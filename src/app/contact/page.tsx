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
          <p className="font flex items-center rounded-sm border border-green-200 bg-green-100/50 p-4 text-green-950">
            <span className="mr-4 inline-block aspect-square h-4 rounded-full bg-green-500" />I am currently available
            for new opportunities.
          </p>
          <p>
            Ready to ship? Whether you need a specific design system audit or a fullstack product engineer, let’s
            discuss how we can build scalable software together.
          </p>
          <p>
            Give me a call at <Link href="tel:+46707294379">+46 70 729 43 79</Link> or send me an email at{' '}
            <Link href="mailto:joakim@joakimstrandell.com">joakim@joakimstrandell.com</Link>.
          </p>
          <p>
            You can also find me on <Link href="https://linkedin.com/in/joakimstrandell">LinkedIn</Link> and{' '}
            <Link href="https://x.com/joakimstrandell">X (Twitter)</Link>.
          </p>
          <p>I am based in Stockholm, Sweden.</p>
        </AnimateContent>
      </PageContent>
      <Footer />
    </Page>
  );
}
