import * as React from 'react';
import styled from 'styled-components';
import type { SpacingToken } from '../theme';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: StackDirection;
  gap?: SpacingToken;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  inline?: boolean;
}

const alignMap: Record<StackAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<StackJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const Root = styled.div<{
  $direction: StackDirection;
  $gap: SpacingToken;
  $align: StackAlign;
  $justify: StackJustify;
  $wrap: boolean;
  $inline: boolean;
}>`
  display: ${(p) => (p.$inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(p) => p.$direction};
  gap: ${(p) => p.theme.spacing[p.$gap]};
  align-items: ${(p) => alignMap[p.$align]};
  justify-content: ${(p) => justifyMap[p.$justify]};
  flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};
`;

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      gap = 3,
      align = 'stretch',
      justify = 'start',
      wrap = false,
      inline = false,
      ...rest
    },
    ref,
  ) => (
    <Root
      ref={ref}
      $direction={direction}
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $inline={inline}
      {...rest}
    />
  ),
);
Stack.displayName = 'Stack';
