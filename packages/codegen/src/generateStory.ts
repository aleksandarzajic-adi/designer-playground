import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { RegistryComponent } from '@dp/registry';
import { resolveArchetypeByComponentName } from './templates';

export interface StoryContext {
  storybookRoot: string;
  overwrite?: boolean;
  dryRun?: boolean;
}

export interface StoryResult {
  kind: 'written' | 'skipped';
  componentName: string;
  filePath: string;
}

const STATE_KEYS = new Set(['state', 'status']);
const SKIP_VARIANT_KEYS = new Set(['valuetype', 'assettype', 'active']);
const STATE_VALUE_MAP: Record<string, string> = {
  disabled: 'disabled',
  loading: 'loading',
  invalid: 'invalid',
  error: 'invalid',
  selected: 'selected',
  readonly: 'readonly',
};

const camelKey = (k: string) =>
  k
    .replace(/[_\s-]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toLowerCase());

const camelValue = (v: string) =>
  v
    .toLowerCase()
    .replace(/[_\s-]+(.)/g, (_, c: string) => c.toUpperCase());

const capIdent = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').replace(/^(.)/, (_, c) => c.toUpperCase());

function formatArgValue(v: unknown): string {
  if (typeof v === 'string') return `'${v.replace(/'/g, "\\'")}'`;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v === null) return 'null';
  return JSON.stringify(v);
}

function renderStory(component: RegistryComponent): string {
  const archetype = resolveArchetypeByComponentName(component.name);
  const defaultArgs = archetype?.storyDefault?.args ?? { children: component.name };
  const defaultArgsLine = Object.entries(defaultArgs)
    .map(([k, v]) => `${k}: ${formatArgValue(v)}`)
    .join(', ');

  const normalized: Record<string, string[]> = {};
  const states = new Set<string>();

  const allowList = archetype?.storyDefault?.variantKeys
    ? new Set(archetype.storyDefault.variantKeys.map((k) => k.toLowerCase()))
    : null;

  for (const [rawKey, rawValues] of Object.entries(component.variants ?? {})) {
    const key = camelKey(rawKey);
    const keyLower = key.toLowerCase();
    if (SKIP_VARIANT_KEYS.has(keyLower)) continue;
    if (allowList && !allowList.has(keyLower) && !STATE_KEYS.has(keyLower)) continue;
    if (STATE_KEYS.has(keyLower)) {
      for (const v of rawValues) {
        const mapped = STATE_VALUE_MAP[v.toLowerCase()];
        if (mapped) states.add(mapped);
      }
      continue;
    }
    const deduped = Array.from(new Set(rawValues.map(camelValue)));
    if (deduped.length > 0) normalized[key] = deduped;
  }

  const entries = Object.entries(normalized);
  const controls = entries
    .map(([key, values]) => `    ${key}: { control: 'select', options: [${values.map((v) => `'${v}'`).join(', ')}] }`)
    .join(',\n');

  const stateControls = [...states]
    .map((s) => `    ${s}: { control: 'boolean' }`)
    .join(',\n');

  const allControls = [controls, stateControls].filter(Boolean).join(',\n');

  const usedNames = new Set<string>(['Default']);
  const variantStories = entries
    .flatMap(([key, values]) =>
      values.map((value) => {
        let storyName = `${capIdent(key)}${capIdent(value)}`;
        let suffix = 2;
        while (usedNames.has(storyName)) storyName = `${capIdent(key)}${capIdent(value)}${suffix++}`;
        usedNames.add(storyName);
        return `export const ${storyName}: Story = { args: { ${key}: '${value}' } };`;
      }),
    )
    .join('\n');

  const stateStories = [...states]
    .map((s) => {
      let storyName = capIdent(s);
      let suffix = 2;
      while (usedNames.has(storyName)) storyName = `${capIdent(s)}${suffix++}`;
      usedNames.add(storyName);
      return `export const ${storyName}: Story = { args: { ${s}: true } };`;
    })
    .join('\n');

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${component.exportName} } from '@dp/ui';

const meta: Meta<typeof ${component.exportName}> = {
  title: 'Components/${component.name}',
  component: ${component.exportName},
  args: { ${defaultArgsLine} },
${allControls ? `  argTypes: {\n${allControls}\n  },\n` : ''}};

export default meta;
type Story = StoryObj<typeof ${component.exportName}>;

export const Default: Story = {};
${variantStories}
${stateStories}
`;
}

export function generateStory(component: RegistryComponent, ctx: StoryContext): StoryResult {
  const target = resolve(ctx.storybookRoot, 'stories', `${component.name}.stories.tsx`);

  if (existsSync(target) && !ctx.overwrite) {
    return { kind: 'skipped', componentName: component.name, filePath: target };
  }

  if (!ctx.dryRun) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, renderStory(component), 'utf8');
  }

  return { kind: 'written', componentName: component.name, filePath: target };
}
