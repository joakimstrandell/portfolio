import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { CellGrid, CustomCursor } from '@josui/react/src';

import '@fontsource-variable/roboto-mono';
import '@/styles/globals.css';
import { Footer } from '@/components/Footer';

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
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
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
          <div
            className="pointer-events-none fixed inset-x-0 top-0 z-0 h-150 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,var(--color-background)_0%,transparent_100%)]"
            aria-hidden="true"
          />
          <Header />
          <Outlet />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-150 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,var(--color-background)_0%,transparent_100%)] opacity-80"
            aria-hidden="true"
          />
        </CellGrid>
        <Footer />
        <CustomCursor />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}
