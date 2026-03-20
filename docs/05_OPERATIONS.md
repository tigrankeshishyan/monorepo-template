<!-- Owner: maintainer | Review: quarterly | Last updated: YYYY-MM -->

# Operations

## Starting services

```bash
# Development (all packages concurrently)
pnpm dev:full

# Production (Next.js path)
pm2 start ecosystem.config.cjs --env production

# Production (Vite path — only API server needed)
pnpm --filter @app/server start
```

## Health check

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

## Checking logs

```bash
# PM2 logs (Next.js path)
pm2 logs api
pm2 logs web
pm2 logs --lines 200  # last 200 lines all processes

# Node process (Vite path, plain)
journalctl -u app-api -f   # if running as systemd service
```

## Restarting services

```bash
# PM2
pm2 restart api
pm2 restart web
pm2 restart all

# Zero-downtime reload (Next.js)
pm2 reload web
```

## Rotating secrets

1. Generate a new `JWT_SECRET` (min 32 chars)
2. Update in production environment
3. Restart API: `pm2 restart api`
4. All existing JWTs will be invalidated — users must log in again

## Updating the app

```bash
git pull origin main
pnpm install
pnpm build:all
pm2 restart all   # or reload for zero-downtime
```

## Monitoring

- Set up uptime monitoring (e.g., Uptime Robot) on `/health`
- Set alerts at > 90% memory on PM2 (`max_memory_restart` is preset to 500 MB)
- Review PM2 logs weekly for recurring errors
