---
description: Scaffold a new Recharts chart component, consulting the chart-designer for the right chart type and config.
allowed-tools: Read, Write, Edit, Glob, Grep
argument-hint: <chart name> (optional) — e.g. WeeklyRevenueByChannel
---

Activate the `new-chart` skill and consult the `chart-designer` subagent to scaffold a new chart component under `src/components/charts/`.

Steps:

1. Confirm the chart name from `$ARGUMENTS` (PascalCase) or ask the user.
2. Ask the user what question the chart should answer and what data shape feeds it.
3. Call out to the `chart-designer` subagent for the right chart type + Recharts config + known gotchas.
4. Scaffold:
   - `src/components/charts/<ChartName>.jsx` following the standard composition pattern in `.claude/agents/chart-designer.md`.
   - A storybook-style usage example inline in the component's JSDoc.
   - `src/components/charts/__tests__/<ChartName>.test.jsx` with a minimal render test using a fixture dataset.
5. Report:
   - Files created.
   - Chart type chosen + rationale.
   - Recharts gotchas for the chosen chart on the given data shape.
   - Where the component should be imported and rendered.

Do not invent data — if no data shape is provided, scaffold with a `// TODO: feed real data` placeholder and a typed prop interface.
