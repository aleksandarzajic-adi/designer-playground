import type { ExtractedTokens, FigmaNode, FigmaPaint } from '../types';

const SPACING_SCALE: Array<[number, string]> = [
  [0, 'space.0'],
  [4, 'space.1'],
  [8, 'space.2'],
  [12, 'space.3'],
  [16, 'space.4'],
  [24, 'space.5'],
  [32, 'space.6'],
  [48, 'space.8'],
];

const RADIUS_SCALE: Array<[number, string]> = [
  [4, 'radius.sm'],
  [8, 'radius.md'],
  [12, 'radius.lg'],
  [999, 'radius.pill'],
];

const FONT_SIZE_SCALE: Array<[number, string]> = [
  [12, 'fontSize.xs'],
  [14, 'fontSize.sm'],
  [16, 'fontSize.md'],
  [18, 'fontSize.lg'],
  [22, 'fontSize.xl'],
  [28, 'fontSize.2xl'],
];

const FONT_WEIGHT_SCALE: Array<[number, string]> = [
  [400, 'fontWeight.regular'],
  [500, 'fontWeight.medium'],
  [700, 'fontWeight.bold'],
];

const COLOR_TOKENS: Record<string, string> = {
  '#ffffff': 'color.bgPrimary',
  '#f7f8fa': 'color.bgSurface',
  '#eceef2': 'color.bgMuted',
  '#0b0d12': 'color.fgPrimary',
  '#5b6472': 'color.fgMuted',
  '#4f46e5': 'color.accent',
  '#4338ca': 'color.accentHover',
  '#e1e4ea': 'color.border',
  '#dc2626': 'color.danger',
  '#16a34a': 'color.success',
  '#d97706': 'color.warning',
};

function nearest(scale: Array<[number, string]>, value: number): string {
  let best = scale[0];
  let bestDelta = Math.abs(scale[0][0] - value);
  for (let i = 1; i < scale.length; i++) {
    const d = Math.abs(scale[i][0] - value);
    if (d < bestDelta) {
      best = scale[i];
      bestDelta = d;
    }
  }
  return best[1];
}

export function mapSpacingToToken(px: number): string {
  return nearest(SPACING_SCALE, px);
}

export function mapRadiusToToken(px: number): string {
  return nearest(RADIUS_SCALE, px);
}

export function mapFontSizeToToken(px: number): string {
  return nearest(FONT_SIZE_SCALE, px);
}

export function mapFontWeightToToken(weight: number): string {
  return nearest(FONT_WEIGHT_SCALE, weight);
}

function rgbToHex(c: FigmaPaint['color']): string | null {
  if (!c) return null;
  const to = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${to(c.r)}${to(c.g)}${to(c.b)}`.toLowerCase();
}

export function mapColorToToken(hex: string): string {
  return COLOR_TOKENS[hex.toLowerCase()] ?? hex.toLowerCase();
}

function firstSolid(paints?: FigmaPaint[]): string | null {
  if (!paints) return null;
  const solid = paints.find((p) => p.type === 'SOLID' && p.visible !== false);
  return solid ? rgbToHex(solid.color) : null;
}

export function extractTokens(node: FigmaNode): ExtractedTokens {
  const out: ExtractedTokens = {};

  const bg = firstSolid(node.fills);
  if (bg) out.background = mapColorToToken(bg);

  const stroke = firstSolid(node.strokes);
  if (stroke) out.border = mapColorToToken(stroke);

  if (node.cornerRadius != null) {
    out.borderRadius = mapRadiusToToken(node.cornerRadius);
  }

  if (node.type === 'TEXT' && node.style) {
    const textColor = firstSolid(node.fills);
    if (textColor) out.color = mapColorToToken(textColor);
    if (node.style.fontFamily) out.fontFamily = node.style.fontFamily;
    if (node.style.fontSize != null) out.fontSize = mapFontSizeToToken(node.style.fontSize);
    if (node.style.fontWeight != null) out.fontWeight = mapFontWeightToToken(node.style.fontWeight);
    if (node.style.lineHeightPx != null) {
      out.lineHeight = `${(node.style.lineHeightPx / (node.style.fontSize ?? 16)).toFixed(2)}`;
    }
  }

  return out;
}
