import * as React from 'react';
import styled from 'styled-components';

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
  shortcut?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Root = styled.button<{ $disabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: ${(p) => p.theme.spacing[3]};
  padding: ${(p) => p.theme.spacing[3]} ${(p) => p.theme.spacing[4]};
  width: 100%;
  background: transparent;
  border: none;
  border-radius: ${(p) => p.theme.radii.md};
  color: ${(p) => p.theme.colors.fgPrimary};
  font-family: inherit;
  text-align: left;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  transition: background ${(p) => p.theme.durations.fast} ease;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.bgMuted};
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: -2px;
  }
`;

const IconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

const Body = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]};
  flex: 1;
  min-width: 0;
`;

const Row = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[1]};
`;

const Label = styled.span`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const Shortcut = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1;
  color: ${(p) => p.theme.colors.fgMuted};
  border-radius: ${(p) => p.theme.radii.md};
  flex-shrink: 0;
`;

const Description = styled.span`
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgMuted};
`;

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ label, description, shortcut, icon, disabled = false, ...rest }, ref) => (
    <Root
      ref={ref}
      type={rest.type ?? 'button'}
      role="menuitem"
      $disabled={disabled}
      disabled={disabled}
      {...rest}
    >
      {icon && <IconSlot>{icon}</IconSlot>}
      <Body>
        <Row>
          <Label>{label}</Label>
          {shortcut && <Shortcut>{shortcut}</Shortcut>}
        </Row>
        {description && <Description>{description}</Description>}
      </Body>
    </Root>
  ),
);
MenuItem.displayName = 'MenuItem';
