import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { ThemeProvider } from '@dp/ui';
import { defaultMode, modes, type ThemeName } from '@dp/tokens';

const themeMap = Object.fromEntries(modes.map((m) => [m, m])) as Record<ThemeName, string>;

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
  },
  decorators: [
    withThemeByDataAttribute({
      themes: themeMap,
      defaultTheme: defaultMode,
      attributeName: 'data-theme',
    }),
    (Story, ctx) => {
      const theme = (ctx.globals.theme ?? defaultMode) as ThemeName;
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
