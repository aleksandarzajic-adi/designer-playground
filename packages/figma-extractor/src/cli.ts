import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchFigmaFile } from './client';
import { extractComponents } from './extractor';

function parseFileKey(input: string): string {
  const match = input.match(/figma\.com\/(?:design|file|board|make)\/([A-Za-z0-9]+)/);
  return match ? match[1] : input.trim();
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  const rawKey = process.env.FIGMA_FILE_KEY ?? process.argv[2];
  if (!token || !rawKey) {
    console.error('usage: FIGMA_TOKEN=xxx FIGMA_FILE_KEY=yyy dp-extract');
    process.exit(1);
  }
  const fileKey = parseFileKey(rawKey);

  console.log(`fetching ${fileKey}…`);
  const file = await fetchFigmaFile(fileKey, { token });
  const extracted = extractComponents(file);

  const outDir = resolve(process.cwd(), '.extracted');
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, 'components.json');
  writeFileSync(
    outPath,
    JSON.stringify(
      { fileName: file.name, extractedAt: new Date().toISOString(), components: extracted },
      null,
      2,
    ),
  );
  console.log(`wrote ${extracted.length} components → ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
