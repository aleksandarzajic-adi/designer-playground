import { color, radius, shadow, space } from '@dp/tokens';
import styled from 'styled-components';

export interface CardProps {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof space;
    assetType?: CardAssetType;
    variant?: CardVariant;
    direction?: CardDirection;
}

export const Card = styled.div<{ $elevation?: CardProps['elevation']; $padding?: CardProps['padding'] }>`
  background: ${color.bgSurface};
  border: 1px solid ${color.border};
  border-radius: ${radius.lg};
  padding: ${(p) => space[p.$padding ?? 5]};
  box-shadow: ${(p) => {
    const e = p.$elevation ?? 'sm';
    if (e === 'none') return 'none';
    return shadow[e];
  }};
`;

export type CardAssetType = 'icon' | 'image';
export type CardVariant = 'stroke' | 'default';
export type CardDirection = 'horizontal' | 'vertical';
