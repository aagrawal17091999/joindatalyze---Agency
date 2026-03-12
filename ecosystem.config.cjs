/**
 * PM2 ecosystem file – run backend and frontend together.
 * Suited for AWS Ubuntu (frontend bound to 0.0.0.0 so it’s reachable via server IP/domain).
 *
 * Usage:
 *   npm run build          # build frontend once (from repo root)
 *   pm2 start ecosystem.config.cjs
 *
 * Or start individually:
 *   pm2 start ecosystem.config.cjs --only datalyze-api
 *   pm2 start ecosystem.config.cjs --only datalyze-frontend
 */
module.exports = {
  apps: [
    {
      name: 'datalyze-api',
      cwd: './server',
      script: 'node',
      args: 'index.js',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
    {
      name: 'datalyze-frontend',
      cwd: './',
      script: 'node',
      args: 'scripts/serve-static.mjs --port 4173 --host 0.0.0.0',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
