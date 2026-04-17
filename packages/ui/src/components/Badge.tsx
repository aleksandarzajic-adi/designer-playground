import styled, { css } from 'styled-components';
import { color, space, radius, fontSize, fontWeight } from '@dp/tokens';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

const tones = {
  neutral: css`background: ${color.bgMuted}; color: ${color.fgPrimary};`,
  accent: css`background: ${color.accent}; color: ${color.fgOnAccent};`,
  success: css`background: ${color.success}; color: ${color.fgOnAccent};`,
  warning: css`background: ${color.warning}; color: ${color.fgOnAccent};`,
  danger: css`background: ${color.danger}; color: ${color.fgOnAccent};`,
};

export const Badge = styled.span<{ $tone?: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  padding: ${space[1]} ${space[2]};
  border-radius: ${radius.pill};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  line-height: 1;
  ${(p) => tones[p.$tone ?? 'neutral']}
`;
