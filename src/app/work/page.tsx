import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';

export default function Blog() {
  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose dark:prose-invert">
          <h1>Work</h1>
          <p>
            A collection of projects, ideas, and insights — things I’ve built or learned while designing and developing
            digital products.
          </p>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
