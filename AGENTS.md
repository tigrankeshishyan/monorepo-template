# Agent Guide

This file is the canonical repo-local workflow and refactor guide for coding agents.

## Engineering Flow

Use an incremental, chunk-first workflow for production-safe changes:

1. Split by responsibility, not by arbitrary line counts.
2. Keep compatibility entrypoints (`index.ts` or existing re-export files) while refactoring internals.
3. Extract pure logic first (`types`, `validators`, `mappers`), then side effects (`API`, `DB`, calls), then orchestration.
4. After each chunk, run package-scoped validation (`type-check`, `lint`, targeted tests when available).
5. Add or expand tests after chunking so each module is independently testable.

Preferred split pattern for new or refactored flows:

- `types.ts`
- `validators.ts`
- `execution.ts`
- `formatters.ts` or `mappers.ts`
- thin route, service, or component orchestrator file

## File Size Policy

- React components: target 300 lines max.
- General files: target 300 lines max without significant type declarations.
- General files with substantial local type declarations: target 400 lines max.

When a file exceeds the limit:

1. Create a thin compatibility entrypoint.
2. Move cohesive responsibilities into neighboring modules or a folder.
3. Prefer named helpers over inline logic when that reduces orchestration file size.

## Monorepo Rules

- Use `@app/shared-utils` for shared utilities (logger, helpers, retry).
- Use `@app/shared-types` for shared types and enums.
- Use `@app/shared-db` for database access, auth, and Supabase client.
- Use package imports across packages, never deep relative imports.
- Keep docs synchronized with major behavior and architecture changes.

## Validation

- Use targeted package checks during refactors.
- Do not treat a large one-shot rewrite as complete without validation between chunks.
- Run `pnpm check:all` before finishing any task. If it fails, you're not done.
