---
description: Manually trigger a refresh of docs/architecture.md
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
argument-hint: (optional) area of the codebase to focus on
---

Invoke the `architecture-updater` subagent to regenerate `docs/architecture.md` for this repo.

Instructions for the subagent:

- Scan the current state of the repository (folder structure, route tree, component tree, xlsx parsers, chart modules, backend layer if present, external integrations).
- Compare against the existing `docs/architecture.md`.
- Rewrite the file so its six sections (Overview, Folder Structure, Routes & Pages, Data Flow, External Integrations, Deployment) reflect the **current** state of the code — not historical or aspirational state.
- Keep the maintained banner at the top of the file.
- If `$ARGUMENTS` is provided, focus the refresh on that area (e.g. `src/components/charts/`, `src/lib/xlsx/`).

After regeneration, print a brief diff summary of what changed.
