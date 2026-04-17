import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawTokens, defaultMode } from '../dist/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../dist/tokens.css');
const generatedCssPath = resolve(__dirname, '../src/tokens.generated.css');

if (existsSync(generatedCssPath)) {
  const src = readFileSync(generatedCssPath, 'utf8');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, src, 'utf8');
  console.log('tokens.css (from figma variables) →', out);
  process.exit(0);
}

const toBlock = (selector, obj) => {
  const body = Object.entries(obj)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
};

const fallbackMode = defaultMode ?? Object.keys(rawTokens)[0];
const blocks = Object.entries(rawTokens).map(([mode, vars]) => {
  const selector =
    mode === fallbackMode ? `:root, [data-theme="${mode}"]` : `[data-theme="${mode}"]`;
  return toBlock(selector, vars);
});

const css = ['/* generated — do not edit */', ...blocks].join('\n\n');

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css, 'utf8');
console.log('tokens.css written:', out);
