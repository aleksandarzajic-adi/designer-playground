import * as React from 'react';
import styled from 'styled-components';

export interface SwitchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

const Root = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
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

const TRACK_WIDTH = 36;
const TRACK_HEIGHT = 20;
const THUMB_SIZE = 16;
const THUMB_INSET = 2;

const Track = styled.span<{ $checked: boolean; $disabled: boolean }>`
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: ${TRACK_WIDTH}px;
  height: ${TRACK_HEIGHT}px;
  border-radius: ${(p) => p.theme.radii.pill};
  border: 1px solid
    ${(p) =>
      p.$disabled
        ? p.theme.colors.border
        : p.$checked
          ? p.theme.colors.fgPrimary
          : p.theme.colors.fgMuted};
  background: ${(p) =>
    p.$disabled
      ? p.theme.colors.bgMuted
      : p.$checked
        ? p.theme.colors.fgPrimary
        : p.theme.colors.bgPrimary};
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease;

  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Thumb = styled.span<{ $checked: boolean; $disabled: boolean }>`
  position: absolute;
  top: ${THUMB_INSET - 1}px;
  left: ${(p) =>
    p.$checked ? TRACK_WIDTH - THUMB_SIZE - THUMB_INSET - 1 : THUMB_INSET - 1}px;
  width: ${THUMB_SIZE}px;
  height: ${THUMB_SIZE}px;
  border-radius: ${(p) => p.theme.radii.pill};
  background: ${(p) =>
    p.$disabled
      ? p.theme.colors.border
      : p.$checked
        ? p.theme.colors.bgPrimary
        : p.theme.colors.fgMuted};
  transition: left ${(p) => p.theme.durations.base} ease;
`;

const LabelText = styled.span<{ $disabled: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
  color: ${(p) => (p.$disabled ? p.theme.colors.fgMuted : p.theme.colors.fgPrimary)};
`;

const Description = styled.span<{ $disabled: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: ${(p) => p.theme.typography.lineHeight.normal};
  color: ${(p) => p.theme.colors.fgMuted};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
`;

export const SwitchField = React.forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({ label, description, checked, defaultChecked, disabled = false, className, style, ...rest }, ref) => {
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? (checked as boolean) : internal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.checked);
      rest.onChange?.(e);
    };

    return (
      <Root $disabled={disabled} className={className} style={style}>
        <Row>
          <LabelText $disabled={disabled}>{label}</LabelText>
          <HiddenInput
            ref={ref}
            type="checkbox"
            role="switch"
            checked={isControlled ? (checked as boolean) : undefined}
            defaultChecked={isControlled ? undefined : defaultChecked}
            disabled={disabled}
            aria-checked={isOn}
            {...rest}
            onChange={handleChange}
          />
          <Track $checked={isOn} $disabled={disabled} aria-hidden="true">
            <Thumb $checked={isOn} $disabled={disabled} />
          </Track>
        </Row>
        {description && <Description $disabled={disabled}>{description}</Description>}
      </Root>
    );
  },
);
SwitchField.displayName = 'SwitchField';
