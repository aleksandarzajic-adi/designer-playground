import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = (t: DefaultTheme): Record<ButtonSize, ReturnType<typeof css>> => ({
  sm: css`
    height: 32px;
    padding: 0 ${t.spacing[3]};
    font-size: ${t.typography.fontSize.sm};
    gap: ${t.spacing[1]};
  `,
  md: css`
    height: 40px;
    padding: 0 ${t.spacing[4]};
    font-size: ${t.typography.fontSize.md};
    gap: ${t.spacing[2]};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${t.spacing[5]};
    font-size: ${t.typography.fontSize.lg};
    gap: ${t.spacing[2]};
  `,
});

const variantStyles = (t: DefaultTheme): Record<ButtonVariant, ReturnType<typeof css>> => ({
  primary: css`
    background: ${t.colors.accent};
    color: ${t.colors.fgOnAccent};
    border: 1px solid ${t.colors.accent};
    &:hover:not(:disabled) {
      background: ${t.colors.accentHover};
      border-color: ${t.colors.accentHover};
    }
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
  secondary: css`
    background: ${t.colors.bgSurface};
    color: ${t.colors.fgPrimary};
    border: 1px solid ${t.colors.border};
    &:hover:not(:disabled) {
      background: ${t.colors.bgMuted};
    }
    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `,
});

const Root = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}>`
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {leftIcon && !loading && <IconSlot>{leftIcon}</IconSlot>}
      {loading ? '…' : children}
      {rightIcon && !loading && <IconSlot>{rightIcon}</IconSlot>}
    </Root>
  ),
);
Button.displayName = 'Button';
