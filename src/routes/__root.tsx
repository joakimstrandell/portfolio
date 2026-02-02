import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { CellGrid, CustomCursor } from '@josui/react/src';

import '@fontsource-variable/roboto-mono';
import '@/styles/globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { name: 'theme-color', content: '#000000' },
      { title: 'Joakim Strandell - Product Engineer' },
      {
        name: 'description',
        content:
          'Joakim Strandell is a product engineer with a passion for building scalable, user-centered web applications.',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <CellGrid
          className="min-h-screen"
          gridColor="color-foreground"
          gridOpacity={0.05}
          cellOpacity={0.3}
          cellSize={16}
        >
          <CustomCursor />
          <Header />
          <Outlet />
          <div
            className="pointer-events-none fixed inset-x-0 top-0 z-0 h-150 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,var(--color-background)_0%,transparent_100%)]"
            aria-hidden="true"
          />
        </CellGrid>
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
