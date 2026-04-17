import type { ArchetypeSpec, TemplateFn } from './shared';

export type ToggleKind = 'checkbox' | 'radio' | 'switch';

export function toggleTemplate(kind: ToggleKind): TemplateFn {
  return (spec: ArchetypeSpec) => {
    const name = spec.componentName;
    const htmlType: 'checkbox' | 'radio' = kind === 'radio' ? 'radio' : 'checkbox';
    const isSwitch = kind === 'switch';

    const controlMarkup = isSwitch
      ? `<SwitchTrack $checked={checked}><SwitchThumb $checked={checked} /></SwitchTrack>`
      : kind === 'radio'
        ? `<Dot $checked={checked} />`
        : `<Tick $checked={checked} aria-hidden="true">{checked ? '✓' : null}</Tick>`;

    const extraStyled = isSwitch
      ? `
const SwitchTrack = styled.span<{ $checked: boolean }>\`
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 9999px;
  background: \${(p) => (p.$checked ? p.theme.colors.accent : p.theme.colors.bgMuted)};
  border: 1px solid \${(p) => p.theme.colors.border};
  transition: background \${(p) => p.theme.durations.fast} ease;
\`;

const SwitchThumb = styled.span<{ $checked: boolean }>\`
  position: absolute;
  top: 1px;
  left: \${(p) => (p.$checked ? '15px' : '1px')};
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: \${(p) => p.theme.colors.bgPrimary};
  transition: left \${(p) => p.theme.durations.fast} ease;
\`;
`
      : kind === 'radio'
        ? `
const Dot = styled.span<{ $checked: boolean }>\`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 1px solid \${(p) => (p.$checked ? p.theme.colors.accent : p.theme.colors.border)};
  background: \${(p) => p.theme.colors.bgPrimary};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 9999px;
    background: \${(p) => (p.$checked ? p.theme.colors.accent : 'transparent')};
  }
\`;
`
        : `
const Tick = styled.span<{ $checked: boolean }>\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: \${(p) => p.theme.radii.sm};
  border: 1px solid \${(p) => (p.$checked ? p.theme.colors.accent : p.theme.colors.border)};
  background: \${(p) => (p.$checked ? p.theme.colors.accent : p.theme.colors.bgPrimary)};
  color: \${(p) => p.theme.colors.fgOnAccent};
  font-size: 11px;
\`;
`;

    const source = `import * as React from 'react';
import styled from 'styled-components';

export interface ${name}Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
}

const Root = styled.label<{ $disabled: boolean; $invalid: boolean }>\`
  display: inline-flex;
  align-items: flex-start;
  gap: \${(p) => p.theme.spacing[2]};
  cursor: \${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: \${(p) => (p.$disabled ? 0.6 : 1)};
  color: \${(p) => (p.$invalid ? p.theme.colors.danger : p.theme.colors.fgPrimary)};
\`;

const HiddenInput = styled.input\`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
\`;

const TextBlock = styled.span\`
  display: inline-flex;
  flex-direction: column;
  gap: \${(p) => p.theme.spacing[1]};
\`;

const Label = styled.span\`
  font-size: \${(p) => p.theme.typography.fontSize.md};
  font-weight: \${(p) => p.theme.typography.fontWeight.medium};
  line-height: \${(p) => p.theme.typography.lineHeight.tight};
\`;

const Description = styled.span\`
  font-size: \${(p) => p.theme.typography.fontSize.sm};
  color: \${(p) => p.theme.colors.fgMuted};
\`;
${extraStyled}
export const ${name} = React.forwardRef<HTMLInputElement, ${name}Props>(
  ({ label, description, invalid = false, disabled = false, checked, defaultChecked, onChange, ...rest }, ref) => {
    const controlled = checked !== undefined;
    const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false);
    const isChecked = controlled ? Boolean(checked) : internal;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!controlled) setInternal(e.target.checked);
      onChange?.(e);
    };

    const checkedState = isChecked;
    void checkedState;

    return (
      <Root $disabled={Boolean(disabled)} $invalid={invalid}>
        <HiddenInput
          ref={ref}
          type="${htmlType}"
          disabled={disabled}
          checked={isChecked}
          onChange={handleChange}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        {((checked: boolean) => ${controlMarkup})(isChecked)}
        {(label || description) && (
          <TextBlock>
            {label && <Label>{label}</Label>}
            {description && <Description>{description}</Description>}
          </TextBlock>
        )}
      </Root>
    );
  },
);
${name}.displayName = '${name}';
`;

    return { componentName: name, fileName: `${name}.tsx`, source };
  };
}
