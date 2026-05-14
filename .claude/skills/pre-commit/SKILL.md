---
name: pre-commit
description: Run lint + tests + build before committing changes. Activate when the user says "ready to commit", "ship it", "let's commit", "before I push", or asks to verify the build is clean.
---

# pre-commit

Run the full pre-commit verification suite for Hooten Young Dashboard: lint, tests, build.

## When to activate

- User signals they are about to commit, push, or merge.
- User asks "is it ready?", "did the build break?", "anything failing?".
- After completing a feature, before reporting it as done.

## Steps

Run these sequentially. Stop on first failure and report.

1. **Lint** — `npm run lint`
   - If `npm run lint` is not defined, fall back to `npx eslint "src/**/*.{js,jsx}"`.
2. **Tests** — `npm test -- --watchAll=false`
   - CRA's test runner defaults to watch mode; the `--watchAll=false` flag forces a one-shot run.
   - Use `--coverage` if the user asks for coverage info.
3. **Build** — `npm run build`
   - CRA's production build catches errors that tests don't — missing env vars, dependency resolution issues, import errors.

## Reporting

- ✅ All three pass → confirm safe to commit.
- ⚠️ One or more fail → print the failing command's output verbatim, identify the root cause, and stop. Do **not** auto-fix without confirmation.

## Notes

- `npm run build` can be slow (~30s+) for a real CRA app with MUI. Don't skip it — CRA's build often surfaces React 19 warnings that the dev server hides.
- If the dev server is running, the build will run anyway but may compete for CPU. Worth pausing the dev server first on slow machines.
- CRA's deprecation means some `npm audit` warnings are expected. Don't try to "fix" them by upgrading react-scripts unless the migration to Vite/Next is on the table.
