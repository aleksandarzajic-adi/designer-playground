import * as React from 'react';
import { ThemeProvider as SCProvider, createGlobalStyle } from 'styled-components';
import { rawTokens, defaultMode, type ThemeName } from '@dp/tokens';
import { buildTheme } from '../theme';

const modeEntries = Object.entries(rawTokens) as [ThemeName, Record<string, string>][];
const baseTokens = rawTokens[defaultMode as ThemeName] ?? modeEntries[0][1];

const modeBlocks = modeEntries
  .map(([mode, vars]) => {
    const selector =
      mode === (defaultMode as ThemeName)
        ? `:root, [data-theme="${mode}"]`
        : `[data-theme="${mode}"]`;
    const body = Object.entries({ ...baseTokens, ...vars })
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n    ');
    return `${selector} {\n    ${body}\n  }`;
  })
  .join('\n  ');

const GlobalStyle = createGlobalStyle`
  ${modeBlocks}
  html, body {
    margin: 0;
    padding: 0;
    background: var(--dp-color-bg-primary);
    color: var(--dp-color-fg-primary);
    font-family: var(--dp-font-sans);
    font-size: var(--dp-font-size-md);
    -webkit-font-smoothing: antialiased;
  }
  *, *::before, *::after { box-sizing: border-box; }
`;

export interface ThemeProviderProps {
  theme?: ThemeName;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme = defaultMode as ThemeName,
  children,
}) => {
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <SCProvider theme={buildTheme(theme)}>
      <GlobalStyle />
      {children}
    </SCProvider>
  );
};
