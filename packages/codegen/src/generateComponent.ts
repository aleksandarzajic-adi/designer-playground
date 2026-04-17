import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { updateComponent, type UpdateResult } from '@dp/diff-engine';
import type { ExtractedComponent } from '@dp/figma-extractor';
import {
  loadRegistry,
  saveRegistry,
  upsertComponent,
  type Registry,
  type RegistryComponent,
} from '@dp/registry';
import { ClaudeCodeClient } from './claudeCode';
import { SYSTEM_PROMPT, componentPrompt } from './prompts';
import { specFromSnapshot } from './specFromSnapshot';
import { renderFromArchetype } from './templates';

export interface GenerateContext {
  uiPackageRoot: string;
  registryPath: string;
  dryRun?: boolean;
  claude?: ClaudeCodeClient;
}

export type GenerateOutcome =
  | { kind: 'created'; source: 'template' | 'claude'; componentName: string; filePath: string }
  | {
      kind: 'updated';
      componentName: string;
      filePath: string;
      result: UpdateResult;
    }
  | { kind: 'unchanged'; componentName: string; filePath: string }
  | { kind: 'skipped'; componentName: string; reason: string };

function claudeFor(ctx: GenerateContext): ClaudeCodeClient {
  return ctx.claude ?? new ClaudeCodeClient();
}

export async function generateComponent(
  snapshot: ExtractedComponent,
  ctx: GenerateContext,
): Promise<GenerateOutcome> {
  if (snapshot.type !== 'component' && snapshot.type !== 'component-set') {
    return { kind: 'skipped', componentName: snapshot.name, reason: `type=${snapshot.type}` };
  }

  const registry: Registry = loadRegistry(ctx.registryPath);
  const entry = registry.components[snapshot.name];

  if (entry && existsSync(resolve(process.cwd(), entry.filePath))) {
    return updateExisting(snapshot, entry, registry, ctx);
  }
  return createNew(snapshot, registry, ctx);
}

async function updateExisting(
  snapshot: ExtractedComponent,
  entry: RegistryComponent,
  registry: Registry,
  ctx: GenerateContext,
): Promise<GenerateOutcome> {
  const filePath = resolve(process.cwd(), entry.filePath);
  const spec = specFromSnapshot(snapshot);

  const hasWork =
    Object.keys(spec.variants ?? {}).length > 0 ||
    (spec.states?.length ?? 0) > 0 ||
    Object.keys(spec.tokens ?? {}).length > 0;

  if (!hasWork) return { kind: 'unchanged', componentName: entry.name, filePath };

  const result = await updateComponent(filePath, spec, {
    componentName: entry.name,
    dryRun: ctx.dryRun,
  });

  if (!result.changed) return { kind: 'unchanged', componentName: entry.name, filePath };

  upsertComponent(registry, {
    ...entry,
    figmaNodeId: snapshot.figmaId,
    figmaLastSyncedAt: new Date().toISOString(),
    variants: {
      ...(entry.variants ?? {}),
      ...snapshot.variants.propertyDefinitions,
    },
  });
  if (!ctx.dryRun) saveRegistry(registry, ctx.registryPath);

  return { kind: 'updated', componentName: entry.name, filePath, result };
}

async function createNew(
  snapshot: ExtractedComponent,
  registry: Registry,
  ctx: GenerateContext,
): Promise<GenerateOutcome> {
  const templated = renderFromArchetype(snapshot);
  if (templated) {
    return writeComponent(snapshot, templated, registry, ctx, 'template');
  }

  const client = claudeFor(ctx);
  const generated = await client.completeJson<{
    type: 'create';
    componentName: string;
    fileName: string;
    source: string;
  }>(SYSTEM_PROMPT, componentPrompt(snapshot));

  return writeComponent(snapshot, generated, registry, ctx, 'claude');
}

function writeComponent(
  snapshot: ExtractedComponent,
  gen: { componentName: string; fileName: string; source: string },
  registry: Registry,
  ctx: GenerateContext,
  source: 'template' | 'claude',
): GenerateOutcome {
  const componentDir = resolve(ctx.uiPackageRoot, 'src/components', gen.componentName);
  const target = resolve(componentDir, gen.fileName);

  if (!ctx.dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, gen.source, 'utf8');
    writeFileSync(
      resolve(componentDir, 'index.ts'),
      `export * from './${gen.fileName.replace(/\.tsx$/, '')}';\n`,
      'utf8',
    );
  }

  upsertComponent(registry, {
    name: gen.componentName,
    filePath: `packages/ui/src/components/${gen.componentName}/${gen.fileName}`,
    exportName: gen.componentName,
    props: Object.entries(snapshot.variants.propertyDefinitions).map(([name, values]) => ({
      name,
      type: values.map((v) => `'${v}'`).join(' | '),
      optional: true,
    })),
    variants: snapshot.variants.propertyDefinitions,
    figmaNodeId: snapshot.figmaId,
    figmaLastSyncedAt: new Date().toISOString(),
  });
  if (!ctx.dryRun) saveRegistry(registry, ctx.registryPath);

  return { kind: 'created', source, componentName: gen.componentName, filePath: target };
}
