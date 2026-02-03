import { createFileRoute, Link } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent, PageSection } from '@/components/page';
import { Checklist } from '@/components/Checklist';

export const Route = createFileRoute('/work/client/contract-first-apis-at-stockholm-exergi')({
  component: ContractFirstApisCase,
  head: () => ({
    meta: [
      { title: 'Contract-First APIs at Stockholm Exergi - Joakim Strandell' },
      {
        name: 'description',
        content:
          'Case study: Contract-first API design and type-safe SDK generation using OpenAPI, Kubb, and TanStack Query for Stockholm Exergi (2024–2025).',
      },
    ],
  }),
});

function ContractFirstApisCase() {
  return (
    <Page>
      <PageSection width="lg">
        <AnimateContent>
          <h1 className="mb-6 text-4xl font-bold">Contract-First APIs</h1>
          <p className="text-muted-foreground grid grid-cols-3 gap-x-8">
            <div className="prose">
              <strong>Role:</strong>
              <p>Frontend Engineer, leading architecture for frontend infrastructure and applications</p>
            </div>
            <div>
              <strong>Outcome:</strong>
              <p>Shared API contracts and generated SDKs adopted across multiple services</p>
            </div>
            <div>
              <strong>Focus period:</strong>
              <p>2024–2025</p>
            </div>
          </p>
        </AnimateContent>
      </PageSection>
      <PageContent>
        <AnimateContent className="prose">
          <h2>Overview</h2>
          <p>
            Stockholm Exergi’s product suite depends on consistent data and reliable integrations between backend
            services and frontend applications. By 2024, we needed a faster, safer way to evolve APIs without
            introducing breaking changes or duplicated client code across teams.
          </p>
          <p>
            I led the frontend architecture for a contract-first approach: backend and frontend defined the API contract
            together, used that contract as the source of truth, and generated type-safe SDKs and query hooks directly
            from it.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Challenge</h2>
          <p>We needed to reduce integration risk while increasing delivery speed across multiple services.</p>
          <Checklist
            className="my-4"
            items={[
              'API changes were costly to coordinate across teams',
              'Frontend integrations required repeated manual setup',
              'Validation logic drifted between backend and frontend',
              'Onboarding new engineers meant re-learning API patterns',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>The Approach</h2>
          <p>
            We aligned on contract-first API design. The contract defined the shape of every endpoint, request, and
            response. From there we automated everything we could.
          </p>
          <p>
            Our workshops started from the UI. We brought user flows and rough mock-ups, walked through the screens
            together, and mapped the data structures needed to power each state. We defined the exact endpoints and
            methods required to create, update, and delete content before any implementation started.
          </p>
          <p>
            After the contract was agreed, teams could split and move fast. Frontend generated SDKs and mock APIs from
            the contract, while backend implemented the real services. When the mock switched to production, it worked
            because both sides had built to the same contract.
          </p>
          <Checklist
            className="my-4"
            items={[
              'Co-authored OpenAPI specs with backend engineers during design reviews',
              'Used the contract as the single source of truth for API behavior',
              'Generated TypeScript SDKs with Kubb',
              'Generated TanStack Query hooks for consistent data access patterns',
              'Generated Zod validators to keep client-side validation aligned',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Implementation Highlights</h2>
          <p>
            We rolled the system across more than four services, with additional services in the pipeline when I left.
          </p>
          <p>
            <strong>Contract workflow</strong>
            <br />
            Backend and frontend defined contracts together in Stoplight (SmartBear). The visual editor let us build
            OpenAPI specs without hand-writing YAML, while enforcing shared endpoint rules from our best-practices
            guidelines. The OpenAPI spec was treated as a required artifact for every API change.
          </p>
          <p>
            <strong>Generated SDKs</strong>
            <br />
            Kubb generated a typed SDK for each service, producing request/response types, API clients, and hooks. This
            eliminated hand-written API client code and reduced drift between contract and usage.
          </p>
          <p>
            <strong>Frontend integration</strong>
            <br />
            TanStack Query hooks standardized loading, caching, and error handling. Zod validators provided runtime
            safety for incoming and outgoing payloads, so posted data matched the contract as strictly as responses.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Results</h2>
          <p>
            The system reduced integration friction across teams, made API changes safer to roll out, and shortened the
            feedback loop between backend and frontend development.
          </p>
          <Checklist
            className="my-4"
            items={[
              'Faster onboarding: one consistent API pattern across services',
              'Fewer contract mismatches: types and validators generated from the same source',
              'More predictable delivery: API changes were reviewed against a shared spec',
            ]}
          />
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Learnings</h2>
          <p>
            <strong>Contracts are collaboration tools.</strong>
            <br />
            The biggest win was not just type safety—it was shared ownership. Writing the contract together aligned
            backend and frontend early, before code diverged.
          </p>
          <p>
            <strong>Generated clients free teams to focus on product work.</strong>
            <br />
            Once the SDKs were in place, teams stopped rebuilding API integrations and moved faster with fewer
            regressions.
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Technical Summary</h2>
          <p>
            <strong>Stack:</strong> TypeScript, OpenAPI, Kubb, TanStack Query, Zod, React, Vite
          </p>
          <p>
            <strong>Scope:</strong> Applied across 4+ backend services, with additional services queued at the time of
            handover
          </p>
        </AnimateContent>

        <AnimateContent className="prose">
          <h2>Next</h2>
          <p>If you want to build reliable, scalable API contracts and type-safe frontend integrations, let’s talk.</p>
          <Link to="/connect" className="inline-flex font-semibold underline">
            Start a conversation
          </Link>
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
