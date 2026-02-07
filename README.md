# Datalyze

Marketing site and app for Datalyze (analytics & growth). Vite + Tailwind frontend; Node/Express API in `server/` with MySQL and Firebase Auth.

## Quick start

**Frontend**
```bash
npm install
npm run dev
```
Open **http://localhost:5173**. Copy `.env.example` to `.env` and set Firebase (and optional `VITE_API_BASE_URL`) if using auth or the contact API.

**Backend**
```bash
cd server
cp .env.example .env
# Edit .env: DATABASE_URL (or MYSQL_*), Firebase, CORS_ORIGINS
npm install
npm run db:create   # if needed
npm run migrate
npm run dev
```
API: **http://localhost:4040**. See [server/README.md](server/README.md) and [docs/backend-setup.md](docs/backend-setup.md).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend) |
| `npm run build` | Build static assets to `dist/` |
| `npm run preview` | Preview production build |

## Structure

- **Root** — Single `index.html` (SPA shell), Vite + Tailwind config.
- **src/** — React SPA: `main.jsx` entry, `App.jsx` routes, `components/` (Layout, Header, Footer), `pages/` (one component per route), `context/AuthContext.jsx`, `data/caseStudies.js`. No legacy `.html` pages; all routes are React components.
- **server/** — Express API, Sequelize, MySQL, Firebase Admin; migrations in `server/migrations/`.
- **docs/** — [backend-setup.md](docs/backend-setup.md), [platform-setup.md](docs/platform-setup.md), [frontend-architecture.md](docs/frontend-architecture.md).

## Deploy (static)

Build with `npm run build` and deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.). Node 18+ required for build.
