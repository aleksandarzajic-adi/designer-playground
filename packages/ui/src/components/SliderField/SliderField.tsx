import * as React from 'react';
import styled, { css } from 'styled-components';

export interface SliderFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'prefix'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  prefix?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[3]};
  width: 100%;
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
`;

const LabelRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.theme.spacing[1]};
`;

const LabelText = styled.label<{ $disabled: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgPrimary};
  ${(p) =>
    p.$disabled &&
    css`
      color: ${p.theme.colors.fgMuted};
    `}
`;

const Output = styled.div<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgPrimary};
  ${(p) =>
    p.$disabled &&
    css`
      color: ${p.theme.colors.fgMuted};
    `}
`;

const Prefix = styled.span`
  margin-right: ${(p) => p.theme.spacing[1]};
`;

const Description = styled.p<{ $disabled: boolean }>`
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgMuted};
  ${(p) =>
    p.$disabled &&
    css`
      opacity: 0.7;
    `}
`;

const SliderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Input = styled.input<{ $disabled: boolean; $percent: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  margin: 0;
  padding: 0;
  background: transparent;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  transition: opacity ${(p) => p.theme.durations.fast} ease;

  &:focus {
    outline: none;
  }
  &:focus-visible::-webkit-slider-thumb {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
  &:focus-visible::-moz-range-thumb {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }

  &::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: ${(p) => p.theme.radii.pill};
    background: ${(p) =>
      p.$disabled
        ? `${p.theme.colors.bgMuted}`
        : `linear-gradient(to right, ${p.theme.colors.fgPrimary} 0%, ${p.theme.colors.fgPrimary} ${p.$percent}%, ${p.theme.colors.bgMuted} ${p.$percent}%, ${p.theme.colors.bgMuted} 100%)`};
  }
  &::-moz-range-track {
    height: 8px;
    border-radius: ${(p) => p.theme.radii.pill};
    background: ${(p) => p.theme.colors.bgMuted};
  }
  &::-moz-range-progress {
    height: 8px;
    border-radius: ${(p) => p.theme.radii.pill};
    background: ${(p) => (p.$disabled ? p.theme.colors.bgMuted : p.theme.colors.fgPrimary)};
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    margin-top: -4px;
    border-radius: ${(p) => p.theme.radii.pill};
    background: ${(p) => (p.$disabled ? p.theme.colors.bgMuted : p.theme.colors.fgPrimary)};
    border: 1px solid ${(p) => (p.$disabled ? p.theme.colors.border : p.theme.colors.fgPrimary)};
    cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
    transition: background ${(p) => p.theme.durations.fast} ease;
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: ${(p) => p.theme.radii.pill};
    background: ${(p) => (p.$disabled ? p.theme.colors.bgMuted : p.theme.colors.fgPrimary)};
    border: 1px solid ${(p) => (p.$disabled ? p.theme.colors.border : p.theme.colors.fgPrimary)};
    cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  }
`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const SliderField = React.forwardRef<HTMLInputElement, SliderFieldProps>(
  (
    {
      id,
      label,
      description,
      prefix,
      showValue = true,
      formatValue,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      disabled = false,
      onChange,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;

    const [internalValue, setInternalValue] = React.useState<number>(
      defaultValue ?? value ?? min,
    );
    const isControlled = value !== undefined;
    const current = isControlled ? (value as number) : internalValue;
    const percent = max === min ? 0 : ((clamp(current, min, max) - min) / (max - min)) * 100;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(Number(event.target.value));
      onChange?.(event);
    };

    const display = formatValue ? formatValue(current) : current;

    return (
      <Wrapper className={className} style={style}>
        {(label || showValue) && (
          <LabelRow>
            {label && (
              <LabelText htmlFor={inputId} $disabled={disabled}>
                {label}
              </LabelText>
            )}
            {showValue && (
              <Output $disabled={disabled}>
                {prefix && <Prefix>{prefix}</Prefix>}
                <span>{display}</span>
              </Output>
            )}
          </LabelRow>
        )}
        <SliderRow>
          <Input
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={disabled}
            onChange={handleChange}
            $disabled={disabled}
            $percent={percent}
            {...rest}
          />
        </SliderRow>
        {description && <Description $disabled={disabled}>{description}</Description>}
      </Wrapper>
    );
  },
);
SliderField.displayName = 'SliderField';
