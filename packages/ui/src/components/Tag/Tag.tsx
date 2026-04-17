import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type TagTone = 'brand' | 'neutral' | 'positive' | 'danger' | 'warning';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: TagTone;
    scheme?: TagScheme;
    variant?: TagVariant;
}

const toneStyles = (t: DefaultTheme): Record<TagTone, ReturnType<typeof css>> => ({
  brand: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
  neutral: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
  positive: css`background: ${t.colors.bgMuted}; color: ${t.colors.fgPrimary};`,
  danger: css`background: ${t.colors.danger}; color: ${t.colors.fgOnAccent};`,
  warning: css`background: ${t.colors.warning}; color: ${t.colors.fgOnAccent};`,
});

const Root = styled.span<{ $tone: TagTone }>`
  display: inline-flex;
  align-items: center;
  padding: ${(p) => p.theme.spacing[1]} ${(p) => p.theme.spacing[2]};
  border-radius: ${(p) => p.theme.radii.pill};
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: 1;
  ${(p) => toneStyles(p.theme)[p.$tone]}
`;

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ tone = 'brand', ...rest }, ref) => <Root ref={ref} $tone={tone} {...rest} />,
);
Tag.displayName = 'Tag';

export type TagScheme = 'brand' | 'neutral' | 'positive' | 'danger' | 'warning';
export type TagVariant = 'primary' | 'secondary';
