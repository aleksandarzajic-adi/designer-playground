import { defaultOf, unionLiteral, type ArchetypeSpec, type TemplateFn } from './shared';

export const tooltipTemplate: TemplateFn = (spec: ArchetypeSpec) => {
  const name = spec.componentName;
  const placements = spec.variants.placement ?? ['top', 'bottom', 'left', 'right'];

  const source = `import * as React from 'react';
import styled from 'styled-components';

export type ${name}Placement = ${unionLiteral(placements)};

export interface ${name}Props extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: React.ReactNode;
  placement?: ${name}Placement;
  children: React.ReactElement;
}

const Wrapper = styled.span\`
  position: relative;
  display: inline-flex;
\`;

const Bubble = styled.span<{ $placement: ${name}Placement; $visible: boolean }>\`
  position: absolute;
  background: \${(p) => p.theme.colors.fgPrimary};
  color: \${(p) => p.theme.colors.bgPrimary};
  padding: \${(p) => p.theme.spacing[1]} \${(p) => p.theme.spacing[2]};
  border-radius: \${(p) => p.theme.radii.sm};
  font-size: \${(p) => p.theme.typography.fontSize.xs};
  white-space: nowrap;
  pointer-events: none;
  opacity: \${(p) => (p.$visible ? 1 : 0)};
  transition: opacity \${(p) => p.theme.durations.fast} ease;
  z-index: 10;
  \${(p) => {
    switch (p.$placement) {
      case 'top':    return 'bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);';
      case 'bottom': return 'top: calc(100% + 6px); left: 50%; transform: translateX(-50%);';
      case 'left':   return 'right: calc(100% + 6px); top: 50%; transform: translateY(-50%);';
      case 'right':  return 'left: calc(100% + 6px); top: 50%; transform: translateY(-50%);';
      default: return '';
    }
  }}
\`;

export const ${name} = React.forwardRef<HTMLSpanElement, ${name}Props>(
  ({ content, placement = '${defaultOf(placements)}', children }, _ref) => {
    const [visible, setVisible] = React.useState(false);
    return (
      <Wrapper onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} onFocus={() => setVisible(true)} onBlur={() => setVisible(false)}>
        {children}
        <Bubble role="tooltip" $placement={placement} $visible={visible}>
          {content}
        </Bubble>
      </Wrapper>
    );
  },
);
${name}.displayName = '${name}';
`;

  return { componentName: name, fileName: `${name}.tsx`, source };
};
