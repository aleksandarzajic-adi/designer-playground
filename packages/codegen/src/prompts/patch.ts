import type { ExtractedComponent } from '@dp/figma-extractor';

export interface PatchSpec {
  variants?: Record<string, string[]>;
  states?: string[];
  tokens?: Record<string, string>;
}

export interface PatchResponse {
  type: 'update';
  componentName: string;
  rationale: string;
  changes: PatchSpec;
}

export function patchPrompt(args: {
  componentName: string;
  existingSource: string;
  snapshot: ExtractedComponent;
}): string {
  return `Reconcile the existing component with the updated Figma snapshot. Produce the MINIMAL set of changes. Do not rewrite the file.

Component: ${args.componentName}

Existing source:
\`\`\`tsx
${args.existingSource}
\`\`\`

Figma snapshot:
\`\`\`json
${JSON.stringify(args.snapshot, null, 2)}
\`\`\`

Return a single JSON object exactly (no other keys):
\`\`\`json
{
  "type": "update",
  "componentName": "${args.componentName}",
  "rationale": "one short paragraph",
  "changes": {
    "variants": { "<propName>": ["<value>", "..."] },
    "states":   ["loading" | "disabled" | "invalid" | "selected" | "readonly"],
    "tokens":   { "<existing token expression>": "<replacement>" }
  }
}
\`\`\`

Rules:
- \`variants\`: only include NEW literal values not already present in the source. Omit keys with nothing to add.
- \`states\`: only include states the Figma snapshot implies and the source lacks.
- \`tokens\`: key = exact string in source (e.g. "color.primary"), value = replacement (e.g. "color.accent"). Skip if identical.
- If nothing to change, return \`"changes": {}\`.`;
}
