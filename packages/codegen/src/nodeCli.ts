import { resolve } from 'node:path';
import {
  FigmaClient,
  extractNode,
  walkComponentRoots,
  type FigmaNode,
} from '@dp/figma-extractor';
import { loadRegistry } from '@dp/registry';
import { generateComponent } from './generateComponent';
import { generateStory } from './generateStory';
import { refreshBarrel } from './refreshBarrel';

function parseFileKey(input: string): string {
  const match = input.match(/figma\.com\/(?:design|file|board|make)\/([A-Za-z0-9]+)/);
  return match ? match[1] : input.trim();
}

function parseNodeId(input: string): string {
  const urlMatch = input.match(/node-id=([0-9A-Za-z\-:%]+)/);
  const raw = urlMatch ? decodeURIComponent(urlMatch[1]) : input.trim();
  return raw.replace(/-/g, ':');
}

const PAGE_PATTERN =
  /^(examples[/\s]|hero\b|footer\b|header\b|page[/\s]|panel[/\s]|card grid\b|ai chatbot$|about$|home page$|contact us$|pricing$|waitlist$|landing page$|article$|shop$|product detail page$|portfolio$|ai chat$|slot$|_)/i;

async function main() {
  const args = process.argv.slice(2);
  const nodeArg = args.find((a) => !a.startsWith('--'));
  if (!nodeArg) {
    console.error(
      'usage: pnpm ds:node <nodeId | figma-url> [--file=<key|url>] [--filter=<regex>] [--include-pages] [--dry-run] [--no-stories]',
    );
    process.exit(1);
  }

  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error('FIGMA_TOKEN missing. Set in .env.');
    process.exit(1);
  }

  const fileArg = args.find((a) => a.startsWith('--file='));
  const rawFileKey = fileArg
    ? fileArg.slice('--file='.length)
    : nodeArg.startsWith('http')
      ? nodeArg
      : (process.env.FIGMA_FILE_KEY ?? '');
  if (!rawFileKey) {
    console.error('missing file key. Pass --file=<key|url> or set FIGMA_FILE_KEY in .env.');
    process.exit(1);
  }

  const fileKey = parseFileKey(rawFileKey);
  const nodeId = parseNodeId(nodeArg);
  const dryRun = args.includes('--dry-run');
  const skipStories = args.includes('--no-stories');
  const includePages = args.includes('--include-pages');
  const filterArg = args.find((a) => a.startsWith('--filter='));
  const filter = filterArg ? new RegExp(filterArg.slice('--filter='.length), 'i') : null;

  const client = new FigmaClient({ token });

  console.log(`fetching node ${nodeId} from ${fileKey}…`);
  const resp = await client.getNodes(fileKey, [nodeId]);
  const entry = resp.nodes[nodeId];
  if (!entry) {
    console.error(`node ${nodeId} not found in file.`);
    process.exit(1);
  }

  const root = (entry as { document: FigmaNode }).document;
  if (!root) {
    console.error(`node ${nodeId} has no document.`);
    process.exit(1);
  }

  const componentRoots = walkComponentRoots(root);
  if (componentRoots.length === 0) {
    console.error(
      `no COMPONENT or COMPONENT_SET found inside node. Root type: ${root.type}. Did you pass a frame?`,
    );
    process.exit(1);
  }

  let snapshots = componentRoots.map((n) => extractNode(n));
  if (!includePages) snapshots = snapshots.filter((s) => !PAGE_PATTERN.test(s.name));
  if (filter) snapshots = snapshots.filter((s) => filter.test(s.name));

  console.log(
    `queue: ${snapshots.length}/${componentRoots.length} components inside node "${root.name}"`,
  );
  if (snapshots.length === 0) {
    console.log('nothing to generate after filters. Try --include-pages or adjust --filter=.');
    return;
  }
  snapshots.forEach((s) =>
    console.log(
      ` - ${s.name} (${s.type}) →`,
      Object.keys(s.variants.propertyDefinitions).join(',') || '(no variants)',
    ),
  );

  if (dryRun) {
    console.log('\ndry-run: exiting before any writes.');
    return;
  }

  const uiPackageRoot = resolve(process.cwd(), 'packages/ui');
  const registryPath = resolve(process.cwd(), 'packages/registry/registry.json');
  const storybookRoot = resolve(process.cwd(), 'apps/storybook');

  const outcomes: unknown[] = [];
  for (const snapshot of snapshots) {
    const outcome = await generateComponent(snapshot, {
      uiPackageRoot,
      registryPath,
      figmaFileKey: fileKey,
      dryRun: false,
    });
    outcomes.push(outcome);
    console.log(`[${outcome.kind}] ${outcome.componentName}`);
  }

  if (!skipStories) {
    const registry = loadRegistry(registryPath);
    for (const snapshot of snapshots) {
      const componentName = snapshot.name
        .split(/[\s_\-/]+/)
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');
      const regEntry = registry.components[componentName];
      if (!regEntry) continue;
      const storyResult = generateStory(regEntry, {
        storybookRoot,
        overwrite: true,
        dryRun: false,
      });
      console.log(`[story:${storyResult.kind}] ${storyResult.componentName}`);
    }
  }

  const registry = loadRegistry(registryPath);
  const barrelPath = refreshBarrel(uiPackageRoot, registry);
  console.log(`[barrel] refreshed → ${barrelPath}`);

  console.log(JSON.stringify({ outcomes }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
