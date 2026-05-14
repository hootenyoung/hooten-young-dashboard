# Project: Hooten Young Dashboard

## About Hooten Young

Hooten Young (HY) is a premium American spirits brand — whiskey and cigars, built around heritage, craft, and a masculine, military-adjacent identity. HY is building a proprietary AI marketing engine that spans **three separate repositories**, each owned independently but designed to integrate at the system level (shared Postgres database, shared APIs/buckets):

1. **`hooten-young-ui`** — public-facing website. (Stack: Next.js 15 + TypeScript + Tailwind.)
2. **`hooten-young-dashboard`** — this repo. Internal weekly sales-review tool.
3. **`hooten-young-analytics`** — social + competitor intelligence engine. (Stack: Python 3.12 + FastAPI + Postgres + GCS, deployed to Cloud Run.)

Integration between repos happens through shared infrastructure (Postgres, GCS, APIs), not shared code. From Claude's perspective, each repo is self-contained.

## This Repo's Purpose

Internal dashboard for HY leadership. Every Friday, HY uploads a sales report (Excel/xlsx). The dashboard parses it, surfaces week-over-week and YoY trends, breaks down by SKU / channel / region, and (eventually) cross-references the sales numbers against social and competitor patterns from the analytics repo.

**Audience:** HY leadership and (eventually) sales team. Internal only — never public.

## Tech Stack

- **Framework:** React 19 (SPA, Create React App with `react-scripts` 5)
- **Routing:** React Router DOM 7
- **UI:** MUI (Material UI) 9 + Emotion (CSS-in-JS for `sx` prop)
- **Animation:** Framer Motion 12
- **Charts:** Recharts 3 (bar, area, line, donut, heatmaps)
- **Data parsing:** SheetJS (`xlsx`) — Excel parsing in the browser
- **Backend:** TBD — see "Open question: backend shape" below
- **Database:** Shared Postgres (same DB as `hooten-young-analytics`)
- **Fonts:** Inter (UI) + Playfair Display (headings)
- **Hosting:** GCP (the `gcp-build` script implies Cloud Run or App Engine)

### Note on CRA

Create React App is officially deprecated by the React Team (2023). React 19 works with CRA but doesn't get first-class support. **This is intentional for now** — moving to Vite or Next.js is a known future migration, not a Day 1 task. If you (or Claude) touch the build config, do not silently introduce features that depend on a modern bundler.

### Open question: backend shape

The dashboard needs to read from and write to the shared Postgres. Browsers cannot talk to Postgres directly. There are three plausible backend shapes:

1. **Thin Node/Express backend in this repo.** Self-contained. Deploys alongside the SPA. Default assumption.
2. **Call `hooten-young-analytics`'s FastAPI.** Zero backend code here; coupling across repos.
3. **Supabase or similar BaaS wrapping the shared Postgres.** Frontend → Supabase REST, no custom backend.

Confirm with the project lead which shape is canonical. This scaffold does **not** include a backend yet — when the decision is made, add the appropriate layer and update this section + `docs/architecture.md`.

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- **No `Co-Authored-By: Claude` lines** in commit messages.
- **Workflow:** PR-based; feature branches off `main`.
- **Components:** Function components only. Named exports (no `default`).
- **File naming:** PascalCase for components (`SalesChart.jsx`), kebab-case for non-component utilities (`format-currency.js`).
- **Styling:** MUI `sx` prop for one-off styling; `styled()` from MUI/Emotion for repeated patterns. Avoid raw CSS files unless dealing with global resets / font imports.
- **State:** Local React state by default; lift up only when needed; no Redux unless a real cross-cutting need appears.
- **Charts:** Recharts inside a `ResponsiveContainer`. Always set `dataKey` and a stable `key` prop on dynamic chart elements.
- **xlsx parsing:** keep parsing logic in `src/lib/xlsx/`, not inside components. Components consume parsed, typed data.

## Architecture

See [docs/architecture.md](docs/architecture.md). That document is **maintained by the `architecture-updater` subagent** — run `/sync-architecture` after structural changes (new routes, new chart modules, new ingestion sources) to refresh it.

## Security & Compliance

- **Internal use only.** No public access. Add auth before exposing this dashboard outside HQ.
- **Data sovereignty.** Per the HY SOW, **all data and insights belong to Hooten Young.** Do not export sales data to third-party analytics tools without explicit approval.
- **No secrets in code.** Never commit API keys, DB URLs, or service-account JSON. CRA exposes any `REACT_APP_*` env var to the browser bundle — only put non-secret values in `REACT_APP_*` vars. Secrets must live behind a backend.
- **PII / financial data.** Sales reports contain sensitive commercial data. Don't log raw rows. Don't paste sample data into public chat/issue trackers.
- **Uploaded xlsx files.** Parse in-browser; do not upload to third-party services. If/when uploads go to a backend, route through GCP infra (Cloud Storage with private ACL).

## Pre-commit checklist

Before every commit:

1. `npm run lint` — passes
2. `npm test -- --watchAll=false` — passes (CRA's test runner is non-interactive in CI)
3. `npm run build` — passes (catches things tests don't, like env-var resolution)

The `pre-commit` skill (`.claude/skills/pre-commit/`) automates this.
