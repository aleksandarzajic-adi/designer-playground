import type { ArchetypeSpec, TemplateFn } from './shared';

export const inputFieldTemplate: TemplateFn = (spec: ArchetypeSpec) => {
  const name = spec.componentName;
  const hasInvalid = spec.states.includes('invalid');
  const hasReadonly = spec.states.includes('readonly');

  const source = `import * as React from 'react';
import styled from 'styled-components';

export interface ${name}Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
${hasInvalid ? '  invalid?: boolean;\n  errorText?: string;\n' : ''}${hasReadonly ? '  readOnly?: boolean;\n' : ''}}

const Wrapper = styled.label\`
  display: inline-flex;
  flex-direction: column;
  gap: \${(p) => p.theme.spacing[1]};
  width: 100%;
\`;

const LabelText = styled.span\`
  font-size: \${(p) => p.theme.typography.fontSize.sm};
  color: \${(p) => p.theme.colors.fgMuted};
\`;

const HelperText = styled.span<{ $invalid?: boolean }>\`
  font-size: \${(p) => p.theme.typography.fontSize.xs};
  color: \${(p) => (p.$invalid ? p.theme.colors.danger : p.theme.colors.fgMuted)};
\`;

const StyledInput = styled.input<{ $invalid: boolean }>\`
  height: 40px;
  padding: 0 \${(p) => p.theme.spacing[3]};
  border-radius: \${(p) => p.theme.radii.md};
  border: 1px solid \${(p) => (p.$invalid ? p.theme.colors.danger : p.theme.colors.border)};
  background: \${(p) => p.theme.colors.bgPrimary};
  color: \${(p) => p.theme.colors.fgPrimary};
  font-family: inherit;
  font-size: \${(p) => p.theme.typography.fontSize.md};
  transition:
    border-color \${(p) => p.theme.durations.fast} ease,
    box-shadow \${(p) => p.theme.durations.fast} ease;

  &::placeholder { color: \${(p) => p.theme.colors.fgMuted}; }
  &:focus {
    outline: none;
    border-color: \${(p) => p.theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.18);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:read-only { background: \${(p) => p.theme.colors.bgMuted}; }
\`;

export const ${name} = React.forwardRef<HTMLInputElement, ${name}Props>(
  ({ label, helperText,${hasInvalid ? ' invalid = false, errorText,' : ''} id, ...rest }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
${hasInvalid ? '    const message = invalid ? errorText ?? helperText : helperText;\n' : '    const message = helperText;\n'}    return (
      <Wrapper htmlFor={inputId}>
        {label && <LabelText>{label}</LabelText>}
        <StyledInput id={inputId} ref={ref} $invalid={${hasInvalid ? 'invalid' : 'false'}} {...rest} />
        {message && <HelperText${hasInvalid ? ' $invalid={invalid}' : ''}>{message}</HelperText>}
      </Wrapper>
    );
  },
);
${name}.displayName = '${name}';
`;

  return { componentName: name, fileName: `${name}.tsx`, source };
};
