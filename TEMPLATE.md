# Template Setup Guide

> **Delete this file after completing setup.**

This repo was created from the product template. Follow these steps once after cloning.

---

## Step 1 — Choose your frontend stack

The template ships both Vite and Next.js. **Keep one, delete the other.**

**Option A — Vite (static frontend, simpler deploy)**
```bash
rm -rf packages/clients/web-next
```
Also remove from `pnpm-workspace.yaml`:
```yaml
# Delete this line:
- 'packages/clients/web-next'
```
And from `tsconfig.base.json` references, remove:
```json
{ "path": "packages/clients/web-next" }
```

**Option B — Next.js (SSR/SSG, PM2 deploy on server)**
```bash
rm -rf packages/clients/web-vite
```
Same cleanup in `pnpm-workspace.yaml` and `tsconfig.base.json`.

---

## Step 2 — Rename `@app` to your product scope

Pick a short scope name for your product. Examples: `@myapp`, `@dashboard`, `@billing`.

```bash
# Find all occurrences (dry run first)
grep -r "@app/" . \
  --include="*.json" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.mjs" \
  --include="*.cjs" \
  --include="*.md" \
  -l

# Replace (macOS sed requires '' after -i)
find . \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.md" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  -exec sed -i '' 's/@app\//@YOUR_SCOPE\//g' {} +
```

Also rename the root `"name": "app"` in `package.json` to your product name.

---

## Step 3 — Repository naming conventions

| Item | Convention | Example |
|------|-----------|---------|
| Repository name | `kebab-case` | `payments-platform`, `booking-tool` |
| Package scope | `@kebab-case/` | `@payments-platform/shared-types` |
| Branch: production | `main` | |
| Branch: integration | `dev` | |
| Feature branches | `feature/<slug>` | `feature/user-onboarding` |
| Fix branches | `fix/<slug>` | `fix/auth-token-expiry` |
| Release tags | SemVer | `v0.1.0`, `v1.0.0` |

---

## Step 4 — Design palette

In both Tailwind configs (`packages/clients/web-*/tailwind.config.ts`), replace the `brand` color palette with your product colors:

```typescript
colors: {
  brand: {
    50:  "#your-lightest",
    // ...
    900: "#your-darkest",
  },
}
```

---

## Step 5 — Environment variables

```bash
cp .env.example .env
# Fill in: JWT_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ALLOWED_ORIGINS
```

---

## Step 6 — First run

```bash
pnpm install
pnpm check:all   # must pass before any code is written
pnpm dev:full
```

---

## Step 7 — Keeping the template in sync

If the template receives tooling/security updates you want to pull in:

```bash
git remote add template <template-repo-url>
git fetch template
# Cherry-pick specific commits or compare manually
git cherry-pick <commit-hash>
```

---

## Step 8 — Delete this file

```bash
rm TEMPLATE.md
git add . && git commit -m "chore: complete template setup"
```
