import AnimateContent from '@/components/AnimateContent';
import { Page, PageContent } from '@/components/page';
import { Experience } from './-experience';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <Page>
        <PageContent className="max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <AnimateContent className="prose">
                <h1>Joakim Strandell</h1>
                <p className="text-muted-foreground -mt-6 text-sm">
                  Product Engineer with 20+ years in UX/UI Design and Full-Stack Engineering
                </p>
              </AnimateContent>
              <AnimateContent className="prose dark:prose-invert">
                <h2>From Soapbox Cars to Enterprise Products</h2>
                <p>
                  I’ve always liked building things. As a kid it was boats, soapbox cars, and questionable DIY
                  cigarettes. Later it became websites, apps, and digital products. The tools changed, but the curiosity
                  stayed the same.
                </p>
                <p>
                  In my twenties I started my first company, built a few SaaS tools before “SaaS” was even a thing, and
                  later co-founded a small digital studio that ended up working with brands like H&M, MTV, and BMW.
                </p>
                <p>
                  For the last decade working as a consultant, I’ve operated at the intersection of UX/UI Design and
                  Full-Stack Engineering.
                </p>
                <p>
                  Most recently, I spent 7 years with Stockholm Exergi, designing consistent user experiences and
                  transitioning their platform to a modern, type-safe React architecture.
                </p>
              </AnimateContent>
              <AnimateContent className="mt-12">
                <div className="flex items-center gap-8">
                  <Button size="lg" asChild>
                    <Link href="/about#experience">My experience</Link>
                  </Button>

                  <Button size="lg" variant="outline" asChild>
                    <Link href="/about#cv">CV as PDF</Link>
                  </Button>
                </div>
              </AnimateContent>
            </div>
            <AnimateContent
              animationType="slideLeft"
              className="border-foreground/10 flex items-center justify-center overflow-hidden rounded-full border-8 bg-white/20"
            >
              <Image src="/joakim-sketch-transparent.png" alt="Old man laptop" width={320} height={320} />
            </AnimateContent>
          </div>
        </PageContent>
        <AnimateContent>
          <div className="relative border-t-8 border-b-8 border-black/10 bg-white/50">
            <PageContent className="max-w-6xl space-y-8">
              <div className="prose">
                <h2>My Philosophy</h2>
                <p>
                  I’ve believe in uniting human-centered design principles with full-stack engineering — keeping humans
                  at the center for the entire product lifecycle. Be it the users of the product or the people building
                  it, I believe in creating a seamless experience for everyone.
                  {/* working closely
                  with product teams to design thoughtful experiences, architect application infrastructures with
                  exceptional developer experience, and bring clarity between design and code through team collaboration
                  and shared best practices. */}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-12">
                <div className="prose">
                  <h3>01. Design First</h3>
                  <p>
                    The best designs are the ones that are built with the user in mind, and where every stakeholder is
                    involved in the process.
                  </p>
                </div>
                <div className="prose">
                  <h3>02. Rigor Matters</h3>
                  <p>
                    Besides solid engineering practices, i believe good DX is the foundation of a successful product. I
                    believe in Type Safety, Automation. Whether it is using Zod for validation or auto-generating API
                    SDKs from OpenAPI specs, I build infrastructure that prevents bugs before they happen. I believe in
                    Type Safety and Automation. Whether it is using Zod for validation or auto-generating API SDKs from
                    OpenAPI specs, I build infrastructure that prevents bugs before they happen.
                  </p>
                </div>
                <div className="prose">
                  <h3>03. User-Centric Engineering</h3>
                  <p>
                    At the end of the day, code must solve a problem. Whether I was streamlining production for Printees
                    or visualizing energy loads for Stockholm Exergi, my focus is always on the user's success.
                  </p>
                </div>
              </div>
            </PageContent>
          </div>
        </AnimateContent>

        <PageContent>
          <AnimateContent className="prose dark:prose-invert">
            <h1>Experience</h1>
            <hr className="border-foreground -mt-4 border-2" />
            <p>
              In recent years, I’ve focused on uniting user-centered design principles with frontend engineering —
              working closely with product teams to design thoughtful experiences, build scalable frontend
              infrastructures and developer tooling, and bring clarity between design and code through documentation and
              shared best practices.
            </p>
          </AnimateContent>
          <AnimateContent>
            <Experience
              title="Stockholm Exergi"
              period="2018-2025"
              type="Contract"
              time="7 years"
              role="UX/UI Designer and Frontend Developer"
              description="As a long-term consultant for Stockholm Exergi’s Intelligy Solution Platform, I led initiatives spanning UX/UI design, frontend development and infrastructure. I helped transition multiple products from a Python/Django-based interface to a modern React architecture, and later focused on building scalable frontend systems – including design systems, shared libraries, developer tooling, and documentation – to improve consistency and efficiency across applications and teams. In recent years, I’ve focused on uniting user-centered design principles with frontend engineering —
              working closely with product teams to design thoughtful experiences, build scalable frontend
              infrastructures and developer tooling, and bring clarity between design and code through documentation and
              shared best practices."
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
          </AnimateContent>
        </PageContent>

        <AnimateContent>
          <div className="relative border-t-8 border-b-8 border-black/10 bg-white/50">
            <PageContent className="max-w-6xl">
              <AnimateContent>
                <div className="prose">
                  <h2>Technical Stack</h2>
                  <p>
                    I rely on a modern, type-safe stack that prioritizes developer experience and long-term
                    maintainability. My go-to architecture leverages React 18+ and TypeScript, using TanStack Query for
                    robust server state data management and Zod for end-to-end validation.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="prose">
                      <h4>Core & Infrastructure</h4>
                      <ul>
                        <li>Miro</li>
                        <li>Figma</li>
                        <li>Affinity</li>
                      </ul>
                    </div>
                    <div className="prose">
                      <h4>Frontend</h4>
                      <ul>
                        <li>React</li>
                        <li>Next.js</li>
                        <li>Tailwind CSS</li>
                        <li>TypeScript</li>
                        <li>Shadcn UI</li>
                      </ul>
                    </div>
                    <div className="prose">
                      <h4>Backend</h4>
                      <ul>
                        <li>Node.js</li>
                        <li>Express</li>
                        <li>PostgreSQL</li>
                      </ul>
                    </div>
                    <div className="prose">
                      <h4>Tools</h4>
                      <ul>
                        <li>Git</li>
                        <li>Docker</li>
                        <li>CI/CD</li>
                      </ul>
                    </div>
                    <div className="prose">
                      <h4>Tools</h4>
                      <ul>
                        <li>Git</li>
                        <li>Docker</li>
                        <li>CI/CD</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimateContent>
            </PageContent>
          </div>
        </AnimateContent>
      </Page>
    </>
  );
}
