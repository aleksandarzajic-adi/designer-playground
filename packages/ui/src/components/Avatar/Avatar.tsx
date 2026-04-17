import * as React from 'react';
import styled, { css } from 'styled-components';

export type AvatarSize = 'large' | 'small' | 'medium';
export type AvatarShape = 'circle' | 'square';
export type AvatarType = 'initial' | 'image';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  type?: AvatarType;
}

const sizeStyles: Record<AvatarSize, ReturnType<typeof css>> = {
  large: css`width: 48px; height: 48px; font-size: 19px;`,
  small: css`width: 28px; height: 28px; font-size: 11px;`,
  medium: css`width: 36px; height: 36px; font-size: 14px;`,
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

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      size = 'large',
      shape = 'circle',
      type,
      ...rest
    },
    ref,
  ) => {
    const resolvedType: AvatarType = type ?? (src ? 'image' : 'initial');
    const showImage = resolvedType === 'image' && src;
    return (
      <Root ref={ref} $size={size} $shape={shape} {...rest}>
        {showImage ? <img src={src} alt={alt ?? ''} /> : (initials ?? '?')}
      </Root>
    );
  },
);
Avatar.displayName = 'Avatar';
