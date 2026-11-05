# Shoply — Development Environment Setup

| Field | Value |
|---|---|
| **Project name** | Shoply |
| **Document type** | Development Environment Specification |
| **Version** | 1.0 |
| **Date** | 2026-11-04 |
| **Status** | 🟡 Draft — Awaiting stakeholder approval |
| **Author** | Senior Development Environment Engineer |
| **Sources of truth** | `docs/PROJECT_PLANNING.md` · `docs/SRS.md` · `docs/USER_FLOWS.md` · `docs/UI_UX_DESIGN_SPEC.md` · `docs/SYSTEM_ARCHITECTURE.md` · `docs/DATABASE_DESIGN.md` · `docs/API_DOCUMENTATION.md` (all approved) |
| **Host environment** | Windows 10/11 · VS Code · OpenCode · Git/GitHub |
| **Stack** | React JS · JavaScript · Tailwind CSS · Spring Boot · Java · Maven · MySQL |
| **Scope** | Environment definition only: toolchain, scaffolding plan, env vars, commands, ports, CORS, Git, troubleshooting, readiness checklist |
| **Code status** | ❌ No application code · ❌ No scaffolding applied yet — this document *specifies* the setup; every file to be created is proposed in [§13](#13-proposed-setup-changes-awaiting-approval) |

---

## Document Control

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-04 | Initial development environment specification |

**Rules governing this document:**

1. **No existing file is modified or overwritten** — the seven approved documents remain untouched; this is a new file.
2. **No ecommerce feature code** — no entities, endpoints, components, or migrations are created here. Scaffolding (project skeletons, config files) is *specified* and applied only after approval (§13).
3. **No unnecessary dependencies** — every proposed dependency in §4–§5 traces to an approved decision; alternatives are marked optional.
4. **No secrets** — every credential appears as a placeholder with a generation command; real values live only in git-ignored `.env` files (SEC-12, ARCH §18.2).
5. **Architecture and requirements unchanged** — this document configures the environment *around* the approved architecture; where the approved docs prescribe something (ports aside — they don't), they win.

---

## Table of Contents

| Task | Section |
|---|---|
| 1. Review the existing repository structure | [§1 Repository Review](#1-repository-review) |
| 2. Identify missing development setup requirements | [§1.3 Gap Analysis](#13-gap-analysis--missing-setup-requirements) |
| — Target structure | [§2 Proposed Repository Structure](#2-proposed-repository-structure) |
| — Prerequisites | [§3 Prerequisites & Toolchain](#3-prerequisites--toolchain-windows) |
| 3. Prepare the frontend setup | [§4 Frontend Setup](#4-frontend-setup) |
| 4. Prepare the backend setup | [§5 Backend Setup](#5-backend-setup) |
| — Database setup | [§6 Database Setup](#6-database-setup) |
| 5. Define environment variable requirements | [§7 Environment Variables](#7-environment-variables) |
| 6. Define local development commands | [§8 Local Development Commands](#8-local-development-commands) |
| 7. Define development ports | [§9 Development Ports](#9-development-ports) |
| 8. Define CORS requirements | [§10 CORS Requirements](#10-cors-requirements) |
| 9. Define Git configuration | [§11 Git Configuration](#11-git-configuration) |
| 10. Define troubleshooting instructions | [§12 Troubleshooting](#12-troubleshooting) |
| — Everything to be applied | [§13 Proposed Setup Changes](#13-proposed-setup-changes-awaiting-approval) |
| — Open setup decisions | [§14 ENVDEC Register](#14-unresolved-environment-decisions-envdec) |
| — Verification | [§15 Readiness Checklist](#15-readiness-checklist) |

**Additional reading:** [§1.4 Grounding](#14-grounding--what-the-approved-docs-already-decide) maps each setup decision to its source document.

---

## 1. Repository Review

### 1.1 Current state (as of 2026-11-04)

```text
e-com/
├── .git/                      ← repository initialized, history = documentation phases
└── docs/                      ← 7 approved documents (READ-ONLY source of truth)
    ├── PROJECT_PLANNING.md        52 KB
    ├── SRS.md                    160 KB
    ├── USER_FLOWS.md              84 KB
    ├── UI_UX_DESIGN_SPEC.md       83 KB
    ├── SYSTEM_ARCHITECTURE.md     71 KB
    ├── DATABASE_DESIGN.md        101 KB
    └── API_DOCUMENTATION.md       92 KB
```

**Verified:**

- ✅ Git repository exists; working tree contains only `docs/`.
- ✅ All seven approved documents present and unmodified in this session.
- ❌ **No** `frontend/`, `backend/`, `docker-compose.yml`, `.gitignore`, `.gitattributes`, `.env.example`, `README.md`, VS Code workspace config, or any code.

### 1.2 Interpretation

The repository is exactly where the plan says it should be: documentation-complete, implementation-zero (DATABASE_DESIGN §"Code status", API_DOCUMENTATION §18.2). This document defines the *first* code-bearing changes — pure environment scaffolding — so that the subsequent implementation phases start from a running, verifiable baseline (NFR-04: boot from an empty database using only migrations + seed).

### 1.3 Gap analysis — missing setup requirements

| # | Missing requirement | Why it's needed (source) | Proposed where |
|---|---|---|---|
| G1 | `.gitignore` | Secrets, build output, and volumes must never be committed (SEC-12) | §11.2 |
| G2 | `.gitattributes` | Windows CRLF/LF churn would pollute every diff | §11.3 |
| G3 | `frontend/` scaffold (Vite + React JS + Tailwind) | Storefront SPA host (ARCH §3, plan §6) | §4 |
| G4 | `backend/` scaffold (Spring Boot 3.x / Java 21 / Maven) | API host (ARCH §7, AR-DEC-01) | §5 |
| G5 | `docker-compose.yml` (MySQL 8) | Documented local baseline (ARCH §17.1) | §6.2 |
| G6 | Database users + schema bootstrap SQL | Least-privilege split: `shoply_app` DML / `shoply_migrator` DDL (SEC-19, DB §15) | §6.3 |
| G7 | `.env.example` (backend + frontend) | Committed placeholders; real `.env` ignored (ARCH §18.2) | §7.3 |
| G8 | Local env-var loader (PowerShell wrapper) | Windows has no `.env` auto-load for `mvn` | §7.4 |
| G9 | VS Code extensions + workspace settings | Consistent lint/format/runtime on this host | §4.6, §5.6 |
| G10 | README skeleton | NFR-16 / QG-7 require setup docs — *content lands when features exist* | §11.5 |
| G11 | CI workflow (GitHub Actions) | NFR-14 lint+tests; Testcontainers MySQL (ARCH §17.1) — **out of scope for this phase**, specified for later | §11.6 |
| G12 | Root dev scripts (single-command convenience) | Optional ergonomic wrappers — see ENV-DEC-08 | §8.4 |

### 1.4 Grounding — what the approved docs already decide

| Concern | Approved decision | Source |
|---|---|---|
| Backend runtime | Spring Boot **3.x** on **Java 21 LTS** | ARCH §7 (AR-DEC-01) |
| Build | Maven, `mvn spring-boot:run` locally | ARCH §17.1 |
| Schema management | **Flyway only** (`V1__init_schema.sql`, forward-only); `ddl-auto=validate` | FR-GEN-10, DB §24 |
| Local database | MySQL 8 via **Docker Compose** | ARCH §17.1 |
| DB users | `shoply_app` (DML) + `shoply_migrator` (DDL at Flyway time) | SEC-19, DB §15 |
| Charset | `utf8mb4` / `utf8mb4_0900_ai_ci` | DB §1.1 |
| Seed | Idempotent seed **runner** (not a migration); realistic catalog; re-runnable | FR-GEN-09, DB §24.2, ARCH §4.5 |
| Frontend | Vite + React **JS** (no TypeScript) + Tailwind; feature folders; TanStack Query | ARCH §3, plan §6 |
| Design tokens | Figma variables → Tailwind seed (`colors`, `fontSize`, `spacing`, `borderRadius`, `transitionDuration`) | UI spec §20.5 |
| Lint/format | ESLint + Prettier | NFR-14 |
| Tests | Frontend: Vitest + RTL · Backend: JUnit 5 + Testcontainers (real MySQL) | ARCH §7, §17.1 |
| Payments locally | **Mock gateway default** (`PAYMENT_PROVIDER=mock`); Stripe test keys optional | ARCH §17.1, §18.1 |
| Health | `GET /api/v1/health` → 200 `UP` / 503 `DOWN` | FR-GEN-06, ARCH §16.2 |
| Profiles | `local` and `demo` | ARCH §18.1 |
| Secrets | `.env.example` committed; real `.env` git-ignored; JWT ≥ 32 bytes | SEC-12, ARCH §18.2 |
| CORS | Explicit allowlist — **never `*` with credentials** | ARCH §18, API §7.1 |
| Public API base | `VITE_API_BASE=/api/v1` | ARCH §18.1 |
| CI | Frontend lint+test+build; backend tests + image; Testcontainers | ARCH §17.1 |

**Not decided by any approved document (defined here — see §14):** port numbers, Tailwind major version, dev proxy vs direct CORS, repository folder layout, commit convention, Lombok use, local env-loading mechanism.

---

## 2. Proposed Repository Structure

Single repository (one codebase, one deployment — ARCH §1), siblings by layer:

```text
e-com/
├── .git/
├── .gitignore                    ← G1
├── .gitattributes                ← G2
├── README.md                     ← G10 (skeleton; full content with NFR-16 as features land)
├── docker-compose.yml            ← G5  (MySQL 8 only — no app container locally)
├── docs/                         ← approved documents (READ-ONLY)
│   └── DEVELOPMENT_SETUP.md      ← this file
├── frontend/                     ← G3  Vite + React JS + Tailwind SPA
│   ├── .env.example              (VITE_API_BASE)
│   ├── .env                      (git-ignored)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js            (port 5173 · strictPort · /api proxy)
│   ├── tailwind setup            (§4.4)
│   ├── eslint.config.js · .prettierrc
│   ├── vitest.config.js
│   ├── .vscode/                  (shared: extensions.json, settings.json)
│   └── src/
│       ├── api/                  ← API client (envelope/error parsing)
│       ├── components/           ← shared UI
│       ├── features/             ← auth · catalog · cart · checkout · orders · account · admin
│       ├── routes/               ← React Router route tree
│       ├── styles/               ← tokens.css (Figma export) + Tailwind entry
│       └── main.jsx
├── backend/                      ← G4  Spring Boot modular monolith
│   ├── .env.example              (DB/JWT/CORS/payment placeholders)
│   ├── .env                      (git-ignored)
│   ├── pom.xml                   (+ Maven wrapper: mvnw / mvnw.cmd)
│   ├── src/main/java/com/shoply/
│   │   ├── ShoplyApplication.java
│   │   └── (modules created at implementation: identity · catalog · cart · checkout · inventory · reporting · platform)
│   ├── src/main/resources/
│   │   ├── application.yml       (common) · application-local.yml · application-demo.yml
│   │   └── db/migration/         ← Flyway: V1__init_schema.sql … (implementation phase)
│   └── src/test/java/            (JUnit 5 + Testcontainers)
├── tools/                        ← dev-only scripts (no dependencies)
│   └── dev.ps1                   ← G8 env loader (§7.4)
└── uploads/                      ← runtime image volume (git-ignored; created on first run)
```

**Rationale:** layer siblings mirror the ARCH §17.1 environment table (Vite dev server | `mvn spring-boot:run` | MySQL container); one GitHub repo keeps CI and review simple for a solo developer (plan §1).

---

## 3. Prerequisites & Toolchain (Windows)

### 3.1 Versions

| Tool | Required version | Notes / source |
|---|---|---|
| **JDK** | **21 LTS** (x64, *full JDK*, not JRE) | AR-DEC-01 — non-negotiable |
| **Maven** | 3.9.x (+ **Maven Wrapper** committed, so `mvnw.cmd` always matches) | ARCH §17.1 |
| **Node.js** | ≥ 20 LTS (**22 LTS recommended**) | Vite baseline; ENV-DEC-01 |
| **npm** | 10+ (ships with Node) | — |
| **MySQL** | 8.0+ (8.x server) | ARCH §1.1 — via Docker **or** native service (§6.1) |
| **Docker Desktop** | Optional but **recommended** | Compose baseline (ARCH §17.1); required for Testcontainers tests |
| **Git** | 2.4x (Git for Windows, default OpenSSH/credential manager) | §11 |
| **VS Code** | Current | + extensions §3.2 |
| **OpenCode** | Current | already in use |

### 3.2 VS Code extensions (recommended set)

| Extension | Purpose |
|---|---|
| Extension Pack for Java (incl. Language Support, Debugger, Maven, Test Runner) | Backend run/debug/test |
| Spring Boot Extension Pack (STS4 + Boot Dashboard) | `application.yml` awareness, run dashboard |
| ESLint · Prettier – Code formatter | NFR-14 lint/format parity with CI |
| Tailwind CSS IntelliSense | Class completion from the token layer (UI spec §20.5) |
| Docker · MySQL (client) | Compose + schema inspection |
| (Optional) Code Spell Checker | Docs/README hygiene |

Workspace settings (proposed in `.vscode/settings.json`, shared via git): Prettier as default formatter, `editor.formatOnSave`, ESLint auto-fix on save, `files.eol: "\n"`, Java 21 configuration, `java.configuration.updateBuildConfiguration: automatic`.

### 3.3 Verify the toolchain (run in PowerShell)

```powershell
java -version        # expect: openjdk version "21"
mvn -v               # expect: Maven 3.9.x · Maven home · Java version: 21
                     #   (or use the committed wrapper: .\backend\mvnw.cmd -v)
node -v              # expect: v20+ (v22 LTS preferred)
npm -v               # expect: 10+
git --version        # expect: 2.4x
docker --version     # optional; needed for Compose DB + Testcontainers
mysql --version      # only if using the native-MySQL alternative (§6.1B)
```

**If `java`/`mvn` are missing or not 21:** set `JAVA_HOME=C:\Program Files\Java\jdk-21` (adjust path) and add `%JAVA_HOME%\bin`, Maven `bin`, and npm's directory to the user `PATH`; restart VS Code **and** its terminals (`Terminal → Restart Terminal`) — half-configured terminals are the #1 source of "command not found" confusion (T-01, T-02).

---

## 4. Frontend Setup

> **Proposed, not applied.** Commands and file contents below are the exact plan; nothing runs until §13 is approved.

### 4.1 Scaffold (creation sequence)

```powershell
# from repository root
npm create vite@latest frontend -- --template react     # React JS — NO TypeScript (stack fixed by brief)
cd frontend
npm install                                              # react, react-dom (from template)
npm install react-router-dom @tanstack/react-query lucide-react animate.css
npm install -D tailwindcss @tailwindcss/vite eslint prettier vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Dependency justification (nothing else is added):**

| Package | Type | Approved basis |
|---|---|---|
| `react-router-dom` | runtime | Routing (ARCH §3, plan §6) |
| `@tanstack/react-query` | runtime | Server state owner (plan §6, ARCH §3) |
| `lucide-react` | runtime | Icon set (SRS stack) |
| `animate.css` | runtime | Motion library (SRS stack) |
| `tailwindcss` + `@tailwindcss/vite` | styling | Tailwind CSS (stack; UI spec §20.5) — **v4, see ENV-DEC-02** |
| `eslint` + `prettier` (+ config) | dev | NFR-14 |
| `vitest` + `@testing-library/*` + `jsdom` | dev | ARCH §7 testing (Vitest + RTL on API client, card states, checkout guard, money formatter) |

No UI kit, no state library beyond React + TanStack Query, no axios (fetch suffices; the API client wraps it) — matching plan §6's minimalism.

### 4.2 `vite.config.js` (specification)

| Key | Value | Why |
|---|---|---|
| `plugins` | `react()`, `tailwindcss()` | stack |
| `server.port` | **5173** | §9; fixed + `strictPort: true` so CORS/cookie debugging never chases a moved port |
| `server.proxy` | `'/api' → { target: 'http://localhost:8080', changeOrigin: true, ws: false }` | **primary dev transport** (ENV-DEC-03) — same-origin requests, cookies/CSRF behave exactly like production (§10.2) |
| `test` (Vitest) | `environment: 'jsdom'`, setup file with jest-dom | ARCH §7 |

### 4.3 Environment (frontend)

`.env.example` (committed) → copy to `.env` (git-ignored):

```dotenv
# frontend/.env.example — public build-time values, NEVER secrets (ARCH §18.1)
VITE_API_BASE=/api/v1
```

`VITE_API_BASE=/api/v1` is a **relative** path: the SPA calls its own origin, and the Vite proxy forwards `/api` to the backend. During production build the same relative path is served by the host's reverse proxy/rewrite (ARCH §18.1). No key, token, or URL with credentials ever appears in frontend env (all `VITE_*` values are bundled into the public JS).

### 4.4 Tailwind + design tokens

Per UI spec §20.5 the Figma handoff is the token seed: `colors`, `fontSize`, `spacing`, `borderRadius` (0/pill/circle), `transitionDuration`. Setup plan:

1. `src/styles/tokens.css` — Tailwind v4 `@theme` block seeded from the Figma variable export (the one file that changes when tokens are re-exported).
2. `src/styles/index.css` — `@import "tailwindcss"` + component/util layers; Animate.css imported alongside (its classes are opt-in per UX motion rules).
3. Fonts: Poppins + Inter with `font-display: swap` + system fallback (PERF-12, UI spec §5) — loaded from Google Fonts or self-hosted (ENV-DEC-06).
4. No `tailwind.config.js` needed in v4 (theme lives in CSS); if the Figma exporter outputs a JS config instead, fall back to Tailwind v3 toolchain — flagged as ENV-DEC-02.

### 4.5 Source layout (ARCH §3 — enforced from day one)

`/src/api` (client + envelope/error/CSRF/401 handling) · `/src/components` (shared) · `/src/features/*` (feature folders — **features never import from other features**; cross-feature goes through `/components` or `/api`) · `/src/routes` · `/src/styles`. Scaffolding creates the folders plus a single "Shoply" shell page and route placeholder — **no ecommerce feature components** (task boundary).

### 4.6 Quality gates

| Gate | Command | Source |
|---|---|---|
| Lint | `npm run lint` | NFR-14 |
| Format | `npx prettier --write .` | NFR-14 |
| Unit tests | `npm test` (Vitest) | ARCH §7 |
| Production build | `npm run build` → `dist/` | ARCH §17 |

---

## 5. Backend Setup

> **Proposed, not applied.** No Java source beyond the application entry point is created in this phase.

### 5.1 Scaffold (creation sequence)

```powershell
# Spring Initializr (start.spring.io) choices — via IDE wizard or curl:
#   Type: Maven Project     Language: Java     Spring Boot: 3.x (latest stable 3.x at scaffold time)
#   Group: com.shoply       Artifact: backend  Packaging: Jar     Java: 21
#   Dependencies: Spring Web · Spring Security · Spring Data JPA · Validation
#                 Flyway (core + MySQL driver) · MySQL Driver · Lombok? → NO (ENV-DEC-04)
#                 Tests: Spring Boot Test · Spring Security Test · Testcontainers (JUnit Jupiter, MySQL)
cd backend
mvn -N wrapper:wrapper -Dmaven=3.9     # commit mvnw/mvnw.cmd/maven/wrapper
```

**Dependency justification:**

| Dependency | Approved basis |
|---|---|
| Spring Web | REST API (ARCH §6) |
| Spring Security | Cookie/JWT + CSRF chain (ARCH §8, SEC-03/04) |
| Spring Data JPA + Validation | Hibernate/JPA + `@Valid` DTO binding (stack, API §1.2) |
| Flyway + MySQL driver | FR-GEN-10 — migrations only, `ddl-auto=validate` |
| Spring Boot Test + Security Test + **Testcontainers (MySQL)** | ARCH §7/§17.1 — real MySQL in tests |
| ~~Actuator~~ | **Not added** — health is the custom `GET /api/v1/health` (FR-GEN-06); no unnecessary dependencies |
| ~~Lombok~~ | **Not added** — absent from the approved stack; manual DTO mappers are the plan's choice (plan §6, ARCH §4.3). Revisit only with approval (ENV-DEC-04) |
| spring-boot-devtools | Optional, dev-scope only — acceptable convenience (ENV-DEC-05); excluded from the jar automatically |

### 5.2 Configuration files (specification)

| File | Contents (summary) |
|---|---|
| `application.yml` | Server port from `SERVER_PORT` (default **8080**) · `spring.profiles.default: local` · `spring.config.import: optional:file:.env[.properties]` (§7.4) · datasource `${DB_URL}` / `${DB_USERNAME}` / `${DB_PASSWORD}` · Flyway enabled with **separate migrator credentials** (`spring.flyway.user/password = ${FLYWAY_USER}/${FLYWAY_PASSWORD}` — SEC-19: app user is DML-only) · JPA `ddl-auto: validate` · `time-zone: UTC` · Jackson: ISO-8601 strings, UTC, **no timestamps** (API §7.1 format `2026-11-04T09:30:00.000Z`) · `server.servlet.encoding UTF-8` |
| `application-local.yml` | `COOKIE_SECURE: false` (HTTP dev) · `PAYMENT_PROVIDER: mock` (ARCH §17.1) · `CORS_ALLOWED_ORIGINS` default `http://localhost:5173,http://127.0.0.1:5173` · `UPLOAD_DIR` → `./uploads` · verbose SQL logging **off** by default (opt-in property) |
| `application-demo.yml` | `COOKIE_SECURE: true` · Stripe provider · production-ish defaults — **no secrets in the file** |
| Typed config | One `@ConfigurationProperties` class validating required vars at boot — missing critical config **fails fast** with a clear message (ARCH §18.2); verified by a boot test |

### 5.3 Target package structure (ARCH §5 — created when modules start)

```text
com.shoply
├── identity · catalog · cart · checkout · inventory · reporting · platform
│     each: …controller → …service → …repository (+ dto, mapper)
└── (dependency rule: acyclic — platform depends on nothing; reporting is the read-only leaf)
```

Scaffold phase creates only `ShoplyApplication`, the `platform` placeholder package, and a boot test — module packages appear with their implementation phase (task boundary: no feature code now).

### 5.4 Flyway & seed contract (DB §24, FR-GEN-09/10)

| Aspect | Rule |
|---|---|
| Location | `src/main/resources/db/migration/` |
| Naming | `V1__init_schema.sql`, `V2__….sql` — sequential, double-underscore, **forward-only** (never edit an applied migration; fix with a new one) |
| Timing | On boot (ARCH §17.3) under the **migrator** credential |
| Validation | Hibernate `ddl-auto=validate` checks the result — drift ⇒ boot failure (intended) |
| Seed | **Not a migration**: the idempotent seed runner (ARCH §4.5) executes under the `local` profile (and demo), never against production (FR-GEN-09, DB §24.2). Scope: 4–5 categories, 40–60 products, ~250–400 SKUs, images, ADMIN/STAFF/CUSTOMER accounts (FR-GEN-09); re-run = no duplicates (EC-30) |
| Reset (dev only) | Drop schema → recreate → Flyway rebuilds → seed re-runs (§8.5) |

### 5.5 Run & test

```powershell
cd backend
.\mvnw.cmd spring-boot:run        # profile: local (default) · port 8080
.\mvnw.cmd test                   # JUnit 5; Testcontainers tests need Docker
.\mvnw.cmd package                # jar → target/ (image builds in CI, ARCH §17.3)
```

### 5.6 VS Code run/debug

- **Option A (recommended):** Spring Boot Dashboard → run `ShoplyApplication` with profile `local`; env comes from `backend/.env` via `spring.config.import` (§7.4) — nothing secret lives in committed VS Code files.
- **Option B:** integrated terminal + `.\mvnw.cmd spring-boot:run`.
- **Option C (debug):** Run and Debug panel → *Spring Boot: Debug* launch config (committed, secret-free), or attach the Java debugger to a running app on the JDWP port VS Code prints.
- If the installed Java extension supports an `envFile` key in `launch.json`, it may point at `backend/.env` — **do not paste secrets into `launch.json`** (it is committed).

---

## 6. Database Setup

### 6.1 Two supported paths

| | **A — Docker Compose (ARCH baseline, recommended)** | **B — Native MySQL 8 (fallback)** |
|---|---|---|
| Source | ARCH §17.1: "MySQL 8 via Docker Compose" | Pragmatic alternative when Docker is unavailable on the host |
| Install | Docker Desktop for Windows (WSL2 backend) | MySQL 8 from Oracle/Chocolatey; run as service (`services.msc` → MySQL80) |
| Isolation | Project-contained container, throwaway volume | Shares the machine; risk of colliding with other projects' schemas |
| Testcontainers | Works (needed for `mvn test`) | Unaffected for app; Testcontainers **still needs Docker** (§12 T-16) |
| Selection | **ENV-DEC-03 default: A**, with B documented | Choose at setup time; both produce identical schema/users |

### 6.2 Path A — `docker-compose.yml` (specification)

| Key | Value | Notes |
|---|---|---|
| Service | `mysql` image `mysql:8.4` (or `mysql:8.0`) | only service — app runs natively (ARCH §17.1) |
| Ports | `"3306:3306"` (host:container) | if 3306 is taken → `"3307:3306"` and `DB_URL` follows (T-04) |
| Env | `MYSQL_DATABASE=shoply` · `MYSQL_ROOT_PASSWORD` from env (**dev-only value**, never committed) · `MYSQL_CHARSET`/collation defaults | root password is Compose-local |
| Command flags | `--character-set-server=utf8mb4 --collation-server=utf8mb4_0900_ai_ci` | matches DB §1.1 |
| Volume | named volume `mysql-data:/var/lib/mysql` | survives restarts; wipe = full reset (§8.5) |
| Healthcheck | `mysqladmin ping` | `dependsOn`-style ordering for future services |

### 6.3 Database bootstrap (one-time, both paths)

Run once (native `mysql` client or `docker compose exec mysql mysql -u root -p < tools/db-bootstrap.sql`):

```sql
-- tools/db-bootstrap.sql — dev machine only; contains NO real passwords
CREATE DATABASE IF NOT EXISTS shoply
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- App runtime user: DML only (SEC-19)
CREATE USER IF NOT EXISTS 'shoply_app'@'localhost' IDENTIFIED BY '<DEV_APP_PASSWORD>';
GRANT SELECT, INSERT, UPDATE, DELETE ON shoply.* TO 'shoply_app'@'localhost';

-- Migration user: schema DDL, used only by Flyway (SEC-19 — never by running app)
CREATE USER IF NOT EXISTS 'shoply_migrator'@'localhost' IDENTIFIED BY '<DEV_MIGRATOR_PASSWORD>';
GRANT ALL PRIVILEGES ON shoply.* TO 'shoply_migrator'@'localhost';
FLUSH PRIVILEGES;
```

Notes:
- `@'localhost'` covers both native MySQL and the Compose container **when the app connects via localhost** (Compose maps the port to the host; the server sees the connection from the gateway — if grants fail inside the container path, use `'shoply_app'@'%'` for local dev only and record it as an accepted dev-only relaxation).
- Both passwords are generated per machine (§7.2) and live only in `backend/.env`.
- Schema `shoply` is empty at this point — **Flyway owns all DDL** (FR-GEN-10); never create tables by hand.

### 6.4 What "database ready" means

1. Server accepting TCP on the `DB_URL` port · 2. `shoply` schema exists with `utf8mb4_0900_ai_ci` · 3. Both users exist with correct grants · 4. First backend boot runs `V1__init_schema` (Flyway history table present) · 5. Seed runner completes idempotently (FR-GEN-09). Steps 4–5 are verified by the [§15 checklist](#15-readiness-checklist).

---

## 7. Environment Variables

### 7.1 Requirements (ARCH §18 — authoritative)

1. **Typed binding, fail-fast:** a `@ConfigurationProperties` class validates required variables at boot; missing critical config aborts startup with a clear message — no silent defaults for secrets (ARCH §18.2).
2. **`.env.example` committed with placeholders; real `.env` git-ignored** (SEC-12). No secret ever appears in code, config committed to git, logs, or this document.
3. **Same code, all environments** — behavior differences come only from config (mock vs Stripe, upload dir, cookie flags) (ARCH §18.2).
4. **No feature flags in V1** (ARCH §18.2).
5. **Frontend values are public by construction** — only `VITE_*`, bundled into the JS; secrets never reach the SPA.

### 7.2 Backend variable table (`.env.example` content — placeholders only)

| Group | Variable | Local dev value | Notes / source |
|---|---|---|---|
| Server | `SERVER_PORT` | `8080` | §9 |
| Server | `SPRING_PROFILES_ACTIVE` | `local` | profiles: `local`/`demo` (ARCH §18.1) |
| Database | `DB_URL` | `jdbc:mysql://localhost:3306/shoply?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8mb4` | port follows §9; `serverTimezone=UTC` enforces UTC storage (API §7.1) |
| Database | `DB_USERNAME` | `shoply_app` | DML-only user (SEC-19) |
| Database | `DB_PASSWORD` | `<DEV_APP_PASSWORD>` | generated per machine (§7.4) |
| Database (Flyway) | `FLYWAY_USER` | `shoply_migrator` | separate migrator credential (SEC-19, DB §15) |
| Database (Flyway) | `FLYWAY_PASSWORD` | `<DEV_MIGRATOR_PASSWORD>` | generated per machine |
| Security | `JWT_SECRET` | `<BASE64_≥32_BYTES>` | HS256 signing key — **≥ 32 bytes**, generated per env (SEC-12); generation cmd below |
| Security | `COOKIE_SECURE` | `false` (local) / `true` (demo) | `true` over plain HTTP = cookies never sent (T-10) |
| Payments | `PAYMENT_PROVIDER` | `mock` | mock default locally; Stripe test optional (ARCH §17.1) |
| Payments | `STRIPE_SECRET_KEY` | `<EMPTY>` or `sk_test_…` | **test mode only — no live keys in V1** (ARCH §18.1); leave empty while provider=mock |
| Payments | `STRIPE_WEBHOOK_SECRET` | `<EMPTY>` or `whsec_…` | from Stripe dashboard / Stripe CLI listener (§8.3) |
| Storage | `UPLOAD_DIR` | `<ABSOLUTE_PATH>\backend\uploads` (Windows: `C:\...\e-com\uploads`) | local volume (ARCH §12) |
| Storage | `PUBLIC_UPLOAD_BASE` | `/uploads` | URL prefix (ARCH §18.1) |
| App | `ORDER_EXPIRY_MINUTES` | `30` | DEC-02 |
| App | `SESSION_DAYS` | `7` | DEC-18 |
| App | `RATE_LIMIT_MAX_ATTEMPTS` | `5` | FR-AUTH-08 |
| App | `RATE_LIMIT_WINDOW_MINUTES` | `15` | FR-AUTH-08 |
| CORS | `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | explicit allowlist — never `*` (§10) |

**Generate secrets on Windows (PowerShell — never commit the output):**

```powershell
# JWT_SECRET — 48 random bytes, base64 (≥32-byte requirement, SEC-12)
$b = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
[Convert]::ToBase64String($b)

# DB passwords — 24 random chars
-join ((1..24) | ForEach-Object { [char](Get-Random -Min 48 -Max 122) })
```

### 7.3 `.env.example` files (committed)

```dotenv
# backend/.env.example — copy to backend/.env and fill per §7.2/§7.4. NEVER commit .env (SEC-12).
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=local
DB_URL=jdbc:mysql://localhost:3306/shoply?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8mb4
DB_USERNAME=shoply_app
DB_PASSWORD=
FLYWAY_USER=shoply_migrator
FLYWAY_PASSWORD=
JWT_SECRET=
COOKIE_SECURE=false
PAYMENT_PROVIDER=mock
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPLOAD_DIR=
PUBLIC_UPLOAD_BASE=/uploads
ORDER_EXPIRY_MINUTES=30
SESSION_DAYS=7
RATE_LIMIT_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MINUTES=15
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

```dotenv
# frontend/.env.example — public build-time values only. NEVER put secrets here (bundled into JS).
VITE_API_BASE=/api/v1
```

### 7.4 How local loading works (Windows — ENV-DEC-07)

Spring Boot does not read `.env` natively. **Recommended mechanism (zero dependencies):**

- `application.yml` declares `spring.config.import: optional:file:.env[.properties]` — the `.env` file (properties syntax `KEY=VALUE`, which is what our keys already are) is loaded from the `backend/` working directory by Spring itself. Works identically for `mvnw spring-boot:run`, VS Code run/debug, and the packaged jar; the file is `optional:` so a fresh clone boots to a *clear validation error*, not a stack trace (ARCH §18.2 fail-fast).
- **Fallback B:** `tools\dev.ps1` — a plain PowerShell loader that reads `backend\.env` into process environment variables and then runs the given command (proposed in §13; no external dependencies).
- **Not used:** Windows user/system environment variables for secrets (leaks across projects and machines) and secrets in committed VS Code `launch.json` (SEC-12).

---

## 8. Local Development Commands

### 8.1 First-time setup (in order)

```powershell
# 0) Toolchain sanity (§3.3) — java 21, node, git present
# 1) Database (Path A — Docker)
docker compose up -d mysql
#    OR Path B: ensure the native MySQL 8 service is running (services.msc → MySQL80)

# 2) One-time DB bootstrap (§6.3) — creates shoply + both users
docker compose exec -T mysql mysql -u root -p"<compose root pw>" < tools/db-bootstrap.sql
#    OR native:  mysql -u root -p < tools/db-bootstrap.sql

# 3) Backend env
copy backend\.env.example backend\.env      # then fill passwords + JWT_SECRET (§7.4 generation cmds)

# 4) Frontend env + dependencies
copy frontend\.env.example frontend\.env
cd frontend
npm install

# 5) First backend boot (Flyway creates schema; local profile runs idempotent seed)
cd ..\backend
.\mvnw.cmd spring-boot:run

# 6) Verify
curl http://localhost:8080/api/v1/health     # expect 200 {"status":"UP"}
```

### 8.2 Daily loop (three terminals)

| Terminal | Command | Result |
|---|---|---|
| 1 — DB (only if stopped) | `docker compose up -d mysql` | MySQL on 3306 |
| 2 — Backend | `cd backend` → `.\mvnw.cmd spring-boot:run` | API on **8080**, profile `local` |
| 3 — Frontend | `cd frontend` → `npm run dev` | SPA on **5173**, proxying `/api` → 8080 |

Open `http://localhost:5173` — SPA talks to the API same-origin through the proxy (§10.2).

### 8.3 Quality, build, and maintenance commands

| Purpose | Frontend | Backend |
|---|---|---|
| Dev server | `npm run dev` | `.\mvnw.cmd spring-boot:run` |
| Tests | `npm test` (Vitest) | `.\mvnw.cmd test` (Testcontainers → Docker) |
| Lint / format | `npm run lint` · `npx prettier --write .` | — (formatter for Java lands with CI choice, ENV-DEC-09) |
| Build | `npm run build` | `.\mvnw.cmd package` |
| Clean | `npm run build` resets dist | `.\mvnw.cmd clean` |
| Health probe | — | `curl http://localhost:8080/api/v1/health` |
| Stripe webhook (only if `PAYMENT_PROVIDER=stripe`) | — | `stripe listen --forward-to localhost:8080/api/v1/webhooks/stripe` (Stripe CLI) |
| DB shell | — | `docker compose exec mysql mysql -u shoply_app -p shoply` |
| Apply new migration | — | just restart the backend (Flyway on boot) |
| DB reset (dev only) | — | §8.5 |

### 8.4 Optional convenience scripts (ENV-DEC-08 — plain scripts, no npm workspace/tooling)

```powershell
# tools/dev.ps1 — loader + runner (proposed file, §13)
#   usage:  .\tools\dev.ps1 backend    |    .\tools\dev.ps1 frontend
#   loads backend\.env into process env, then starts the chosen side
```

Root-level orchestration (`dev.ps1 -All`) and a `package.json`-free root keep the "no unnecessary tooling" rule — a workspace manager (npm workspaces, concurrently, Make) is **deliberately not introduced** (ENV-DEC-08).

### 8.5 Database reset (development only)

```powershell
docker compose down -v          # removes the mysql-data volume
docker compose up -d mysql
# re-run §6.3 bootstrap → first backend boot re-applies V1__init_schema → seed re-runs
```

Native-MySQL variant: `DROP DATABASE shoply;` then re-run §6.3 (never run this against anything shared/demo). Forward-only migrations mean **history is never edited** — reset instead (DB §24.1).

---

## 9. Development Ports

Ports are **defined by this document** — no approved doc prescribes them (ENV-DEC-01).

| Service | Port | Protocol | Override | Notes |
|---|---|---|---|---|
| **Backend API** (Spring Boot) | **8080** | HTTP | `SERVER_PORT` | Spring default; `GET /api/v1/health` probe; JDWP debug port is chosen by VS Code and printed at launch |
| **Frontend dev server** (Vite) | **5173** | HTTP | fixed in `vite.config.js` (`strictPort: true`) | if 5173 is busy, **stop the squatter** (T-04) rather than silently moving — a moved port breaks the CORS allowlist and muscle memory |
| **MySQL** | **3306** (host) → 3306 (container) | TCP | compose `ports:` → e.g. `3307:3306` + matching `DB_URL` | standard MySQL port |
| **Vite HMR** | same 5173 (WebSocket) | ws | — | via the dev server port |
| Stripe CLI forward (optional) | → 8080 | HTTPS→HTTP | `stripe listen --forward-to …` | only with `PAYMENT_PROVIDER=stripe` |

**Rules:**

1. Ports 8080/5173/3306 are **the** development contract — documented in README (NFR-16) and used in CORS, proxies, and docs consistently.
2. Nothing listens on 0.0.0.0 by necessity: Vite and Spring both bind localhost-friendly defaults; exposure beyond the machine is a deployment concern (ARCH §17).
3. Conflict handling is *explicit* — see T-04 (`netstat -ano | findstr :8080` + `Stop-Process -Id <pid>`).

---

## 10. CORS Requirements

### 10.1 The rule (ARCH §18, API §7.1)

**Explicit origin allowlist with credentials — never `*` with `credentials: true`.** Spring Security CORS is configured from `CORS_ALLOWED_ORIGINS` (comma-separated exact origins, scheme included).

| Setting | Value | Source |
|---|---|---|
| Allowed origins (local) | `http://localhost:5173`, `http://127.0.0.1:5173` | §9 |
| `allowCredentials` | `true` (cookies are the auth mechanism) | SEC-03 |
| Allowed methods | `GET, POST, PUT, PATCH, DELETE, OPTIONS` | API §12 |
| Allowed headers | `Content-Type, X-XSRF-TOKEN, Idempotency-Key, X-Request-Id` | API §4.3 |
| Exposed response header | `X-Request-Id` (SPA reads it for error states) | NFR-09 |
| Preflight cache | `maxAge` ≥ 600 s | perf nicety |
| Wildcard `*` | **Forbidden** with credentials — rejected in review | ARCH §18 |

### 10.2 Two layers — why both exist

| Layer | Where | Role |
|---|---|---|
| **① Vite dev proxy (primary, local)** | `vite.config.js`: `/api → http://localhost:8080` | Browser sees **same-origin** requests → no preflight, no CORS friction, cookies (`shoply_session`, `XSRF-TOKEN`, `shoply_guest`) behave exactly as in production behind one origin. Matches `VITE_API_BASE=/api/v1` (relative). |
| **② Spring CORS allowlist (always configured)** | `CORS_ALLOWED_ORIGINS` → security filter chain | **(a)** Direct-origin calls during development (testing the API from another origin, Swagger UI served on 8080 → *same* origin actually; third-party tools don't enforce CORS) · **(b)** the deployed split topology where the SPA and API sit on different hosts (ARCH §17.1 demo row) — this is where CORS genuinely applies · **(c)** safety: misconfigured proxy ⇒ clear `403` CORS error instead of silent failure |

**Order of precedence (recommended):** if the request is already same-origin (proxied), Spring CORS never engages; cross-origin requests hit the allowlist; everything else fails closed.

### 10.3 What does *not* use CORS

- **Stripe → Shoply webhook** — server-to-server, authenticated by signature (`Stripe-Signature`), not a browser call (API §12.10).
- **`curl` / Postman / health probes** — CORS is a browser-enforced policy only.
- **Server-side calls** (gateway, future adapters) — irrelevant.

### 10.4 Common local CORS symptoms → see T-07 (blocked by CORS policy), T-08 (cookies/CSRF), T-09 (preflight 403).

---

## 11. Git Configuration

### 11.1 Conventions (proposed — ENV-DEC-09)

| Aspect | Rule |
|---|---|
| Branching | `main` always green/runnable · short-lived branches: `feat/<kebab>`, `fix/<kebab>`, `chore/<kebab>`, `docs/<kebab>` · merge via PR or fast-forward (solo repo — keep history linear) |
| Commits | **Conventional Commits**: `feat(cart): add line mutation handlers` · `fix(auth): honor SESSION_EXPIRED redirect` · `docs: …` · `chore(deps): …` — type(scope): summary, imperative mood, ≤ 72-char subject |
| Granularity | One logical change per commit; scaffold commits separated from feature commits (a reviewer can read the history as a narrative) |
| What never gets committed | Secrets (`.env`, keys) · build output (`node_modules/`, `dist/`, `target/`) · runtime uploads · IDE-local files · OS junk (`Thumbs.db`, `desktop.ini`) |
| Push | `main` only via fast-forward; no force-push to `main` |
| History | No `git add .` blindly — stage explicitly; `git status` before every commit |

### 11.2 `.gitignore` (proposed content — G1)

```gitignore
# secrets & local env (SEC-12)
.env
*.env.local
!*.env.example

# backend
backend/target/
*.jar
!mvnw wrapper jar… (maven-wrapper.jar is committed)

# frontend
node_modules/
frontend/dist/
*.log
npm-debug.log*

# runtime uploads (seeded assets ship in repo under assets/, copied at runtime — ARCH §19)
uploads/

# IDE / OS
.vscode/*          !.vscode/extensions.json   !.vscode/settings.json
.idea/
*.iml
Thumbs.db
desktop.ini
.DS_Store
```

*(Exact allow-listing of shared `.vscode` files finalized at scaffold — ENV-DEC-10: share `extensions.json` + `settings.json`, ignore `launch.json` if it ever becomes machine-specific.)*

### 11.3 `.gitattributes` (proposed content — G2, Windows-specific)

```gitattributes
* text=auto eol=lf            # normalize line endings — Windows CRLF never churns diffs
*.cmd text eol=crlf           # Windows scripts keep CRLF (mvnw.cmd must stay runnable)
*.ps1 text eol=crlf
*.png binary
*.jpg binary
*.webp binary
*.ico binary
```

Plus one-time host config (documented, not enforced): `git config core.longpaths true` (T-14 — deep `node_modules` paths on Windows).

### 11.4 One-time Git identity (if not already set)

```powershell
git config --global user.name  "<name>"
git config --global user.email "<email>"
git config --global core.longpaths true
git config --global init.defaultBranch main
```

### 11.5 README (NFR-16 / QG-7) — skeleton now, content later

The README requirement (setup, architecture, key decisions, **seed accounts**, how to run tests) is an approved deliverable, but its meaningful content depends on built features. Plan: minimal README at scaffold time (title + §8 quickstart + port table), expanded as features land; **seed accounts section appears when the seed runner exists**.

### 11.6 CI (specified now, implemented later — out of scope for this phase)

GitHub Actions workflow (NFR-14, ARCH §17.3): frontend `lint + test + build` · backend `test` with **Testcontainers MySQL** · `npm audit` · (later) Docker image + breaking-change check (API §16.4). Requires GitHub repo secrets (`JWT_SECRET` test value, etc.) — CI-only, generated separately, never the developer's local values.

---

## 12. Troubleshooting

Windows-first symptom → cause → fix. `requestId` from any API error (`X-Request-Id` header / error body) is the correlation handle for backend logs (NFR-09).

### 12.1 Toolchain & boot

| # | Symptom | Likely cause | Fix |
|---|---|---|---|
| **T-01** | `'java' is not recognized` or version ≠ 21 | `JAVA_HOME`/`PATH` missing; JRE instead of JDK | Install JDK 21 LTS; set `JAVA_HOME=C:\Program Files\Java\jdk-21`; add `%JAVA_HOME%\bin` to PATH; **restart VS Code + terminals** |
| **T-02** | `'mvn' is not recognized` | Maven not on PATH | Use the wrapper `.\backend\mvnw.cmd` (always version-correct) or add Maven `bin` to PATH |
| **T-03** | Spring Boot fails: *DataSource* / *Connection refused* | DB not running, wrong `DB_URL`, or `.env` not loaded | `docker compose up -d mysql` (or start service MySQL80); verify port with `Test-NetConnection localhost -Port 3306`; confirm working dir = `backend/` so `spring.config.import` finds `.env` (§7.4) |
| **T-04** | `Port 8080/5173/3306 already in use` | Orphaned process (previous run, another project) | `netstat -ano \| findstr :8080` → `Stop-Process -Id <pid> -Force`; for 3306 consider the compose `3307:3306` mapping (§9) |
| **T-05** | VS Code Java: wrong JDK / build errors after switch | Stale language server | `Java: Clean Java Language Server Workspace` + reload; `Java: Configure Java Runtime` → 21 |
| **T-06** | `mvn test` fails: *Could not find a valid Docker environment* | Testcontainers needs Docker | Start Docker Desktop — or run tests in CI (G11) and use `.\mvnw.cmd -DskipTests` for the local loop (ENV-DEC-03/08); **never** substitute an in-memory DB (tests require real MySQL — ARCH §7) |

### 12.2 HTTP, CORS, cookies & CSRF

| # | Symptom | Likely cause | Fix |
|---|---|---|---|
| **T-07** | Browser: *blocked by CORS policy / No 'Access-Control-Allow-Origin'* | SPA calling `http://localhost:8080` **directly** instead of through the proxy; or origin not in `CORS_ALLOWED_ORIGINS` | Use relative `VITE_API_BASE=/api/v1` + proxy (§10.2); if direct, add the exact origin (scheme + port) to `CORS_ALLOWED_ORIGINS`; never `*` with credentials |
| **T-08** | Login succeeds but next request is `401`/`403` — cookie "not sticking" | `COOKIE_SECURE=true` on plain HTTP; or cross-site cookie (origin mismatch); or proxy not forwarding `Set-Cookie` | local ⇒ `COOKIE_SECURE=false`; keep SPA and `/api` on the **same origin** via proxy; Vite proxy forwards `Set-Cookie` by default — don't bypass it |
| **T-09** | Mutating requests fail `403 FORBIDDEN` with `FORBIDDEN` code | Missing/rotated CSRF header | Send `X-XSRF-TOKEN` from the non-HttpOnly `XSRF-TOKEN` cookie on every `POST/PUT/PATCH/DELETE` (API §4.3); re-read it after login/register (it rotates) |
| **T-10** | Preflight `OPTIONS` returns 403 | Spring Security filters blocking preflight | CORS filter must precede the security chain's auth checks — verify config maps `CORS_ALLOWED_ORIGINS`; probe with browser devtools Network → preflight |
| **T-11** | API returns `401 SESSION_EXPIRED` while browsing | 7-day expiry, password/role change bumping `token_version`, or `JWT_SECRET` changed since token issuance | Log in again; after changing `JWT_SECRET`, all old sessions die by design (SEC-17) |
| **T-12** | API `500` with only `requestId` | Server-side defect | Find `requestId` in backend console/log (MDC) — never trust client text alone (ERR-04) |

### 12.3 Database & migrations

| # | Symptom | Likely cause | Fix |
|---|---|---|---|
| **T-13** | Boot fails: `Access denied for user 'shoply_app'` | Bootstrap SQL not run / password mismatch | Re-run §6.3; sync `backend\.env` (`DB_USERNAME/DB_PASSWORD`) — **never** grant the app user DDL as a "fix" (SEC-19) |
| **T-14** | Boot fails: Flyway *checksum mismatch* | An **applied** migration file was edited | Restore the file; fix forward with a new `V(n+1)__` — applied migrations are immutable (DB §24.1). Dev shortcut: full reset §8.5 |
| **T-15** | Boot fails: Hibernate `Schema-validation: missing table/column` | Migration ↔ entity drift (the validator working as intended) | Compare the entity with the latest migration; add a **new** migration — `ddl-auto` must stay `validate` (FR-GEN-10) |
| **T-16** | `Unknown database 'shoply'` / cannot connect | DB down or schema missing | Start DB; Flyway creates **tables**, not the schema — schema creation is §6.3's `CREATE DATABASE` |
| **T-17** | Garbled `ü/é` in the console or seed data | Windows code page vs utf8mb4 | `chcp 65001` in the terminal; verify `SHOW CREATE DATABASE shoply` shows `utf8mb4`/`utf8mb4_0900_ai_ci` |
| **T-18** | Duplicate-key error when re-running seed | Seed not idempotent / interrupted run | Re-run the seed (insert-if-absent, FR-GEN-09); if state is suspect, §8.5 reset (dev only) |
| **T-19** | `Public Key Retrieval is not allowed` JDBC error | MySQL 8 caching_sha2_password + SSL off | Keep `allowPublicKeyRetrieval=true&useSSL=false` in `DB_URL` (§7.2) — or enable SSL properly |
| **T-20** | Timestamps off by hours | Server/JVM timezone ≠ UTC | JDBC `serverTimezone=UTC` (§7.2) + app `time-zone: UTC` (§5.2); all API dates are UTC ISO-8601 (API §7.1) |

### 12.4 Frontend & Git

| # | Symptom | Likely cause | Fix |
|---|---|---|---|
| **T-21** | `npm run dev` won't start / module not found | `npm install` never run or `node_modules` broken | `npm install` (fresh clone); persistent corruption → delete `node_modules` + `package-lock.json`? **No** — keep the lockfile, delete only `node_modules`, reinstall |
| **T-22** | Proxy error: `ECONNREFUSED 127.0.0.1:8080` (Vite console) | Backend down | Start the backend (§8.2); Vite proxies only — it never starts Java |
| **T-23** | Page loads but every API call 404s | Wrong base path | Requests must go to `/api/v1/...` (relative). A 404 `NOT_FOUND` envelope ⇒ proxy works, path is wrong (check API §3 naming) |
| **T-24** | HMR stops updating | Stale dev server / crashed overlay | Restart `npm run dev`; check the browser console overlay for the compile error |
| **T-25** | Hundreds of files "modified" with no real change | CRLF/LF drift | `.gitattributes` (§11.3) applied? `git add --renormalize .` once; ensure `core.longpaths true` (§11.4) |
| **T-26** | `Filename too long` during `npm install` (Windows) | Windows path-length limit | `git config --global core.longpaths true` (§11.4); enable Windows long paths policy if it persists |
| **T-27** | Accidentally staged a secret (`git status` shows `.env`) | Missing/old `.gitignore` | **Do not commit.** `git rm --cached backend/.env`; verify `.gitignore` (§11.2). If already pushed → rotate the secret immediately (treat JWT_SECRET/passwords as compromised) |
| **T-28** | ESLint/Prettier disagreement with CI | Local versions drifted | `npm ci` (lockfile-exact install); same Node major as CI (§3.1) |

---

## 13. Proposed Setup Changes (awaiting approval)

**Nothing below has been applied.** Each item is explained so it can be reviewed before creation. On approval, these are executed exactly as specified — still **no ecommerce feature code** (feature work is a later, separately-gated phase).

| # | Change | Contents / command | Why it's safe |
|---|---|---|---|
| C1 | Create `docs/DEVELOPMENT_SETUP.md` | this file | ✅ **Already done** — the only change applied in this phase; new file, nothing overwritten |
| C2 | `.gitignore` + `.gitattributes` (root) | §11.2 / §11.3 | Prevents secret/line-ending accidents immediately — apply **first** when coding starts |
| C3 | `frontend/` scaffold | §4.1 exact commands; adds `package.json`, lockfile, Vite/ESLint/Prettier/Vitest config, `src/` shell folders, `.env.example` | Template-generated only; dependency list fixed to §4.1 — nothing extra |
| C4 | `backend/` scaffold | §5.1 Initializr choices + Maven wrapper; adds `pom.xml`, `ShoplyApplication`, `application*.yml`, boot test, `.env.example` | Dependency list justified in §5.1; no Actuator/Lombok; module packages deferred |
| C5 | `docker-compose.yml` | §6.2 — MySQL 8 service + volume + healthcheck | Dev-only container; root password via env placeholder |
| C6 | `tools/db-bootstrap.sql` | §6.3 — schema + least-privilege users | Contains **no real passwords** (`<DEV_…_PASSWORD>` placeholders) |
| C7 | `tools/dev.ps1` | §7.4 fallback loader: reads `backend\.env`, launches a side | Plain PowerShell, no dependencies, dev-only |
| C8 | `.vscode/extensions.json` + `settings.json` | §3.2 shared recommendations + formatting defaults | No machine paths, no secrets |
| C9 | `README.md` skeleton | Title, quickstart (§8.1–8.2), port table (§9), doc index | NFR-16 baseline; grows with features |
| C10 | `.env` files (user-created) | copy from `.env.example` per §7.3/§8.1 | Git-ignored by C2 (SEC-12) |
| C11 | DB bootstrap execution | §6.3 SQL run once against the local DB | Idempotent statements (`IF NOT EXISTS`) |
| C12 | CI workflow | §11.6 | **Explicitly deferred** — not part of this approval |

**Sequence when approved:** C2 → C5 → C6 → C3 → C4 → C7 → C8 → C9 → C10 → C11 → run [§15 checklist](#15-readiness-checklist). Feature implementation begins only after a *separate* approval.

---

## 14. Unresolved Environment Decisions (ENVDEC)

Setup-level choices **not covered** by any approved document — position taken, confirmation pending:

| ID | Decision | Position taken | If reversed | Status |
|---|---|---|---|---|
| **ENV-DEC-01** | Node version | Node ≥ 20, **22 LTS recommended** (docs only say "Vite + React") | One reinstall; lockfile unaffected | 🟡 Open (low risk) |
| **ENV-DEC-02** | Tailwind **v4** (`@tailwindcss/vite`, `@theme` in CSS) vs v3 (JS config) | **v4** — current major, token layer maps cleanly to `@theme` (UI spec §20.5); fallback path documented in §4.4 | Swap toolchain in `vite.config.js` + one config file — token *values* unchanged | 🟡 Open |
| **ENV-DEC-03** | Dev transport: Vite **proxy** (same-origin) vs direct cross-origin + CORS | **Proxy primary**, CORS always configured as second layer (§10.2) | Direct mode works too — cookies survive on `localhost` across ports (SameSite=Lax is same-site); CORS allowlist already covers it | 🟡 Open (low risk) |
| **ENV-DEC-04** | **Lombok** in backend | **Not used** — absent from approved stack; plan chose manual DTO mappers (plan §6) | Adds one dependency + annotation processing; reversible until entities exist | 🟡 Open |
| **ENV-DEC-05** | `spring-boot-devtools` | Optional dev-scope convenience; **excluded from jar** — include at scaffold | Removing later is a one-line `pom.xml` change | 🟡 Open (low risk) |
| **ENV-DEC-06** | Fonts: Google Fonts vs self-hosted | Google Fonts with `font-display: swap` + fallbacks (PERF-12); self-hosting = perf hardening for demo deploy | One `<link>` ↔ one folder | 🟡 Open (low risk) |
| **ENV-DEC-07** | `.env` loading: `spring.config.import` (chosen) vs PowerShell loader vs OS env vars | **`spring.config.import: optional:file:.env[.properties]`** — works for all run modes, zero deps; PowerShell script kept as fallback (§7.4) | Swap loading mechanism; variable *names* stay per §7.2 | 🟡 Open |
| **ENV-DEC-08** | Root orchestration scripts / workspace tooling | **Minimal:** optional `tools\dev.ps1`; no npm workspaces, no `concurrently`, no Make | Adding a runner later is additive | 🟡 Open (low risk) |
| **ENV-DEC-09** | Git/commit convention + Java formatter | **Conventional Commits** + branch naming (§11.1); Java formatter (Spotless/Checkstyle) deferred to CI phase | Convention is documentation-level; formatter arrives with CI (ENV-DEC-10) | 🟡 Open |
| **ENV-DEC-10** | Share which `.vscode` files via git | Share `extensions.json` + `settings.json`; ignore `launch.json` until it's proven machine-independent | Un-ignore one file | 🟡 Open (low risk) |
| **ENV-DEC-11** | MySQL image tag (`mysql:8.4` LTS vs `mysql:8.0`) | **`mysql:8.4`** (§6.2) — both satisfy "MySQL 8"; tag pinned for reproducibility | Image tag change + volume recreate (§8.5) | 🟡 Open (low risk) |
| **ENV-DEC-12** | Compose root-password handling | Root password from env placeholder, **dev-only** (never reused elsewhere) | Could use `MYSQL_RANDOM_ROOT_PASSWORD` + exec as root via container | 🟡 Open (low risk) |
| **ENV-DEC-13** | Local tests without Docker | With Docker: full `mvn test`; without: skip Testcontainers-tagged tests locally, **CI always runs them** (no H2 — real MySQL only, ARCH §7) | Stricter: require Docker for any test run | 🟡 Open |

**Carried from prior phases (unchanged):** DBQ-01/APIDEC-01 (money format), DEC-22 (metrics), DEC-24/26 (home/config) — none block environment setup.

---

## 15. Readiness Checklist

Run top to bottom after the §13 changes are applied. ✅ all = environment ready.

### 15.1 Toolchain (host)

- [ ] `java -version` → OpenJDK **21** · `JAVA_HOME` set · VS Code terminals restarted
- [ ] `.\backend\mvnw.cmd -v` → Maven 3.9.x on Java 21 (wrapper committed)
- [ ] `node -v` → ≥ 20 (22 LTS) · `npm -v` → 10+
- [ ] `git --version` → 2.4x · identity set · `core.longpaths true` (§11.4)
- [ ] Docker Desktop running *(for Path A + Testcontainers)* — or native MySQL 8 service running (Path B)
- [ ] VS Code extensions installed (§3.2)

### 15.2 Database

- [ ] MySQL accepting TCP on `localhost:3306` (`Test-NetConnection localhost -Port 3306`)
- [ ] `shoply` schema exists — `SHOW CREATE DATABASE shoply` → `utf8mb4` / `utf8mb4_0900_ai_ci`
- [ ] `shoply_app` connects with **DML-only** grants; `shoply_migrator` holds schema DDL (SEC-19)
- [ ] Compose volume present (`docker compose ps` healthy) — Path A only
- [ ] After first backend boot: `SELECT * FROM flyway.history` (or `flyway_schema_history`) shows `V1` **success**
- [ ] Seed runner completed; re-run does **not** duplicate (categories 4–5, products 40–60 — FR-GEN-09, EC-30)

### 15.3 Backend

- [ ] `backend\.env` exists from `.env.example`; `JWT_SECRET` ≥ 32 bytes; **no secret in git** (`git status` clean of `.env`)
- [ ] `.\mvnw.cmd spring-boot:run` boots without error on **8080**, profile `local`
- [ ] `curl http://localhost:8080/api/v1/health` → **200** `{"status":"UP"}` (FR-GEN-06)
- [ ] Response carries `X-Request-Id` header (NFR-09)
- [ ] `GET http://localhost:8080/api/v1/auth/session` → **200** `{"authenticated":false}` (probe works end-to-end)
- [ ] Fail-fast works: temporarily blank a critical var → boot aborts with a clear config message (ARCH §18.2), then restore
- [ ] `.\mvnw.cmd test` green with Docker *(or deferred per ENV-DEC-13 — CI must still run them)*

### 15.4 Frontend

- [ ] `frontend\.env` exists (`VITE_API_BASE=/api/v1`); no secrets present by design
- [ ] `npm install` completes; lockfile committed
- [ ] `npm run dev` serves **http://localhost:5173** (`strictPort`)
- [ ] Page renders the app shell with no console errors
- [ ] Proxy works: an `/api/...` request from the browser reaches the backend (health/session probe) — **zero CORS errors**
- [ ] `npm run lint` clean · `npm test` green · `npm run build` succeeds (NFR-14, ARCH §7)

### 15.5 End-to-end smoke (all three together)

- [ ] DB (terminal 1) + backend (terminal 2) + frontend (terminal 3) running per §8.2
- [ ] Browser `localhost:5173` → SPA loads → API calls go to same-origin `/api/v1` → responses 200
- [ ] Backend console logs show `requestId`-tagged lines; a forced 404 returns the **error envelope** `{code, message, requestId}` (API §8.1)
- [ ] Cookies visible in DevTools: `shoply_session` (**HttpOnly**), `XSRF-TOKEN` (readable), `shoply_guest`
- [ ] Restart backend → still healthy (Flyway re-apply = no-op); restart DB container → data persists (volume)
- [ ] `git status` → only intended files; `git log` → clean Conventional-Commit history

### 15.6 Environment is READY when

> ✅ Sections 15.1–15.5 all checked **and** every change C2–C11 applied per §13 **and** ENVDEC positions confirmed or explicitly accepted as stated.

---

## Approval Gate

> **⏸️ Awaiting your approval.**
>
> This document changed **nothing except creating itself**. On approval I will apply, in order: `.gitignore`/`.gitattributes` (C2) → Docker Compose + DB bootstrap SQL (C5–C6) → frontend scaffold (C3) → backend scaffold (C4) → helper scripts/VS Code/README (C7–C9) → your `.env` fills (C10) → one-time DB bootstrap (C11) — then walk the §15 checklist with you and report results.
>
> Review with attention to:
> 1. **ENV-DEC-02/03** — Tailwind v4 and the Vite proxy (two choices that shape the scaffold).
> 2. **ENV-DEC-04** — no Lombok in the backend.
> 3. **§6.1** — Docker Compose (arch baseline) vs native MySQL on this machine: **which path should I take?**
> 4. **§7.2** — env var names/local values (all placeholders; nothing secret exists yet).
> 5. **§13 C12/§11.6** — CI deferred to a later phase.
>
> No ecommerce feature code is created by this approval — that is the next, separately-gated phase.
