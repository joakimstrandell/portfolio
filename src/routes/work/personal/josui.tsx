import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageSection } from '@/components/Page';
import { Checklist } from '@/components/Checklist';

export const Route = createFileRoute('/work/personal/josui')({
  component: JosuiCase,
  head: () => ({
    meta: [
      { title: 'JOSUI Design System Monorepo - Joakim Strandell' },
      {
        name: 'description',
        content:
          'Case study: A work-in-progress, multi-package design system monorepo with a token pipeline, core logic, and React + Vue implementations (2026–present).',
      },
    ],
  }),
});

function JosuiCase() {
  return (
    <Page>
      <PageSection width="narrow">
        <AnimateContent className="prose">
          <h1 className="mb-6 text-4xl font-bold">JOSUI Design System</h1>
          <p className="text-primary-700 -mt-4">Work in progress</p>
          <p className="text-muted-foreground">
            <strong>Role:</strong> Creator and sole contributor
            <br />
            <strong>Focus period:</strong> January 2026–Present
            <br />
            <strong>Outcome:</strong> Evolving design system architecture with multi-framework delivery
            <br />
          </p>
        </AnimateContent>
        <AnimateContent className="prose">
          <h2>Overview</h2>
          <p>
            JOSUI is a personal design system monorepo created to demonstrate how I approach scalable UI architecture
            and platform-ready tooling. It is actively evolving as I test ideas, refine patterns, and ship new packages.
          </p>
          <p>
            The system currently includes tokens, core logic, web utilities, and framework-specific libraries for both
            React and Vue, with shared tooling to keep consistency across packages.
          </p>
          <p>
            The goal is to show end-to-end thinking: design tokens as the source of truth, a layered architecture that
            keeps responsibilities clean, and delivery formats that match how teams actually consume design systems.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Challenge</h2>
          <p>
            I wanted a single system that could scale across multiple frameworks while keeping API surfaces consistent
            and reducing duplication between packages.
          </p>
          <Checklist
            className="my-4"
            items={[
              'Tokens needed to support multiple output formats without manual drift',
              'Core logic had to stay framework-agnostic',
              'Framework libraries needed consistent APIs and test setups',
              'Tooling had to enforce standards across the monorepo',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Approach</h2>
          <p>
            I’m building the system as a layered monorepo: tokens → core → web utilities → framework implementations,
            with separate styling delivery channels. The token pipeline is the single source of truth and feeds every
            consumer package as the system grows.
          </p>
          <Checklist
            className="my-4"
            items={[
              'Defining JSON tokens (aligned with the latest DTCG specs) as the source of truth and generating multiple formats via Terrazzo',
              'Isolated core logic in @josui/core and @josui/core-web',
              'Implementing React and Vue component libraries with aligned APIs',
              'Building Tailwind and SCSS consumption packages for different styling workflows',
              'Adding workspace tooling packages for ESLint, TypeScript, and Prettier consistency',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Implementation Highlights</h2>
          <p>
            <strong>Token pipeline</strong>
            <br />
            Tokens live as JSON files and are compiled into JS, CSS variables, Tailwind tokens, and SCSS outputs using
            Terrazzo. The pipeline is evolving as new formats and naming conventions are tested.
          </p>
          <p>
            <strong>Core and web utilities</strong>
            <br />
            Core behavior is centralized in @josui/core, with web-specific helpers in @josui/core-web. Framework
            packages build on top, so React and Vue can ship the same behaviors with idiomatic bindings as the APIs
            stabilize.
          </p>
          <p>
            <strong>Framework packages and tooling</strong>
            <br />
            React and Vue libraries are published separately, each with Storybook, Vitest, and Testing Library setup.
            The monorepo includes internal linting, TypeScript, and Prettier config packages to enforce consistency. It
            also includes `AGENTS.md` guidance and scoped skills to support agentic coding workflows across packages.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Results</h2>
          <p className="text-muted-foreground">
            This system is in active development, so the outcomes below reflect the current state rather than a final
            destination.
          </p>
          <Checklist
            className="my-4"
            items={[
              'A token pipeline that drives multiple delivery formats',
              'Early API parity across React and Vue implementations',
              'Package boundaries designed to scale with new additions',
              'Tooling foundations to keep the workspace aligned',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Learnings</h2>
          <p>
            <strong>Tokens are the real product.</strong>
            <br />
            The more reliable and automated the tokens become, the more composable and repeatable the system gets.
          </p>
          <p>
            <strong>Framework parity must be designed, not assumed.</strong>
            <br />
            The only way to keep APIs consistent over time is to intentionally design the layers that sit between core
            logic and framework bindings.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Technical Summary</h2>
          <p>
            <strong>Stack:</strong> pnpm, Turborepo, TypeScript, Vite, tsup, Terrazzo, React, Vue, Storybook, Vitest,
            Testing Library
          </p>
          <p>
            <strong>Scope:</strong> Multi-package design system with tokens, core utilities, framework libraries, and
            tooling packages (in progress)
          </p>
          <p>
            Repository: <a href="https://github.com/joakimstrandell/josui">github.com/joakimstrandell/josui</a>
          </p>
        </AnimateContent>
        <AnimateContent className="prose">
          <p>
            Lets <Link to="/connect">connect</Link> if you want to talk design systems or token pipelines.
          </p>
        </AnimateContent>
      </PageSection>
    </Page>
  );
}
