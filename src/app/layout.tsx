import type { Metadata } from 'next';
import { Roboto_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Signature from '@/components/Signature';
import { ThemeProvider } from '@/components/theme-provider';
import Navigation from '@/components/Navigation';
import { PageContent } from '@/components/page';

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
          <Link href="/" className="absolute top-0 left-0 z-30 m-6 inline-block">
            <div className="bg-accent flex h-12 w-12 items-end justify-end p-1">
              <Signature className="h-6" />
            </div>
          </Link>
          <div className="absolute top-0 left-0 z-20 w-full">
            <PageContent className="mt-14">
              <Navigation />
            </PageContent>
          </div>
          <div className="from-background absolute top-0 left-0 z-10 h-38 w-full bg-gradient-to-b via-black to-transparent" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
