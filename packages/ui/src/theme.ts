import { rawTokens, defaultMode, type ThemeName } from '@dp/tokens';

export interface ThemeColors {
  bgPrimary: string;
  bgSurface: string;
  bgMuted: string;
  fgPrimary: string;
  fgMuted: string;
  fgOnAccent: string;
  accent: string;
  accentHover: string;
  border: string;
  danger: string;
  success: string;
  warning: string;
}

export interface ThemeSpacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
}

export interface ThemeTypography {
  fontFamily: { sans: string; mono: string };
  fontSize: { xs: string; sm: string; md: string; lg: string; xl: string; '2xl': string };
  fontWeight: { regular: string; medium: string; bold: string };
  lineHeight: { tight: string; normal: string; relaxed: string };
}

export interface ThemeRadii {
  sm: string;
  md: string;
  lg: string;
  pill: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeDurations {
  fast: string;
  base: string;
  slow: string;
}

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  radii: ThemeRadii;
  shadows: ThemeShadows;
  durations: ThemeDurations;
}

const cssVar = (name: string) => `var(${name})`;

export const theme: Theme = {
  name: defaultMode as ThemeName,
  colors: {
    bgPrimary: cssVar('--dp-color-bg-primary'),
    bgSurface: cssVar('--dp-color-bg-surface'),
    bgMuted: cssVar('--dp-color-bg-muted'),
    fgPrimary: cssVar('--dp-color-fg-primary'),
    fgMuted: cssVar('--dp-color-fg-muted'),
    fgOnAccent: cssVar('--dp-color-fg-on-accent'),
    accent: cssVar('--dp-color-accent'),
    accentHover: cssVar('--dp-color-accent-hover'),
    border: cssVar('--dp-color-border'),
    danger: cssVar('--dp-color-danger'),
    success: cssVar('--dp-color-success'),
    warning: cssVar('--dp-color-warning'),
  },
  spacing: {
    0: cssVar('--dp-space-0'),
    1: cssVar('--dp-space-1'),
    2: cssVar('--dp-space-2'),
    3: cssVar('--dp-space-3'),
    4: cssVar('--dp-space-4'),
    5: cssVar('--dp-space-5'),
    6: cssVar('--dp-space-6'),
    8: cssVar('--dp-space-8'),
  },
  typography: {
    fontFamily: {
      sans: cssVar('--dp-font-sans'),
      mono: cssVar('--dp-font-mono'),
    },
    fontSize: {
      xs: cssVar('--dp-font-size-xs'),
      sm: cssVar('--dp-font-size-sm'),
      md: cssVar('--dp-font-size-md'),
      lg: cssVar('--dp-font-size-lg'),
      xl: cssVar('--dp-font-size-xl'),
      '2xl': cssVar('--dp-font-size-2xl'),
    },
    fontWeight: {
      regular: cssVar('--dp-font-weight-regular'),
      medium: cssVar('--dp-font-weight-medium'),
      bold: cssVar('--dp-font-weight-bold'),
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  radii: {
    sm: cssVar('--dp-radius-sm'),
    md: cssVar('--dp-radius-md'),
    lg: cssVar('--dp-radius-lg'),
    pill: cssVar('--dp-radius-pill'),
  },
  shadows: {
    sm: cssVar('--dp-shadow-sm'),
    md: cssVar('--dp-shadow-md'),
    lg: cssVar('--dp-shadow-lg'),
  },
  durations: {
    fast: cssVar('--dp-duration-fast'),
    base: cssVar('--dp-duration-base'),
    slow: cssVar('--dp-duration-slow'),
  },
};

export const buildTheme = (name: ThemeName): Theme => ({ ...theme, name });

export const cssVariables = rawTokens;

export type SpacingToken = keyof ThemeSpacing;
export type ColorToken = keyof ThemeColors;
export type FontSizeToken = keyof ThemeTypography['fontSize'];
export type FontWeightToken = keyof ThemeTypography['fontWeight'];
export type RadiusToken = keyof ThemeRadii;
export type ShadowToken = keyof ThemeShadows;
