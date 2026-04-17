import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['ts-morph'],
  banner: { js: '#!/usr/bin/env node' },
});
