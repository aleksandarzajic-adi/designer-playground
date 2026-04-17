import type { ExtractedComponent } from '@dp/figma-extractor';

export function componentPrompt(snapshot: ExtractedComponent): string {
  return `You are scaffolding a NEW component inside an existing monorepo. You have file-system tools. Follow this exact procedure:

Step 1 — Read context (do this before writing):
  a. Read \`packages/ui/src/theme.ts\` — understand the exact \`Theme\` interface: colors, spacing, typography.fontSize, typography.fontWeight, radii, shadows, durations. DO NOT invent keys.
  b. Read \`packages/ui/src/components/Button/Button.tsx\` as a style reference. Mirror its patterns: transient props, forwardRef, styled factories, import paths.
  c. Read \`packages/ui/src/primitives/Stack.tsx\` to see how transient props are threaded.

Step 2 — Generate:
  - styled-components only. NEVER inline styles. NEVER Tailwind.
  - Consume theme via \`theme.colors.X\`, \`theme.spacing[N]\`, \`theme.typography.fontSize.X\`, \`theme.typography.fontWeight.X\`, \`theme.radii.X\`, \`theme.durations.X\`. Use ONLY tokens that exist in \`theme.ts\`.
  - Transient props \`$variant\`, \`$size\`, etc. Never forward to DOM.
  - \`React.forwardRef\` for DOM-rendering components.
  - Export the component, its \`Props\` interface, and variant type aliases.
  - Normalize variant keys to camelCase (first letter lowercase). Normalize variant values to camelCase.
  - Map Figma \`State\` variants to boolean props on the interface (e.g. \`disabled?: boolean\`, \`loading?: boolean\`). Do NOT expose a \`state\` enum prop.

Step 3 — Output:
  Return ONLY a single JSON object inside a \`\`\`json fence. No prose outside the fence.
  \`\`\`json
  {
    "type": "create",
    "componentName": "PascalCase",
    "fileName": "ComponentName.tsx",
    "source": "<full file contents>"
  }
  \`\`\`

Figma snapshot:
\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\``;
}
