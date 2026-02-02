import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Footer } from '@/components/Footer';

export const Route = createFileRoute('/work/')({
  component: Work,
  head: () => ({
    meta: [
      { title: 'Work - Joakim Strandell' },
      {
        name: 'description',
        content: 'A collection of client projects, concepts, and thoughts from Joakim Strandell.',
      },
    ],
  }),
});

function Work() {
  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose">
          <h1>Work</h1>
          <p>
            A collection of client projects, concepts, and thoughts — things I've built or learned while designing and
            developing digital products.
          </p>
          <ul>
            <li>
              <Link to="/work/stockholm-exergi-design-to-engineering">Stockholm Exergi: Design to Engineering</Link>
              <br />
              <span className="text-muted-foreground text-sm">
                Seven years unifying design and engineering for energy analytics.
              </span>
            </li>
          </ul>
          <p className="text-muted-foreground">
            More cases coming soon. Visit my <Link to="/about">about</Link> page for my background, or connect with me
            on <a href="https://linkedin.com/in/joakimstrandell">LinkedIn</a>.
          </p>
        </AnimateContent>
      </PageContent>
      <Footer />
    </Page>
  );
}
