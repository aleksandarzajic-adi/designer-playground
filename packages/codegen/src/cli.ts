import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadRegistry } from '@dp/registry';
import type { ExtractedComponent } from '@dp/figma-extractor';
import { generateComponent } from './generateComponent';
import { generateStory } from './generateStory';

async function main() {
  const extractedPath = resolve(process.cwd(), '.extracted/components.json');
  if (!existsSync(extractedPath)) {
    console.error(`missing ${extractedPath} — run 'pnpm ds:pull' first`);
    process.exit(1);
  }

  const { components } = JSON.parse(readFileSync(extractedPath, 'utf8')) as {
    components: ExtractedComponent[];
  };

  const dryRun = process.argv.includes('--dry-run');
  const skipStories = process.argv.includes('--no-stories');
  const overwriteStories = process.argv.includes('--stories-overwrite');

  const uiPackageRoot = resolve(process.cwd(), 'packages/ui');
  const registryPath = resolve(process.cwd(), 'packages/registry/registry.json');
  const storybookRoot = resolve(process.cwd(), 'apps/storybook');

  const outcomes: unknown[] = [];
  for (const snapshot of components) {
    const outcome = await generateComponent(snapshot, { uiPackageRoot, registryPath, dryRun });
    outcomes.push(outcome);
    console.log(`[${outcome.kind}] ${outcome.componentName}`);
  }

  if (!skipStories) {
    const registry = loadRegistry(registryPath);
    for (const component of Object.values(registry.components)) {
      const result = generateStory(component, { storybookRoot, overwrite: overwriteStories, dryRun });
      console.log(`[story:${result.kind}] ${result.componentName}`);
    }
  }

  console.log(JSON.stringify({ outcomes }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
