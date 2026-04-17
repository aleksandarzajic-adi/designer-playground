import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { RegistryComponent } from '@dp/registry';

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

function renderStory(component: RegistryComponent): string {
  const variantEntries = Object.entries(component.variants ?? {});
  const variantControls = variantEntries
    .map(
      ([name, values]) =>
        `    ${name}: { control: 'select', options: [${values.map((v) => `'${v}'`).join(', ')}] }`,
    )
    .join(',\n');

  const variantStories = variantEntries
    .flatMap(([name, values]) =>
      values.map((value) => {
        const storyName = `${cap(name)}${cap(value)}`;
        return `export const ${storyName}: Story = { args: { ${name}: '${value}' } };`;
      }),
    )
    .join('\n');

  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${component.exportName} } from '@dp/ui';

const meta: Meta<typeof ${component.exportName}> = {
  title: 'Components/${component.name}',
  component: ${component.exportName},
  args: { children: '${component.name}' },
${variantControls ? `  argTypes: {\n${variantControls}\n  },\n` : ''}};

export default meta;
type Story = StoryObj<typeof ${component.exportName}>;

export const Default: Story = {};
${variantStories}
`;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
