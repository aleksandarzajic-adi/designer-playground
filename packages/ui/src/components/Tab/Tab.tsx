import * as React from 'react';
import styled from 'styled-components';

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const Root = styled.button<{ $active: boolean }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[1]} ${(p) => p.theme.spacing[3]};
  background: transparent;
  border: 1px solid ${(p) => (p.$active ? p.theme.colors.fgPrimary : p.theme.colors.border)};
  border-radius: ${(p) => p.theme.radii.md};
  color: ${(p) => (p.$active ? p.theme.colors.fgPrimary : p.theme.colors.fgMuted)};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease,
    color ${(p) => p.theme.durations.fast} ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.bgMuted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ active = false, disabled, children, ...rest }, ref) => (
    <Root
      ref={ref}
      type={rest.type ?? 'button'}
      role="tab"
      aria-selected={active}
      $active={active}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Root>
  ),
);
Tab.displayName = 'Tab';
