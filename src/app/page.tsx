import AnimateContentOnScroll from '@/components/AnimateContentOnScroll';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <Page className="pt-0">
      <PageContent className="flex flex-1 items-center">
        <div>
          <AnimateContentOnScroll>
            <h1>Hi! My name is Joakim</h1>
          </AnimateContentOnScroll>
          <AnimateContentOnScroll>
            <p className="text-lg">
              I’m a <span className="text-accent">product engineer</span>, bridging{' '}
              <span className="text-accent">design</span> and <span className="text-accent">development</span> <br />
              to build scalable, user-centered web applications.
            </p>
          </AnimateContentOnScroll>
          <AnimateContentOnScroll>
            <div className="mt-8 flex gap-6">
              <Button>About</Button>
              <Button>Work</Button>
            </div>
          </AnimateContentOnScroll>
        </div>
      </PageContent>
    </Page>
  );
}
