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
              As a <strong>Product Designer and Engineer</strong>, I execute across the entire stack. From defining user
              flows and designing user interfaces in Figma, to building and shipping production ready web applications.
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
                I adapt quickly to your teams needs, and can parachute into any stage of development, or execute across
                the entire product lifecycle.
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
                        <p>
                          Talking to users and stakeholders to identify and define needs and requirements for creating a
                          truely useful product.
                        </p>
                      </li>
                      <li>
                        <h4>Ideation</h4>
                        <p>
                          Creating user flows, wireframes, and clickable prototypes to validate logic. Testing early
                          concepts with users and stakeholders.
                        </p>
                      </li>
                      <li>
                        <h4>High Fidelity</h4>
                        <p>
                          Crafting design systems, defining interaction patterns, tokens and states, and designing
                          high-fidelity interfaces in Figma.
                        </p>
                      </li>
                      <li>
                        <h4>Handoff</h4>
                        <p>
                          Preparing detailed documentation, code samples, and structured design files and that are ready
                          for immediate handoff.
                        </p>
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
                          Building complex, data-rich, and accessible interfaces with pixel-perfect precision, i.g in
                          React. Handling complex state management with tools like Redux, TanStack Query and routing
                          libraries.
                        </p>
                      </li>
                      <li>
                        <h4>Backend</h4>
                        <p>
                          Implementing application and business logic, authentication, API routes, and database
                          integrations (using tools like Supabase/PostgreSQL).
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
            </AnimateContent>
          </PageContent>
        </div>
      </AnimateContent>
      <Footer />
    </Page>
  );
}
