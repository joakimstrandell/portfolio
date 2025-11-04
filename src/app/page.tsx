import AnimateContent from '@/components/AnimateContent';
import { FunnelCanvas } from '@/components/FunnelMesh';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <Page className="min-h-screen">
      <PageContent className="max-w-7xl">
        {/* <AnimateContent className="prose prose-lg dark:prose-invert">
          <h1>Joakim Strandell</h1>
        </AnimateContent>
        <AnimateContent className="prose prose-xl dark:prose-invert">
          <p className="max-w-[58ch]">
            I'm a <span className="text-accent">product engineer</span> bridging{' '}
            <span className="text-accent">design</span> and <span className="text-accent">development</span>. I build
            scalable, user-centered web applications that balance thoughtful design with solid engineering.
          </p>
        </AnimateContent> */}
        <div className="flex items-center justify-center gap-10">
          <div className="">
            <AnimateContent className="prose dark:prose-invert">
              <h1>I'm a Product Engineer</h1>
            </AnimateContent>
            <AnimateContent className="prose prose-lg dark:prose-invert">
              <p className="max-w-[58ch] pt-6">
                Bridging <span className="text-accent">UX/UI design</span> and{' '}
                <span className="text-accent">full-stack development</span> to build scalable, user-centered web
                applications that balance thoughtful design with solid engineering.
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
          </div>
          <AnimateContent>
            <FunnelCanvas />
          </AnimateContent>
        </div>
      </PageContent>
    </Page>
  );
}
