# Shoply — Frontend

Premium single-vendor ecommerce storefront (React 19 + Vite + Tailwind CSS v4). JavaScript/JSX only — no TypeScript.

## Quickstart

```bash
npm install
npm run dev      # http://localhost:5173 (strict port, /api proxied to :8080)
npm run build    # production build → dist/
npm run lint     # oxlint
npm run preview  # serve the production build locally
```

Ports: frontend **5173**, backend **8080** (not yet built), MySQL **3306** — see `docs/DEVELOPMENT_SETUP.md` §9.

## Project documentation (source of truth)

| Doc | Purpose |
|---|---|
| `docs/PROJECT_PLANNING.md` | Scope, catalog structure, milestones |
| `docs/SRS.md` | Functional/non-functional requirements |
| `docs/USER_FLOWS.md` | Flows + 35-page route inventory |
| `docs/UI_UX_DESIGN_SPEC.md` | Design system, tokens, component specs |
| `docs/SYSTEM_ARCHITECTURE.md` | Frontend/backend architecture |
| `docs/DATABASE_DESIGN.md` | Schema |
| `docs/API_DOCUMENTATION.md` | REST contract |
| `docs/DEVELOPMENT_SETUP.md` | Environment, ports, env vars, troubleshooting |

## Structure

```
src/
├── assets/            # static assets
├── components/
│   ├── common/        # Logo, SectionHeading, ProductCard
│   ├── layout/        # AnnouncementBar, Navbar, Footer
│   └── ui/            # Button, Container, Icon
├── data/              # static content (navigation)
├── hooks/             # useScrolled
├── layouts/           # MainLayout (storefront shell)
├── pages/             # route components
├── routes/            # router config
├── styles/            # tokens.css (design system), base.css, index.css
└── utils/             # cn, format
```
