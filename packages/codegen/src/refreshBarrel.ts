import { readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Registry } from '@dp/registry';

const BASE_EXPORTS = [
  "export * from './theme';",
  "export * from './theme/ThemeProvider';",
  "export * from './primitives';",
];

const LEGACY_FILES = ['Input', 'Card', 'Badge', 'Heading'];

export function refreshBarrel(uiPackageRoot: string, registry: Registry): string {
  const componentsDir = resolve(uiPackageRoot, 'src/components');
  const indexPath = resolve(uiPackageRoot, 'src/index.ts');

  const folderExports = new Set<string>();
  if (existsSync(componentsDir)) {
    for (const entry of readdirSync(componentsDir)) {
      const full = resolve(componentsDir, entry);
      if (!statSync(full).isDirectory()) continue;
      if (!existsSync(resolve(full, 'index.ts'))) continue;
      folderExports.add(entry);
    }
  }

  for (const comp of Object.values(registry.components)) {
    if (folderExports.has(comp.name)) continue;
    const maybeFolder = resolve(componentsDir, comp.name);
    if (existsSync(resolve(maybeFolder, 'index.ts'))) folderExports.add(comp.name);
  }

  const legacyExports = LEGACY_FILES.filter((n) =>
    existsSync(resolve(componentsDir, `${n}.tsx`)),
  ).map((n) => `export * from './components/${n}';`);

  const sortedFolders = [...folderExports].sort();
  const folderLines = sortedFolders.map((n) => `export * from './components/${n}';`);

  const contents =
    [...BASE_EXPORTS, ...legacyExports, ...folderLines].join('\n') + '\n';

  writeFileSync(indexPath, contents, 'utf8');
  return indexPath;
}
