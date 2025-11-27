import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import StackedPanes from '@/components/StackedPanes';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <Page className="justify-center">
      <div className="relative flex min-h-[calc(100vh-130px)] flex-col">
        <div
          className={cn(
            'absolute inset-y-0 top-0 right-0 overflow-hidden',
            'hidden items-center md:flex',
            'pl-3 lg:w-3/8',
          )}
        >
          <AnimateContent delay={0.2} animationType="slideLeft" className="pointer-events-auto">
            <StackedPanes />
          </AnimateContent>
        </div>
        <PageContent
          className={cn(
            'pointer-events-none relative z-10 max-w-2xl md:max-w-7xl',
            'flex h-full flex-1 flex-col justify-center',
          )}
        >
          <AnimateContent className="prose prose-sm md:prose-base dark:prose-invert md:max-w-[60ch] lg:max-w-[78ch]">
            <h1 className="pointer-events-auto leading-9 md:leading-12">
              I help teams align{' '}
              <span className="bg-strategy-500/20 text-strategy-950 inline-block pb-1 leading-none">strategy</span>,{' '}
              <span className="bg-design-100 text-design-950 inline-block pb-1 leading-none">design</span>, and{' '}
              <span className="bg-engineering-100 text-engineering-950 inline-block pb-1 leading-none">
                engineering
              </span>{' '}
              to build web <span className="inline sm:hidden">apps</span>{' '}
              <span className="hidden sm:inline">applications</span> users love.
            </h1>
          </AnimateContent>
          <AnimateContent className="prose dark:prose-invert pointer-events-auto md:max-w-[60ch] lg:max-w-[80ch]">
            <p className="prose-lg pointer-events-auto">
              As a <strong>Product Engineer</strong> with <strong>20+ years</strong> of experience in{' '}
              <strong>UX/UI Design</strong> and <strong>Full-Stack Engineering</strong>, I work across the entire
              product lifecycle — combining a deep understanding of <strong>user needs</strong> and{' '}
              <strong>product strategy</strong> with <strong>hands-on design</strong> and{' '}
              <strong>engineering expertise</strong>.
            </p>
          </AnimateContent>
          <AnimateContent className="mt-2">
            <div className="flex items-center gap-8">
              <Button size="lg" asChild className="pointer-events-auto">
                <Link href="/work">View work</Link>
              </Button>

              <Button size="lg" variant="outline" asChild className="pointer-events-auto">
                <Link href="/about">Readme</Link>
              </Button>
            </div>
          </AnimateContent>
        </PageContent>
      </div>
      <AnimateContent>
        <div className="relative border-t-8 border-b-8 border-black/10 bg-white/50">
          <PageContent className="max-w-6xl space-y-8">
            <div className="prose">
              <h2>How I Help You Succeed</h2>
              <p className="prose-lg">
                Whether you are launching a production-ready <strong>MVP</strong> or modernizing a{' '}
                <strong>legacy platform</strong>, I ensure your product is polished, performant, and built to last.
              </p>
            </div>
            <AnimateContent className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="prose">
                  <h3>Product Strategy & Design</h3>
                  <ul>
                    <li>User Research & Ideation</li>
                    <li>Rapid Prototyping & MVP Definition</li>
                    <li>UX Auditing & Flow Optimization</li>
                    <li>Design Systems & High-fidelity Design</li>
                    <li>A/B Testing & Iteration Cycles</li>
                  </ul>
                  <p>
                    User Research & Ideation. Rapid Prototyping & MVP Definition. UX Auditing & Flow Optimization.
                    High-fidelity Design, A/B Testing & Iteration Cycles.
                  </p>
                </div>
                <div className="prose">
                  <h3>Fullstack Development</h3>
                  <p>
                    End-to-End Application Development. Complex UI Components & Interactions. Design System Adoption.
                    Performance Optimization. DX and tooling.
                  </p>
                </div>
                <div className="prose">
                  <h3>Application Architecture</h3>
                  <p>
                    Technical spiking for new features. Defining API contracts and testing strategies. Monorepo setup
                    and scaling advice. Code reuse and optimization.
                  </p>
                </div>
                <div className="prose">
                  <h3>Team Leadership</h3>
                  <p>
                    Developer onboarding and training. Technical documentation and best practices. Team collaboration
                    and communication.
                  </p>
                </div>
              </div>
              {/* <Button size="lg" asChild className="pointer-events-auto">
                <Link href="/about">View services</Link>
              </Button> */}
            </AnimateContent>
          </PageContent>
        </div>
      </AnimateContent>
      <footer className="bg-white/80">
        <PageContent className="max-w-6xl">
          <p>
            © 2025
            <br /> Joakim Strandell <br />
            Awkward Group AB
          </p>
          <div>
            <h4>Work</h4>
            <ul>
              <li>
                <Link href="/work">Case studies</Link>
              </li>
              <li>
                <Link href="/work">Projects</Link>
              </li>
              <li>
                <Link href="/work">Insights</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li>
                <Link href="/about">Readme</Link>
              </li>
              <li>
                <Link href="/about">Philosophy</Link>
              </li>
              <li>
                <Link href="/about">Experience</Link>
              </li>
              <li>
                <Link href="/about">Technical Stack</Link>
              </li>
              <li>
                <Link href="/about">CV as PDF</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="mailto:joakim@awkwardgroup.se">joakim@awkwardgroup.com</a>
              </li>
              <li>
                <Link href="/terms">+46 70 729 43 79</Link>
              </li>
            </ul>
          </div>
          <ul>
            <li>
              <a href="mailto:joakim@awkwardgroup.se">joakim@awkwardgroup.com</a>
            </li>
            <li>
              <Link href="/terms">+46 70 729 43 79</Link>
            </li>
            <li>
              <Link href="https://github.com/joakimstrandell">Github</Link>
            </li>
            <li>
              <Link href="https://dribbble.com/joakim-strandell">Dribbble</Link>
            </li>
            <li>
              <Link href="https://x.com/joakimstrandell">X (Twitter)</Link>
            </li>
            <li>
              <Link href="https://linkedin.com/in/joakimstrandell">LinkedIn</Link>
            </li>
          </ul>
        </PageContent>
      </footer>
    </Page>
  );
}
