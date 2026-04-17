import * as React from 'react';
import styled from 'styled-components';
import { color, space, radius, fontSize, duration } from '@dp/tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  label?: string;
}

const Wrapper = styled.label`
  display: inline-flex;
  flex-direction: column;
  gap: ${space[1]};
  width: 100%;
`;

const LabelText = styled.span`
  font-size: ${fontSize.sm};
  color: ${color.fgMuted};
`;

const StyledInput = styled.input<{ $invalid: boolean }>`
  height: 40px;
  padding: 0 ${space[3]};
  border-radius: ${radius.md};
  border: 1px solid ${(p) => (p.$invalid ? color.danger : color.border)};
  background: ${color.bgPrimary};
  color: ${color.fgPrimary};
  font-family: inherit;
  font-size: ${fontSize.md};
  transition: border-color ${duration.fast} ease, box-shadow ${duration.fast} ease;
  &::placeholder { color: ${color.fgMuted}; }
  &:focus {
    outline: none;
    border-color: ${color.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, label, id, ...rest }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <Wrapper htmlFor={inputId}>
        {label && <LabelText>{label}</LabelText>}
        <StyledInput id={inputId} ref={ref} $invalid={invalid} {...rest} />
      </Wrapper>
    );
  },
);
Input.displayName = 'Input';
