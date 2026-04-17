import * as React from 'react';
import styled from 'styled-components';
import { color, fontSize, fontWeight } from '@dp/tokens';

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const sizes: Record<HeadingLevel, string> = {
  1: fontSize['2xl'],
  2: fontSize.xl,
  3: fontSize.lg,
  4: fontSize.md,
};

const Styled = styled.h1<{ $level: HeadingLevel }>`
  margin: 0;
  color: ${color.fgPrimary};
  font-weight: ${fontWeight.bold};
  font-size: ${(p) => sizes[p.$level]};
  line-height: 1.25;
`;

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, ...rest }) => {
  const Tag = `h${level}` as const;
  return (
    <Styled as={Tag} $level={level} {...rest}>
      {children}
    </Styled>
  );
};
