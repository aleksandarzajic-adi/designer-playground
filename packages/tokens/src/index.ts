export const color = {
  bgPrimary: 'var(--dp-color-bg-primary)',
  bgSurface: 'var(--dp-color-bg-surface)',
  bgMuted: 'var(--dp-color-bg-muted)',
  fgPrimary: 'var(--dp-color-fg-primary)',
  fgMuted: 'var(--dp-color-fg-muted)',
  fgOnAccent: 'var(--dp-color-fg-on-accent)',
  accent: 'var(--dp-color-accent)',
  accentHover: 'var(--dp-color-accent-hover)',
  border: 'var(--dp-color-border)',
  danger: 'var(--dp-color-danger)',
  success: 'var(--dp-color-success)',
  warning: 'var(--dp-color-warning)',
} as const;

export const space = {
  0: 'var(--dp-space-0)',
  1: 'var(--dp-space-1)',
  2: 'var(--dp-space-2)',
  3: 'var(--dp-space-3)',
  4: 'var(--dp-space-4)',
  5: 'var(--dp-space-5)',
  6: 'var(--dp-space-6)',
  8: 'var(--dp-space-8)',
} as const;

export const radius = {
  sm: 'var(--dp-radius-sm)',
  md: 'var(--dp-radius-md)',
  lg: 'var(--dp-radius-lg)',
  pill: 'var(--dp-radius-pill)',
} as const;

export const font = {
  sans: 'var(--dp-font-sans)',
  mono: 'var(--dp-font-mono)',
} as const;

export const fontSize = {
  xs: 'var(--dp-font-size-xs)',
  sm: 'var(--dp-font-size-sm)',
  md: 'var(--dp-font-size-md)',
  lg: 'var(--dp-font-size-lg)',
  xl: 'var(--dp-font-size-xl)',
  '2xl': 'var(--dp-font-size-2xl)',
} as const;

export const fontWeight = {
  regular: 'var(--dp-font-weight-regular)',
  medium: 'var(--dp-font-weight-medium)',
  bold: 'var(--dp-font-weight-bold)',
} as const;

export const shadow = {
  sm: 'var(--dp-shadow-sm)',
  md: 'var(--dp-shadow-md)',
  lg: 'var(--dp-shadow-lg)',
} as const;

export const duration = {
  fast: 'var(--dp-duration-fast)',
  base: 'var(--dp-duration-base)',
  slow: 'var(--dp-duration-slow)',
} as const;

export const tokens = { color, space, radius, font, fontSize, fontWeight, shadow, duration };
export type Tokens = typeof tokens;

export * from './tokens.generated';
