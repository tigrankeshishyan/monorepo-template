# Agent Guide

This file is the canonical repo-local workflow and refactor guide for coding agents.

## Documentation is authoritative — strictly follow it

Before changing any documented subsystem, **read the linked doc and obey every rule in it**. The docs encode production-critical invariants; ignoring them re-opens bugs.

When code or behavior changes invalidate something a doc says, **update the doc in the same change** — do not ship a code edit and leave the doc stale. Treat doc drift as a regression.

## Engineering Flow

Use an incremental, chunk-first workflow for production-safe changes:

1. Split by responsibility, not by arbitrary line counts.
2. Keep compatibility entrypoints (`index.ts` or existing re-export files) while refactoring internals.
3. Extract pure logic first (`types`, `validators`, `mappers`), then side effects (`API`, `DB`, calls), then orchestration.
4. When validation is needed, run only `pnpm check:all`.
5. Do **not** add new `*.selftest.ts` files or other ad-hoc selftest runners unless the user explicitly asks. This repo validates via `pnpm check:all` (format, lint, type-check, build)—not agent-written selftests.

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
- Keep project documentation synchronized with behavior, configuration, and architecture: update the relevant doc when a change would confuse operators or the next agent if left undocumented. Do not treat docs as an optional follow-up.

## Documentation Authority (strict)

The files under `docs/` plus `AGENTS.md` and `README.md` are the **canonical contract** for behavior. Strictly follow them:

- Before writing or changing code, read the relevant doc section first. The doc wins over any habit, prior conversation, or local heuristic.
- If the code disagrees with the doc, fix the code to match the doc. Do not silently change documented behavior to match a buggy implementation.
- If you intentionally need to change documented behavior, update the doc in the **same** change. Code edits that contradict the docs without updating them are not done.
- When a doc is ambiguous or missing, ask before guessing, then write the clarification back into the doc so the next agent inherits it.
- “Strictly follow the docs” applies to feature behavior, naming, file layout, validation commands (`pnpm check:all`), and the rules in this file.

## Validation

- Use only `pnpm check:all` for validation. Do not substitute package-scoped checks or piecemeal commands.
- Do not treat a task as complete until `pnpm check:all` passes.
- **No new selftest files:** do not create `*.selftest.ts`, `*-selftest.ts`, or similar throwaway test scripts as part of feature work. Do not wire them into `package.json` or docs unless the user requests tests. Rely on `pnpm check:all`; if automated tests are needed, use the project’s real test setup only when one exists and the user asks for tests.

## Production completion (agents)

Every change set is treated as **production-bound**: deliver work you are confident is correct under real traffic, not “good enough for a draft.”

- **No known defects in the handoff:** fix bugs, type errors, broken UX, misleading copy or metrics, and stale docs before you stop. Do not leave “probably fine” behavior, silent partial fixes, or untested edge cases for someone else unless the user explicitly agreed to defer (then add a `// TODO` with reason).
- **Verify end-to-end for the surface you touched:** run `pnpm check:all` and address all failures; incomplete or unverified work is not complete work.
- **Docs stay true:** if behavior or configuration changed, update the relevant `docs/` section and this file in the **same** change so operators and the next agent are not misled.
- **Prefer honesty over polish:** remove or relabel UI that cannot be correct without missing data (e.g. a progress bar with the wrong denominator) rather than shipping a pretty but wrong chart.

## Code Hygiene (Critical)

- Do not leave dead code when implementing requested changes.
- If behavior is replaced, remove the old implementation instead of appending a parallel/new section that duplicates the same responsibility.
- Avoid temporary compatibility layers unless explicitly requested by the user or required for a staged migration.
- Keep a single canonical implementation path for each responsibility to reduce drift, size growth, and hidden bugs.

## TODO Policy

- Always add `TODO` comments for unfinished work and known follow-up improvements.
- Add `TODO` comments when you find code that should be improved but is out of the current task scope.
- Use clear, actionable wording with brief reason/context.
- Format: `// TODO: <what needs improvement and why>`
