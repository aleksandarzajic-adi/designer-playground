import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchFigmaFile } from './client';
import { extractComponents } from './extractor';

async function main() {
  const token = process.env.FIGMA_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY ?? process.argv[2];
  if (!token || !fileKey) {
    console.error('usage: FIGMA_TOKEN=xxx FIGMA_FILE_KEY=yyy dp-extract');
    process.exit(1);
  }

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
