/**
 * Post-build prerendering script.
 * Spins up vite preview, visits each route with Puppeteer,
 * and saves the fully-rendered HTML back to dist/.
 */
import { execSync, spawn } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// Import route list — since it's an ES module with no JSX, we can import directly
const { prerenderRoutes } = await import('../src/prerender-routes.js');

const PORT = 4173; // vite preview default

// Start vite preview server
console.log('Starting preview server...');
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--open', 'false'], {
  cwd: ROOT,
  stdio: 'pipe',
  env: { ...process.env, VITE_NO_OPEN: '1' },
});

// Wait for server to be ready
await new Promise((resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('Server start timeout')), 15000);
  server.stdout.on('data', (data) => {
    const msg = data.toString();
    if (msg.includes('Local:') || msg.includes('http://')) {
      clearTimeout(timeout);
      resolve();
    }
  });
  server.stderr.on('data', (data) => {
    const msg = data.toString();
    // vite preview sometimes logs to stderr
    if (msg.includes('Local:') || msg.includes('http://')) {
      clearTimeout(timeout);
      resolve();
    }
  });
  server.on('error', (err) => {
    clearTimeout(timeout);
    reject(err);
  });
});

console.log(`Preview server running on port ${PORT}`);

// Launch Puppeteer
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

let success = 0;
let failed = 0;

for (const route of prerenderRoutes) {
  try {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;
    console.log(`Prerendering: ${route}`);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the prerender-ready event (dispatched by App.jsx useEffect)
    // If the app already rendered, the event already fired, so also check if root has content
    await page.waitForFunction(
      () => document.getElementById('root')?.children.length > 0,
      { timeout: 10000 }
    );

    // Small delay to ensure helmet tags are in <head>
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => {});

    const html = await page.content();
    await page.close();

    // Write to dist/<route>/index.html
    const outDir = route === '/' ? DIST : join(DIST, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
    success++;
    console.log(`  -> Saved ${route === '/' ? '/index.html' : `${route}/index.html`}`);
  } catch (err) {
    failed++;
    console.error(`  -> FAILED ${route}: ${err.message}`);
  }
}

await browser.close();
server.kill();

console.log(`\nPrerendering complete: ${success} succeeded, ${failed} failed out of ${prerenderRoutes.length} routes.`);

if (failed > 0) {
  process.exit(1);
}
