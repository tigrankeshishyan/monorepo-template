<!-- Owner: maintainer | Review: on architecture change | Last updated: YYYY-MM -->

# Architecture

## Package Map

```
┌─────────────────────────────────────────────────────────┐
│                        Clients                           │
│   web-vite (Vite + React)   web-next (Next.js)          │
└──────────────────────────┬──────────────────────────────┘
                           │ /api/* (proxy or rewrite)
┌──────────────────────────▼──────────────────────────────┐
│                    @app/server                           │
│         Express API · routes · middleware                │
└────────┬──────────────────┬───────────────────┬─────────┘
         │                  │                   │
┌────────▼──────┐  ┌────────▼──────┐  ┌────────▼──────┐
│ @app/shared-db│  │@app/shared-   │  │@app/shared-   │
│ Supabase,     │  │utils          │  │types          │
│ DatabaseMgr,  │  │logger, retry, │  │enums,         │
│ auth, JWT     │  │helpers        │  │interfaces     │
└───────────────┘  └───────────────┘  └───────────────┘
         │
┌────────▼──────────────────────────────────────────────┐
│                    Supabase                            │
│   PostgreSQL + Auth + Row Level Security              │
└───────────────────────────────────────────────────────┘
```

## Request lifecycle

1. Client calls `GET /api/health` (proxied in dev)
2. Express receives the request in `http-setup.ts`
3. Helmet + CORS middleware runs
4. Route handler (`routes/health.ts`) runs
5. Protected routes pass through `middleware/auth.ts` which verifies JWT
6. Handler calls `getDatabaseManager()` for DB operations
7. `DatabaseManager` uses the singleton Supabase admin client

## Auth flow

```
Client → POST /auth/login { email, password }
       ← 200 { token, user }

Client → GET /auth/me  Authorization: Bearer <token>
       ← 200 { user }   (token verified in requireAuth middleware)
```

## Shared package rules

| Package | Import from | Never do |
|---------|-------------|----------|
| `@app/shared-types` | Any package | Put runtime logic here |
| `@app/shared-utils` | Any package | Import from server-specific packages |
| `@app/shared-db` | Server only | Import from client-side code |

## Database schema

See [packages/shared/db/migrations/001_users.sql](../packages/shared/db/migrations/001_users.sql).

Current tables:
- `users` — auth identity, email, role, timestamps
- `profiles` — display_name, avatar_url (1:1 with users)

Both tables have RLS enabled. Users can only read/update their own data; admins can read all users.
