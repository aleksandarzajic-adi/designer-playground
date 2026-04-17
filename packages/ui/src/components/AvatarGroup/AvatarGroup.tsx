import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type AvatarGroupSpacing = 'overlap' | 'spaced';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: AvatarGroupSpacing;
  max?: number;
  children: React.ReactNode;
}

const spacingStyles = (t: DefaultTheme): Record<AvatarGroupSpacing, ReturnType<typeof css>> => ({
  overlap: css`
    gap: 0;
    & > * + * {
      margin-left: calc(${t.spacing[2]} * -1);
    }
  `,
  spaced: css`
    gap: ${t.spacing[1]};
  `,
});

const Root = styled.div<{ $spacing: AvatarGroupSpacing }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  ${(p) => spacingStyles(p.theme)[p.$spacing]}
`;

const Avatars = styled.div<{ $spacing: AvatarGroupSpacing }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  ${(p) => spacingStyles(p.theme)[p.$spacing]}
`;

const Overflow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[1]};
  background: ${(p) => p.theme.colors.bgMuted};
  color: ${(p) => p.theme.colors.fgMuted};
  border-radius: ${(p) => p.theme.radii.md};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
`;

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ spacing = 'overlap', max, children, ...rest }, ref) => {
    const items = React.Children.toArray(children);
    const visible = typeof max === 'number' && max >= 0 ? items.slice(0, max) : items;
    const overflow = typeof max === 'number' ? items.length - visible.length : 0;

    return (
      <Root ref={ref} $spacing={spacing} {...rest}>
        <Avatars $spacing={spacing}>{visible}</Avatars>
        {overflow > 0 && <Overflow>{`+${overflow}`}</Overflow>}
      </Root>
    );
  },
);
AvatarGroup.displayName = 'AvatarGroup';
