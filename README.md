# Product Template

A production-ready monorepo starter for full-stack Node.js products.

**Stack:** Node 20 · TypeScript · Express · Supabase · Vite or Next.js · Tailwind CSS · pnpm workspaces · Husky

---

## What's included

```
packages/
  shared/
    types/   → @app/shared-types  Enums, interfaces, utility types
    utils/   → @app/shared-utils  Logger, retry, helpers
    db/      → @app/shared-db     Supabase client, auth, DatabaseManager, migrations
  server/    → @app/server        Express API (health, auth, JWT middleware)
  clients/
    web-vite/ → @app/web-vite     Vite + React 18 + Tailwind (delete if using Next)
    web-next/ → @app/web-next     Next.js 14 + Tailwind (delete if using Vite)
```

**Quality gates wired out of the box:**
- Husky pre-push hook runs `pnpm check:all` (format → lint → typecheck → build)
- ESLint with `no-explicit-any` as error
- Prettier with consistent formatting
- Full TypeScript strict mode

**Supabase full baseline:**
- Typed DB client with env validation at startup
- `DatabaseManager` singleton with health check
- JWT helpers (`signToken`, `verifyToken`)
- Supabase session validation
- SQL migration: `users` + `profiles` tables with RLS

---

## Using this template

1. Click **"Use this template"** on GitHub
2. Clone your new repo
3. Read [TEMPLATE.md](./TEMPLATE.md) and complete setup
4. Delete `TEMPLATE.md` when done

Full setup guide → [docs/01_SETUP.md](./docs/01_SETUP.md)

---

## Quick start (after setup)

```bash
pnpm install
cp .env.example .env   # fill in values
pnpm check:all         # must pass
pnpm dev:full          # server + web
```

---

## Scripts

| Script | What it does |
|--------|-------------|
| `pnpm dev:full` | Start server + web client concurrently |
| `pnpm check:all` | format → lint:fix → type-check:all → build:all |
| `pnpm type-check:all` | TypeScript check all packages |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm format` | Prettier format all source |
| `pnpm build:all` | Build all packages |
| `pnpm clean` | Remove all dist/ and node_modules/ |

---

## Docs

- [Start Here](./docs/00_START_HERE.md)
- [Setup](./docs/01_SETUP.md)
- [Architecture](./docs/02_ARCHITECTURE.md)
- [Development](./docs/03_DEVELOPMENT.md)
- [Deployment](./docs/04_DEPLOYMENT.md)
- [Operations](./docs/05_OPERATIONS.md)

---

## License

MIT
