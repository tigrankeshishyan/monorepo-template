<!-- Owner: maintainer | Review: quarterly | Last updated: YYYY-MM -->

# Setup

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 10 | `npm i -g pnpm` |
| Supabase CLI | latest | `brew install supabase/tap/supabase` |

## 1. Clone & rename

```bash
git clone <your-repo-url> my-product
cd my-product
```

Follow [TEMPLATE.md](../TEMPLATE.md) to rename `@app` to your scope.

## 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

- `JWT_SECRET` — at least 32 random characters
- `SUPABASE_URL` — from your Supabase project dashboard
- `SUPABASE_ANON_KEY` — from Supabase → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase → Settings → API (keep secret)
- `ALLOWED_ORIGINS` — comma-separated client URLs (e.g. `http://localhost:5173`)

## 3. Install dependencies

```bash
pnpm install
```

## 4. Run database migrations

```bash
# Using Supabase CLI (recommended)
supabase db push

# Or directly with psql
psql "$DATABASE_URL" -f packages/shared/db/migrations/001_users.sql
```

## 5. Validate everything compiles

```bash
pnpm check:all
```

All steps must pass before starting development.

## 6. Start development

```bash
pnpm dev:full
# Server → http://localhost:3000
# Web    → http://localhost:5173  (Vite)  OR  http://localhost:3001  (Next)
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Missing required environment variable: SUPABASE_URL` | `.env` file not loaded or variable missing |
| `JWT_SECRET must be at least 32 characters` | Replace placeholder in `.env` with a real secret |
| TypeScript errors after install | Run `pnpm type-check:all` to see all errors with context |
| Port already in use | Change `PORT` in `.env` or kill the conflicting process |
