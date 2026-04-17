import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export interface TagToggleItem {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

type TagToggleGroupBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
>;

export interface TagToggleGroupProps extends TagToggleGroupBaseProps {
  items: TagToggleItem[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
}

const Root = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${(p) => p.theme.spacing[2]};
  flex-wrap: wrap;
`;

const tagVariant = (t: DefaultTheme, selected: boolean) =>
  selected
    ? css`
        background: ${t.colors.fgPrimary};
        color: ${t.colors.bgPrimary};
        border-color: ${t.colors.fgPrimary};
      `
    : css`
        background: ${t.colors.bgMuted};
        color: ${t.colors.fgMuted};
        border-color: ${t.colors.border};
        &:hover:not(:disabled) {
          background: ${t.colors.bgSurface};
          color: ${t.colors.fgPrimary};
        }
      `;

const Tag = styled.button<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(p) => p.theme.spacing[2]};
  padding: ${(p) => p.theme.spacing[2]};
  border: 1px solid transparent;
  border-radius: ${(p) => p.theme.radii.md};
  font-family: inherit;
  font-size: ${(p) => p.theme.typography.fontSize.md};
  font-weight: ${(p) => p.theme.typography.fontWeight.regular};
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition:
    background ${(p) => p.theme.durations.fast} ease,
    color ${(p) => p.theme.durations.fast} ease,
    border-color ${(p) => p.theme.durations.fast} ease;

  ${(p) => tagVariant(p.theme, p.$selected)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${(p) => p.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M13 4.5L6.5 11L3 7.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const normalize = (
  value: string | string[] | null | undefined,
  multiple: boolean,
): string[] => {
  if (value == null) return [];
  if (Array.isArray(value)) return multiple ? value : value.slice(0, 1);
  return [value];
};

export const TagToggleGroup = React.forwardRef<HTMLDivElement, TagToggleGroupProps>(
  (
    {
      items,
      value,
      defaultValue,
      onChange,
      multiple = false,
      disabled = false,
      name,
      role,
      ...rest
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<string[]>(() =>
      normalize(defaultValue, multiple),
    );
    const selected = isControlled ? normalize(value, multiple) : internal;

    const emit = (next: string[]) => {
      if (!isControlled) setInternal(next);
      if (!onChange) return;
      if (multiple) onChange(next);
      else onChange(next[0] ?? null);
    };

    const toggle = (v: string) => {
      if (multiple) {
        const next = selected.includes(v)
          ? selected.filter((x) => x !== v)
          : [...selected, v];
        emit(next);
      } else {
        emit(selected[0] === v ? [] : [v]);
      }
    };

    return (
      <Root ref={ref} role={role ?? (multiple ? 'group' : 'radiogroup')} {...rest}>
        {items.map((item) => {
          const isSelected = selected.includes(item.value);
          const itemDisabled = disabled || item.disabled;
          return (
            <Tag
              key={item.value}
              type="button"
              name={name}
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              aria-pressed={multiple ? isSelected : undefined}
              disabled={itemDisabled}
              $selected={isSelected}
              onClick={() => toggle(item.value)}
            >
              {isSelected && <CheckIcon />}
              {item.label}
            </Tag>
          );
        })}
      </Root>
    );
  },
);
TagToggleGroup.displayName = 'TagToggleGroup';
