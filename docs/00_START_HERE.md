<!-- Owner: maintainer | Review: on major release | Last updated: YYYY-MM -->

# Start Here

This is a full-stack monorepo template. This file is your entry point — read it once, then follow the links.

## What's Included

| Package | Purpose |
|---------|---------|
| `@app/shared-types` | Enums, interfaces, generic TypeScript utilities |
| `@app/shared-utils` | Logger, retry, delay, error helpers |
| `@app/shared-db` | Supabase client, DatabaseManager, JWT auth, migrations |
| `@app/server` | Express API server (health, auth routes, middleware) |
| `@app/web-vite` | Vite + React + Tailwind frontend _(delete if using Next)_ |
| `@app/web-next` | Next.js + Tailwind frontend _(delete if using Vite)_ |

## Quick Links

- [Setup](./01_SETUP.md) — prerequisites, install, first run
- [Architecture](./02_ARCHITECTURE.md) — package map and data flow
- [Development](./03_DEVELOPMENT.md) — coding standards, chunk-first workflow
- [Deployment](./04_DEPLOYMENT.md) — Vite static hosting, Next.js + PM2 on DigitalOcean
- [Operations](./05_OPERATIONS.md) — starting services, env rotation, health checks

## First Steps After Cloning

1. Read [TEMPLATE.md](../TEMPLATE.md) and rename `@app` to your product scope
2. Delete the frontend package you are **not** using (`web-vite` or `web-next`)
3. Copy `.env.example` → `.env` and fill in real values
4. Run `pnpm install`
5. Run `pnpm check:all` — it must pass before any code is written
6. Start developing: `pnpm dev:full`
