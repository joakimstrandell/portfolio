import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { CustomCursor } from '@/components/CustomCursor';
import { Grid } from '@/components/Grid';

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Joakim Strandell - Product Engineer',
  description:
    'Joakim Strandell is a product engineer with a passion for building scalable, user-centered web applications.',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable} antialiased`}>
        <Grid className="min-h-screen">
          <CustomCursor />
          <Header />
          {children}
        </Grid>
      </body>
    </html>
  );
}
