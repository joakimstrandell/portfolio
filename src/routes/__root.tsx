import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { CustomCursor } from '@/components/CustomCursor';
import { Grid } from '@/components/Grid';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <Grid className="min-h-screen">
          <CustomCursor />
          <Header />
          <Outlet />
        </Grid>
        <Scripts />
      </body>
    </html>
  );
}
