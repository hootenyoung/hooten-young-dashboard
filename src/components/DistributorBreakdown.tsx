import { useSalesByDistributor, type DateRange } from '../api/sales';
import { RankedBarList, type RankedBarItem } from './RankedBarList';

interface DistributorBreakdownProps {
  range?: DateRange;
}

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 100_000) return `$${(value / 1_000).toFixed(0)}K`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

const CHANNEL_LABEL: Record<string, string> = {
  distributor: 'Distributor',
  control_state: 'Control State',
  military: 'Military',
  other: 'Other',
};

export function DistributorBreakdown({ range }: DistributorBreakdownProps) {
  const { data, isLoading, error } = useSalesByDistributor(range);

  const totalRevenue = Number(data?.total_revenue ?? 0);
  const known = (data?.distributors ?? []).filter((d) => d.distributor_name !== null);
  const unknown = (data?.distributors ?? []).find((d) => d.distributor_name === null);

  const items: RankedBarItem[] = known.map((d) => {
    const channelLabel = d.channel ? (CHANNEL_LABEL[d.channel] ?? d.channel) : 'Distributor';
    return {
      id: d.distributor_id ?? d.distributor_name ?? 'unknown',
      label: d.distributor_name ?? 'Unknown',
      value: Number(d.revenue),
      displayValue: formatShort(Number(d.revenue)),
      pct: d.pct_of_revenue,
      sublabel: `${channelLabel} · ${numberFormatter.format(Number(d.cases))} cases · ${d.customer_count} customers`,
    };
  });

  const summary: Array<{ label: string; value: string }> = [
    { label: 'Revenue', value: formatShort(totalRevenue) },
    { label: 'Distributors', value: String(known.length) },
  ];

  if (unknown && Number(unknown.revenue) > 0) {
    summary.push({
      label: 'Unmapped',
      value: formatShort(Number(unknown.revenue)),
    });
  }

  return (
    <RankedBarList
      title="Distributor Breakdown"
      caption="Revenue and cases by parent distributor / channel"
      items={items}
      isLoading={isLoading}
      error={error}
      summary={summary}
    />
  );
}
