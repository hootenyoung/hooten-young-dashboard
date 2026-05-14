---
description: Run the code-reviewer subagent on current/staged React + MUI + Recharts changes
allowed-tools: Read, Bash, Glob, Grep
argument-hint: (optional) path or commit range to focus on
---

Invoke the `code-reviewer` subagent to review changes in this branch.

Default scope:

- Staged changes (`git diff --cached`)
- Unstaged changes (`git diff`)
- Recent commits on this branch not yet on `main` (`git log main..HEAD`)

If `$ARGUMENTS` is provided, narrow the review to that path or commit range.

The subagent should produce:

1. **Bugs** — React 19 + Router 7 + MUI 9 + Recharts 3 + xlsx pitfalls.
2. **Conventions** — Conventional Commits, naming, component layout, parser isolation.
3. **Security** — secrets, CRA env-var leaks, unsafe HTML, sales-data exports.
4. **Performance** — re-render flooding, re-parsing xlsx, Recharts on large datasets, Framer Motion on layout properties.
5. **Sovereignty flags** — any sales data leaving HY-controlled infrastructure.
6. **Suggestions** — non-blocking improvements.

Group findings by severity (blocker / high / medium / nit).
