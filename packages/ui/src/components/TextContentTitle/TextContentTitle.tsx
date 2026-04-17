import * as React from 'react';
import styled from 'styled-components';

export type TextContentTitleAlign = 'start' | 'center';

export interface TextContentTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: TextContentTitleAlign;
}

const alignMap: Record<TextContentTitleAlign, string> = {
  start: 'flex-start',
  center: 'center',
};

const textAlignMap: Record<TextContentTitleAlign, string> = {
  start: 'left',
  center: 'center',
};

const Root = styled.div<{ $align: TextContentTitleAlign }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]};
  align-items: ${(p) => alignMap[p.$align]};
  padding: ${(p) => p.theme.spacing[0]};
`;

const Title = styled.span<{ $align: TextContentTitleAlign }>`
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize['2xl']};
  font-weight: ${(p) => p.theme.typography.fontWeight.bold};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgPrimary};
  text-align: ${(p) => textAlignMap[p.$align]};
`;

const Subtitle = styled.span<{ $align: TextContentTitleAlign }>`
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize['2xl']};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgMuted};
  text-align: ${(p) => textAlignMap[p.$align]};
`;

export const TextContentTitle = React.forwardRef<HTMLDivElement, TextContentTitleProps>(
  ({ title, subtitle, align = 'start', ...rest }, ref) => (
    <Root ref={ref} $align={align} {...rest}>
      <Title $align={align}>{title}</Title>
      {subtitle && <Subtitle $align={align}>{subtitle}</Subtitle>}
    </Root>
  ),
);
TextContentTitle.displayName = 'TextContentTitle';
