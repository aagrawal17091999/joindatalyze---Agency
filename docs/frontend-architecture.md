# Frontend architecture (React SPA)

The frontend is a **single-page application** built with React, React Router, and Vite. There are no separate `.html` pages; all screens are React components.

## Entry and routing

- **`index.html`** — Single shell: `<div id="root">` and `<script src="/src/main.jsx">`.
- **`src/main.jsx`** — Renders the app inside `BrowserRouter` and `AuthProvider`.
- **`src/App.jsx`** — Defines all routes and wraps them in `Layout` (header + footer + main content).

## Directory layout

```
src/
├── main.jsx              # Entry: ReactDOM, BrowserRouter, AuthProvider
├── App.jsx               # Routes and Layout wrapper
├── config.js             # Firebase and env (VITE_*)
├── styles.css            # Global styles
├── components/
│   ├── Layout.jsx        # Page shell: Header + main + Footer
│   ├── Header.jsx        # Logo + nav links (React Router <Link>)
│   └── Footer.jsx        # Brand, nav groups, legal links
├── context/
│   └── AuthContext.jsx   # Firebase Auth state, signIn/signUp, postEvent
├── data/
│   └── caseStudies.js    # caseStudyList (gallery), caseStudyBySlug (detail)
└── pages/
    ├── Home.jsx
    ├── About.jsx
    ├── Services.jsx
    ├── Tools.jsx
    ├── CaseStudies.jsx   # List; links to /case-studies/:slug
    ├── CaseStudy.jsx     # Detail by slug from URL
    ├── Resources.jsx
    ├── FAQs.jsx
    ├── Contact.jsx
    ├── SignIn.jsx
    └── SignUp.jsx
```

## Routes (URLs)

| Path | Page component |
|------|-----------------|
| `/`, `/index` | Home |
| `/about` | About |
| `/services` | Services |
| `/tools` | Tools |
| `/case-studies` | CaseStudies (list) |
| `/case-studies/:slug` | CaseStudy (e.g. copyfy, foriio) |
| `/resources` | Resources |
| `/faqs` | FAQs |
| `/contact` | Contact |
| `/signin` | SignIn |
| `/signup` | SignUp |

“Book Audit” in the header links to `/contact`.

## Auth

- **AuthContext** wraps the app and provides `user`, `signIn`, `signUp`, `postEvent`.
- Sign In and Sign Up pages use Firebase (email/password) and optional `?tool=...` for tool-specific redirects.
- Config and env: `src/config.js` and root `.env` (e.g. `VITE_FIREBASE_*`, `VITE_CLOUD_FUNCTIONS_BASE_URL`).

## Static assets

- **`/logos/`** — Case study and partner logos (in project root `logos/`; Vite serves from `public/` if you put them there, or reference from root).
- **`/images/`**, **`/teck_stack/`** — Other images; ensure paths match how Vite serves `public/` or existing structure.

## Removing legacy HTML

Legacy multi-page HTML has been removed:

- Root: `about.html`, `services.html`, `case-studies.html`, `contact.html`, `faqs.html`, `resources.html`, `tools.html`, `signin.html`, `signup.html`, `auth.html` — **deleted** (replaced by React routes).
- **`case-studies/**/*.html`** — **deleted**; case study content is driven by `src/data/caseStudies.js` and `CaseStudy.jsx`.
- **`src/main.js`**, **`src/auth.js`**, **`src/components/footer.js`** — **deleted**; replaced by `main.jsx`, `AuthContext.jsx`, and `Footer.jsx`.

Only **`index.html`** at the project root remains as the SPA entry.
