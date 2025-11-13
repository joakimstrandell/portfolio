import AnimateContent from '@/components/AnimateContent';
import { Particles } from '@/components/Particles';
import { Page, PageContent } from '@/components/page';
import { Grid } from '@/components/Grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <Page className="min-h-screen">
      <Grid>
        <PageContent className="relative z-10 max-w-xl md:max-w-6xl">
          <AnimateContent className="prose dark:prose-invert font-bold">
            <h1 className="max-w-[48ch]">I&apos;m a Product Engineer</h1>
          </AnimateContent>
          <AnimateContent className="prose-xl dark:prose-invert">
            <p className="max-w-[42ch] lg:max-w-[48ch]">
              I help teams align <span className="text-accent">design</span> and{' '}
              <span className="text-accent">engineering</span> to build intuitive, scalable products that deliver real
              value to users.
            </p>
          </AnimateContent>
          <AnimateContent className="mt-10">
            <div className="flex items-center gap-8">
              <Button size="lg" asChild>
                <Link href="/about">About me</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/notes">View work</Link>
              </Button>
            </div>
          </AnimateContent>
        </PageContent>

        <AnimateContent
          className={cn(
            'fixed right-0 z-0 hidden items-center justify-center overflow-hidden',
            'h-screen w-screen min-w-[700px]',
            'md:flex',
          )}
          animationType="slideLeft"
        >
          <Particles className="relative -right-1/3 lg:-right-1/4" />
        </AnimateContent>
      </Grid>
    </Page>
  );
}
