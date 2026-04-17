import * as React from 'react';
import styled from 'styled-components';
import type { SpacingToken } from '../../theme';

export type TextListDensity = 'default' | 'tight';

export interface TextListProps extends React.HTMLAttributes<HTMLUListElement> {
  density?: TextListDensity;
  items?: React.ReactNode[];
}

const densityGap: Record<TextListDensity, SpacingToken> = {
  default: 3,
  tight: 2,
};

const Root = styled.ul<{ $density: TextListDensity }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[densityGap[p.$density]]};
  padding: ${(p) => p.theme.spacing[0]};
  margin: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[0]};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgMuted};
`;

export const TextList = React.forwardRef<HTMLUListElement, TextListProps>(
  ({ density = 'default', items, children, ...rest }, ref) => (
    <Root ref={ref} $density={density} {...rest}>
      {items
        ? items.map((item, i) => <Item key={i}>{item}</Item>)
        : React.Children.map(children, (child, i) => <Item key={i}>{child}</Item>)}
    </Root>
  ),
);
TextList.displayName = 'TextList';
