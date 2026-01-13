import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import StackedPanes from '@/components/StackedPanes';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';

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
              by unifying{' '}
              <span className="bg-design-500/20 text-design-950 inline-block pb-1 leading-none">design</span> and{' '}
              <span className="bg-engineering-500/20 text-engineering-950 inline-block pb-1 leading-none">
                engineering
              </span>
              .
            </h1>
          </AnimateContent>
          <AnimateContent className="prose dark:prose-invert pointer-events-auto md:max-w-[67ch] lg:max-w-[78ch]">
            <p className="prose-lg pointer-events-auto">
              With 20+ years of experience, I eliminate the friction between concept and code. I build scalable design
              systems and robust fullstack architectures that allow teams to go from idea to production without the
              translation loss.
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
        <div className="relative border-t-8 border-black/10 bg-white/50">
          <PageContent className="space-y-8">
            <div className="prose max-w-[78ch]">
              <h2>How I Help You Succeed</h2>
              <p className="prose-lg">
                I adapt quickly to your team's needs and can parachute into any stage of development, or execute across
                the entire product lifecycle.
              </p>
            </div>
            <AnimateContent className="space-y-8">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>01. UX/UI & Product Design</h3>
                      <p className="-mt-2 text-lg font-normal">Designing for implementation, not just presentation.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-6 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Discovery & Strategy</h4>
                        <p>
                          Partnering with stakeholders to define the right product. I focus on technical feasibility
                          during ideation to ensure complex requirements never compromise the user experience.
                        </p>
                      </li>
                      <li>
                        <h4>Systematic Design</h4>
                        <p>
                          I treat the codebase as the source of truth. While Figma is used for rapid ideation, I
                          architect systems directly in code. This &quot;Zero-Loss&quot; approach is faster and ensures
                          the approved design is exactly what ships to production.
                        </p>
                      </li>
                      <li>
                        <h4>High-Fidelity Prototyping</h4>
                        <p>
                          Designing complex interaction patterns and states. I often skip static mockups for complex
                          flows, prototyping directly in code to validate logic and feel immediately.
                        </p>
                      </li>
                      <li>
                        <h4>Zero-Friction Integration</h4>
                        <p>
                          I eliminate the traditional &quot;handoff.&quot; Instead of delivering static files, I ship
                          production-ready components. This closes the gap between design intent and engineering
                          reality, preventing technical debt before it starts.
                        </p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>02. Fullstack Engineering</h3>
                      <p className="-mt-2 font-normal">Vertical ownership from database to UI.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-6 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Modern Frontend</h4>
                        <p>
                          Building pixel-perfect, accessible interfaces in a modern frontend stack. I use
                          component-driven architecture to ensure the UI is modular, testable, and strictly typed.
                        </p>
                      </li>
                      <li>
                        <h4>Robust Backend</h4>
                        <p>
                          Architecting scalable backend logic in a modern stack. I focus on performance and data
                          integrity, ensuring the API layer serves the frontend efficiently.
                        </p>
                      </li>
                      <li>
                        <h4>Type-Safe Integration</h4>
                        <p>
                          Bridging the gap with end-to-end type safety. I use TypeScript and tools like Zod and OpenAPI
                          to generate strict contracts between backend and frontend, eliminating runtime errors.
                        </p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="prose">
                      <h3>03. Architecture & Developer Experience</h3>
                      <p className="-mt-2 font-normal">Building the systems that build the product.</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-foreground [&>li]:prose space-y-6 text-base leading-7 [&>li>h4]:mt-0 [&>li>h4]:mb-0 [&>li>h4]:text-base [&>li>p:last-child]:mb-0">
                      <li>
                        <h4>Monorepo Architecture</h4>
                        <p>
                          Setting up modern workspaces (e.g., Turborepo/Nx) that allow multiple applications and
                          libraries to share logic efficiently while keeping build times fast.
                        </p>
                      </li>
                      <li>
                        <h4>Design System Infrastructure</h4>
                        <p>
                          Bridging Figma and code. I build shared UI libraries using primitives (like Radix UI) and
                          styling engines (like Tailwind) to enforce consistency across the platform.
                        </p>
                      </li>
                      <li>
                        <h4>Tooling & CI/CD</h4>
                        <p>
                          Automating quality. I configure ESLint, Prettier, and GitHub Actions pipelines to catch errors
                          early and deploy with confidence.
                        </p>
                      </li>
                      <li>
                        <h4>Maintainability</h4>
                        <p>
                          Writing code that is easy to delete and easy to extend. I prioritize clean abstractions and
                          documentation so the team can move fast without breaking things.
                        </p>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button size="lg" asChild variant="outline" className="pointer-events-auto">
                <Link href="/contact">Let&apos;s connect</Link>
              </Button>
            </AnimateContent>
          </PageContent>
        </div>
      </AnimateContent>
      <Footer />
    </Page>
  );
}
