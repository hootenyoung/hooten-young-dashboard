import { useSalesByState, type DateRange } from '../api/sales';
import { RankedBarList, type RankedBarItem } from './RankedBarList';

interface GeographicBreakdownProps {
  range?: DateRange;
}

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 100_000) return `$${(value / 1_000).toFixed(0)}K`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

export function GeographicBreakdown({ range }: GeographicBreakdownProps) {
  const { data, isLoading, error } = useSalesByState(range);

  const totalRevenue = Number(data?.total_revenue ?? 0);
  const knownStates = (data?.states ?? []).filter((s) => s.state_code !== null);
  const unknownState = (data?.states ?? []).find((s) => s.state_code === null);

  const items: RankedBarItem[] = knownStates.map((s) => ({
    id: s.state_code as string,
    label: s.state_code as string,
    value: Number(s.revenue),
    displayValue: formatShort(Number(s.revenue)),
    pct: s.pct_of_revenue,
    sublabel: `${numberFormatter.format(Number(s.cases))} cases · ${s.customer_count} customers`,
  }));

  const summary: Array<{ label: string; value: string }> = [
    { label: 'Revenue', value: formatShort(totalRevenue) },
    { label: 'States', value: String(knownStates.length) },
  ];

  if (unknownState && Number(unknownState.revenue) > 0) {
    summary.push({
      label: 'Unmapped',
      value: formatShort(Number(unknownState.revenue)),
    });
  }

  return (
    <RankedBarList
      title="Geographic Breakdown"
      caption="Revenue and cases by customer state"
      items={items}
      isLoading={isLoading}
      error={error}
      summary={summary}
    />
  );
}
