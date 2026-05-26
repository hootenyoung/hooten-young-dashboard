# Project: Hooten Young Dashboard

## About Hooten Young

Hooten Young (HY) is a premium American spirits brand — whiskey and cigars, built around heritage, craft, and a masculine, military-adjacent identity. The HY platform spans three repos:

1. **`hooten-young-sales`** — Python / FastAPI backend. Sales + depletions domain.
2. **`hooten-young-marketing`** — Python backend (separate team). Marketing intelligence.
3. **`hooten-young-dashboard`** — this repo. **Single React SPA** consuming both backends.

Integration is at the system level (shared Postgres instances, shared GCP project) — not shared code. Each repo is self-contained.

## This Repo's Purpose

The single user-facing application for the HY platform. Internal-only, never public.

- **Sales views** — KPIs, monthly trends, breakdowns by product / state / distributor, white-space, follow-up tracker. Backed by `hooten-young-sales`.
- **Marketing views** — Social + competitor intelligence (added later by the marketing team's work). Backed by `hooten-young-marketing`.

The dashboard is **a thin consumer of typed REST endpoints** — no business logic, no data parsing. xlsx ingestion lives on the backend.

## Tech Stack

- **Framework:** React 18 (SPA)
- **Build:** Vite 5 + TypeScript (strict)
- **UI:** MUI 6 + Emotion (CSS-in-JS via the `sx` prop)
- **Charts:** Recharts (inside `ResponsiveContainer`)
- **Routing:** React Router 6
- **Data fetching:** TanStack Query 5 (cache, dedup, loading/error states)
- **Fonts:** Inter (UI) + Playfair Display (headings) — brand match
- **Lint / format:** ESLint (flat config) + Prettier
- **Hosting:** GCP Cloud Run (one service per environment)

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **No `Co-Authored-By: Claude` lines** in commit messages.
- **Workflow:** Trunk-based. PR into `main` → auto-deploy to dev. Tags `v*.*.*` → prod (with approval).
- **TypeScript strict** everywhere.
- **Components:** Function components, named exports preferred. PascalCase filenames (`KpiStrip.tsx`).
- **Files / utilities:** kebab-case for non-component modules (`api/sales.ts`).
- **Styling:** MUI `sx` prop for one-offs; `styled()` for repeated patterns. No raw CSS files except global resets / font imports.
- **State:** Local React state by default; TanStack Query for server state. No Redux unless a real cross-cutting need appears.
- **Charts:** Recharts inside `ResponsiveContainer`. Always set `dataKey`s and stable keys on dynamic elements.

## API Integration

- Typed API client lives in `src/api/`. One module per backend domain (`sales.ts`, eventually `marketing.ts`).
- Response types **mirror the backend Pydantic schemas** — when the backend changes, update the TS types in lock-step. Mismatches surface at the type level.
- Pydantic `Decimal` values come over JSON as **strings**. We model them as `string` in TS to preserve precision; convert with `Number(...)` only at the display layer.
- In dev, Vite proxies `/api/*` to `http://localhost:8000` (the sales backend). No CORS needed.
- In prod, set `VITE_API_BASE_URL` to the deployed Cloud Run URL.

## Deployment

Cloud Run, one service per environment, in GCP project `hooten-young-platform`:

| Environment | Service              | Deploy trigger                    |
|-------------|----------------------|-----------------------------------|
| `dev`       | `hy-dashboard-dev`   | push to `main` (auto)             |
| `prod`      | `hy-dashboard-prod`  | tag `v*.*.*` + reviewer approval  |

GitHub Actions workflow in `.github/workflows/deploy.yml` (added later in the pipeline phase).

## Security

- **Internal use only.** Auth will be added before exposing this dashboard beyond HY infrastructure.
- **No secrets in code.** `VITE_*` vars are public. Real secrets stay on the backends.
- **Sensitive commercial data.** Don't log raw rows. Don't paste sample data into public channels.

## Pre-commit checklist

Before every commit:

1. `npm run lint` — ESLint passes
2. `npm run format:check` — Prettier check passes (or run `npm run format` to fix)
3. `npm run typecheck` — TypeScript strict passes
4. `npm run build` — production build succeeds

The `pre-commit` skill (`.claude/skills/pre-commit/`) automates this.
