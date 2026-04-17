import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadRegistry } from '@dp/registry';
import type { ExtractedComponent } from '@dp/figma-extractor';
import { generateComponent } from './generateComponent';
import { generateStory } from './generateStory';
import { refreshBarrel } from './refreshBarrel';

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
  const setsOnly = !process.argv.includes('--include-singletons');
  const includePages = process.argv.includes('--include-pages');
  const filterArg = process.argv.find((a) => a.startsWith('--filter='));
  const filter = filterArg ? new RegExp(filterArg.slice('--filter='.length), 'i') : null;

  const PAGE_PATTERN =
    /^(examples[/\s]|hero\b|footer\b|header\b|page[/\s]|panel[/\s]|card grid\b|ai chatbot$|about$|home page$|contact us$|pricing$|waitlist$|landing page$|article$|shop$|product detail page$|portfolio$|ai chat$|slot$|_)/i;

  let queue = components;
  if (setsOnly) queue = queue.filter((c) => c.type === 'component-set');
  if (!includePages) queue = queue.filter((c) => !PAGE_PATTERN.test(c.name));
  if (filter) queue = queue.filter((c) => filter.test(c.name));

  console.log(`queue: ${queue.length}/${components.length} components`);
  if (queue.length === 0) {
    console.log('nothing to do. try --include-singletons or adjust --filter=');
    return;
  }
  if (dryRun) {
    queue.forEach((c) => console.log(' -', c.name, '→', Object.keys(c.variants.propertyDefinitions).join(',') || '(no variants)'));
    console.log('dry-run: exiting before any writes.');
    return;
  }

  const uiPackageRoot = resolve(process.cwd(), 'packages/ui');
  const registryPath = resolve(process.cwd(), 'packages/registry/registry.json');
  const storybookRoot = resolve(process.cwd(), 'apps/storybook');
  const figmaFileKeyRaw = process.env.FIGMA_FILE_KEY;
  const figmaFileKey = figmaFileKeyRaw
    ? figmaFileKeyRaw.match(/figma\.com\/(?:design|file|board|make)\/([A-Za-z0-9]+)/)?.[1] ??
      figmaFileKeyRaw.trim()
    : undefined;

  const outcomes: unknown[] = [];
  for (const snapshot of queue) {
    const outcome = await generateComponent(snapshot, {
      uiPackageRoot,
      registryPath,
      figmaFileKey,
      dryRun,
    });
    outcomes.push(outcome);
    console.log(`[${outcome.kind}] ${outcome.componentName}`);
  }

  const registry = loadRegistry(registryPath);

  if (!skipStories) {
    for (const component of Object.values(registry.components)) {
      const result = generateStory(component, { storybookRoot, overwrite: overwriteStories, dryRun });
      console.log(`[story:${result.kind}] ${result.componentName}`);
    }
  }

  if (!dryRun) {
    const barrelPath = refreshBarrel(uiPackageRoot, registry);
    console.log(`[barrel] refreshed → ${barrelPath}`);
  }

  console.log(JSON.stringify({ outcomes }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
