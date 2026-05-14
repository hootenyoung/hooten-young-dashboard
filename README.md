# Hooten Young Dashboard

Internal weekly sales-review dashboard for **Hooten Young** — a premium American spirits brand (whiskey + cigars). Every Friday, HY uploads a sales report (Excel/xlsx); the dashboard parses it, surfaces trends and breakdowns, and (eventually) cross-references the numbers against social/competitor intelligence from `hooten-young-analytics`. One of three repos in the HY AI marketing engine; the others are `hooten-young-ui` (public website) and `hooten-young-analytics` (social + competitor intelligence).

## Stack

React 19 (CRA) · React Router 7 · MUI 9 + Emotion · Framer Motion 12 · Recharts 3 · SheetJS (xlsx) · GCP

> **Note:** Create React App is deprecated upstream; we use it deliberately for now. Vite/Next migration is a known future task — see `CLAUDE.md`.

## Quick start

```bash
# 1. Install deps
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Run dev server
npm start
```

Opens at http://localhost:3000.

## Pre-commit

```bash
npm run lint && npm test -- --watchAll=false && npm run build
```

The `pre-commit` skill in `.claude/skills/pre-commit/` automates this.

## Repo guide

- [`CLAUDE.md`](./CLAUDE.md) — project context, conventions, open backend question. **Read this first.**
- [`docs/architecture.md`](./docs/architecture.md) — current architecture (maintained by the `architecture-updater` subagent; refresh with `/sync-architecture`).
- [`docs/onboarding.md`](./docs/onboarding.md) — new-developer setup guide.
- [`.claude/`](./.claude/) — Claude Code config (hooks, agents, skills, slash commands).
- [`.mcp.json`](./.mcp.json) — MCP server wiring (GitHub, Postgres, Playwright, Filesystem).
- [`scripts/`](./scripts/) — automation scripts (setup, deploy, data).
- [`src/`](./src/) — application source.

## Security

Internal use only. Sales data is sensitive — no exports to third-party tools without approval. CRA exposes any `REACT_APP_*` env var to the browser bundle; never put secrets there. See [`CLAUDE.md`](./CLAUDE.md#security--compliance).
