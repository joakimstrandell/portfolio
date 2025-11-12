import AnimateContent from '@/components/AnimateContent';
import { Particles } from '@/components/Particles';
import { Page, PageContent } from '@/components/page';
import { Grid } from '@/components/Grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Page className="min-h-screen">
      <Grid>
        <Particles className="-right-1/4" />
        <PageContent className="max-w-7xl">
          <AnimateContent className="prose dark:prose-invert">
            <h1>I&apos;m a Product Engineer</h1>
          </AnimateContent>
          <AnimateContent className="prose prose-xl dark:prose-invert">
            <p className="max-w-[62ch]">
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
      </Grid>
    </Page>
  );
}
