import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export interface AiChatBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'placeholder' | 'value' | 'onSubmit'> {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  active?: boolean;
  disabled?: boolean;
  leftActions?: React.ReactNode;
  submitIcon?: React.ReactNode;
}

const rootStyles = (t: DefaultTheme, active: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: ${t.spacing[5]};
  padding: ${t.spacing[4]};
  background: ${t.colors.bgPrimary};
  border: 1px solid ${t.colors.border};
  border-radius: ${t.radii.lg};
  transition:
    border-color ${t.durations.fast} ease,
    box-shadow ${t.durations.fast} ease;

  ${active &&
  css`
    border-color: ${t.colors.accent};
    box-shadow: ${t.shadows.sm};
  `}
`;

const Root = styled.div<{ $active: boolean; $disabled: boolean }>`
  ${(p) => rootStyles(p.theme, p.$active)}
  ${(p) => p.$disabled && 'opacity: 0.6; pointer-events: none;'}
`;

const Field = styled.textarea<{ $active: boolean }>`
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => (p.$active ? p.theme.colors.fgPrimary : p.theme.colors.fgMuted)};

  &::placeholder {
    color: ${(p) => p.theme.colors.fgMuted};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]};
`;

const ActionGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]};
`;

const SubmitButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing[2]};
  border-radius: ${(p) => p.theme.radii.lg};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.fgPrimary : p.theme.colors.border)};
  background: ${(p) =>
    p.$active ? p.theme.colors.fgPrimary : p.theme.colors.bgMuted};
  color: ${(p) =>
    p.$active ? p.theme.colors.bgPrimary : p.theme.colors.fgMuted};
  cursor: pointer;
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease,
    color ${(p) => p.theme.durations.fast} ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const DefaultArrowUp = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AiChatBox = React.forwardRef<HTMLDivElement, AiChatBoxProps>(
  (
    {
      placeholder = 'What would you like to know?',
      value,
      onValueChange,
      onSubmit,
      active,
      disabled = false,
      leftActions,
      submitIcon,
      ...rest
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState('');
    const isControlled = value !== undefined;
    const current = isControlled ? value : internal;
    const isActive = active ?? current.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    };

    const handleSubmit = () => {
      if (disabled) return;
      onSubmit?.(current);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <Root ref={ref} $active={isActive} $disabled={disabled} {...rest}>
        <Field
          $active={isActive}
          placeholder={placeholder}
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <Row>
          <ActionGroup>{leftActions}</ActionGroup>
          <SubmitButton
            type="button"
            $active={isActive}
            onClick={handleSubmit}
            disabled={disabled}
            aria-label="Submit"
          >
            {submitIcon ?? DefaultArrowUp}
          </SubmitButton>
        </Row>
      </Root>
    );
  },
);
AiChatBox.displayName = 'AiChatBox';
