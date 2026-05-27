---
name: new-chart
description: Scaffold a new Recharts chart component following Hooten Young Dashboard conventions. Activate when the user asks to "add a chart", "visualize X", "make a bar/line/area/heatmap of Y", or names a new chart component to build.
---

# new-chart

Create a new chart component in `src/components/charts/`, consulting the `chart-designer` subagent for the right chart type and Recharts configuration.

## When to activate

- User asks to add / create / scaffold a chart.
- User describes a question to visualize ("how did DTC do vs retail by week").
- User names a chart component (`WeeklyRevenueByChannel`, `SkuLeaderboard`, etc.).

## Conventions to follow

1. **Location** — `src/components/charts/<ChartName>.jsx`. One chart per file.
2. **Naming** — PascalCase. Name should describe the question, not the chart type ("WeeklyRevenueByChannel" is better than "WeeklyBarChart").
3. **Composition** — always wrap in `<ResponsiveContainer width="100%" height={H}>`. Default `height={320}` unless the caller overrides via prop.
4. **Props** — `data` is the only required prop. Optional `height`, `loading`, `emptyMessage`. No internal data fetching — components are pure rendering.
5. **Formatting** — currency / date / number formatters live in `src/lib/format/`, not inline.
6. **Theme** — pull colors from MUI theme (`useTheme()` or CSS variables like `var(--mui-palette-primary-main)`); never hardcode hex.
7. **Tests** — `src/components/charts/__tests__/<ChartName>.test.jsx` with at least a render test against a fixture dataset.

## Steps

1. Confirm the chart name + the question it answers.
2. Ask the `chart-designer` subagent for chart type, Recharts config, and gotchas.
3. Create the `.jsx` file with the standard composition pattern (see `.claude/agents/chart-designer.md`).
4. Create the test file with a minimal render test.
5. Update any index/barrel file in `src/components/charts/` if one exists.
6. Report the created file paths + chart-designer's rationale + import example.

## Template

```jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';

/**
 * <ChartName> — <one-line description of the question this answers>.
 *
 * Usage:
 *   <ChartName data={parsedSalesData.byWeekChannel} />
 */
export function ChartName({ data, height = 320 }) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 16, right: 16, bottom: 24, left: 24 }}>
        <XAxis dataKey="weekEnding" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={theme.palette.primary.main} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

## Do NOT

- Fetch data inside the component. Components render; routes/pages fetch.
- Pre-format the `data` prop. Use Recharts `tickFormatter` / `Tooltip formatter` instead.
- Hardcode pixel widths.
- Use `<PieChart>` for >5 slices — push back and propose a ranked `<BarChart>`.
