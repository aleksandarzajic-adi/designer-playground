import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
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
import { ClaudeClient } from './claude';
import { SYSTEM_PROMPT, componentPrompt, patchPrompt, type PatchResponse } from './prompts';

export interface GenerateContext {
  uiPackageRoot: string;
  registryPath: string;
  dryRun?: boolean;
  claude?: ClaudeClient;
}

export type GenerateOutcome =
  | { kind: 'created'; componentName: string; filePath: string }
  | { kind: 'updated'; componentName: string; filePath: string; result: UpdateResult; rationale: string }
  | { kind: 'unchanged'; componentName: string; filePath: string }
  | { kind: 'skipped'; componentName: string; reason: string };

function claudeFor(ctx: GenerateContext): ClaudeClient {
  return ctx.claude ?? new ClaudeClient();
}

export async function generateComponent(
  snapshot: ExtractedComponent,
  ctx: GenerateContext,
): Promise<GenerateOutcome> {
  if (snapshot.type !== 'component' && snapshot.type !== 'component-set') {
    return { kind: 'skipped', componentName: snapshot.name, reason: `type=${snapshot.type}` };
  }

  const registry: Registry = loadRegistry(ctx.registryPath);
  const registryEntry = registry.components[snapshot.name];
  const client = claudeFor(ctx);

  if (registryEntry && existsSync(resolve(process.cwd(), registryEntry.filePath))) {
    return updateExisting(snapshot, registryEntry, registry, ctx, client);
  }

  return createNew(snapshot, registry, ctx, client);
}

async function updateExisting(
  snapshot: ExtractedComponent,
  entry: RegistryComponent,
  registry: Registry,
  ctx: GenerateContext,
  client: ClaudeClient,
): Promise<GenerateOutcome> {
  const filePath = resolve(process.cwd(), entry.filePath);
  const source = readFileSync(filePath, 'utf8');

  const response = await client.completeJson<PatchResponse>(
    SYSTEM_PROMPT,
    patchPrompt({ componentName: entry.name, existingSource: source, snapshot }),
  );

  const changes = response.changes ?? {};
  const hasWork =
    Object.keys(changes.variants ?? {}).length > 0 ||
    (changes.states?.length ?? 0) > 0 ||
    Object.keys(changes.tokens ?? {}).length > 0;

  if (!hasWork) {
    return { kind: 'unchanged', componentName: entry.name, filePath };
  }

  const result = await updateComponent(filePath, changes, {
    componentName: entry.name,
    dryRun: ctx.dryRun,
  });

  if (!result.changed) {
    return { kind: 'unchanged', componentName: entry.name, filePath };
  }

  upsertComponent(registry, {
    ...entry,
    figmaNodeId: snapshot.figmaId,
    figmaLastSyncedAt: new Date().toISOString(),
    variants: {
      ...(entry.variants ?? {}),
      ...Object.fromEntries(
        Object.entries(snapshot.variants.propertyDefinitions).map(([k, v]) => [k, v]),
      ),
    },
  });

  if (!ctx.dryRun) saveRegistry(registry, ctx.registryPath);

  return { kind: 'updated', componentName: entry.name, filePath, result, rationale: response.rationale };
}

async function createNew(
  snapshot: ExtractedComponent,
  registry: Registry,
  ctx: GenerateContext,
  client: ClaudeClient,
): Promise<GenerateOutcome> {
  const generated = await client.completeJson<{
    type: 'create';
    componentName: string;
    fileName: string;
    source: string;
  }>(SYSTEM_PROMPT, componentPrompt(snapshot));

  const componentDir = resolve(ctx.uiPackageRoot, 'src/components', generated.componentName);
  const target = resolve(componentDir, generated.fileName);

  if (!ctx.dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, generated.source, 'utf8');
    writeFileSync(
      resolve(componentDir, 'index.ts'),
      `export * from './${generated.fileName.replace(/\.tsx$/, '')}';\n`,
      'utf8',
    );
  }

  const relPath = `packages/ui/src/components/${generated.componentName}/${generated.fileName}`;
  upsertComponent(registry, {
    name: generated.componentName,
    filePath: relPath,
    exportName: generated.componentName,
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

  return { kind: 'created', componentName: generated.componentName, filePath: target };
}
