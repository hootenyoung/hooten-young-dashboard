# Onboarding — Hooten Young Dashboard

Welcome. This is the internal weekly sales-review dashboard for Hooten Young. It is one of three repos in the HY system; see [CLAUDE.md](../CLAUDE.md) for the big picture.

## Before you start

You'll need:

- **Node.js 18+** (CRA 5 requires Node 14+, but use 18 LTS or 20 LTS for React 19 compatibility).
- **npm** (CRA ships with npm; if you prefer pnpm/yarn, fine, but lockfile coordination is your job).
- **GitHub access** — write access to `hooten-young-dashboard`.
- **GCP access** — read access to the HY GCP project for deployment and (later) shared Postgres connectivity. Ask the project lead.
- **A recent weekly sales xlsx** — needed to drive the parser. Get an anonymized sample from the project lead before committing fixtures.
- **Claude Code** — recommended. The repo has `.claude/` configured with subagents, slash commands, and skills tailored for this repo.

## First-time setup

```bash
git clone https://github.com/hootenyoung/hooten-young-dashboard.git
cd hooten-young-dashboard

# Initialize CRA in this repo (one time, if not already done — confirm with the project lead first)
# npx create-react-app . --template typescript    # if going TS
# npx create-react-app .                          # JS variant

# Install runtime deps for the stack
# npm install react-router-dom @mui/material @emotion/react @emotion/styled \
#   framer-motion recharts xlsx

# Copy env template and fill in values
cp .env.example .env.local

# Run dev server
npm start
```

Opens at http://localhost:3000.

## Environment vars

CRA exposes any var prefixed with `REACT_APP_*` to the **browser bundle**. Anything in `REACT_APP_*` is public. Secrets (DB URLs, server-side API keys) must live behind a backend — never in `REACT_APP_*` vars or the browser bundle.

See `.env.example` for the current list and what each var is for. **Never commit `.env*.local` files.**

## Working with the weekly xlsx report

1. Get an anonymized sample report from the project lead. Place it at `tests/fixtures/xlsx/weekly-sales-sample.xlsx` for parser development.
2. Real reports never get committed — `.gitignore` excludes `*.xlsx` outside `tests/fixtures/`.
3. When the report format changes (it will), use:
   - `/audit-upload <path>` — invokes the `data-shape-auditor` to identify what drifted.
   - The `xlsx-parser` subagent to update `src/lib/xlsx/parse-weekly-sales.js`.
   - Add a regression fixture under `tests/fixtures/xlsx/` for the new shape.

## Running tests

```bash
npm test                                # interactive watch mode
npm test -- --watchAll=false            # one-shot (CI mode)
npm test -- --coverage --watchAll=false # with coverage
```

## Daily workflow

1. Pull `main`, branch off (`git checkout -b feat/your-thing`).
2. Make changes. Use the `new-chart` or `new-page` skill when adding charts/routes so structure stays consistent.
3. If you touched xlsx parsing, run `/audit-upload <sample.xlsx>` to confirm no regression.
4. Use `/review` to invoke the code-reviewer subagent before opening a PR.
5. Run the pre-commit skill: `npm run lint && npm test -- --watchAll=false && npm run build`.
6. Commit with [Conventional Commits](https://www.conventionalcommits.org/) format — `feat:`, `fix:`, `chore:`, etc. **No `Co-Authored-By: Claude` lines.**
7. Open a PR. CI will run the same checks.

## What's in `.claude/`

- **`agents/`** — subagents specialized for this repo:
  - `architecture-updater` — refreshes `docs/architecture.md` via `/sync-architecture`.
  - `code-reviewer` — React 19 + Router 7 + MUI 9 + Recharts 3 + xlsx pitfalls.
  - `xlsx-parser` — defensive Excel parsing; schema validation; drift handling.
  - `chart-designer` — picks the right Recharts chart for the question and writes the config.
  - `data-shape-auditor` — validates an uploaded xlsx before promoting it to the dashboard.
- **`commands/`** — slash commands: `/review`, `/sync-architecture`, `/audit-upload`, `/new-chart`.
- **`skills/`** — `new-chart`, `new-page`, `pre-commit`.
- **`settings.json`** — safe Stop hook (timestamps a session log); PreToolUse hook that blocks destructive bash commands.

When in doubt, ask Claude — it has the repo's conventions in context via [CLAUDE.md](../CLAUDE.md).

## Open question: backend shape

The dashboard needs to read from / write to the shared Postgres (owned by `hooten-young-analytics`). Browsers can't talk to Postgres directly. The current scaffold does **not** include a backend. Confirm with the project lead which shape is canonical:

1. Thin Node/Express backend in this repo.
2. Call `hooten-young-analytics`'s FastAPI directly.
3. Supabase or similar BaaS wrapping the shared Postgres.

Once decided, add the appropriate layer and update [CLAUDE.md](../CLAUDE.md) + [architecture.md](architecture.md).

## Compliance + data sovereignty — read this once

Per the HY SOW, **all sales data and insights belong to HY** — the vendor cannot reuse or license them elsewhere.

- Sales data is sensitive commercial info. Don't log raw rows. Don't paste sample data into public chat/issue trackers.
- Don't post uploaded xlsx files to third-party services (parser-preview tools, online viewers).
- `*-service-account*.json` and `.env*` files are gitignored — keep it that way.

When in doubt, flag it for the project lead.

## Who owns what

- **`hooten-young-ui`** — public website. Different developer focus.
- **`hooten-young-dashboard`** — this repo.
- **`hooten-young-analytics`** — competitor + social intelligence. Different developer.

Cross-repo work means coordinating at the database/API layer. The Postgres schema is owned by `hooten-young-analytics`; this dashboard consumes it (mostly read-only). Coordinate any schema changes via PR + a ping to the analytics owner.

## Helpful pointers

- Architecture: [architecture.md](architecture.md) (maintained by `architecture-updater`).
- Chart design opinions: `.claude/agents/chart-designer.md`.
- xlsx parsing opinions: `.claude/agents/xlsx-parser.md`.
- Project SOW (scope, deliverables, IP terms) — ask the project lead.
