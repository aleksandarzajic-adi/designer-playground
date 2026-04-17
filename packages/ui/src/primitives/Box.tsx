import * as React from 'react';
import styled, { css } from 'styled-components';
import type {
  ColorToken,
  RadiusToken,
  ShadowToken,
  SpacingToken,
} from '../theme';

type Display = 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  p?: SpacingToken;
  px?: SpacingToken;
  py?: SpacingToken;
  pt?: SpacingToken;
  pr?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  m?: SpacingToken;
  mx?: SpacingToken;
  my?: SpacingToken;
  mt?: SpacingToken;
  mr?: SpacingToken;
  mb?: SpacingToken;
  ml?: SpacingToken;
  bg?: ColorToken;
  color?: ColorToken;
  radius?: RadiusToken;
  shadow?: ShadowToken;
  border?: boolean;
  display?: Display;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  flex?: string | number;
}

const sz = (v: string | number | undefined) =>
  v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

const Root = styled.div<Omit<BoxProps, 'as'>>`
  ${(p) => css`
    ${p.display && `display: ${p.display};`}
    ${p.p !== undefined && `padding: ${p.theme.spacing[p.p]};`}
    ${p.px !== undefined && `padding-left: ${p.theme.spacing[p.px]}; padding-right: ${p.theme.spacing[p.px]};`}
    ${p.py !== undefined && `padding-top: ${p.theme.spacing[p.py]}; padding-bottom: ${p.theme.spacing[p.py]};`}
    ${p.pt !== undefined && `padding-top: ${p.theme.spacing[p.pt]};`}
    ${p.pr !== undefined && `padding-right: ${p.theme.spacing[p.pr]};`}
    ${p.pb !== undefined && `padding-bottom: ${p.theme.spacing[p.pb]};`}
    ${p.pl !== undefined && `padding-left: ${p.theme.spacing[p.pl]};`}
    ${p.m !== undefined && `margin: ${p.theme.spacing[p.m]};`}
    ${p.mx !== undefined && `margin-left: ${p.theme.spacing[p.mx]}; margin-right: ${p.theme.spacing[p.mx]};`}
    ${p.my !== undefined && `margin-top: ${p.theme.spacing[p.my]}; margin-bottom: ${p.theme.spacing[p.my]};`}
    ${p.mt !== undefined && `margin-top: ${p.theme.spacing[p.mt]};`}
    ${p.mr !== undefined && `margin-right: ${p.theme.spacing[p.mr]};`}
    ${p.mb !== undefined && `margin-bottom: ${p.theme.spacing[p.mb]};`}
    ${p.ml !== undefined && `margin-left: ${p.theme.spacing[p.ml]};`}
    ${p.bg && `background: ${p.theme.colors[p.bg]};`}
    ${p.color && `color: ${p.theme.colors[p.color]};`}
    ${p.radius && `border-radius: ${p.theme.radii[p.radius]};`}
    ${p.shadow && `box-shadow: ${p.theme.shadows[p.shadow]};`}
    ${p.border && `border: 1px solid ${p.theme.colors.border};`}
    ${p.width !== undefined && `width: ${sz(p.width)};`}
    ${p.height !== undefined && `height: ${sz(p.height)};`}
    ${p.minWidth !== undefined && `min-width: ${sz(p.minWidth)};`}
    ${p.maxWidth !== undefined && `max-width: ${sz(p.maxWidth)};`}
    ${p.flex !== undefined && `flex: ${p.flex};`}
  `}
`;

export const Box = React.forwardRef<HTMLElement, BoxProps>(({ as, ...rest }, ref) => (
  <Root ref={ref as React.Ref<HTMLDivElement>} as={as as never} {...rest} />
));
Box.displayName = 'Box';
