# Datalyze Landing Page

A Vite + TailwindCSS-powered marketing site scaffold for the Datalyze analytics & growth team. The layout is organized into clear sections (hero, growth model, tech stack, testimonials, FAQs, about, services, case studies, resources, and CTAs) so it’s easy to extend with blogs or additional pages later. The design tokens follow the shadcn/ui system with custom gradients and motion flourishes defined in `src/styles.css`.

## Getting started

```bash
npm install
npm run dev
```

- Visit the dev server output by Vite (defaults to `http://localhost:5173`).
- Edit `src/styles.css` or `index`; Vite will hot-reload changes. Tailwind picks up classes across all HTML + `src/` files via `tailwind.config.js`.

## Build for static hosting

```bash
npm run build
```

The production-ready static assets are emitted to `dist/` and can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, S3+CloudFront, etc.).

## Project structure

- `index` — Entry HTML file defining the page sections and content blocks.
- `src/main.js` — Minimal client entry that imports global styles and sets the footer year.
- `src/styles.css` — Tailwind + shadcn/ui themed globals, layout system, and component primitives (cards, grids, buttons, animations).

## Staging deployment (what you’ll need)

1. **Node 18+** on CI to run `npm install` and `npm run build`.
2. **A static host** (e.g., Netlify/Vercel/Cloudflare Pages). Configure the publish directory as `dist/` and use `npm run build` as the build command.
3. **Environment ownership**: DNS (or a temporary subdomain) pointing to the staging host plus deploy keys/API tokens for CI to publish.
4. **Optional analytics pixels**: If you want staging instrumentation, add provider snippets into `index` or wire a tag manager later.

Once those are in place, we can connect the repo to the host, add a simple CI workflow, and ship a staging URL automatically on push.
