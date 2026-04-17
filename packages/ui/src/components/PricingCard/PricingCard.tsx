import * as React from 'react';
import styled from 'styled-components';

export type PricingCardElevation = 'none' | 'sm' | 'md' | 'lg';

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: PricingCardElevation;
  interactive?: boolean;
}

const Root = styled.div<{ $elevation: PricingCardElevation; $interactive: boolean }>`
  background: ${(p) => p.theme.colors.bgSurface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.lg};
  padding: ${(p) => p.theme.spacing[5]};
  box-shadow: ${(p) => (p.$elevation === 'none' ? 'none' : p.theme.shadows[p.$elevation])};
  transition: transform ${(p) => p.theme.durations.fast} ease, box-shadow ${(p) => p.theme.durations.fast} ease;
  ${(p) =>
    p.$interactive &&
    `
      cursor: pointer;
      &:hover { transform: translateY(-1px); box-shadow: ${p.theme.shadows.md}; }
    `}
`;

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ elevation = 'sm', interactive = false, ...rest }, ref) => (
    <Root ref={ref} $elevation={elevation} $interactive={interactive} {...rest} />
  ),
);
PricingCard.displayName = 'PricingCard';
