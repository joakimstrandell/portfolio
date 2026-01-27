# Claude Code Instructions

Project-specific instructions for Claude Code when working on this portfolio.

## Project Overview

Personal portfolio site built with TanStack Start (file-based routing on Vite).

## Key Architecture Decisions

- **TanStack Start** over Next.js: Chosen to resolve Turbopack symlink issues with local `@josui/*` packages
- **File-based routing**: Routes in `src/routes/` using `createFileRoute`
- **No MDX**: Work posts are plain React components (simpler, no build complexity)
- **Local packages**: `@josui/*` packages linked via `link:` protocol from sibling directory

## File Conventions

### Routes
- Root layout: `src/routes/__root.tsx`
- Pages use `createFileRoute('/path')` pattern
- Route metadata via `head` property in route config

### Components
- Shared components in `src/components/`
- UI primitives in `src/components/ui/`
- Use `'use client'` directive only when needed (hooks, browser APIs)

### Styling
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Global styles in `src/styles/globals.css`
- Custom colors: `strategy-*`, `design-*`, `engineering-*`

## Important Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + TanStack Start config |
| `src/router.tsx` | Router setup with `getRouter` export |
| `src/routeTree.gen.ts` | Auto-generated (don't edit manually) |
| `tailwind.config.js` | Tailwind configuration |

## Common Tasks

### Adding a new page
1. Create `src/routes/[name].tsx`
2. Export `Route` using `createFileRoute('/[name]')`
3. Route tree auto-regenerates on dev server

### Using Links
```tsx
import { Link } from '@tanstack/react-router'
<Link to="/about">About</Link>
<Link to="/about" hash="experience">Experience</Link>
```

### Page metadata
```tsx
export const Route = createFileRoute('/page')({
  component: Page,
  head: () => ({
    meta: [
      { title: 'Page Title' },
      { name: 'description', content: '...' },
    ],
  }),
})
```

## Dependencies

### Local (linked)
- `@josui/react` - UI components (Button, etc.)
- `@josui/tailwind` - Tailwind preset
- `@josui/tokens` - Design tokens

### Key packages
- `@tanstack/react-router` - Routing
- `@tanstack/react-start` - SSR framework
- `gsap` - Animations
- `@react-three/fiber` - 3D effects

## Known Issues

- `asChild` prop on Button shows React warning - type issue in @josui/react, works at runtime
- TypeScript errors about `asChild` - same root cause, can be ignored

## Don't

- Don't manually edit `src/routeTree.gen.ts`
- Don't use `next/link` or `next/image` (project migrated from Next.js)
- Don't add vinxi - project uses Vite directly
