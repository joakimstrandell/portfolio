import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Footer } from '@/components/Footer';
import { Checklist } from '@/components/Checklist';

export const Route = createFileRoute('/work/client/design-to-engineering-at-stockholm-exergi')({
  component: StockholmExergiCase,
  head: () => ({
    meta: [
      { title: 'Design to Engineering at Stockholm Exergi - Joakim Strandell' },
      {
        name: 'description',
        content:
          'Case study: 7 years unifying design and engineering for energy analytics — building a design system and frontend infrastructure adopted across 8+ products.',
      },
    ],
  }),
});

function StockholmExergiCase() {
  return (
    <Page>
      <PageContent>
        <AnimateContent className="prose">
          <h1>Unifying Design and Engineering</h1>
          <p className="text-muted-foreground">
            <strong>Role:</strong> Product Designer & Frontend Engineer
            <br />
            <strong>Focus period:</strong> 2022–2025 (3 years)
            <br />
            <strong>Outcome:</strong> Design system and frontend infrastructure adopted across organization
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Overview</h2>
          <p>
            A 3-year effort to remove handoffs and deliver a single system for internal operations products in Intelligy
            Solutions — Stockholm Exergi's energy analytics platform.
          </p>
          <p>
            I joined Stockholm Exergi in 2018 as a UX/UI designer. By 2022, the platform had grown into multiple
            products with inconsistent UI and duplicated effort. The unification work below is what I led over the final
            three years.
          </p>
          <p>
            What made the unification work different: our frontend team owned both product design and engineering. No
            handoffs between disciplines, no translation loss. The design system we built lives in code — components are
            the spec.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Challenge</h2>
          <p>The platform had grown organically. Multiple products, independent codebases, inconsistent experiences.</p>
          <Checklist
            className="my-4"
            items={[
              'Fragmented UI — same functions looked different across products',
              'Duplicated effort — teams rebuilt similar components repeatedly',
              'Design-dev gap — Figma designs interpreted independently by each developer',
              'Slow iteration — no shared patterns meant starting from scratch',
              'Technical debt — legacy Django stack made frontend changes painful',
            ]}
          />
          <p>This wasn't a design problem or an engineering problem. It was both.</p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Unification (2022–2025)</h2>
          <p>My scope shifted from product delivery to platform-wide systems and enablement.</p>
        </AnimateContent>

        <div className="border-primary-500/30 relative my-8 ml-1.5 space-y-8 border-l-2 pl-8">
          <AnimateContent>
            <TimelineItem period="Background (2018–2022)" title="Product Design → Frontend Development">
              Joined as UX/UI designer for the customer-facing Intelligy app. Conducted user research with property
              owners and designed data visualization interfaces. Expanded into frontend engineering, built features in
              the Django stack, and led the design and development of Intelligy Pro — a React-based platform that
              eventually absorbed the original product.
            </TimelineItem>
          </AnimateContent>
          <AnimateContent>
            <TimelineItem period="2022–2024" title="Architecture & Infrastructure">
              Took ownership of frontend architecture. Built STEXUI — a comprehensive design system (60+ components).
              Created type-safe API tooling with auto-generated TypeScript clients from OpenAPI specs. Developed shared
              utility libraries for formatting, dates, and translations.
            </TimelineItem>
          </AnimateContent>
          <AnimateContent>
            <TimelineItem period="2024–2025" title="Standards & Mentorship">
              As the team grew, balanced hands-on development with standards and mentorship. Wrote ADRs for API design,
              led code reviews and feature planning, and enabled developer mobility through standardized patterns.
            </TimelineItem>
          </AnimateContent>
        </div>

        <AnimateContent className="prose">
          <h2>The Work</h2>
          <p>
            The unification work focused on internal applications used by operations teams. I worked directly with
            internal stakeholders and field users to standardize workflows, establish a shared language, and make
            complex energy data actionable across products.
          </p>
          <p>
            <strong>Core design challenge:</strong> Internal users needed to make decisions quickly. The system had to
            surface the right context without forcing people to interpret raw data.
          </p>
          <p>Principles that guided both design and engineering:</p>
          <Checklist
            className="my-4"
            items={[
              'Progressive disclosure — summary first, details on demand',
              'Contextual comparison — data means nothing without reference',
              'Action-oriented — every insight connects to something users can do',
              'Clear installation flows — one way to complete installations end-to-end',
              'Consistent naming — shared language across products and field workflows',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h3>Systems Built</h3>
          <p>
            Built the foundation that made consistency and speed possible across internal products — not just shared UI,
            but shared behavior.
          </p>
          <p>
            <strong>Design System (STEXUI)</strong>
            <br />A comprehensive component and theming system built with React, TypeScript, Radix UI primitives,
            Tailwind CSS, and CVA for type-safe variants. It standardized how measurements are formatted, how loading
            states are rendered, and how optimistic updates behave — so the experience felt consistent everywhere.
          </p>
          <p>
            Complex components built for real needs: data tables with TanStack integration, Mapbox-powered property
            maps, date range pickers with custom intervals, a Chart.js-based analytics module for custom datasets, and a
            composable sidebar system.
          </p>
          <p>
            <strong>Type-Safe API Infrastructure</strong>
            <br />
            Connected 8+ microservices with generated TypeScript clients. OpenAPI Spec → Generated SDK → TanStack Query
            Hooks → UI. API integration bugs went from a recurring problem to essentially zero.
            <span className="text-muted-foreground block pt-3 text-sm">
              Read more:{' '}
              <Link to="/work/client/contract-first-apis-at-stockholm-exergi" className="underline underline-offset-4">
                Contract-First APIs at Stockholm Exergi
              </Link>
              .
            </span>
          </p>
          <p>
            <strong>Shared Infrastructure</strong>
            <br />
            Shared utilities for formatting, localization, and common data patterns. Reusable hooks and table tooling. A
            consistent frontend architecture made it easy to spin up new apps and keep behavior aligned across
            codebases. A shared monorepo and tooling standards kept packages, configs, and updates centralized.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Why This Worked</h2>
          <p>
            Owning both design and engineering removed handoffs and kept decisions consistent from UX intent through
            implementation. That reduced rework and made new patterns usable across teams.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Results</h2>
          <p>
            <strong>Adoption:</strong> Unified design language across internal products — 4 migrated to the new stack, 5
            in pipeline at handover.
          </p>
          <p>
            <strong>Velocity:</strong> New features shipped ~3x faster once teams adopted the shared component library
            and API tooling.
          </p>
          <p>
            <strong>Quality:</strong> Hard-to-trace bugs became same-day fixes after implementing type-safe API clients
            with Zod validation on all endpoints.
          </p>
          <p>
            <strong>Onboarding:</strong> Developer ramp-up dropped from weeks to days — same stack, same patterns across
            all products.
          </p>
          <p>
            <strong>Reusability:</strong> New applications inherited the full component library from day one — no
            rebuilding common patterns.
          </p>
        </AnimateContent>

        <AnimateContent>
          <blockquote className="border-primary-500/30 my-12 border-l-2 pl-6">
            <p className="text-lg italic">
              "His ability to own the entire chain – from design concept to complex implementation – enabled us to
              deliver higher quality faster."
            </p>
            <footer className="text-muted-foreground mt-3 text-sm">
              <strong className="text-foreground">Patrik Höjner</strong> · Head of Intelligy Solutions DevOps, Stockholm
              Exergi
            </footer>
          </blockquote>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Learnings</h2>
          <p>
            <strong>The gap between design and engineering is where quality dies.</strong>
            <br />
            Every handoff is lossy compression. Owning both sides eliminates the translation layer where details get
            lost.
          </p>
          <p>
            <strong>Design systems are governance problems, not component problems.</strong>
            <br />
            Building a button is easy. Getting eight teams to use the same button — and keep using it — is the real
            work.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Technical Summary</h2>
          <p>
            <strong>Stack:</strong> React 18, TypeScript, TanStack Query, TanStack Router, Radix UI, Tailwind CSS,
            OpenAPI, Zod, Figma, Vite, npm workspaces
          </p>
          <p>
            <strong>Scope:</strong> Internal operations products with a shared design system and frontend architecture
          </p>
          <p>
            See some of the patterns in action in the{' '}
            <Link to="/work/personal/josui" className="underline underline-offset-4">
              JOSUI design system monorepo case study
            </Link>{' '}
            and in <a href="https://github.com/joakimstrandell/josui">josui</a> — my open source design system inspired
            by some of the same principles.
          </p>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}

function TimelineItem({ period, title, children }: { period: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative mb-10 last:mb-0">
      <div className="bg-primary-500 absolute top-1 -left-9.25 h-2 w-2 rounded-full" />
      <p className="text-muted-foreground font-mono text-sm">{period}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1">{children}</p>
    </div>
  );
}
