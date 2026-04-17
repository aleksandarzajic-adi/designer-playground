import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type ButtonVariant = 'primary' | 'neutral' | 'subtle';
export type ButtonSize = 'medium' | 'small';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
    disabled?: boolean;
}

const sizeStyles = (t: DefaultTheme): Record<ButtonSize, ReturnType<typeof css>> => ({
  medium: css`height: 40px; padding: 0 ${t.spacing[4]}; font-size: ${t.typography.fontSize.md}; gap: ${t.spacing[2]};`,
  small: css`height: 32px; padding: 0 ${t.spacing[3]}; font-size: ${t.typography.fontSize.sm}; gap: ${t.spacing[1]};`,
});

const variantStyles = (t: DefaultTheme): Record<ButtonVariant, ReturnType<typeof css>> => ({
  primary: css`
    background: ${t.colors.accent};
    color: ${t.colors.fgOnAccent};
    border: 1px solid ${t.colors.accent};
    &:hover:not(:disabled) { background: ${t.colors.accentHover}; border-color: ${t.colors.accentHover}; }
  `,
  neutral: css`
    background: ${t.colors.bgMuted};
    color: ${t.colors.fgPrimary};
    border: 1px solid ${t.colors.border};
    &:hover:not(:disabled) { background: ${t.colors.bgSurface}; }
  `,
  subtle: css`
    background: transparent;
    color: ${t.colors.fgPrimary};
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: ${t.colors.bgMuted}; }
  `,
});

const Root = styled.button<{ $variant: ButtonVariant; $size: ButtonSize; $fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  border-radius: ${(p) => p.theme.radii.md};
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease,
    transform ${(p) => p.theme.durations.fast} ease;

  ${(p) => sizeStyles(p.theme)[p.$size]}
  ${(p) => variantStyles(p.theme)[p.$variant]}
  ${(p) => p.$fullWidth && 'width: 100%;'}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid ${(p) => p.theme.colors.accent}; outline-offset: 2px; }
  &:active:not(:disabled) { transform: translateY(1px); }
`;

const IconSlot = styled.span`display: inline-flex; align-items: center;`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => (
    <Root
      ref={ref}
      type={rest.type ?? 'button'}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      {...rest}
    >
      {leftIcon && <IconSlot>{leftIcon}</IconSlot>}
      {children}
      {rightIcon && <IconSlot>{rightIcon}</IconSlot>}
    </Root>
  ),
);
Button.displayName = 'Button';
