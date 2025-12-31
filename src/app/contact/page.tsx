import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function Contact() {
  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose dark:prose-invert">
          <h1>Contact</h1>
          <p className="bg-strategy-500/20 font text-strategy-950 rounded-sm p-4 text-lg">
            🎉 I am currently available for new opportunities.
          </p>
          <p>
            Let’s connect if you want to discuss digital design, engineering, or how we can build products people love!
            I also like to talk about the weather, and how AI will take my job (spoiler: it won&apos;t).
          </p>
          <p>
            Call me at <Link href="tel:+46707294379">+46 70 729 43 79</Link> or send me an email at{' '}
            <Link href="mailto:joakim@joakimstrandell.com">joakim@joakimstrandell.com</Link>.
          </p>
          <p>
            You can find me on <Link href="https://x.com/joakimstrandell">X (Twitter)</Link> which I never use. Or{' '}
            <Link href="https://linkedin.com/in/joakimstrandell">LinkedIn</Link> which I use when I have to.
          </p>
          <p>I am based in Stockholm, Sweden.</p>
        </AnimateContent>
      </PageContent>
      <Footer />
    </Page>
  );
}
