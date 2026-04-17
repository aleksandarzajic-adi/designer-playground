import type { ExtractedComponent } from '@dp/figma-extractor';

export function componentPrompt(snapshot: ExtractedComponent): string {
  return `Generate a new styled-components React component file from this Figma snapshot.

Requirements:
- File must compile against TypeScript strict mode.
- Component name: PascalCase derived from snapshot.name.
- Export: named export of the component and its Props interface and variant type aliases.
- Use DefaultTheme (styled-components) for colors, spacing, radii, fontSize, fontWeight, durations.
- Respect variants from snapshot.variants.propertyDefinitions and map them to sized/styled branches.
- No hardcoded hex values unless the token name in snapshot.tokens is unknown.

Figma snapshot:
\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\`

Return a single JSON object exactly:
\`\`\`json
{
  "type": "create",
  "componentName": "PascalCase",
  "fileName": "ComponentName.tsx",
  "source": "<full file contents>"
}
\`\`\``;
}
