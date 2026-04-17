import * as React from 'react';
import styled from 'styled-components';
import type { ColorToken, FontSizeToken, FontWeightToken } from '../theme';

export type TextTag = 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextTag;
  size?: FontSizeToken;
  weight?: FontWeightToken;
  color?: ColorToken;
  muted?: boolean;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
}

const Root = styled.p<Required<Pick<TextProps, 'size' | 'weight'>> & {
  $color?: ColorToken;
  $muted: boolean;
  $align: 'left' | 'center' | 'right';
  $truncate: boolean;
}>`
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSize[p.size]};
  font-weight: ${(p) => p.theme.typography.fontWeight[p.weight]};
  color: ${(p) =>
    p.$color
      ? p.theme.colors[p.$color]
      : p.$muted
        ? p.theme.colors.fgMuted
        : p.theme.colors.fgPrimary};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
  text-align: ${(p) => p.$align};
  ${(p) =>
    p.$truncate &&
    `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`}
`;

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      size = 'md',
      weight = 'regular',
      color,
      muted = false,
      align = 'left',
      truncate = false,
      ...rest
    },
    ref,
  ) => (
    <Root
      ref={ref as React.Ref<HTMLParagraphElement>}
      as={as}
      size={size}
      weight={weight}
      $color={color}
      $muted={muted}
      $align={align}
      $truncate={truncate}
      {...rest}
    />
  ),
);
Text.displayName = 'Text';
