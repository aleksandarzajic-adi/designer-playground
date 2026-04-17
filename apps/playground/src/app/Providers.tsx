'use client';

import * as React from 'react';
import { ThemeProvider } from '@dp/ui';
import type { ThemeName } from '@dp/tokens';

interface Ctx {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

export const ThemeContext = React.createContext<Ctx>({ theme: 'light', setTheme: () => {} });

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeName>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
