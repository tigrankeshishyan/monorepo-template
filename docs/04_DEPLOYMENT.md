<!-- Owner: maintainer | Review: on deploy change | Last updated: YYYY-MM -->

# Deployment

## Choice A — Vite (static hosting)

Vite produces a fully static bundle — no server process needed for the frontend.

```bash
# Build
pnpm --filter @app/web-vite run build
# Output: packages/clients/web-vite/dist/

# Deploy dist/ to any static host:
# - Vercel: connect repo, set output directory to packages/clients/web-vite/dist
# - Netlify: same
# - DigitalOcean Spaces + CDN: upload dist/ contents
```

The Express API still runs as a Node process on your server.

## Choice B — Next.js + PM2 on DigitalOcean

Both the Express API and the Next.js server run on a single droplet managed by PM2.

### Build

```bash
pnpm --filter @app/server run build
pnpm --filter @app/web-next run build
```

### Start with PM2

```bash
# First time
npm install -g pm2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup   # follow the printed command to enable startup on reboot
```

### Nginx (reverse proxy, recommended)

Configure nginx on the droplet to route traffic:

```nginx
# /etc/nginx/sites-available/app
server {
  listen 80;
  server_name yourdomain.com;

  # Next.js web app
  location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # Express API
  location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

Then run: `certbot --nginx -d yourdomain.com` for HTTPS.

### Environment variables in production

Do **not** commit `.env`. On the droplet, set variables via:

```bash
# /etc/environment  or  ~/.profile  or  pm2 env
export SUPABASE_URL=...
export SUPABASE_SERVICE_ROLE_KEY=...
export JWT_SECRET=...
```

## Pre-deployment checklist

- [ ] `pnpm check:all` passes locally
- [ ] `.env` is not committed (check `.gitignore`)
- [ ] Database migrations are run in the target environment
- [ ] `ALLOWED_ORIGINS` contains the production frontend URL
- [ ] `JWT_SECRET` is a strong random value (not the example placeholder)
- [ ] PM2 process list shows both `api` and `web` as `online` (Next.js only)
