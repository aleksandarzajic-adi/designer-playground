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

export const rawTokens = {
  light: {
    '--dp-color-bg-primary': '#ffffff',
    '--dp-color-bg-surface': '#f7f8fa',
    '--dp-color-bg-muted': '#eceef2',
    '--dp-color-fg-primary': '#0b0d12',
    '--dp-color-fg-muted': '#5b6472',
    '--dp-color-fg-on-accent': '#ffffff',
    '--dp-color-accent': '#4f46e5',
    '--dp-color-accent-hover': '#4338ca',
    '--dp-color-border': '#e1e4ea',
    '--dp-color-danger': '#dc2626',
    '--dp-color-success': '#16a34a',
    '--dp-color-warning': '#d97706',
    '--dp-space-0': '0',
    '--dp-space-1': '4px',
    '--dp-space-2': '8px',
    '--dp-space-3': '12px',
    '--dp-space-4': '16px',
    '--dp-space-5': '24px',
    '--dp-space-6': '32px',
    '--dp-space-8': '48px',
    '--dp-radius-sm': '4px',
    '--dp-radius-md': '8px',
    '--dp-radius-lg': '12px',
    '--dp-radius-pill': '999px',
    '--dp-font-sans':
      "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    '--dp-font-mono': "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    '--dp-font-size-xs': '12px',
    '--dp-font-size-sm': '14px',
    '--dp-font-size-md': '16px',
    '--dp-font-size-lg': '18px',
    '--dp-font-size-xl': '22px',
    '--dp-font-size-2xl': '28px',
    '--dp-font-weight-regular': '400',
    '--dp-font-weight-medium': '500',
    '--dp-font-weight-bold': '700',
    '--dp-shadow-sm': '0 1px 2px rgba(11,13,18,0.06)',
    '--dp-shadow-md': '0 4px 12px rgba(11,13,18,0.08)',
    '--dp-shadow-lg': '0 12px 32px rgba(11,13,18,0.12)',
    '--dp-duration-fast': '120ms',
    '--dp-duration-base': '200ms',
    '--dp-duration-slow': '320ms',
  },
  dark: {
    '--dp-color-bg-primary': '#0b0d12',
    '--dp-color-bg-surface': '#14171d',
    '--dp-color-bg-muted': '#1d2128',
    '--dp-color-fg-primary': '#f4f5f7',
    '--dp-color-fg-muted': '#9aa3b2',
    '--dp-color-fg-on-accent': '#ffffff',
    '--dp-color-accent': '#818cf8',
    '--dp-color-accent-hover': '#a5b4fc',
    '--dp-color-border': '#262b34',
    '--dp-color-danger': '#f87171',
    '--dp-color-success': '#4ade80',
    '--dp-color-warning': '#fbbf24',
  },
} as const;

export type ThemeName = keyof typeof rawTokens;
