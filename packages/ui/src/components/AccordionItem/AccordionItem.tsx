import * as React from 'react';
import styled from 'styled-components';

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Root = styled.div<{ $open: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[2]};
  padding: ${(p) => p.theme.spacing[4]};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => (p.$open ? p.theme.colors.bgPrimary : p.theme.colors.bgMuted)};
  transition: background ${(p) => p.theme.durations.fast} ease;
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
`;

const Header = styled.button<{ $disabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]};
  width: 100%;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.medium};
  line-height: ${(p) => p.theme.typography.lineHeight.tight};
  color: ${(p) => p.theme.colors.fgPrimary};
  text-align: left;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const TitleText = styled.span`
  flex: 1;
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform ${(p) => p.theme.durations.fast} ease;
  transform: rotate(${(p) => (p.$open ? '180deg' : '0deg')});
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const ChevronIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      title,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      children,
      ...rest
    },
    ref,
  ) => {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isOpen = isControlled ? open : internalOpen;

    const toggle = () => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    return (
      <Root ref={ref} $open={isOpen} $disabled={disabled} {...rest}>
        <Header
          type="button"
          $disabled={disabled}
          disabled={disabled}
          aria-expanded={isOpen}
          onClick={toggle}
        >
          <TitleText>{title}</TitleText>
          <Chevron $open={isOpen}>
            <ChevronIcon />
          </Chevron>
        </Header>
        {isOpen && <Content>{children}</Content>}
      </Root>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';
