import * as React from 'react';
import styled, { css } from 'styled-components';

export interface RadioFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
}

const Root = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  ${(p) => p.$disabled && 'opacity: 0.6;'}
`;

const Row = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]};
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Indicator = styled.span<{ $checked: boolean; $disabled: boolean }>`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: ${(p) => p.theme.radii.pill};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.bgPrimary};
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease;

  ${(p) =>
    p.$checked &&
    css`
      background: ${p.theme.colors.bgMuted};
      border-color: ${p.theme.colors.fgPrimary};

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border-radius: ${p.theme.radii.pill};
        background: ${p.theme.colors.fgPrimary};
        transform: translate(-50%, -50%);
      }
    `}

  ${(p) =>
    p.$disabled &&
    css`
      background: ${p.theme.colors.bgMuted};
      border-color: ${p.theme.colors.border};

      &::after {
        background: ${p.theme.colors.fgMuted};
      }
    `}

  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const LabelText = styled.span<{ $disabled: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => (p.$disabled ? p.theme.colors.fgMuted : p.theme.colors.fgPrimary)};
`;

const DescriptionRow = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]};
`;

const DescriptionSpacer = styled.span`
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
`;

const DescriptionText = styled.span<{ $disabled: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => (p.$disabled ? p.theme.colors.fgMuted : p.theme.colors.fgMuted)};
`;

export const RadioField = React.forwardRef<HTMLInputElement, RadioFieldProps>(
  ({ label, description, checked = false, disabled = false, className, style, ...rest }, ref) => (
    <Root $disabled={disabled} className={className} style={style}>
      <Row>
        <HiddenInput
          ref={ref}
          type="radio"
          checked={checked}
          disabled={disabled}
          {...rest}
        />
        <Indicator $checked={checked} $disabled={disabled} aria-hidden="true" />
        <LabelText $disabled={disabled}>{label}</LabelText>
      </Row>
      {description && (
        <DescriptionRow>
          <DescriptionSpacer aria-hidden="true" />
          <DescriptionText $disabled={disabled}>{description}</DescriptionText>
        </DescriptionRow>
      )}
    </Root>
  ),
);
RadioField.displayName = 'RadioField';
