import { createFileRoute, Link } from '@tanstack/react-router'
import AnimateContent from '@/components/AnimateContent'
import { Page, PageContent } from '@/components/page'
import { Experience } from '@/components/Experience'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: 'About - Joakim Strandell' },
      { name: 'description', content: 'Learn about Joakim Strandell, a product engineer with 20+ years of experience in UX/UI Design and Fullstack Engineering.' },
    ],
  }),
})

function About() {
  return (
    <>
      <Page>
        <PageContent className="max-w-6xl">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="space-y-6">
              <AnimateContent>
                <div className="flex items-center justify-between gap-2">
                  <div className="prose">
                    <h1>Joakim Strandell</h1>

                    <p className="text-muted-foreground -mt-6 text-sm">
                      20+ years in UX/UI Design and Fullstack Engineering
                    </p>
                  </div>
                  <div className="hidden overflow-hidden rounded-full border-2 border-black/10 sm:block lg:hidden">
                    <img src="/joakim-sketch-transparent.png" alt="Joakim Strandell" width={100} height={100} />
                  </div>
                </div>
              </AnimateContent>
              <AnimateContent className="prose">
                <h2>From Soapbox Cars to Enterprise Products</h2>
                <p>
                  I've always liked building things. As a kid it was boats, soapbox cars, and questionable DIY
                  cigarettes. Later it became websites, apps, and digital products. The tools changed, but the curiosity
                  stayed the same.
                </p>
                <p>
                  In my twenties I started my first company, built a few SaaS tools before "SaaS" was even a thing, and
                  later co-founded a small digital studio that ended up working with brands like H&M, MTV, and BMW.
                </p>
                <p>
                  For the last decade working as a consultant, I've operated at the intersection of UX/UI Design and
                  Fullstack Engineering.
                </p>
                <p>
                  Most recently, I spent 7 years with Stockholm Exergi, designing consistent user experiences and
                  transitioning their platform to a modern, type-safe React architecture and API layer.
                </p>
              </AnimateContent>
              <AnimateContent className="mt-12">
                <div className="flex items-center gap-8">
                  <Button size="lg" asChild>
                    <Link to="/about" hash="experience">My experience</Link>
                  </Button>

                  <Button size="lg" variant="outline" asChild>
                    <a href="/CV - Joakim Strandell.pdf">CV as PDF</a>
                  </Button>
                </div>
              </AnimateContent>
            </div>
            <AnimateContent
              animationType="slideLeft"
              className="border-foreground/10 hidden items-center justify-center overflow-hidden rounded-full border-8 bg-white/20 lg:flex"
            >
              <img src="/joakim-sketch-transparent.png" alt="Old man laptop" width={320} height={320} />
            </AnimateContent>
          </div>
        </PageContent>
        <AnimateContent>
          <div id="philosophy" className="relative border-t-8 border-b-8 border-black/10 bg-white/50">
            <PageContent className="space-y-8">
              <div className="prose">
                <h2>My Philosophy</h2>
                <p className="text-lg font-bold">Great products are built in the overlap.</p>
                <p>
                  For too long, design and engineering have lived in separate realities. Designers perfect static images
                  that are impossible to maintain, and developers are left to interpret the intent. The result is
                  &quot;drift&quot;—a gap between what was approved and what actually ships.
                </p>

                <p>
                  I believe the best work happens when we remove that friction. I treat Code as the Source of Truth.
                  Instead of maintaining heavy, static design libraries, I architect systems where design tokens and
                  variables map 1:1 to production code.
                </p>

                <p>
                  This &quot;Code-First&quot; approach eliminates the traditional &quot;hand-off.&quot; We don&apos;t
                  just hope for the best; we prototype in the browser to validate logic, physics, and accessibility
                  immediately. This ensures a Zero-Loss process where the product you design is exactly the product you
                  build—cohesive, scalable, and shipped on time.
                </p>
              </div>
            </PageContent>
          </div>
        </AnimateContent>

        <PageContent id="experience">
          <AnimateContent className="prose">
            <h1>Experience</h1>
            <p className="-mt-4">
              In recent years, I've focused on uniting human-centered design principles with frontend engineering —
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
              description="As a long-term consultant for Stockholm Exergi's Intelligy Solution Platform, I led initiatives spanning UX/UI design, frontend development and infrastructure. I helped transition multiple products from a Python/Django-based interface to a modern React architecture, and later focused on building scalable frontend systems – including design systems, shared libraries, developer tooling, and documentation – to improve consistency and efficiency across applications and teams. In recent years, I've focused on uniting user-centered design principles with frontend engineering —
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
            <div className="prose">
              <br />
              <h2>More coming soon...</h2>
              <p>
                For now you can download my CV as a PDF <a href="/CV - Joakim Strandell.pdf">here</a>.
              </p>
            </div>
          </AnimateContent>
        </PageContent>

        <AnimateContent>
          <div id="stack" className="relative border-t-8 border-black/10 bg-white/50">
            <PageContent className="max-w-6xl">
              <AnimateContent>
                <div className="prose">
                  <h2>My Work Stack</h2>
                  <p>
                    As both a designer and developer, I try to stick to what is considered the best practices in the
                    design and development world. Even though the latest and greatest is always tempting, I like to
                    focus on what delivers the best results for the project at hand.
                  </p>
                  <p>
                    Within all areas of my work I use AI where it makes sense to do so. I believe there is no substitute
                    (yet) for human creativity and problem solving, but AI can help with the repetitive and routine
                    tasks, act as a second pair of eyes, and speed up the process.
                  </p>
                </div>
              </AnimateContent>
              <AnimateContent className="mt-12">
                <div className="[&>a]:bg-primary-500/20 [&>a]:text-primary-950 space-y-2 space-x-2 [&>a]:inline-block [&>a]:rounded-md [&>a]:p-2">
                  <a href="https://www.ideou.com/blogs/inspiration/what-is-human-centered-design">
                    Human-Centered Design
                  </a>
                  <a href="https://medium.com/@MargaretKagundu/from-pencils-to-pixels-the-power-of-paper-sketching-in-ui-ux-design-afa66c2f7abf/">
                    Pen and Paper
                  </a>
                  <a href="https://www.whimsical.com/">Whimsical</a>
                  <a href="https://miro.com">Miro</a>
                  <a href="https://www.figma.com/">Figma</a>
                  <a href="https://www.sketch.com/">Sketch</a>
                  <a href="https://www.adobe.com/">Adobe</a>
                  <a href="https://www.affinity.com/">Affinity</a>
                  <a href="https://www.typescriptlang.org/">TypeScript</a>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a>
                  <a href="https://react.dev/">React</a>
                  <a href="https://nextjs.org/">Next.js</a>
                  <a href="https://tailwindcss.com/">Tailwind CSS</a>
                  <a href="https://www.shadcn.com/">Shadcn UI</a>
                  <a href="https://tanstack.com/">Tanstack</a>
                  <a href="https://www.zod.dev/">Zod</a>
                  <a href="https://redux.js.org/">Redux</a>
                  <a href="https://nodejs.org/">Node.js</a>
                  <a href="https://www.python.org/">Python</a>
                  <a href="https://www.django.com/">Django</a>
                  <a href="https://www.openapis.org/">OpenAPI</a>
                  <a href="https://www.postgresql.org/">PostgreSQL</a>
                  <a href="https://www.mysql.com/">MySQL</a>
                  <a href="https://www.mongodb.com/">MongoDB</a>
                  <a href="https://www.docker.com/">Docker</a>
                  <a href="https://www.git-scm.com/">Git</a>
                  <a href="https://www.github.com/">GitHub</a>
                  <a href="https://www.gitlab.com/">GitLab</a>
                  <a href="https://www.cursor.com/">Cursor</a>
                  <a href="https://www.claude.ai/">Claude</a>
                  <a href="https://www.gemini.com/">Gemini</a>
                  <a href="https://www.atlassian.com/software/jira">Jira</a>
                  <a href="https://www.microsoft.com/en-us/microsoft-365">Microsoft 365</a>
                  <a href="https://www.notion.com/">Notion</a>
                </div>
              </AnimateContent>
            </PageContent>
          </div>
        </AnimateContent>
        <Footer />
      </Page>
    </>
  )
}
