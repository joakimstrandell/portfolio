import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Checklist } from '@/components/Checklist';
import { Page, PageContent } from '@/components/page';
import StackedPanes from '@/components/StackedPanes';
import { cn } from '@josui/core-web';
import { Footer } from '@/components/Footer';
import { RotatingText } from '@/components/RotatingText';
import { Button } from '@/components/ui/button';
import { Card } from '@josui/react';
import DesignProcessAnimation from '@/components/DesignProcessAnimation';
import FullstackAnimation from '@/components/FullstackAnimation';
import ArchitectureAnimation from '@/components/ArchitectureAnimation';
import GlobeBackground from '@/components/GlobeBackground';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <Page>
      <div className="relative flex min-h-[calc(100vh-60px)] flex-col">
        <div
          className={cn(
            'absolute inset-y-0 top-0 right-0 overflow-hidden',
            'hidden items-center md:flex',
            'pl-3 lg:w-3/8',
          )}
        >
          <AnimateContent delay={0.2} animationType="fadeLeft" className="pointer-events-auto -mr-24">
            <StackedPanes />
          </AnimateContent>
        </div>
        <PageContent
          className={cn(
            'pointer-events-none relative z-10 max-w-2xl md:max-w-7xl',
            'flex h-full flex-1 flex-col justify-center',
          )}
        >
          <AnimateContent className="prose prose-sm md:prose-base md:max-w-[62ch] lg:max-w-[78ch]">
            <h1 className="pointer-events-auto leading-9 md:leading-12">
              I help teams ship{' '}
              <span className="text-primary-950 bg-primary-100 inline-block pb-1 leading-none">ideas</span> faster by
              unifying <span className="bg-tertiary-100 text-tertiary-900 inline-block pb-1 leading-none">design</span>{' '}
              and{' '}
              <span className="bg-secondary-500/20 text-secondary-900 inline-block pb-1 leading-none">engineering</span>
              .
            </h1>
          </AnimateContent>
          <AnimateContent className="prose pointer-events-auto md:max-w-[67ch]">
            <p className="prose-lg pointer-events-auto">
              With 20+ years of experience, I eliminate the friction between concept and code. I build scalable design
              systems and robust fullstack architectures that allow teams to go from idea to production without the
              translation loss.
            </p>
          </AnimateContent>
          <AnimateContent className="mt-2">
            <div className="flex items-center gap-8">
              <Button size="lg" variant="primary" asChild className="pointer-events-auto">
                <Link to="/work">View work</Link>
              </Button>

              <Button size="lg" asChild className="pointer-events-auto">
                <Link to="/about">Readme</Link>
              </Button>
            </div>
          </AnimateContent>
        </PageContent>
      </div>

      <AnimateContent>
        <GlobeBackground className="-mt-72" />

        {/* <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 70%)',
            }}
          /> */}
        <PageContent className="relative z-10 max-w-6xl pt-48">
          <AnimateContent animationType="slideUp" className="-mt-32">
            <div className="prose prose-xl md:prose-2xl prose-a mx-auto text-center">
              <h2 className="mb-4">
                How I Help You{' '}
                <RotatingText className="text-primary-600" words={['Succeed', 'Scale', 'Innovate', 'Ship', 'Launch']} />
              </h2>
              <p className="mx-auto max-w-[52ch]">
                I adapt quickly to your team&apos;s needs and can parachute into any stage of development, or execute
                across the entire product lifecycle.
              </p>
            </div>
          </AnimateContent>
          {/* Product Design */}
          <div className="mt-12 space-y-8 md:mt-24 md:space-y-12">
            <AnimateContent animationType="slideUp">
              <Card shadow="none" className="border-border/40 flex flex-col items-center border p-0 md:flex-row">
                <div className="flex-1 p-6 md:p-12">
                  <h3 className="text-2xl font-semibold md:text-3xl">Product Design</h3>
                  <p className="mt-1 text-base text-gray-600 md:text-lg">
                    Designing for implementation, not just presentation.
                  </p>
                  <Checklist
                    className="mt-4"
                    items={[
                      'Prototype complex flows directly in code',
                      'Design systems built in the codebase, not just Figma',
                      'No handoff — I ship production-ready components',
                    ]}
                  />
                </div>
                <div className="flex w-full justify-center md:w-auto">
                  <DesignProcessAnimation />
                </div>
              </Card>
            </AnimateContent>

            {/* Fullstack Engineering */}
            <AnimateContent>
              <Card
                shadow="none"
                className="border-border/40 flex flex-col items-center border p-0 md:min-h-96 md:flex-row"
              >
                <div className="flex-1 p-6 md:pl-12">
                  <h3 className="text-2xl font-semibold md:text-3xl">Fullstack Engineering</h3>
                  <p className="mt-1 text-base text-gray-600 md:text-lg">Vertical ownership from database to UI.</p>
                  <Checklist
                    className="mt-4"
                    items={[
                      'Component-driven, accessible frontends in React/TypeScript',
                      'Scalable backend architecture with clean API design',
                      'End-to-end type safety — contracts generated, not assumed',
                    ]}
                  />
                </div>
                <div className="flex w-full justify-center md:w-auto">
                  <FullstackAnimation />
                </div>
              </Card>
            </AnimateContent>

            {/* Architecture & DX */}
            <AnimateContent>
              <Card
                shadow="none"
                className="border-border/40 flex flex-col items-center border p-0 md:min-h-96 md:flex-row"
              >
                <div className="flex-1 p-6 md:pl-12">
                  <h3 className="text-2xl font-semibold md:text-3xl">Architecture & DX</h3>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    Building the systems that build the product.
                  </p>
                  <Checklist
                    className="mt-4"
                    items={[
                      'Monorepo setup with fast, cacheable builds',
                      'Shared UI libraries bridging design tokens to code',
                      'CI/CD pipelines that catch problems before deploy',
                    ]}
                  />
                </div>
                <div className="flex w-full justify-center md:w-auto">
                  <ArchitectureAnimation />
                </div>
              </Card>
            </AnimateContent>

            <AnimateContent className="text-center">
              <Button size="xl" variant="primary" asChild className="pointer-events-auto">
                <Link to="/contact">Let&apos;s Chat!</Link>
              </Button>
            </AnimateContent>
          </div>
        </PageContent>
      </AnimateContent>

      <Footer />
    </Page>
  );
}
