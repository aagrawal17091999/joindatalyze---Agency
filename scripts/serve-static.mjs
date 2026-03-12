/**
 * Production static file server for pre-rendered SPA.
 *
 * Serves pre-rendered HTML from dist/ with proper directory index
 * resolution, then falls back to dist/index.html for client-side
 * routing (non-pre-rendered routes).
 *
 * Usage: node scripts/serve-static.mjs [--port 4173] [--host 0.0.0.0]
 */
import express from 'express';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const hostIdx = args.indexOf('--host');
const PORT = portIdx !== -1 ? Number(args[portIdx + 1]) : 4173;
const HOST = hostIdx !== -1 ? args[hostIdx + 1] : '0.0.0.0';

const app = express();

// Serve static assets (JS, CSS, images, etc.) with caching
app.use(
  express.static(DIST, {
    extensions: ['html'],
    index: 'index.html',
    maxAge: '1y',
    setHeaders(res, filePath) {
      // Don't cache HTML files — they may be updated on rebuild
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// SPA fallback: for any request that didn't match a static file,
// serve the root index.html so React Router can handle it client-side.
app.get('/{*splat}', (_req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(join(DIST, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Static server running at http://${HOST}:${PORT}`);
});
