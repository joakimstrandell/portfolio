import AnimateContent from '@/components/AnimateContent';
import { Particles } from '@/components/Particles';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <Page className="justify-center">
      <PageContent className="pointer-events-none relative z-10 max-w-2xl md:max-w-6xl">
        <AnimateContent className="prose dark:prose-invert font-bold">
          <h1 className="pointer-events-auto max-w-[48ch]">Designer & Engineer</h1>
        </AnimateContent>
        <AnimateContent className="prose-xl dark:prose-invert">
          <p className="pointer-events-auto max-w-[48ch] lg:max-w-[48ch]">
            I help teams align <span className="text-accent-foreground">design</span> and{' '}
            <span className="text-accent-foreground">engineering</span> to build intuitive, scalable products that
            deliver real value to users.
          </p>
        </AnimateContent>
        <AnimateContent className="mt-10">
          <div className="flex items-center gap-8">
            <Button size="lg" asChild className="pointer-events-auto">
              <Link href="/about">About me</Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="pointer-events-auto">
              <Link href="/notes">View work</Link>
            </Button>
          </div>
        </AnimateContent>
      </PageContent>
      <div
        className={cn(
          'absolute inset-y-0 right-0 z-0 hidden overflow-hidden',
          'h-screen max-h-[1000px] w-screen min-w-[700px]',
          'md:flex',
        )}
      >
        <AnimateContent className="flex h-full w-full items-center justify-center" animationType="slideLeft">
          <Particles className="relative -right-1/3 min-h-[800px] lg:-right-1/4" />
        </AnimateContent>
      </div>
    </Page>
  );
}
