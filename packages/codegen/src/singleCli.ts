import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadRegistry } from '@dp/registry';
import type { ExtractedComponent } from '@dp/figma-extractor';
import { generateComponent } from './generateComponent';
import { generateStory } from './generateStory';
import { refreshBarrel } from './refreshBarrel';

async function main() {
  const nameArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!nameArg) {
    console.error('usage: pnpm ds:component <ComponentName> [--dry-run] [--no-story]');
    process.exit(1);
  }

  const extractedPath = resolve(process.cwd(), '.extracted/components.json');
  if (!existsSync(extractedPath)) {
    console.error(`missing ${extractedPath} — run 'pnpm ds:pull' first`);
    process.exit(1);
  }

  const dryRun = process.argv.includes('--dry-run');
  const skipStory = process.argv.includes('--no-story');

  const { components } = JSON.parse(readFileSync(extractedPath, 'utf8')) as {
    components: ExtractedComponent[];
  };

  const matcher = nameArg.toLowerCase();
  const match = components.find((c) => c.name.toLowerCase() === matcher);
  if (!match) {
    console.error(`no component matched "${nameArg}". Try 'pnpm ds:generate --dry-run' to list.`);
    process.exit(1);
  }

  console.log(
    `component: ${match.name} (${match.type}) — variants:`,
    Object.keys(match.variants.propertyDefinitions).join(',') || '(none)',
  );

  const uiPackageRoot = resolve(process.cwd(), 'packages/ui');
  const registryPath = resolve(process.cwd(), 'packages/registry/registry.json');
  const storybookRoot = resolve(process.cwd(), 'apps/storybook');
  const figmaFileKeyRaw = process.env.FIGMA_FILE_KEY;
  const figmaFileKey = figmaFileKeyRaw
    ? figmaFileKeyRaw.match(/figma\.com\/(?:design|file|board|make)\/([A-Za-z0-9]+)/)?.[1] ??
      figmaFileKeyRaw.trim()
    : undefined;

  const outcome = await generateComponent(match, {
    uiPackageRoot,
    registryPath,
    figmaFileKey,
    dryRun,
  });
  console.log(`[${outcome.kind}]`, outcome.componentName);

  if (!skipStory && (outcome.kind === 'created' || outcome.kind === 'updated')) {
    const registry = loadRegistry(registryPath);
    const entry = registry.components[outcome.componentName];
    if (entry) {
      const storyResult = generateStory(entry, { storybookRoot, overwrite: true, dryRun });
      console.log(`[story:${storyResult.kind}]`, storyResult.componentName);
    }
  }

  if (!dryRun) {
    const registry = loadRegistry(registryPath);
    const barrelPath = refreshBarrel(uiPackageRoot, registry);
    console.log(`[barrel] refreshed → ${barrelPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
