import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Signature from '@/components/Signature';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/Navigation';

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="fixed inset-x-0 top-0 z-20 flex items-end justify-between gap-6 p-6">
            <Link href="/">
              <div className="bg-accent flex h-12 w-12 items-end justify-end p-1">
                <Signature className="h-6" />
              </div>
            </Link>
            <Navigation />
          </div>
          <div className="from-background fixed top-0 left-0 z-10 h-46 w-full bg-gradient-to-b to-transparent" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
