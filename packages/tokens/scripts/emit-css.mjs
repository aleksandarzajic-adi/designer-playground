import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawTokens } from '../dist/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../dist/tokens.css');

const toBlock = (selector, obj) => {
  const body = Object.entries(obj)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
};

const css = [
  '/* generated — do not edit */',
  toBlock(':root, [data-theme="light"]', rawTokens.light),
  toBlock('[data-theme="dark"]', { ...rawTokens.light, ...rawTokens.dark }),
].join('\n\n');

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css, 'utf8');
console.log('tokens.css written:', out);
