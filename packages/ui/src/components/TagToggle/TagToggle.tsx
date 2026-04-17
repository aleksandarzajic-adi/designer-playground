import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type TagToggleTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface TagToggleProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagToggleTone;
}

const toneStyles = (t: DefaultTheme): Record<TagToggleTone, ReturnType<typeof css>> => ({
  neutral: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
  accent: css`background: ${t.colors.accent}; color: ${t.colors.fgOnAccent};`,
  success: css`background: ${t.colors.success}; color: ${t.colors.fgOnAccent};`,
  warning: css`background: ${t.colors.warning}; color: ${t.colors.fgOnAccent};`,
  danger: css`background: ${t.colors.danger}; color: ${t.colors.fgOnAccent};`,
});

const Root = styled.span<{ $tone: TagToggleTone }>`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing[1]} ${(p) => p.theme.spacing[2]};
  border-radius: ${(p) => p.theme.radii.pill};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: 1;
  ${(p) => toneStyles(p.theme)[p.$tone]}
`;

export const TagToggle = React.forwardRef<HTMLSpanElement, TagToggleProps>(
  ({ tone = 'neutral', ...rest }, ref) => <Root ref={ref} $tone={tone} {...rest} />,
);
TagToggle.displayName = 'TagToggle';
