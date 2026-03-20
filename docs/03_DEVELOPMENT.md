<!-- Owner: AI agent via AGENTS.md | Review: on tooling update | Last updated: YYYY-MM -->

# Development

This document summarizes the development workflow. The authoritative source is [AGENTS.md](../AGENTS.md).

## Daily commands

```bash
pnpm dev:full           # Start server + web client concurrently
pnpm check:all          # format → lint:fix → type-check:all → build:all (required before push)
pnpm type-check:all     # Type check all packages at once
pnpm lint:fix           # Auto-fix lint issues
pnpm format             # Auto-format all source files
pnpm clean              # Remove all dist/ and node_modules/
```

## Package-scoped commands (run during refactors)

```bash
pnpm --filter @app/server run type-check
pnpm --filter @app/shared-db run type-check
pnpm --filter @app/web-vite run type-check
```

## Chunk-first workflow

For every feature or fix:

1. Extract **types** first (`types.ts`)
2. Extract **validators** / input checks (`validators.ts`)
3. Extract **execution logic** / DB/API calls (`execution.ts`)
4. Write the **thin orchestrator** (route, service, component)
5. Run `pnpm --filter <affected-pkg> run type-check` after each step
6. Run `pnpm check:all` before opening a PR

## File size limits

| File type | Limit |
|-----------|-------|
| React component | 300 lines |
| General TS file | 300 lines |
| File with many local types | 400 lines |

When a file exceeds the limit, split it into a folder with one file per responsibility.

## Adding a new shared utility

1. Add to `packages/shared/utils/src/helpers.ts` (or a new file if it's large)
2. Export from `packages/shared/utils/src/index.ts`
3. Import via `import { ... } from "@app/shared-utils"`

## Adding a new shared type

1. Add to `packages/shared/types/src/enums.ts` (for enums) or a new file
2. Export from `packages/shared/types/src/index.ts`
3. Import via `import { ... } from "@app/shared-types"`

## Adding a new API route

1. Create `packages/server/src/routes/<feature>.ts`
2. Mount it in `packages/server/src/http-setup.ts`
3. Add auth middleware if the route is protected

## Environment variables

All env vars must be validated at startup, not at call time. Add validation in the module that uses them (e.g., `requireEnv("MY_VAR")` pattern from `shared/db/src/client.ts`).
