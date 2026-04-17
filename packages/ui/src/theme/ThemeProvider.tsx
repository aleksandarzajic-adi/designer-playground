import * as React from 'react';
import { ThemeProvider as SCProvider, createGlobalStyle } from 'styled-components';
import { rawTokens, type ThemeName } from '@dp/tokens';
import { buildTheme } from '../theme';

const GlobalStyle = createGlobalStyle`
  :root, [data-theme="light"] {
    ${Object.entries(rawTokens.light)
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n    ')}
  }
  [data-theme="dark"] {
    ${Object.entries({ ...rawTokens.light, ...rawTokens.dark })
      .map(([k, v]) => `${k}: ${v};`)
      .join('\n    ')}
  }
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme = 'light', children }) => {
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
