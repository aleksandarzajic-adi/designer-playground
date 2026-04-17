import * as React from 'react';
import styled, { css } from 'styled-components';

export type AvatarSize = 'large' | 'small' | 'medium';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
    type?: AvatarType;
}

const sizeStyles: Record<AvatarSize, ReturnType<typeof css>> = {
  large: css`width: 48px; height: 48px;`,
  small: css`width: 28px; height: 28px;`,
  medium: css`width: 36px; height: 36px;`,
};

const shapeStyles: Record<AvatarShape, ReturnType<typeof css>> = {
  circle: css`border-radius: 9999px;`,
  square: css`border-radius: 8px;`,
};

const Root = styled.span<{ $size: AvatarSize; $shape: AvatarShape }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bgMuted};
  color: ${(p) => p.theme.colors.fgPrimary};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  ${(p) => sizeStyles[p.$size]}
  ${(p) => shapeStyles[p.$shape]}

  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, initials, size = 'large', shape = 'circle', ...rest }, ref) => (
    <Root ref={ref} $size={size} $shape={shape} {...rest}>
      {src ? <img src={src} alt={alt ?? ''} /> : initials}
    </Root>
  ),
);
Avatar.displayName = 'Avatar';

export type AvatarType = 'initial' | 'image';
