import * as React from 'react';
import styled from 'styled-components';

export type NavigationButtonListDirection = 'row' | 'column';

export interface NavigationButtonListProps extends React.HTMLAttributes<HTMLElement> {
  direction?: NavigationButtonListDirection;
  children?: React.ReactNode;
}

const Root = styled.nav<{ $direction: NavigationButtonListDirection }>`
  display: flex;
  flex-direction: ${(p) => p.$direction};
  padding: ${(p) => p.theme.spacing[0]};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
`;

export const NavigationButtonList = React.forwardRef<HTMLElement, NavigationButtonListProps>(
  ({ direction = 'row', children, ...rest }, ref) => (
    <Root ref={ref} $direction={direction} {...rest}>
      {children}
    </Root>
  ),
);
NavigationButtonList.displayName = 'NavigationButtonList';
