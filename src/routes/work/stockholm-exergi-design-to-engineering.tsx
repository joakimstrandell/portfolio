import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Footer } from '@/components/Footer';
import { Checklist } from '@/components/Checklist';

export const Route = createFileRoute('/work/stockholm-exergi-design-to-engineering')({
  component: StockholmExergiCase,
  head: () => ({
    meta: [
      { title: 'Stockholm Exergi: Design to Engineering - Joakim Strandell' },
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
          <p>
            <Link to="/work">← Work</Link>
          </p>
          <h1>Unifying Design and Engineering for Energy Analytics</h1>
          <p className="text-muted-foreground">
            <strong>Role:</strong> Product Designer & Frontend Engineer
            <br />
            <strong>Timeline:</strong> 2018–2025 (7 years)
            <br />
            <strong>Outcome:</strong> Design system and frontend infrastructure adopted across organization
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Overview</h2>
          <p>
            For seven years, I led the frontend modernization of Intelligy Solutions — Stockholm Exergi's energy
            analytics platform serving 800,000+ residents across 10,000+ properties.
          </p>
          <p>
            What made this work different: our frontend team owned both product design and engineering. No handoffs
            between disciplines, no translation loss. The design system we built lives in code — components are the
            spec.
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
          <h2>The Evolution</h2>
          <p>My role expanded as the platform's needs became clearer.</p>
        </AnimateContent>

        <div className="border-primary-500/30 relative my-8 ml-1.5 space-y-8 border-l-2 pl-8">
          <AnimateContent>
            <TimelineItem period="2018–2019" title="UX Foundation">
              Joined as UX/UI designer. Conducted user research with property owners and housing associations.
              Established design patterns for the customer-facing analytics platform.
            </TimelineItem>
          </AnimateContent>
          <AnimateContent>
            <TimelineItem period="2019–2022" title="Frontend Migration">
              Expanded into frontend development. Led the migration from Django templates to React. Built the first
              shared component library. Introduced TypeScript.
            </TimelineItem>
          </AnimateContent>
          <AnimateContent>
            <TimelineItem period="2022–2024" title="Architecture & Systems">
              Took ownership of frontend architecture. Built STEXUI — a comprehensive design system. Created type-safe
              API infrastructure. Developed shared utilities for dates, measurements, and formatting.
            </TimelineItem>
          </AnimateContent>
          <AnimateContent>
            <TimelineItem period="2024–2025" title="Enablement">
              Shifted focus to technical direction and team enablement. Established development standards. Documented
              patterns. Enabled developer mobility across products.
            </TimelineItem>
          </AnimateContent>
        </div>

        <AnimateContent className="prose">
          <h2>The Work</h2>
          <h3>Design</h3>
          <p>
            Started with users. Conducted interviews and usability sessions with property owners, BRF board members, and
            internal operations staff.
          </p>
          <p>
            <strong>Core design challenge:</strong> Energy data is complex. Users needed to make decisions — not
            interpret raw numbers.
          </p>
          <p>Design principles that emerged:</p>
          <Checklist
            className="my-4"
            items={[
              'Progressive disclosure — summary first, details on demand',
              'Contextual comparison — data means nothing without reference',
              'Action-oriented — every insight connects to something users can do',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h3>Engineering</h3>
          <p>Built the technical foundation that made consistency possible at scale.</p>
          <p>
            <strong>Design System (STEXUI)</strong>
            <br />
            60+ components, 7 hooks, 12 utility modules, 3 theme variants. Built with React 18, TypeScript, Radix UI
            primitives, Tailwind CSS, and CVA for type-safe variants.
          </p>
          <p>
            Complex components built for real needs: data tables with TanStack integration, Mapbox-powered property
            maps, date range pickers with custom intervals, a sidebar system with 20+ composable parts.
          </p>
          <p>
            <strong>Type-Safe API Infrastructure</strong>
            <br />
            Connected 8+ microservices with generated TypeScript clients. OpenAPI Spec → Generated SDK → TanStack Query
            Hooks → UI. API integration bugs went from a recurring problem to essentially zero.
          </p>
          <p>
            <strong>Shared Infrastructure</strong>
            <br />
            Utility libraries for formatting (dates, measurements, translations). Custom hooks (useDebounce,
            useCopyToClipboard, useKeyShortcut). TanStack utilities (useDataTable, usePaginatedDataTable). Development
            tooling (ESLint configs, TypeScript standards, documentation).
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Why This Worked</h2>
          <p>Owning both design and engineering eliminated the gaps where quality usually dies.</p>
          <Checklist
            className="my-4"
            items={[
              'Design decisions informed by technical constraints — I knew what was feasible',
              'Technical decisions informed by design intent — the right thing was the easy thing',
              'No translation loss — the design system lives in code, components are the spec',
              'Faster feedback loops — prototype in code, test with users, refine without handoffs',
            ]}
          />
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
          <h2>Results</h2>
          <p>
            <strong>Adoption:</strong> 4 products migrated to STEXUI, 5 more in pipeline. All new frontend work builds
            on this infrastructure.
          </p>
          <p>
            <strong>Velocity:</strong> New features shipped ~3x faster once teams adopted the shared component library
            and API tooling.
          </p>
          <p>
            <strong>Quality:</strong> Hard-to-trace bugs became same-day fixes after implementing type-safe API clients
            with Zod validation.
          </p>
          <p>
            <strong>Onboarding:</strong> Developer ramp-up dropped from weeks to days — same stack, same patterns across
            all products.
          </p>
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
            <strong>Packages built:</strong> @stexui/react, @stexui/tailwind, @stexui/utils, @stexui/hooks,
            @stexui/localization, @stexui/app-config, @stexui/api-sdk
          </p>
          <p>
            See the patterns in action: <a href="https://github.com/joakimstrandell/josui">josui</a> — my open source
            design system using the same architecture.
          </p>
        </AnimateContent>
      </PageContent>
      <Footer />
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
