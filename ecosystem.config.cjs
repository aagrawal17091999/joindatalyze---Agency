/**
 * PM2 ecosystem file – run backend and frontend together.
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
      script: 'npx',
      args: 'vite preview --open false',
      env: { NODE_ENV: 'production', BROWSER: 'none' },
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
