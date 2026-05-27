# Hooten Young Dashboard

Single React SPA for the Hooten Young platform — consumes the `hooten-young-sales` and `hooten-young-marketing` backends.

## Stack

React 18 · Vite 5 + TypeScript · MUI 6 + Emotion · Recharts · React Router 6 · TanStack Query 5 · ESLint + Prettier

## Quick start

```bash
# 1. Install deps
npm install

# 2. (Optional) Copy env template; defaults work for local dev
cp .env.example .env.local

# 3. Make sure the sales backend is running locally
#    (in the hooten-young-sales repo: uv run uvicorn hy_sales.main:app --reload --port 8000)

# 4. Start the dev server
npm run dev
```

Opens at http://localhost:5173. Requests to `/api/*` are proxied to `http://localhost:8000` automatically (see `vite.config.ts`).

## Scripts

| Command                | What it does                                           |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Vite dev server with HMR on :5173                      |
| `npm run build`        | Type-check (`tsc -b`) then produce a production bundle |
| `npm run preview`      | Serve the built bundle for a smoke test                |
| `npm run lint`         | ESLint                                                 |
| `npm run typecheck`    | TypeScript strict check (no emit)                      |
| `npm run format`       | Prettier format in place                               |
| `npm run format:check` | Prettier check (CI)                                    |

## Repo guide

- [`CLAUDE.md`](./CLAUDE.md) — project context + conventions. **Read this first.**
- [`src/api/`](./src/api/) — typed API clients (one module per backend domain).
- [`src/components/`](./src/components/) — UI components.
- [`src/theme.ts`](./src/theme.ts) — MUI theme (HY brand: dark + warm amber).
- [`vite.config.ts`](./vite.config.ts) — dev server + proxy config.
- [`.claude/`](./.claude/) — Claude Code config (agents, commands, skills).

## Production env vars

In dev, the Vite proxy handles backend routing. In prod (Cloud Run), set:

- `VITE_API_BASE_URL` — the deployed sales backend URL (e.g. `https://hy-sales-api-prod-...run.app`).
