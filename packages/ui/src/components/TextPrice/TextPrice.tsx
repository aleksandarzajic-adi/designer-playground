import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type TextPriceSize = 'large' | 'small';

export interface TextPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: TextPriceSize;
  currency?: string;
  amount: React.ReactNode;
  period?: React.ReactNode;
}

const currencySizeStyles = (t: DefaultTheme): Record<TextPriceSize, ReturnType<typeof css>> => ({
  large: css`
    font-size: ${t.typography.fontSize.xl};
    font-weight: ${t.typography.fontWeight.bold};
  `,
  small: css`
    font-size: ${t.typography.fontSize.md};
    font-weight: ${t.typography.fontWeight.medium};
  `,
});

const amountSizeStyles = (t: DefaultTheme): Record<TextPriceSize, ReturnType<typeof css>> => ({
  large: css`
    font-size: ${t.typography.fontSize['2xl']};
    font-weight: ${t.typography.fontWeight.bold};
  `,
  small: css`
    font-size: ${t.typography.fontSize.xl};
    font-weight: ${t.typography.fontWeight.medium};
  `,
});

const periodSizeStyles = (t: DefaultTheme): Record<TextPriceSize, ReturnType<typeof css>> => ({
  large: css`
    font-size: ${t.typography.fontSize.sm};
    font-weight: ${t.typography.fontWeight.regular};
    line-height: ${t.typography.lineHeight.relaxed};
  `,
  small: css`
    font-size: ${t.typography.fontSize.sm};
    font-weight: ${t.typography.fontWeight.regular};
    line-height: ${t.typography.lineHeight.tight};
  `,
});

const Root = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const Price = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: flex-end;
`;

const Currency = styled.span<{ $size: TextPriceSize }>`
  line-height: 1;
  ${(p) => currencySizeStyles(p.theme)[p.$size]}
`;

const Amount = styled.span<{ $size: TextPriceSize }>`
  line-height: 1;
  ${(p) => amountSizeStyles(p.theme)[p.$size]}
`;

const Period = styled.span<{ $size: TextPriceSize }>`
  ${(p) => periodSizeStyles(p.theme)[p.$size]}
`;

export const TextPrice = React.forwardRef<HTMLDivElement, TextPriceProps>(
  ({ size = 'large', currency = '$', amount, period = '/ mo', ...rest }, ref) => (
    <Root ref={ref} {...rest}>
      <Price>
        <Currency $size={size}>{currency}</Currency>
        <Amount $size={size}>{amount}</Amount>
      </Price>
      {period && <Period $size={size}>{period}</Period>}
    </Root>
  ),
);
TextPrice.displayName = 'TextPrice';
