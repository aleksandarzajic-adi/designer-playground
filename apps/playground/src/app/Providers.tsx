'use client';

import * as React from 'react';
import { ThemeProvider } from '@dp/ui';
import { defaultMode, type ThemeName } from '@dp/tokens';

interface Ctx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

export const ThemeContext = React.createContext<Ctx>({
  theme: defaultMode as ThemeName,
  setTheme: () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeName>(defaultMode as ThemeName);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
