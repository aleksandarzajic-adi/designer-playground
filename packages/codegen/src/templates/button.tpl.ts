import { defaultOf, unionLiteral, type ArchetypeSpec, type TemplateFn } from './shared';

const VARIANT_STYLE: Record<string, string> = {
  primary: `
    background: \${t.colors.accent};
    color: \${t.colors.fgOnAccent};
    border: 1px solid \${t.colors.accent};
    &:hover:not(:disabled) { background: \${t.colors.accentHover}; border-color: \${t.colors.accentHover}; }`,
  secondary: `
    background: \${t.colors.bgSurface};
    color: \${t.colors.fgPrimary};
    border: 1px solid \${t.colors.border};
    &:hover:not(:disabled) { background: \${t.colors.bgMuted}; }`,
  neutral: `
    background: \${t.colors.bgMuted};
    color: \${t.colors.fgPrimary};
    border: 1px solid \${t.colors.border};
    &:hover:not(:disabled) { background: \${t.colors.bgSurface}; }`,
  subtle: `
    background: transparent;
    color: \${t.colors.fgPrimary};
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: \${t.colors.bgMuted}; }`,
  ghost: `
    background: transparent;
    color: \${t.colors.fgPrimary};
    border: 1px solid transparent;
    &:hover:not(:disabled) { background: \${t.colors.bgMuted}; }`,
  danger: `
    background: \${t.colors.danger};
    color: \${t.colors.fgOnAccent};
    border: 1px solid \${t.colors.danger};
    &:hover:not(:disabled) { filter: brightness(0.92); }`,
};

const SIZE_STYLE: Record<string, string> = {
  small: `height: 32px; padding: 0 \${t.spacing[3]}; font-size: \${t.typography.fontSize.sm}; gap: \${t.spacing[1]};`,
  sm: `height: 32px; padding: 0 \${t.spacing[3]}; font-size: \${t.typography.fontSize.sm}; gap: \${t.spacing[1]};`,
  medium: `height: 40px; padding: 0 \${t.spacing[4]}; font-size: \${t.typography.fontSize.md}; gap: \${t.spacing[2]};`,
  md: `height: 40px; padding: 0 \${t.spacing[4]}; font-size: \${t.typography.fontSize.md}; gap: \${t.spacing[2]};`,
  large: `height: 48px; padding: 0 \${t.spacing[5]}; font-size: \${t.typography.fontSize.lg}; gap: \${t.spacing[2]};`,
  lg: `height: 48px; padding: 0 \${t.spacing[5]}; font-size: \${t.typography.fontSize.lg}; gap: \${t.spacing[2]};`,
};

const renderVariant = (name: string) => {
  const body = VARIANT_STYLE[name.toLowerCase()] ?? VARIANT_STYLE.secondary;
  return `  ${name}: css\`${body}\n  \`,`;
};

const renderSize = (name: string) => {
  const body = SIZE_STYLE[name.toLowerCase()] ?? SIZE_STYLE.medium;
  return `  ${name}: css\`${body}\`,`;
};

export const buttonTemplate: TemplateFn = (spec: ArchetypeSpec) => {
  const variants = spec.variants.variant ?? ['primary', 'secondary'];
  const sizes = spec.variants.size ?? ['medium'];
  const hasLoading = spec.states.includes('loading');
  const name = spec.componentName;

  const source = `import * as React from 'react';
import styled, { css, type DefaultTheme } from 'styled-components';

export type ${name}Variant = ${unionLiteral(variants)};
export type ${name}Size = ${unionLiteral(sizes)};

export interface ${name}Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ${name}Variant;
  size?: ${name}Size;
  fullWidth?: boolean;
${hasLoading ? '  loading?: boolean;\n' : ''}  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = (t: DefaultTheme): Record<${name}Size, ReturnType<typeof css>> => ({
${sizes.map(renderSize).join('\n')}
});

const variantStyles = (t: DefaultTheme): Record<${name}Variant, ReturnType<typeof css>> => ({
${variants.map(renderVariant).join('\n')}
});

const Root = styled.button<{ $variant: ${name}Variant; $size: ${name}Size; $fullWidth: boolean }>\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: \${(p) => p.theme.typography.fontWeight.medium};
  border-radius: \${(p) => p.theme.radii.md};
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition:
    background \${(p) => p.theme.durations.fast} ease,
    border-color \${(p) => p.theme.durations.fast} ease,
    transform \${(p) => p.theme.durations.fast} ease;

  \${(p) => sizeStyles(p.theme)[p.$size]}
  \${(p) => variantStyles(p.theme)[p.$variant]}
  \${(p) => p.$fullWidth && 'width: 100%;'}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid \${(p) => p.theme.colors.accent}; outline-offset: 2px; }
  &:active:not(:disabled) { transform: translateY(1px); }
\`;

const IconSlot = styled.span\`display: inline-flex; align-items: center;\`;

export const ${name} = React.forwardRef<HTMLButtonElement, ${name}Props>(
  (
    {
      variant = '${defaultOf(variants)}',
      size = '${defaultOf(sizes)}',
      fullWidth = false,
${hasLoading ? '      loading = false,\n' : ''}      leftIcon,
      rightIcon,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => (
    <Root
      ref={ref}
      type={rest.type ?? 'button'}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled${hasLoading ? ' || loading' : ''}}
${hasLoading ? '      aria-busy={loading || undefined}\n' : ''}      {...rest}
    >
      {leftIcon${hasLoading ? ' && !loading' : ''} && <IconSlot>{leftIcon}</IconSlot>}
      ${hasLoading ? '{loading ? \'…\' : children}' : '{children}'}
      {rightIcon${hasLoading ? ' && !loading' : ''} && <IconSlot>{rightIcon}</IconSlot>}
    </Root>
  ),
);
${name}.displayName = '${name}';
`;

  return { componentName: name, fileName: `${name}.tsx`, source };
};
