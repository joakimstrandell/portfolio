import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import StackedPanes from '@/components/StackedPanes';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <Page className="justify-center">
      <div className="relative flex min-h-[calc(100vh-155px)] flex-col">
        <div
          className={cn(
            'absolute inset-y-0 top-0 right-0 overflow-hidden',
            'hidden items-center md:flex',
            'pl-3 lg:w-3/8',
          )}
        >
          <AnimateContent delay={0.2} animationType="slideLeft" className="pointer-events-auto -mr-24">
            <StackedPanes />
          </AnimateContent>
        </div>
        <PageContent
          className={cn(
            'pointer-events-none relative z-10 max-w-2xl md:max-w-7xl',
            'flex h-full flex-1 flex-col justify-center',
          )}
        >
          <AnimateContent className="prose prose-sm md:prose-base dark:prose-invert md:max-w-[62ch] lg:max-w-[78ch]">
            <h1 className="pointer-events-auto leading-9 md:leading-12">
              I help teams ship{' '}
              <span className="text-strategy-950 bg-strategy-500/20 inline-block pb-1 leading-none">ideas</span> faster
              by bridging{' '}
              <span className="bg-design-500/20 text-design-950 inline-block pb-1 leading-none">design</span> and{' '}
              <span className="bg-engineering-500/20 text-engineering-950 inline-block pb-1 leading-none">
                engineering
              </span>
              .
            </h1>
          </AnimateContent>
          <AnimateContent className="prose dark:prose-invert pointer-events-auto md:max-w-[67ch] lg:max-w-[78ch]">
            <p className="prose-lg pointer-events-auto">
              As a Product Designer and Engineer, I execute across the entire stack. From defining{' '}
              <strong>user flows</strong> and <strong>interfaces</strong> in Figma to building the{' '}
              <strong>frontend architecture</strong> and <strong>backend logic</strong>, I provide the complete skill
              set needed to design, build, and ship <strong>web applications</strong>.
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
          <PageContent className="space-y-8">
            <div className="prose max-w-[78ch]">
              <h2>How I Help You Succeed</h2>
              <p className="prose-lg">
                I operate as a senior individual contributor who can parachute into any stage of development, or execute
                across the entire product lifecycle. I adapt quickly to your team&apos;s needs.
              </p>
            </div>
            <AnimateContent className="space-y-8">
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>01. UX/UI Design</h3>
                      <p className="-mt-2 text-lg font-normal">From user insights to high-fidelity UI.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-3 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Discovery</h4>
                        <p>Talking to users and stakeholders to define core needs and requirements.</p>
                      </li>
                      <li>
                        <h4>UX Definition</h4>
                        <p>Creating user flows, wireframes, and clickable prototypes to validate logic.</p>
                      </li>
                      <li>
                        <h4>UI Design</h4>
                        <p>Delivering high-fidelity interfaces and defining the visual design system in Figma.</p>
                      </li>
                      <li>
                        <h4>Handoff</h4>
                        <p>Preparing structured design files that are ready for immediate implementation.</p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>02. Fullstack Development</h3>
                      <p className="-mt-2 font-normal">Building the application from start to finish.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-3 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Frontend</h4>
                        <p>
                          Building complex, data-rich, and accessible interfaces with pixel-perfect precision. Handling
                          complex state management with tools like TanStack Query and Zustand. Utilizing tools like
                          Tailwind CSS, Shadcn UI, and Radix UI for speed and consistency.
                        </p>
                      </li>
                      <li>
                        <h4>Backend</h4>
                        <p>
                          Implementing application logic, authentication, API routes, and database integrations (using
                          tools like Supabase/PostgreSQL).
                        </p>
                      </li>
                      <li>
                        <h4>Integration</h4>
                        <p>
                          Connecting frontends to APIs and ensuring type safety across the stack. Defining API contracts
                          and creating type-safe SDKs (i.g. OpenAPI/Zod).
                        </p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>03. Architecture & Tooling</h3>
                      <p className="-mt-2 font-normal">Setting up a professional, scalable codebase.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-3 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Repo Setup</h4>
                        <p>
                          Configuring Monorepos, linting, pre-commit hooks, and formatting (i.g. Prettier/ESLint) for
                          code consistency.
                        </p>
                      </li>
                      <li>
                        <h4>Design Systems</h4>
                        <p>Translating Figma tokens into reusable, type-safe code components (i.g. Radix/Tailwind).</p>
                      </li>
                      <li>
                        <h4>CI/CD</h4>
                        <p>Setting up automated testing and deployment pipelines (i.g. Vercel/GitHub Actions).</p>
                      </li>
                      <li>
                        <h4>Code Quality</h4>
                        <p>Ensuring the codebase is maintainable and ready for team collaboration.</p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
