import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Experience } from './-experience';

export default function About() {
  return (
    <>
      <Page>
        <PageContent className="space-y-6">
          <AnimateContent className="prose dark:prose-invert">
            <h1>Joakim Strandell</h1>
          </AnimateContent>
          <AnimateContent className="prose dark:prose-invert font-extrabold">
            <p>
              As a <span className="text-accent">product engineer</span> bridging{' '}
              <span className="text-accent">UX/UI design</span> and{' '}
              <span className="text-accent">full-stack development</span>, I work across the entire product lifecycle —
              combining a deep understanding of user needs and product strategy with hands-on design and engineering
              expertise to ensure every product I build is both delightful to use and grounded in a solid technical
              foundation.
            </p>
          </AnimateContent>
          <AnimateContent className="prose dark:prose-invert">
            <p>
              Over the past two decades, I’ve worked with everything from early-stage startups to large enterprises. My
              roles have spanned <span className="text-accent">product management</span>,{' '}
              <span className="text-accent">user research</span>, <span className="text-accent">interface design</span>,{' '}
              <span className="text-accent">system architecture</span>, and{' '}
              <span className="text-accent">full-stack development</span> — often bridging them into a unified approach.
            </p>
            <p>
              In recent years, I’ve focused on uniting user-centered design principles with frontend engineering —
              working closely with product teams to design thoughtful experiences, build scalable frontend
              infrastructures and developer tooling, and bring clarity between design and code through documentation and
              shared best practices.
            </p>
            <p>
              Let’s connect if you want to discuss digital product design, frontend architecture, or building
              high-performing teams!
            </p>
          </AnimateContent>
        </PageContent>
      </Page>
      <Page className="bg-foreground/4">
        <AnimateContent>
          <PageContent>
            <AnimateContent className="prose dark:prose-invert">
              <h1>Experience</h1>
            </AnimateContent>
            <Experience
              title="Stockholm Exergi"
              period="2018-2025"
              type="Contract"
              time="7 years"
              role="UX/UI Designer and Frontend Developer"
              description="As a long-term consultant for Stockholm Exergi’s Intelligy Solution Platform, I led initiatives spanning UX/UI design, frontend development and infrastructure. I helped transition multiple products from a Python/Django-based interface to a modern React architecture, and later focused on building scalable frontend systems – including design systems, shared libraries, developer tooling, and documentation – to improve consistency and efficiency across applications and teams."
              skills={['React', 'TypeScript', 'Design Systems', 'Frontend Development', 'Developer Tooling']}
            >
              <p>
                I joined Stockholm Exergi as a UX/UI Designer for Intelligy Solutions – a platform used by property
                owners to monitor, control and analyze district energy usage, subplant capacity, and indoor climate
                across single buildings or large property portfolios. My work centered on creating intuitive,
                data-driven interfaces to enhance usability and deliver clear, actionable information to users.
              </p>

              <p>
                After my initial work in UX/UI design, I was contracted to contribute to frontend development. My
                responsibilities began with implementing a new GUI within the existing Python and Django stack. As the
                platform evolved, we transitioned to a single-page application architecture in React, establishing a
                clear separation between backend and frontend.
              </p>

              <p>
                Over five years, I worked across multiple Intelligy Solutions products, primarily internal tools for
                managing installations and load balancing in district energy networks, with a focus on both UX/UI design
                and frontend development.
              </p>

              <p>
                In recent years, I have concentrated on frontend infrastructure – designing and building design systems,
                component libraries, tooling for application configuration, API SDK generation, and shared libraries for
                formatting and translations, all maintained in a shared monorepo for consistency and efficiency across
                applications.
              </p>

              <p>
                As the frontend team grew, I supported onboarding new developers and took the lead in creating
                comprehensive guidelines and documentation. This included not only Git workflows and commit strategies,
                but also API specification and design guidelines, deployment strategies, and best practices for working
                within our shared codebase. These efforts helped ensure consistency, clarity, and efficiency as the team
                and product portfolio expanded.
              </p>
            </Experience>
          </PageContent>
        </AnimateContent>
      </Page>
      <AnimateContent animationType="fadeIn">
        <Page className="min-h-0">
          <PageContent className="mt-12">
            <AnimateContent>
              <h2>Skills</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <p>
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
                minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                commodi consequatur.
              </p>
            </AnimateContent>
            <AnimateContent>
              <h2>My Story</h2>
              <p>
                I’ve always liked building things. As a kid it was boats, soapbox cars, and questionable DIY cigarettes.
                Later it became websites, apps, and digital products. The tools changed, but the curiosity stayed the
                same.
              </p>
              <p>
                In my twenties I started my first company, built a few SaaS tools before “SaaS” was even a thing, and
                later co-founded a small digital studio that ended up working with brands like H&M, MTV, and BMW.
              </p>
              <p>
                More than two decades later, I’m still doing what I’ve always done — designing and building things that
                people love using.
              </p>
            </AnimateContent>
          </PageContent>
        </Page>
      </AnimateContent>
    </>
  );
}
