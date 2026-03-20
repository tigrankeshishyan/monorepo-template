# Product Template — GitHub Copilot Instructions

`AGENTS.md` is the canonical repo-local workflow guide. Keep this file aligned with it.

## Code Standards

### Shared Components & Utilities

- Always import utilities and helpers from `@app/shared-utils` instead of creating duplicates
- Always import types and enums from `@app/shared-types` instead of creating duplicates
- Always import database utilities from `@app/shared-db` instead of creating duplicates
- Create reusable components and utilities in shared packages; avoid repeating code across packages
- Never create custom implementations when shared helpers already exist

### File Size Limits

- **React Components**: Maximum 300 lines. If exceeded, split into smaller components
- **General Files**: Maximum 300 lines without type declarations; 400 lines with substantial type declarations
- When a file exceeds limits, create a folder with a main entrypoint and separate files per responsibility

### Chunk-First Delivery (MANDATORY)

- Implement work in **small, testable chunks** instead of large one-shot rewrites
- Preferred split pattern per feature:
  - `types.ts` — local contracts
  - `validators.ts` — input checks
  - `execution.ts` — side effects / API calls
  - `*.ts` — thin orchestrator that composes the small modules
- Run `pnpm --filter <pkg> run type-check` after each chunk before moving on

### Component Guidelines

- Mobile-first: components must look good on small screens
- Follow the existing design system and Tailwind config palette tokens
- Use Tailwind CSS classes consistently; never mix with inline styles for layout

### Type Safety

- **NEVER use `eslint-disable-next-line @typescript-eslint/no-explicit-any`**
- Always find the proper type; if it doesn't exist, create it in `@app/shared-types`
- Last resort: `Record<string, unknown>` or a specific interface — never raw `any`

### Error Handling

- Validate inputs at system boundaries (routes, external API responses)
- Always handle partial failures — one operation failing should not crash the whole flow

### Code Style

- Maintain original coding style when modifying existing code
- Use `async/await`; no `.then()/.catch()` chains
- Use enums from `@app/shared-types` instead of string literals
- NO underscore prefix for unused params — use all params or remove them

### TODO Comments

- Always add `// TODO: ...` for improvements, temporary code, hard-coded values, and missing edge cases

## Imports

**ALWAYS use package imports, never relative paths across packages:**

```typescript
// ✅ CORRECT
import { createLogger } from "@app/shared-utils";
import { Status, UserRole } from "@app/shared-types";
import { getDatabaseManager } from "@app/shared-db";

// ❌ WRONG
import { logger } from "../../../utils/logger";
```

## Logging

```typescript
import { createLogger } from "@app/shared-utils";

const logger = createLogger("ComponentName");
logger.info("Message", { data });
logger.error("Error message", error);
logger.warn("Warning", { context });
logger.debug("Debug info", { details });
```

## Types & Enums

```typescript
import { Status, UserRole } from "@app/shared-types";

// Use enums, not strings
const status: Status = Status.ACTIVE; // ✅
const status = "ACTIVE"; // ❌
```

## Package Dependencies

```json
{
  "dependencies": {
    "@app/shared-utils": "workspace:*",
    "@app/shared-types": "workspace:*",
    "@app/shared-db": "workspace:*"
  }
}
```

## Quality Checks

- **Run `pnpm check:all` BEFORE finishing any task**
  - This runs: format → lint:fix → type-check:all → build:all
  - Fix ALL issues before considering work complete
- During implementation, run **package-scoped checks per chunk**: `pnpm --filter <pkg> run type-check`

## Documentation

- Update docs when making significant changes
- **Never create MD files summarizing work done** — no completion summaries
- **No end-of-completion comments** in code

## Project Structure

```
packages/
  shared/
    types/   → @app/shared-types  (enums, interfaces, generic utilities)
    utils/   → @app/shared-utils  (logger, retry, delay, helpers)
    db/      → @app/shared-db     (Supabase client, DatabaseManager, auth, migrations)
  server/    → @app/server        (Express API, routes, middleware)
  clients/
    web-vite/ → @app/web-vite     (Vite + React — delete if using Next)
    web-next/ → @app/web-next     (Next.js — delete if using Vite)
```

### Before Making Changes

1. Does this use shared packages correctly (`@app/...`)?
2. Are imports using package names, not relative paths?
3. Is error handling comprehensive?
4. Is logging consistent?
5. Are types from `@app/shared-types`?
6. Is the file within size limits?
7. Can any repetitive code be moved to a shared package?
