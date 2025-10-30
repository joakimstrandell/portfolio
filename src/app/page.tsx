import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { TileButton } from '@/components/TileButton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Page className="min-h-screen">
      <PageContent>
        <AnimateContent className="prose dark:prose-invert">
          <h1>Hi! My name is Joakim</h1>
        </AnimateContent>
        <AnimateContent className="prose prose-lg dark:prose-invert">
          <p>
            I’m a <span className="text-accent">product engineer</span>, bridging{' '}
            <span className="text-accent">design</span> and <span className="text-accent">development</span> <br />
            to build scalable, user-centered web applications.
          </p>
        </AnimateContent>
        <AnimateContent className="mt-10">
          <div className="flex items-center gap-8">
            <Button size="lg" asChild>
              <Link href="/about">Read more</Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/work">View work</Link>
            </Button>

            {/* <TileButton fromCursor={true}>Center ripple</TileButton> */}
          </div>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
