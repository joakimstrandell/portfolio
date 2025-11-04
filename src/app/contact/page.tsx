import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';

export default function Contact() {
  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose dark:prose-invert">
          <h1>Contact</h1>
          <p>
            Let’s connect if you want to discuss digital product design, frontend architecture, or building
            high-performing teams!
          </p>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
