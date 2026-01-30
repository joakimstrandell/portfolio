import { createFileRoute, Link } from '@tanstack/react-router'
import AnimateContent from '@/components/AnimateContent'
import { Page, PageContent } from '@/components/page'
import { Footer } from '@/components/Footer'

export const Route = createFileRoute('/work/')({
  component: Work,
  head: () => ({
    meta: [
      { title: 'Work - Joakim Strandell' },
      { name: 'description', content: 'A collection of client projects, concepts, and thoughts from Joakim Strandell.' },
    ],
  }),
})

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
          <img
            src="/wip.jpeg"
            alt="Old man laptop"
            className="rounded"
            width={1000}
            height={1000}
            loading="lazy"
            decoding="async"
          />
          <p>I am currently updating my portfolio to showcase selected cases within Product Design and Engineering.</p>
          <p>
            While the pixels are falling into place, please visit my <Link to="/about">about</Link> page for my
            background, or connect with me on <a href="https://linkedin.com/in/joakimstrandell">LinkedIn</a> to
            see my latest updates.
          </p>
        </AnimateContent>
      </PageContent>
      <Footer />
    </Page>
  )
}
