import * as React from 'react';
import styled from 'styled-components';

export type NavigationPillListDirection = 'row' | 'column';

export interface NavigationPillListProps extends React.HTMLAttributes<HTMLElement> {
  direction?: NavigationPillListDirection;
}

const Root = styled.nav<{ $direction: NavigationPillListDirection }>`
  display: flex;
  flex-direction: ${(p) => p.$direction};
  gap: ${(p) => p.theme.spacing[2]};
  padding: ${(p) => p.theme.spacing[0]};
  align-items: ${(p) => (p.$direction === 'row' ? 'center' : 'stretch')};
`;

export const NavigationPillList = React.forwardRef<HTMLElement, NavigationPillListProps>(
  ({ direction = 'row', children, ...rest }, ref) => (
    <Root ref={ref} $direction={direction} {...rest}>
      {children}
    </Root>
  ),
);
NavigationPillList.displayName = 'NavigationPillList';
