import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import HeaderNavigation from '@/components/HeaderNavigation';
import GridBackground from '@/components/GridBackground';
import { CustomCursor } from '@/components/CustomCursor';

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Joakim Strandell - Product Engineer',
  description:
    'Joakim Strandell is a product engineer with a passion for building scalable, user-centered web applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <GridBackground enableGame={false} />
          <CustomCursor />
          <HeaderNavigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
