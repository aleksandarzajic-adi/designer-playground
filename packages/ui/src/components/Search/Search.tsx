import * as React from 'react';
import styled from 'styled-components';

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
    valueType?: SearchValueType;
    disabled?: boolean;
}

const Wrapper = styled.label`
  display: inline-flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]};
  width: 100%;
`;

const LabelText = styled.span`
  font-size: ${(p) => p.theme.typography.fontSize.sm};
  color: ${(p) => p.theme.colors.fgMuted};
`;

const HelperText = styled.span<{ $invalid?: boolean }>`
  font-size: ${(p) => p.theme.typography.fontSize.xs};
  color: ${(p) => (p.$invalid ? p.theme.colors.danger : p.theme.colors.fgMuted)};
`;

const StyledInput = styled.input<{ $invalid: boolean }>`
  height: 40px;
  padding: 0 ${(p) => p.theme.spacing[3]};
  border-radius: ${(p) => p.theme.radii.md};
  border: 1px solid ${(p) => (p.$invalid ? p.theme.colors.danger : p.theme.colors.border)};
  background: ${(p) => p.theme.colors.bgPrimary};
  color: ${(p) => p.theme.colors.fgPrimary};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  transition:
    border-color ${(p) => p.theme.durations.fast} ease,
    box-shadow ${(p) => p.theme.durations.fast} ease;

  &::placeholder { color: ${(p) => p.theme.colors.fgMuted}; }
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:read-only { background: ${(p) => p.theme.colors.bgMuted}; }
`;

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ label, helperText, id, ...rest }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const message = helperText;
    return (
      <Wrapper htmlFor={inputId}>
        {label && <LabelText>{label}</LabelText>}
        <StyledInput id={inputId} ref={ref} $invalid={false} {...rest} />
        {message && <HelperText>{message}</HelperText>}
      </Wrapper>
    );
  },
);
Search.displayName = 'Search';

export type SearchValueType = 'filled' | 'placeholder';
