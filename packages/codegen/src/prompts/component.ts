import type { ExtractedComponent } from '@dp/figma-extractor';

export interface ComponentPromptArgs {
  snapshot: ExtractedComponent;
  figmaFileKey?: string;
}

export function componentPrompt({ snapshot, figmaFileKey }: ComponentPromptArgs): string {
  const mcpBlock = figmaFileKey
    ? `Step 0 — Fetch visual context via Figma MCP (MANDATORY, before any file reads):
  - Call \`mcp__figma__get_design_context\` with:
      fileKey: "${figmaFileKey}"
      nodeId:  "${snapshot.figmaId}"
  - Also call \`mcp__figma__get_screenshot\` with the same IDs to see the design.
  - Use the screenshot + code hints as the visual source of truth. Prefer them over the JSON snapshot below when they disagree.
`
    : '';

  return `You are scaffolding a NEW component inside an existing monorepo. You have file-system tools. Follow this exact procedure.

${mcpBlock}Step 1 — Read project context:
  a. Read \`packages/ui/src/theme.ts\` — learn the exact \`Theme\` interface: colors, spacing, typography.fontSize, typography.fontWeight, radii, shadows, durations. DO NOT invent keys.
  b. Read \`packages/ui/src/components/Button/Button.tsx\` as a style reference. Mirror: transient props, forwardRef, styled factories, import paths.
  c. Read \`packages/ui/src/primitives/Stack.tsx\` to see how transient props are threaded.

Step 2 — Generate:
  - styled-components only. NEVER inline styles. NEVER Tailwind.
  - Consume theme via \`theme.colors.X\`, \`theme.spacing[N]\`, \`theme.typography.fontSize.X\`, \`theme.typography.fontWeight.X\`, \`theme.radii.X\`, \`theme.durations.X\`. ONLY tokens that exist in \`theme.ts\`.
  - Transient props \`$variant\`, \`$size\`, etc. Never forward to DOM.
  - \`React.forwardRef\` for DOM-rendering components.
  - Export component, \`Props\` interface, and variant type aliases.
  - Normalize variant keys → camelCase (first letter lowercase). Normalize variant values → camelCase.
  - Map Figma \`State\` variants to boolean props (e.g. \`disabled?: boolean\`, \`loading?: boolean\`). Do NOT expose a \`state\` enum.
  - When extending \`React.HTMLAttributes<...>\` or \`ButtonHTMLAttributes<...>\`, use \`Omit<..., 'title' | 'content' | 'value' | 'placeholder' | 'onSubmit'>\` for any prop name that collides with DOM attributes.

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

Figma snapshot (minimal — use MCP for visuals):
\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\``;
}
