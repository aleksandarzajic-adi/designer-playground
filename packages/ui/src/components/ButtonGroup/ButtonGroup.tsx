import * as React from 'react';
import styled from 'styled-components';

export type ButtonGroupAlign = 'justify' | 'start' | 'end' | 'center' | 'stack';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: ButtonGroupAlign;
}

const justifyMap: Record<ButtonGroupAlign, string> = {
  justify: 'space-between',
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stack: 'center',
};

const Root = styled.div<{ $align: ButtonGroupAlign }>`
  display: flex;
  flex-direction: ${(p) => (p.$align === 'stack' ? 'column' : 'row')};
  align-items: ${(p) => (p.$align === 'stack' ? 'stretch' : 'center')};
  justify-content: ${(p) => justifyMap[p.$align]};
  gap: ${(p) => p.theme.spacing[4]};
  padding: ${(p) => p.theme.spacing[0]};
`;

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ align = 'start', children, ...rest }, ref) => (
    <Root ref={ref} $align={align} {...rest}>
      {children}
    </Root>
  ),
);
ButtonGroup.displayName = 'ButtonGroup';
