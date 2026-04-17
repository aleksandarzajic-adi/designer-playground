import { defaultOf, unionLiteral, type ArchetypeSpec, type TemplateFn } from './shared';

const SIZE_PX: Record<string, number> = {
  xs: 20,
  small: 28,
  sm: 28,
  medium: 36,
  md: 36,
  large: 48,
  lg: 48,
  xl: 64,
};

export const avatarTemplate: TemplateFn = (spec: ArchetypeSpec) => {
  const name = spec.componentName;
  const sizes = spec.variants.size ?? ['medium'];
  const shapes = spec.variants.shape ?? ['circle', 'square'];

  const sizeCase = sizes
    .map((s) => `  ${s}: css\`width: ${SIZE_PX[s.toLowerCase()] ?? 36}px; height: ${SIZE_PX[s.toLowerCase()] ?? 36}px;\`,`)
    .join('\n');

  const shapeCase = shapes
    .map(
      (s) =>
        `  ${s}: css\`border-radius: \${s === 'circle' ? 'var(--dp-radius-pill)' : 'var(--dp-radius-md)'};\`,`,
    )
    .join('\n');

  const source = `import * as React from 'react';
import styled, { css } from 'styled-components';

export type ${name}Size = ${unionLiteral(sizes)};
export type ${name}Shape = ${unionLiteral(shapes)};

export interface ${name}Props extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: ${name}Size;
  shape?: ${name}Shape;
}

const sizeStyles: Record<${name}Size, ReturnType<typeof css>> = {
${sizeCase}
};

const shapeStyles: Record<${name}Shape, ReturnType<typeof css>> = {
${shapes
  .map(
    (s) =>
      `  ${s}: css\`border-radius: ${s.toLowerCase() === 'circle' ? '9999px' : '8px'};\`,`,
  )
  .join('\n')}
};

const Root = styled.span<{ $size: ${name}Size; $shape: ${name}Shape }>\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: \${(p) => p.theme.colors.bgMuted};
  color: \${(p) => p.theme.colors.fgPrimary};
  font-weight: \${(p) => p.theme.typography.fontWeight.medium};
  \${(p) => sizeStyles[p.$size]}
  \${(p) => shapeStyles[p.$shape]}

  img { width: 100%; height: 100%; object-fit: cover; }
\`;

export const ${name} = React.forwardRef<HTMLSpanElement, ${name}Props>(
  ({ src, alt, initials, size = '${defaultOf(sizes)}', shape = '${defaultOf(shapes)}', ...rest }, ref) => (
    <Root ref={ref} $size={size} $shape={shape} {...rest}>
      {src ? <img src={src} alt={alt ?? ''} /> : initials}
    </Root>
  ),
);
${name}.displayName = '${name}';
`;

  return { componentName: name, fileName: `${name}.tsx`, source };
};
