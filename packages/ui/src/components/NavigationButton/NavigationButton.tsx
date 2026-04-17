import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type NavigationButtonVariant = 'primary' | 'secondary';
export type NavigationButtonSize = 'medium';

export interface NavigationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: NavigationButtonVariant;
  size?: NavigationButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = (t: DefaultTheme): Record<NavigationButtonSize, ReturnType<typeof css>> => ({
  medium: css`height: 40px; padding: 0 ${t.spacing[4]}; font-size: ${t.typography.fontSize.md}; gap: ${t.spacing[2]};`,
});

const variantStyles = (t: DefaultTheme): Record<NavigationButtonVariant, ReturnType<typeof css>> => ({
  primary: css`
    background: ${t.colors.accent};
    color: ${t.colors.fgOnAccent};
    border: 1px solid ${t.colors.accent};
    &:hover:not(:disabled) { background: ${t.colors.accentHover}; border-color: ${t.colors.accentHover}; }
  `,
  secondary: css`
    background: ${t.colors.bgSurface};
    color: ${t.colors.fgPrimary};
    border: 1px solid ${t.colors.border};
    &:hover:not(:disabled) { background: ${t.colors.bgMuted}; }
  `,
});

const Root = styled.button<{ $variant: NavigationButtonVariant; $size: NavigationButtonSize; $fullWidth: boolean }>`
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

export const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
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
NavigationButton.displayName = 'NavigationButton';
