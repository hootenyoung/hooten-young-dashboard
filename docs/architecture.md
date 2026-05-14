# Architecture — Hooten Young Dashboard

> **Maintained by `architecture-updater`.** Refresh this file via `/sync-architecture` after structural changes. Manual edits will survive but may be reconciled on the next run.

## Overview

`hooten-young-dashboard` is the internal weekly sales-review tool for Hooten Young leadership. Every Friday, an Excel sales report is uploaded; the dashboard parses it, surfaces trends and breakdowns, and (eventually) cross-references the numbers against social and competitor intelligence from the sibling `hooten-young-analytics` repo.

This is one of three repositories in the HY system:

- `hooten-young-ui` — public website.
- `hooten-young-dashboard` (this repo) — internal weekly sales review.
- `hooten-young-analytics` — social + competitor intelligence engine.

Integration with the sibling repos happens through shared infrastructure (Postgres database), not shared code.

**Current state:** Pre-implementation. The CRA app has not been initialized yet. This document will fill in as the codebase grows.

**Planned stack:** React 19 (CRA) · React Router DOM 7 · MUI 9 + Emotion · Framer Motion 12 · Recharts 3 · SheetJS (xlsx) · GCP hosting.

## Folder Structure

```
hooten-young-dashboard/
├── .claude/                 # Claude Code config: agents, commands, skills, settings
├── docs/                    # Architecture, onboarding
├── scripts/                 # Shell automation (setup, deploy, data)
├── .env.example             # Env var template
├── .gitignore
├── .mcp.json                # MCP server config (github, postgres, playwright, filesystem)
├── CLAUDE.md                # Repo-level Claude Code guidance
└── README.md
```

After `npx create-react-app .` runs (or the dev wires CRA manually), expect:

```
├── public/                  # Static assets, index.html, favicons
├── src/
│   ├── index.jsx            # CRA entrypoint
│   ├── App.jsx              # Top-level layout
│   ├── router.jsx           # React Router 7 route tree
│   ├── routes/              # Page components, one per route
│   ├── components/
│   │   ├── charts/          # Recharts components
│   │   ├── layout/          # AppShell, Header, Sidebar
│   │   └── upload/          # xlsx upload UI
│   ├── lib/
│   │   ├── xlsx/            # SheetJS parsers
│   │   ├── format/          # Currency, date, number formatters
│   │   └── api/             # Backend client (when backend lands)
│   └── theme/               # MUI theme config, fonts
└── package.json
```

## Routes & Pages

_None yet — pre-implementation._

When pages are added, document each:

- URL path
- Component file
- Loader / data source (xlsx upload, backend API, etc.)
- Charts / panels composed inside

Likely Day 1 pages:
- `/` — landing / "drop your Friday report here"
- `/review` — the parsed-report dashboard
- `/skus/:sku` — single-SKU drilldown
- `/settings` — column-mapping config for parser tweaks

## Data Flow (xlsx → state → charts)

_None yet — pre-implementation._

Expected pattern:

1. **Upload.** User drops an xlsx via the upload component.
2. **Parse.** `src/lib/xlsx/parse-weekly-sales.js` validates the workbook structure and returns a typed `ParseResult` (rows + warnings + source sheet).
3. **Audit.** Optionally, the `data-shape-auditor` agent (via `/audit-upload`) validates against the previous week's shape and flags drift.
4. **State.** Parsed rows live in React state (likely via a context or zustand) for the session. Persistence shape TBD (localStorage vs backend vs Postgres).
5. **Compute.** Pure functions in `src/lib/` aggregate parsed rows into chart-ready datasets (by week, by channel, by SKU, etc.).
6. **Render.** Chart components in `src/components/charts/` render the datasets via Recharts.

## External Integrations

_None wired yet. Anticipated:_

- **Shared Postgres (with `hooten-young-analytics`).** Backend layer in this repo (TBD shape — Node/Express, BaaS, or call analytics' FastAPI) wraps DB access. The schema is owned by `hooten-young-analytics`.
- **GCS bucket (optional).** Persist uploaded xlsx files for audit history.
- **Auth provider (TBD).** Internal use only; likely Google Workspace SSO via OAuth or a simple identity-aware proxy in front of Cloud Run.

Update this section as each integration lands. Each entry should include: what it is, which module wires it up, which env vars it needs, and what fails when it's misconfigured.

## Deployment

_None yet — no build config, no CI._

Planned:

- **Hosting.** GCP — most likely Cloud Run serving the CRA `build/` output via a small static server (or App Engine standard for static hosting).
- **Build.** CRA's `npm run build` produces `build/`. Image is built via Buildpacks (`gcp-build` script hint).
- **Auth.** Identity-aware proxy or Workspace SSO in front of the Cloud Run service.
- **CI.** GitHub Actions: lint + tests + build on every PR; build + deploy on merge to `main`.

Document the actual deployment shape here once provisioned (project ID, region, service names, IAM roles, auth setup).
