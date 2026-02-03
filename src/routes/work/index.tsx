import { createFileRoute } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { ProjectCard } from '@/components/ProjectCard';

export const Route = createFileRoute('/work/')({
  component: Work,
  head: () => ({
    meta: [
      { title: 'Work - Joakim Strandell' },
      {
        name: 'description',
        content: 'A collection of client work, personal projects, concepts, and thoughts from Joakim Strandell.',
      },
    ],
  }),
});

function Work() {
  return (
    <Page>
      <PageContent>
        <AnimateContent>
          <h1 className="mb-2 text-4xl font-bold">Work</h1>
          <p className="mb-12 text-xl">
            A collection of client work, personal projects and concepts from Joakim Strandell.
          </p>
          <ProjectCard
            to="/work/client-work/stockholm-exergi-design-to-engineering"
            type="client"
            title="Unifying Design and Engineering with Design Systems"
            extract="A 3-year effort to remove handoffs by building a shared design system and frontend architecture for internal operations products in Intelligy Solutions."
            thumbnail={{ src: '/exergi-plant.png', alt: 'Stockholm Exergi Plant in Lego blocks' }}
            logo={{ src: '/exergi-logo.png', alt: 'Stockholm Exergi Logo' }}
          />
          <div className="mt-12" />
          <ProjectCard
            to="/work/client-work/contract-first-apis-at-stockholm-exergi"
            type="client"
            title="Contract-First APIs at Stockholm Exergi"
            extract="How we aligned backend and frontend on shared API contracts, then generated type-safe SDKs, TanStack Query hooks, and validation to speed up delivery across multiple services."
            thumbnail={{ src: '/contract-first-apis-thumb.png', alt: 'Abstract contract-first API diagram' }}
            logo={{ src: '/exergi-logo.png', alt: 'Stockholm Exergi Logo' }}
          />
          <div className="mt-12" />
          <ProjectCard
            to="/work/personal/josui"
            type="personal"
            title="JOSUI Design System Monorepo"
            extract="A multi-package design system built with pnpm + turbo, shipping tokens, core logic, React and Vue libraries, and tooling packages for linting, TypeScript, and Prettier."
            thumbnail={{ src: '/josui-thumbnail.png', alt: 'Abstract design system diagram' }}
            logo={{ src: '/josui-logo.png', alt: 'JOSUI logo' }}
          />
        </AnimateContent>
      </PageContent>
    </Page>
  );
}
