import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type CheckboxValueType = 'unchecked' | 'checked' | 'indeterminate';

export interface CheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  valueType?: CheckboxValueType;
  disabled?: boolean;
}

const Root = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing[1]};
  font-family: ${(p) => p.theme.typography.fontFamily.sans};
  color: ${(p) => p.theme.colors.fgPrimary};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.6 : 1)};
  user-select: none;
`;

const Row = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]};
`;

const DescriptionRow = styled.span`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[3]};
  padding-left: calc(16px + ${(p) => p.theme.spacing[3]});
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

const boxStateStyles = (
  t: DefaultTheme,
): Record<CheckboxValueType, ReturnType<typeof css>> => ({
  unchecked: css`
    background: ${t.colors.bgPrimary};
    border-color: ${t.colors.border};
  `,
  checked: css`
    background: ${t.colors.accent};
    border-color: ${t.colors.accent};
  `,
  indeterminate: css`
    background: ${t.colors.accent};
    border-color: ${t.colors.accent};
  `,
});

const Box = styled.span<{ $valueType: CheckboxValueType; $disabled: boolean }>`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: ${(p) => p.theme.radii.sm};
  border: 1px solid ${(p) => p.theme.colors.border};
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease;

  ${(p) => boxStateStyles(p.theme)[p.$valueType]}

  ${(p) =>
    p.$disabled &&
    css`
      background: ${p.theme.colors.bgMuted};
      border-color: ${p.theme.colors.border};
    `}

  ${HiddenInput}:focus-visible + & {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Glyph = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.fgOnAccent};
  width: 10px;
  height: 10px;
`;

const Label = styled.span`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgPrimary};
`;

const Description = styled.span`
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1.4;
  color: ${(p) => p.theme.colors.fgMuted};
`;

const CheckIcon = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false">
    <path
      d="M1.5 5.2 4 7.5 8.5 2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false">
    <path
      d="M2 5h6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    {
      label,
      description,
      valueType = 'unchecked',
      disabled = false,
      className,
      style,
      id,
      ...rest
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = valueType === 'indeterminate';
      }
    }, [valueType]);

    return (
      <Root $disabled={disabled} className={className} style={style}>
        <Row>
          <HiddenInput
            ref={innerRef}
            type="checkbox"
            id={id}
            disabled={disabled}
            checked={valueType === 'checked'}
            aria-checked={valueType === 'indeterminate' ? 'mixed' : valueType === 'checked'}
            readOnly={rest.onChange === undefined}
            {...rest}
          />
          <Box $valueType={valueType} $disabled={disabled}>
            {valueType === 'checked' && (
              <Glyph>
                <CheckIcon />
              </Glyph>
            )}
            {valueType === 'indeterminate' && (
              <Glyph>
                <MinusIcon />
              </Glyph>
            )}
          </Box>
          {label && <Label>{label}</Label>}
        </Row>
        {description && (
          <DescriptionRow>
            <Description>{description}</Description>
          </DescriptionRow>
        )}
      </Root>
    );
  },
);
CheckboxField.displayName = 'CheckboxField';
