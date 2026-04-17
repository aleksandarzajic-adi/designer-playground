import type { ExtractedLayout, FigmaNode } from '../types';
import { mapSpacingToToken } from './tokens';

const alignMap = {
  MIN: 'start',
  CENTER: 'center',
  MAX: 'end',
} as const;

const justifyMap = {
  MIN: 'start',
  CENTER: 'center',
  MAX: 'end',
  SPACE_BETWEEN: 'between',
} as const;

export function extractLayout(node: FigmaNode): ExtractedLayout {
  if (!node.layoutMode || node.layoutMode === 'NONE') {
    return { kind: 'none' };
  }

  const direction: 'row' | 'column' = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';

  const gap = node.itemSpacing != null ? mapSpacingToToken(node.itemSpacing) : undefined;

  const paddingTop = mapSpacingToToken(node.paddingTop ?? 0);
  const paddingRight = mapSpacingToToken(node.paddingRight ?? 0);
  const paddingBottom = mapSpacingToToken(node.paddingBottom ?? 0);
  const paddingLeft = mapSpacingToToken(node.paddingLeft ?? 0);

  return {
    kind: 'flex',
    direction,
    gap,
    padding: {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
    },
    align: node.counterAxisAlignItems ? alignMap[node.counterAxisAlignItems] : undefined,
    justify: node.primaryAxisAlignItems ? justifyMap[node.primaryAxisAlignItems] : undefined,
  };
}
