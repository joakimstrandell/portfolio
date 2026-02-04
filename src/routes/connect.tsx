import { createFileRoute } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageSection } from '@/components/Page';

export const Route = createFileRoute('/connect')({
  component: Connect,
  head: () => ({
    meta: [
      { title: 'Connect - Joakim Strandell' },
      {
        name: 'description',
        content: 'Get in touch with Joakim Strandell for product design, engineering, or consulting opportunities.',
      },
    ],
  }),
});

function Connect() {
  return (
    <Page>
      <PageSection width="narrow">
        <AnimateContent className="prose">
          <h1>Connect</h1>
          <p>
            Ready to ship? Whether you need a specific design system audit or a fullstack product engineer, let's
            discuss how we can build scalable software together.
          </p>
          <p>
            Give me a call at <a href="tel:+46707294379">+46 70 729 43 79</a> or send me an email at{' '}
            <a href="mailto:joakim@joakimstrandell.com">joakim@joakimstrandell.com</a>.
          </p>
          <p>
            You can also find me on <a href="https://linkedin.com/in/joakimstrandell">LinkedIn</a> and{' '}
            <a href="https://x.com/joakimstrandell">X (Twitter)</a>.
          </p>
          <p>
            Or check out my <a href="https://github.com/joakimstrandell">GitHub</a> or{' '}
            <a href="https://dribbble.com/joakimstrandell">Dribbble</a>.
          </p>
          <p>I am based in Stockholm, Sweden.</p>
        </AnimateContent>
      </PageSection>
    </Page>
  );
}
