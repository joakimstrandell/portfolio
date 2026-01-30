# Claude Code Instructions

Project-specific instructions for Claude Code when working on this portfolio.

## Project Overview

Personal portfolio site built with TanStack Start (file-based routing on Vite).

## Key Architecture Decisions

- **TanStack Start** over Next.js: Chosen to resolve Turbopack symlink issues with local `@josui/*` packages
- **File-based routing**: Routes in `src/routes/` using `createFileRoute`
- **No MDX**: Work posts are plain React components (simpler, no build complexity)
- **Local packages**: `@josui/*` packages linked locally in dev, installed from npm in CI (see below)

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
- Custom colors: `primary-*`, `secondary-*`, `tertiary-*`

## Important Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite + TanStack Start config |
| `src/router.tsx` | Router setup with `getRouter` export |
| `src/routeTree.gen.ts` | Auto-generated (don't edit manually) |
| `tailwind.config.js` | Tailwind configuration |
| `.pnpmfile.cjs` | Conditional local linking for @josui packages |

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

## Deployment

Hosted on Vercel. Push to `main` triggers automatic deployment.

### Commands
```bash
npx vercel list --yes              # Check deployment status
npx vercel inspect <url> --logs    # Get build logs
npx vercel deploy --prod --force   # Deploy without build cache
```

### Known deployment issues

**@josui packages resolve to stale versions:** Vercel's build cache holds old npm resolutions. The lockfile only has local link references (from `.pnpmfile.cjs`), not npm pins. Fix: deploy with `--force`.

**pnpm lockfile checksum mismatch:** `.pnpmfile.cjs` behaves differently locally (applies overrides) vs CI (no overrides), causing `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`. Fix: `vercel.json` uses `installCommand: "pnpm install --no-frozen-lockfile"`.

**After publishing new @josui versions:** Deploy with `--force` to ensure Vercel resolves the latest versions from npm.

## Dependencies

### @josui packages

The `@josui/*` packages are published on npm but linked locally during development.

**Always import from `/src`:**
```tsx
// Correct
import { cn } from '@josui/core-web/src';
import { Button } from '@josui/react/src';

// Wrong
import { cn } from '@josui/core-web';
import { Button } from '@josui/react';
```

- `@josui/core` - Core utilities
- `@josui/core-web` - Web-specific core
- `@josui/react` - UI components (Button, etc.)
- `@josui/tailwind` - Tailwind preset
- `@josui/tokens` - Design tokens

**How it works:**
- `package.json` specifies npm versions (`0.x`) in dependencies
- `.pnpmfile.cjs` defines the local link paths and checks if `../josui/packages` exists AND not in CI/Vercel:
  - **Locally**: applies the link overrides (symlinks to sibling repo)
  - **CI/Vercel**: skips overrides, installs from npm

**To add a new @josui package:**
1. Add to `dependencies` in package.json with version `0.x`
2. Add to `localOverrides` object in `.pnpmfile.cjs`

### Key packages
- `@tanstack/react-router` - Routing
- `@tanstack/react-start` - SSR framework
- `nitro` - Server deployment (required for Vercel)
- `gsap` - Animations
- `@react-three/fiber` - 3D effects

## Known Issues

- `asChild` prop on Button shows React warning - type issue in @josui/react, works at runtime
- TypeScript errors about `asChild` - same root cause, can be ignored

## Don't

- Don't manually edit `src/routeTree.gen.ts`
- Don't use `next/link` or `next/image` (project migrated from Next.js)
- Don't add vinxi - project uses Vite directly
