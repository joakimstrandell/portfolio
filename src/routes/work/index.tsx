import { createFileRoute } from '@tanstack/react-router';
import AnimateContent from '@/components/AnimateContent';
import { Page, PageSection } from '@/components/Page';
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
      <PageSection>
        <AnimateContent>
          <h1 className="mb-2 text-4xl font-bold">Work</h1>
          <p className="mb-12 text-xl">
            A collection of client work, personal projects and concepts from Joakim Strandell.
          </p>
        </AnimateContent>
        <AnimateContent className="space-y-8">
          <ProjectCard
            to="/work/client/design-to-engineering-at-stockholm-exergi"
            type="client"
            title="Unifying Design and Engineering"
            extract="A 3-year unification effort: one design system and frontend architecture that made internal operations products consistent and faster to ship."
            thumbnail={{ src: '/exergi-plant.png', alt: 'Stockholm Exergi Plant in Lego blocks' }}
            logo={{ src: '/exergi-logo.png', alt: 'Stockholm Exergi Logo' }}
          />
          <ProjectCard
            to="/work/client/contract-first-apis-at-stockholm-exergi"
            type="client"
            title="Contract-First APIs"
            extract="A contract-first workflow that made frontend–backend integrations faster and safer across multiple services with generated, type-safe clients."
            thumbnail={{ src: '/contract-first-apis-thumb.png', alt: 'Abstract contract-first API diagram' }}
            logo={{ src: '/exergi-logo.png', alt: 'Stockholm Exergi Logo' }}
          />
          <ProjectCard
            to="/work/personal/josui"
            type="personal"
            title="JOSUI Design System"
            extract="An evolving design system monorepo with a token pipeline, core utilities, and React/Vue component libraries."
            thumbnail={{ src: '/josui-thumbnail.png', alt: 'Abstract design system diagram' }}
            logo={{ src: '/josui-logo.png', alt: 'JOSUI logo' }}
          />
        </AnimateContent>
      </PageSection>
    </Page>
  );
}
