import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Page className="pt-0">
      <PageContent className="flex flex-1 items-center">
        <div>
          <AnimateContent>
            <h1>Hej! My name is Joakim</h1>
          </AnimateContent>
          <AnimateContent>
            <p className="text-lg">
              I’m a <span className="text-accent">product engineer</span>, bridging{' '}
              <span className="text-accent">design</span> and <span className="text-accent">development</span> <br />
              to build scalable, user-centered web applications.
            </p>
          </AnimateContent>
          <AnimateContent>
            <div className="mt-8 flex items-center gap-8">
              <Link href="/about">
                <Button size="lg">Read more</Button>
              </Link>
              <Link href="/work">
                <Button size="lg" variant="outline">
                  View work
                </Button>
              </Link>
            </div>
          </AnimateContent>
        </div>
      </PageContent>
    </Page>
  );
}
