import { createFileRoute, Link } from '@tanstack/react-router'
import AnimateContent from '@/components/AnimateContent'
import { Page } from '@/components/page'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/work/stexui')({
  component: STEXUICase,
  head: () => ({
    meta: [
      { title: 'STEXUI Design System - Joakim Strandell' },
      {
        name: 'description',
        content:
          'Case study: Building a comprehensive design system for energy analytics serving 800,000+ residents across 8+ products.',
      },
    ],
  }),
})

function STEXUICase() {
  return (
    <Page className="bg-[#fafaf9]">
      {/* Hero - Full bleed dark section */}
      <section className="relative min-h-[90vh] bg-[#0a0a0a] text-white overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating badge */}
        <AnimateContent className="absolute top-8 right-8 md:top-12 md:right-12">
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-white/40">
            <span className="w-8 h-px bg-white/20" />
            Case Study
          </div>
        </AnimateContent>

        {/* Main content */}
        <div className="relative z-10 flex flex-col justify-end min-h-[90vh] px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
          <AnimateContent>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm"
            >
              <span className="text-lg">←</span> Work
            </Link>
          </AnimateContent>

          <AnimateContent>
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-light leading-[0.85] tracking-tight">
              STEX
              <span className="text-[#3b82f6]">UI</span>
            </h1>
          </AnimateContent>

          <AnimateContent>
            <p className="mt-8 max-w-xl text-lg md:text-xl text-white/60 leading-relaxed">
              A design system for energy analytics — unifying 8 products,
              800,000 residents, and eliminating design-to-code translation loss.
            </p>
          </AnimateContent>

          <AnimateContent>
            <div className="mt-12 flex flex-wrap gap-x-12 gap-y-4 text-sm">
              <div>
                <span className="text-white/30 block">Role</span>
                <span className="text-white/80">Design System Architect</span>
              </div>
              <div>
                <span className="text-white/30 block">Timeline</span>
                <span className="text-white/80">2020–2025</span>
              </div>
              <div>
                <span className="text-white/30 block">Client</span>
                <span className="text-white/80">Stockholm Exergi</span>
              </div>
            </div>
          </AnimateContent>
        </div>

        {/* Large decorative number */}
        <div className="absolute -bottom-20 -right-12 text-[40vw] font-light leading-none text-white/[0.02] select-none pointer-events-none">
          01
        </div>
      </section>

      {/* Stats bar */}
      <AnimateContent>
        <section className="bg-[#3b82f6] text-white">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatBlock value="60+" label="Components" />
            <StatBlock value="8+" label="Products" />
            <StatBlock value="800K" label="Residents Served" />
            <StatBlock value="0" label="Translation Loss" />
          </div>
        </section>
      </AnimateContent>

      {/* Context */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <AnimateContent className="lg:col-span-4">
              <SectionLabel>The Context</SectionLabel>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mt-4">
                District heating for a capital city.
              </h2>
            </AnimateContent>

            <AnimateContent className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
                <p>
                  Stockholm Exergi operates Stockholm's district heating network.
                  Their digital platform, <strong className="text-neutral-900">Intelligy Solutions</strong>,
                  is a suite of energy analytics tools used by property owners, housing associations,
                  and internal operations teams.
                </p>
                <p>
                  The platform is also sold as white-label B2B SaaS — making visual
                  consistency across products a <em>business requirement</em>, not a design preference.
                </p>
              </div>
            </AnimateContent>
          </div>
        </div>
      </section>

      {/* The Problem - Full width dark band */}
      <AnimateContent>
        <section className="bg-[#0a0a0a] text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 relative overflow-hidden">
          {/* Large background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-light text-white/[0.03] whitespace-nowrap select-none pointer-events-none">
            CHAOS
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <SectionLabel dark>The Problem</SectionLabel>

            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <ProblemCard
                number="01"
                title="Inconsistent UI"
                description="Same functions looked different across applications"
              />
              <ProblemCard
                number="02"
                title="Duplicated Effort"
                description="Teams rebuilt similar components for each product"
              />
              <ProblemCard
                number="03"
                title="Slow Delivery"
                description="No shared patterns meant starting from scratch"
              />
              <ProblemCard
                number="04"
                title="Design-Dev Gap"
                description="Figma designs interpreted independently by each developer"
              />
              <ProblemCard
                number="05"
                title="Theming Hell"
                description="White-label customization was manual and error-prone"
              />
            </div>

            <p className="mt-16 text-2xl md:text-3xl font-light text-white/80 max-w-3xl">
              The platform needed a unified system that could scale across
              <span className="text-[#3b82f6]"> 8+ products</span> while supporting
              <span className="text-[#3b82f6]"> multiple brand themes</span>.
            </p>
          </div>
        </section>
      </AnimateContent>

      {/* The Solution */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <AnimateContent>
            <SectionLabel>The Solution</SectionLabel>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] mt-4 max-w-4xl">
              Code as the
              <span className="block text-[#3b82f6]">source of truth.</span>
            </h2>
          </AnimateContent>

          <AnimateContent>
            <p className="mt-12 text-xl md:text-2xl text-neutral-600 max-w-2xl leading-relaxed">
              I designed and built STEXUI — a comprehensive design system implemented
              entirely in code, serving both design and engineering.
            </p>
          </AnimateContent>
        </div>
      </section>

      {/* Architecture - Terminal style */}
      <AnimateContent>
        <section className="px-6 md:px-12 lg:px-24 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-4 text-xs text-white/40 font-mono">@stexui — package architecture</span>
              </div>
              <pre className="p-6 md:p-8 text-sm md:text-base font-mono text-white/80 overflow-x-auto">
{`@stexui/
├── react/          `}<span className="text-[#3b82f6]">→ 60+ components</span>{`
│   ├── primitives/     Button, Badge, Label, Avatar, Skeleton
│   ├── forms/          Input, Select, DatePicker, DateRangePicker
│   ├── data/           DataTable, Carousel, Breadcrumb
│   ├── feedback/       Alert, Dialog, Toast, LoadingSpinner
│   ├── navigation/     Sidebar `}<span className="text-white/40">(805 lines, 20+ subcomponents)</span>{`
│   ├── layout/         Card, Page, Sheet, Popover
│   └── specialized/    Map `}<span className="text-white/40">(Mapbox GL)</span>{`, TimeControl, ImageGallery
│
├── tailwind/       `}<span className="text-[#3b82f6]">→ Design tokens + theme config</span>{`
│   ├── tokens/         80+ color tokens in OKLCH
│   └── themes/         Light, Dark, Horizon (white-label)
│
├── utils/          `}<span className="text-[#3b82f6]">→ 12 utility modules</span>{`
│   ├── dates           Formatting, parsing, ranges
│   ├── measurements    Unit conversion, calculations
│   └── geo             Geographic calculations, bounds
│
└── hooks/          `}<span className="text-[#3b82f6]">→ 7 reusable hooks</span>{`
    ├── useIsMobile, useDebounce, useCopyToClipboard
    └── useKeyShortcut, useLocalStorage...`}
              </pre>
            </div>
          </div>
        </section>
      </AnimateContent>

      {/* Component Highlight Image */}
      <AnimateContent>
        <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto">
            <ImagePlaceholder
              aspectRatio="16/8"
              label="COMPONENT SYSTEM"
              prompt="A horizontal showcase of enterprise UI components on a dark gray (#18181b) background: a collapsible sidebar with icons and nested items on the left, a data table with column sorting/filtering and row selection in the center, and a map with colored status markers on the right. Clean, minimal, professional. Slight 3D perspective tilt. Soft shadows. No text labels needed — let the components speak. Style: high-fidelity UI design, Figma presentation quality."
            />
          </div>
        </section>
      </AnimateContent>

      {/* Deep Dive - Sidebar */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateContent>
              <div>
                <span className="text-xs tracking-widest uppercase text-neutral-400">Deep Dive</span>
                <h3 className="text-4xl md:text-5xl font-light mt-4">
                  Sidebar
                  <span className="block text-lg font-mono text-neutral-400 mt-2">805 lines · 20+ subcomponents</span>
                </h3>

                <ul className="mt-8 space-y-4">
                  <FeatureItem>Context-based state management</FeatureItem>
                  <FeatureItem>Mobile-responsive with sheet transformation</FeatureItem>
                  <FeatureItem>Cookie persistence for user preferences</FeatureItem>
                  <FeatureItem>Keyboard shortcuts (⌘B to toggle)</FeatureItem>
                  <FeatureItem>Composable sub-components: Header, Content, Group, Item, Footer...</FeatureItem>
                </ul>
              </div>
            </AnimateContent>

            <AnimateContent>
              <ImagePlaceholder
                aspectRatio="4/5"
                label="SIDEBAR COMPONENT"
                prompt="A detailed view of a collapsible sidebar UI component showing both expanded and collapsed states. Dark theme (#0a0a0a). The expanded state shows: logo area, navigation groups with icons and labels, nested items, active states with blue highlight, and a footer with user info. The collapsed state shows only icons. Include subtle tooltips and keyboard shortcut hints. Style: enterprise software, professional, minimal. Figma-quality mockup."
              />
            </AnimateContent>
          </div>
        </div>
      </section>

      {/* Design Tokens */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <AnimateContent>
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <SectionLabel>Design Tokens</SectionLabel>
                <h3 className="text-4xl md:text-5xl font-light mt-4">
                  OKLCH for perceptual uniformity.
                </h3>
                <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                  Tokens defined in CSS custom properties using the OKLCH color space —
                  ensuring consistent perceived brightness across hues for better accessibility.
                </p>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-6">
                  <ColorScale name="Primary" colors={['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554']} />
                  <ColorScale name="Success" colors={['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16']} />
                  <ColorScale name="Warning" colors={['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', '#422006']} />
                  <ColorScale name="Destructive" colors={['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a']} />
                </div>
              </div>
            </div>
          </AnimateContent>
        </div>
      </section>

      {/* Theming */}
      <AnimateContent>
        <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <ThemePreview
                name="Light"
                description="Default"
                bg="bg-white"
                accent="bg-[#3b82f6]"
                text="text-neutral-900"
              />
              <ThemePreview
                name="Dark"
                description="Low-light environments"
                bg="bg-[#0a0a0a]"
                accent="bg-[#60a5fa]"
                text="text-white"
              />
              <ThemePreview
                name="Horizon"
                description="White-label client"
                bg="bg-gradient-to-br from-sky-50 to-orange-50"
                accent="bg-gradient-to-r from-sky-500 to-orange-500"
                text="text-neutral-900"
              />
            </div>
          </div>
        </section>
      </AnimateContent>

      {/* Type-safe variants code block */}
      <AnimateContent>
        <section className="px-6 md:px-12 lg:px-24 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionLabel>Type Safety</SectionLabel>
                <h3 className="text-4xl md:text-5xl font-light mt-4">
                  Compile-time variant safety with CVA.
                </h3>
                <p className="mt-6 text-lg text-neutral-600 leading-relaxed">
                  Every component uses Class Variance Authority for type-safe styling.
                  Invalid variant combinations fail at build time, not runtime.
                </p>
              </div>

              <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <span className="text-xs text-white/40 font-mono">button.tsx</span>
                </div>
                <pre className="p-6 text-sm font-mono text-white/70 overflow-x-auto">
<code>{`const buttonVariants = cva(
  'inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        `}<span className="text-[#4ade80]">default</span>{`: 'bg-white border shadow-sm',
        `}<span className="text-[#3b82f6]">primary</span>{`: 'bg-primary text-white',
        `}<span className="text-[#ef4444]">destructive</span>{`: 'bg-destructive',
        `}<span className="text-white/40">ghost</span>{`: 'hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>
      </AnimateContent>

      {/* Governance */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Background number */}
        <div className="absolute -top-20 -left-12 text-[50vw] font-light leading-none text-white/[0.015] select-none pointer-events-none">
          02
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimateContent>
            <SectionLabel dark>Governance</SectionLabel>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mt-4 max-w-3xl">
              Adoption is harder than building.
            </h2>
          </AnimateContent>

          <AnimateContent>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              <GovernanceItem
                number="01"
                title="Pain Points First"
                description="Built components teams were already duplicating"
              />
              <GovernanceItem
                number="02"
                title="Easy Adoption"
                description="New apps inherited the full system from day one"
              />
              <GovernanceItem
                number="03"
                title="On The Roadmap"
                description="Positioned as infrastructure, not a side project"
              />
              <GovernanceItem
                number="04"
                title="Documented"
                description="API guidelines and contribution workflows"
              />
              <GovernanceItem
                number="05"
                title="Evangelized"
                description="Showed velocity improvements in team demos"
              />
            </div>
          </AnimateContent>
        </div>
      </section>

      {/* Outcome */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <AnimateContent>
            <SectionLabel>Outcome</SectionLabel>
          </AnimateContent>

          <div className="mt-12 grid lg:grid-cols-2 gap-16">
            <AnimateContent>
              <div>
                <h3 className="text-2xl font-light text-neutral-400 mb-8">Adoption</h3>
                <div className="space-y-6">
                  <OutcomeMetric value="4" label="products fully migrated" />
                  <OutcomeMetric value="6+" label="products on the roadmap" />
                  <OutcomeMetric value="100%" label="new frontend work on STEXUI" />
                </div>
              </div>
            </AnimateContent>

            <AnimateContent>
              <div>
                <h3 className="text-2xl font-light text-neutral-400 mb-8">Impact</h3>
                <ul className="space-y-4">
                  <ImpactItem>Unified UX across the entire application portfolio</ImpactItem>
                  <ImpactItem>Developers move between products without ramp-up</ImpactItem>
                  <ImpactItem>New apps start with full component library from day one</ImpactItem>
                  <ImpactItem highlight>Design-to-dev translation loss: eliminated</ImpactItem>
                </ul>
              </div>
            </AnimateContent>
          </div>
        </div>
      </section>

      {/* Learnings - Large quote style */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-neutral-100">
        <div className="max-w-7xl mx-auto">
          <AnimateContent>
            <SectionLabel>Learnings</SectionLabel>
          </AnimateContent>

          <div className="mt-16 space-y-24">
            <AnimateContent>
              <LearningQuote
                quote="Design systems are not about efficiency — they're about consistency."
                detail="The real value isn't building components faster. It's ensuring that every user touchpoint feels like the same product."
              />
            </AnimateContent>

            <AnimateContent>
              <LearningQuote
                quote="Ship in code, not in Figma."
                detail="The component library is the source of truth. Figma becomes a sketching tool, not a specification document."
              />
            </AnimateContent>

            <AnimateContent>
              <LearningQuote
                quote="Governance matters more than components."
                detail="Anyone can build a button. The hard part is getting eight teams to use the same button — and to keep using it as requirements evolve."
              />
            </AnimateContent>
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimateContent>
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-[#0a0a0a] text-white text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-white/40 text-sm tracking-widest uppercase">Want to see the code?</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-light">
              I'm building{' '}
              <a
                href="https://github.com/joakimstrandell/josui"
                className="text-[#3b82f6] hover:underline underline-offset-4"
              >
                josui
              </a>
              {' '}— same patterns, open source.
            </h2>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-white text-black hover:bg-white/90">
                <Link to="/contact">Let's connect</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                <Link to="/work">More work</Link>
              </Button>
            </div>
          </div>
        </section>
      </AnimateContent>

      <Footer />
    </Page>
  )
}

// ============================================
// Helper Components
// ============================================

function SectionLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 text-xs tracking-widest uppercase', dark ? 'text-white/40' : 'text-neutral-400')}>
      <span className={cn('w-8 h-px', dark ? 'bg-white/20' : 'bg-neutral-300')} />
      {children}
    </div>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-6 py-8 md:px-8 md:py-10 border-r border-white/10 last:border-r-0 text-center">
      <div className="text-3xl md:text-4xl font-light">{value}</div>
      <div className="text-xs md:text-sm text-white/60 mt-1 tracking-wide">{label}</div>
    </div>
  )
}

function ProblemCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="group">
      <span className="text-xs font-mono text-white/30">{number}</span>
      <h4 className="mt-2 text-lg font-medium text-white/90">{title}</h4>
      <p className="mt-1 text-sm text-white/50 leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0" />
      <span className="text-neutral-600">{children}</span>
    </li>
  )
}

function ColorScale({ name, colors }: { name: string; colors: string[] }) {
  return (
    <div>
      <span className="text-xs text-neutral-400 block mb-2">{name}</span>
      <div className="flex gap-1">
        {colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 h-10 first:rounded-l-lg last:rounded-r-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}

function ThemePreview({ name, description, bg, accent, text }: {
  name: string;
  description: string;
  bg: string;
  accent: string;
  text: string;
}) {
  return (
    <div className={cn('rounded-2xl p-6 md:p-8 h-64 flex flex-col justify-between border border-black/5', bg)}>
      <div className={cn('w-12 h-1.5 rounded-full', accent)} />
      <div>
        <h4 className={cn('text-xl font-medium', text)}>{name}</h4>
        <p className={cn('text-sm mt-1 opacity-60', text)}>{description}</p>
      </div>
    </div>
  )
}

function GovernanceItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <span className="text-[#3b82f6] font-mono text-sm">{number}</span>
      <h4 className="mt-2 text-lg font-medium">{title}</h4>
      <p className="mt-1 text-sm text-white/50">{description}</p>
    </div>
  )
}

function OutcomeMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-5xl md:text-6xl font-light text-[#3b82f6]">{value}</span>
      <span className="text-neutral-600">{label}</span>
    </div>
  )
}

function ImpactItem({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 text-[#3b82f6]">→</span>
      <span className={highlight ? 'font-medium text-neutral-900' : 'text-neutral-600'}>{children}</span>
    </li>
  )
}

function LearningQuote({ quote, detail }: { quote: string; detail: string }) {
  return (
    <div className="max-w-4xl">
      <blockquote className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-neutral-900">
        "{quote}"
      </blockquote>
      <p className="mt-6 text-lg text-neutral-500 max-w-2xl">{detail}</p>
    </div>
  )
}

function ImagePlaceholder({ aspectRatio, label, prompt }: { aspectRatio: string; label: string; prompt: string }) {
  return (
    <div
      className="bg-neutral-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300 p-8"
      style={{ aspectRatio }}
    >
      <div className="text-center max-w-lg">
        <div className="text-4xl mb-4">🖼️</div>
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{label}</p>
        <p className="mt-4 text-xs text-neutral-400 leading-relaxed">{prompt}</p>
      </div>
    </div>
  )
}
