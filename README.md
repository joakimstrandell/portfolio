# Portfolio

Personal portfolio site for Joakim Strandell, built with [TanStack Start](https://tanstack.com/start) and [Tailwind CSS](https://tailwindcss.com).

## Tech Stack

- **Framework:** TanStack Start (Vite + TanStack Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** [@josui/react](../josui/packages/react) (local linked package)
- **Animations:** GSAP with ScrollTrigger
- **3D:** React Three Fiber (for visual effects)
- **Font:** Roboto Mono (via Fontsource)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Local [@josui](../josui) monorepo (for linked packages)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm start
```

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── ui/          # Base UI components (Button, Accordion)
│   ├── Header.tsx   # Site header with navigation
│   ├── Footer.tsx   # Site footer
│   ├── Grid.tsx     # Canvas-based grid background
│   └── ...
├── routes/          # TanStack Router file-based routes
│   ├── __root.tsx   # Root layout
│   ├── index.tsx    # Home page (/)
│   ├── about.tsx    # About page (/about)
│   ├── contact.tsx  # Contact page (/contact)
│   └── work/
│       └── index.tsx # Work listing (/work)
├── styles/
│   └── globals.css  # Global styles and Tailwind config
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── router.tsx       # Router configuration
└── routeTree.gen.ts # Auto-generated route tree
```

## Local Package Dependencies

This project uses locally linked packages from the `@josui` monorepo:

```json
{
  "@josui/core": "link:../josui/packages/core",
  "@josui/core-web": "link:../josui/packages/core-web",
  "@josui/react": "link:../josui/packages/react",
  "@josui/tailwind": "link:../josui/packages/tailwind",
  "@josui/tokens": "link:../josui/packages/tokens"
}
```

Ensure the josui monorepo is available at `../josui` relative to this project.

## Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `pnpm dev`    | Start development server  |
| `pnpm build`  | Build for production      |
| `pnpm start`  | Preview production build  |
| `pnpm lint`   | Run ESLint                |
| `pnpm format` | Format code with Prettier |
