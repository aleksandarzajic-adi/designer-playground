import type { Metadata } from 'next';
import { StyledRegistry } from './StyledRegistry';
import { Providers } from './Providers';

export const metadata: Metadata = {
  title: 'DP Playground',
  description: 'Design system playground',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledRegistry>
          <Providers>{children}</Providers>
        </StyledRegistry>
      </body>
    </html>
  );
}
