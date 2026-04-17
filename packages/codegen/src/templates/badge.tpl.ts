import { defaultOf, unionLiteral, type ArchetypeSpec, type TemplateFn } from './shared';

const TONE_STYLE: Record<string, string> = {
  neutral: 'background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};',
  accent: 'background: ${t.colors.accent}; color: ${t.colors.fgOnAccent};',
  success: 'background: ${t.colors.success}; color: ${t.colors.fgOnAccent};',
  warning: 'background: ${t.colors.warning}; color: ${t.colors.fgOnAccent};',
  danger: 'background: ${t.colors.danger}; color: ${t.colors.fgOnAccent};',
  info: 'background: ${t.colors.accent}; color: ${t.colors.fgOnAccent};',
  primary: 'background: ${t.colors.accent}; color: ${t.colors.fgOnAccent};',
};

export const badgeTemplate: TemplateFn = (spec: ArchetypeSpec) => {
  const name = spec.componentName;
  const tones =
    spec.variants.scheme ??
    spec.variants.variant ??
    spec.variants.tone ??
    ['neutral', 'accent', 'success', 'warning', 'danger'];

  const cases = tones
    .map((tone) => {
      const body = TONE_STYLE[tone.toLowerCase()] ?? TONE_STYLE.neutral;
      return `  ${tone}: css\`${body}\`,`;
    })
    .join('\n');

  const source = `import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type ${name}Tone = ${unionLiteral(tones)};

export interface ${name}Props extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ${name}Tone;
}

const toneStyles = (t: DefaultTheme): Record<${name}Tone, ReturnType<typeof css>> => ({
${cases}
});

const Root = styled.span<{ $tone: ${name}Tone }>\`
  display: inline-flex;
  align-items: center;
  padding: \${(p) => p.theme.spacing[1]} \${(p) => p.theme.spacing[2]};
  border-radius: \${(p) => p.theme.radii.pill};
  font-size: \${(p) => p.theme.typography.fontSize.xs};
  font-weight: \${(p) => p.theme.typography.fontWeight.medium};
  line-height: 1;
  \${(p) => toneStyles(p.theme)[p.$tone]}
\`;

export const ${name} = React.forwardRef<HTMLSpanElement, ${name}Props>(
  ({ tone = '${defaultOf(tones)}', ...rest }, ref) => <Root ref={ref} $tone={tone} {...rest} />,
);
${name}.displayName = '${name}';
`;

  return { componentName: name, fileName: `${name}.tsx`, source };
};
