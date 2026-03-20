// PM2 ecosystem config — used when deploying Next.js on a single DigitalOcean instance.
// This runs both the Express API and the Next.js server as managed processes.
//
// Usage:
//   pm2 start ecosystem.config.cjs --env production
//   pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./packages/server",
      script: "node",
      args: "dist/index.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Restart if memory exceeds 500 MB
      max_memory_restart: "500M",
      // Keep one old instance alive during reload
      instances: 1,
      exec_mode: "fork",
    },
    {
      name: "web",
      cwd: "./packages/clients/web-next",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env_production: {
        NODE_ENV: "production",
        // Express API URL (same server, internal call)
        API_URL: "http://localhost:3000",
      },
      max_memory_restart: "500M",
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
