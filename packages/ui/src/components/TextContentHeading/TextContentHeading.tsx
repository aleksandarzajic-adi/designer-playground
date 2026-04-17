import * as React from 'react';
import styled from 'styled-components';

export type TextContentHeadingAlign = 'start' | 'center';

export interface TextContentHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: TextContentHeadingAlign;
  heading: React.ReactNode;
  subheading?: React.ReactNode;
  headingAs?: keyof JSX.IntrinsicElements;
  subheadingAs?: keyof JSX.IntrinsicElements;
}

const alignMap: Record<TextContentHeadingAlign, string> = {
  start: 'flex-start',
  center: 'center',
};

const textAlignMap: Record<TextContentHeadingAlign, string> = {
  start: 'left',
  center: 'center',
};

const Root = styled.div<{ $align: TextContentHeadingAlign }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]};
  padding: ${(p) => p.theme.spacing[0]};
  align-items: ${(p) => alignMap[p.$align]};
  text-align: ${(p) => textAlignMap[p.$align]};
`;

const Heading = styled.h2`
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.xl};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const Subheading = styled.p`
  margin: 0;
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.lg};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgMuted};
`;

export const TextContentHeading = React.forwardRef<HTMLDivElement, TextContentHeadingProps>(
  ({ align = 'start', heading, subheading, headingAs, subheadingAs, ...rest }, ref) => (
    <Root ref={ref} $align={align} {...rest}>
      <Heading as={headingAs}>{heading}</Heading>
      {subheading && <Subheading as={subheadingAs}>{subheading}</Subheading>}
    </Root>
  ),
);
TextContentHeading.displayName = 'TextContentHeading';
