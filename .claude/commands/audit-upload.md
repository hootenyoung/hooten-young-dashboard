---
description: Audit an uploaded xlsx sales report for shape drift, missing columns, type issues, and other anomalies before promoting it to the dashboard.
allowed-tools: Read, Bash, Glob, Grep
argument-hint: <path to xlsx file>
---

Invoke the `data-shape-auditor` subagent to check that an uploaded sales report matches the expected shape and is safe to feed into the dashboard.

Input handling:

- `$ARGUMENTS` should be a path to the xlsx file to audit. The file is local (do not upload).
- If `$ARGUMENTS` is empty, ask the user for the file path.

The subagent should:

1. Reuse the parsers in `src/lib/xlsx/` to read the file — do not reimplement parsing.
2. Run workbook-structure, header-row, row-sanity, type-sanity, and cross-row-sanity checks (see `.claude/agents/data-shape-auditor.md` for the full list).
3. Output a structured audit report with blockers, warnings, and suggested remediation.

If the audit reveals format drift (renamed columns, new columns), the subagent should flag specifically which parser needs updating and route to the `xlsx-parser` subagent for the actual fix.
