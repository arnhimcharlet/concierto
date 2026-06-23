# Concierto — AGENTS.md

## Project overview

Demo ticket selling platform (Ticketmaster/LiveNation clone). Dual-DB architecture:
**Upstash Redis** for the virtual queue (high-throughput, non-relational) and **Supabase
PostgreSQL** for tickets/orders/users/events (relational, ACID).

## Stack

- **Next.js 16.2.9** (App Router) — Turbopack is the default bundler
- **React 19.2.4**
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **shadcn/ui v4** (`base-nova` style) — components in `src/components/ui/`
- **Supabase** (auth + postgres + storage)
- **Upstash Redis** (HTTP-based, serverless)
- **Framer Motion** — animations
- **lucide-react** — icons
- **Radix UI** — headless primitives
- **next-themes** — dark/light mode

## Key Next.js 16 quirks (not in training data)

- **`middleware.ts` renamed to `proxy.ts`** — named export is `proxy`, not `middleware`.
  Config flags: `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.
- **All Request APIs are async** — `params`, `searchParams`, `cookies()`, `headers()`,
  `draftMode()` are Promises. No sync fallback. Always `await`.
- **Turbopack is default** — do NOT pass `--turbopack` flag. Use `--webpack` to opt out.
- **`revalidateTag` requires 2nd argument** — e.g. `revalidateTag('posts', 'max')`.
- React 19.2: View Transitions, `useEffectEvent`, `Activity`.
- Local docs at `node_modules/next/dist/docs/` — check there for API uncertainty.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config: `eslint.config.mjs`) |
| `npm run start` | Production server |
| `npx shadcn@latest add <component>` | Add shadcn/ui component |

No test or typecheck scripts defined. No CI/CD.

## Paths

- `@/*` → `src/*`
- `src/app/` — pages and API routes (App Router)
- `src/components/` — React components
- `src/components/ui/` — shadcn/ui components
- `src/lib/` — utilities, types, clients (supabase, redis, queue)
- `src/hooks/` — custom React hooks
- `src/providers/` — React context providers

## Architecture rules

- **Queue operations go through Redis** (join, position, status, turn notification).
- **All persisted data goes through Supabase** (events, seats, orders, users).
- **Max 2 tickets per account**, must be adjacent seats.
- **Queue opens 10 min before on-sale time**. 15-min purchase window once inside.
- Redis sorted sets (`ZADD queue:{eventId}`) for FIFO queue positions. SSE or polling
  for real-time position updates.

## State

All pages, components, API routes, and utilities implemented. Build passes (22 routes).
Dev server starts on `localhost:3000`. No git repo.

## Known shadcn/ui v4 differences (base-ui, not Radix)

- `Select` `onValueChange` callback receives `(value: string | null, details) => void`
  — wrap with `(v) => v && setState(v)` if state doesn't accept null.
- `DropdownMenuTrigger` and `DropdownMenuItem` have no `asChild` prop —
  use `onClick` or inline styling instead of wrapping buttons/links.
- `@base-ui/react/menu` — Item renders as a default element, use `router.push()` for navigation.
