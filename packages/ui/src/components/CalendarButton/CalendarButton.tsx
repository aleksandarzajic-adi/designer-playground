import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export interface CalendarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  inRange?: boolean;
  hidden?: boolean;
  disabled?: boolean;
}

const stateStyles = (t: DefaultTheme, active: boolean, inRange: boolean, disabled: boolean) => {
  if (active) {
    return css`
      background: ${t.colors.fgPrimary};
      color: ${t.colors.bgPrimary};
      border: 1px solid transparent;
    `;
  }
  if (inRange) {
    return css`
      background: ${t.colors.bgMuted};
      color: ${disabled ? t.colors.fgMuted : t.colors.fgPrimary};
      border: 1px solid transparent;
    `;
  }
  return css`
    background: transparent;
    color: ${disabled ? t.colors.fgMuted : t.colors.fgPrimary};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${t.colors.bgPrimary};
      border-color: ${t.colors.border};
    }
  `;
};

const Root = styled.button<{
  $active: boolean;
  $inRange: boolean;
  $hidden: boolean;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[4]};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  border-radius: ${(p) => p.theme.radii.md};
  cursor: pointer;
  user-select: none;
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease,
    color ${(p) => p.theme.durations.fast} ease;

  ${(p) => stateStyles(p.theme, p.$active, p.$inRange, p.$disabled)}

  ${(p) =>
    p.$hidden &&
    css`
      visibility: hidden;
      pointer-events: none;
    `}

  &:disabled {
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const CalendarButton = React.forwardRef<HTMLButtonElement, CalendarButtonProps>(
  (
    {
      active = false,
      inRange = false,
      hidden = false,
      disabled = false,
      children,
      ...rest
    },
    ref,
  ) => (
    <Root
      ref={ref}
      type={rest.type ?? 'button'}
      $active={active}
      $inRange={inRange}
      $hidden={hidden}
      $disabled={disabled}
      disabled={disabled}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : rest.tabIndex}
      {...rest}
    >
      {children}
    </Root>
  ),
);
CalendarButton.displayName = 'CalendarButton';
