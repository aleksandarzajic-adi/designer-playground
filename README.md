# design-playground

Figma → extractor → Claude → UI library → Storybook + Playground.

## Setup

```bash
pnpm install
pnpm build
pnpm playground   # http://localhost:3000
pnpm storybook    # http://localhost:6006
```

## Sync from Figma

```bash
cp .env.example .env
# set FIGMA_TOKEN, FIGMA_FILE_KEY, ANTHROPIC_API_KEY
pnpm extract
pnpm codegen -- --dry-run
pnpm codegen
```

## Layout

```
apps/
  playground/       Next.js App Router
  storybook/        Storybook (Vite)
packages/
  ui/               styled-components design system (source of truth)
  tokens/           CSS variables + TS exports
  figma-extractor/  Figma REST client + parser
  codegen/          Claude orchestration
  diff-engine/      ts-morph AST patcher
  registry/         component registry (registry.json)
```

## Rules

- `@dp/ui` depends on `@dp/tokens` only. Never on apps.
- Apps consume `@dp/ui`. Never duplicate components.
- No Tailwind. No inline styles. styled-components only.
- Tokens: CSS variables, emitted by `@dp/tokens`, consumed via TS export.

.
