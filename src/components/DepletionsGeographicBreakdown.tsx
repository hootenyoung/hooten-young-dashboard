import { useDepletionsByState } from '../api/depletions';
import type { DateRange } from '../api/sales';
import { RankedBarList, type RankedBarItem } from './RankedBarList';

interface DepletionsGeographicBreakdownProps {
  range?: DateRange;
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export function DepletionsGeographicBreakdown({ range }: DepletionsGeographicBreakdownProps) {
  const { data, isLoading, error } = useDepletionsByState(range);

  const total9L = Number(data?.total_9l ?? 0);
  const knownStates = (data?.states ?? []).filter((s) => s.state_code !== null);
  const unknownState = (data?.states ?? []).find((s) => s.state_code === null);

  const items: RankedBarItem[] = knownStates.map((s) => ({
    id: s.state_code as string,
    label: s.state_code as string,
    value: Number(s.cases_9l),
    displayValue: `${numberFormatter.format(Number(s.cases_9l))} cs`,
    pct: s.pct_of_9l,
    sublabel: `${s.account_count} accounts`,
  }));

  const summary: Array<{ label: string; value: string }> = [
    { label: '9L Cases', value: numberFormatter.format(total9L) },
    { label: 'States', value: String(knownStates.length) },
  ];

  if (unknownState && Number(unknownState.cases_9l) > 0) {
    summary.push({
      label: 'Unmapped',
      value: numberFormatter.format(Number(unknownState.cases_9l)),
    });
  }

  return (
    <RankedBarList
      title="Depletions by State"
      caption="9-liter pull-through volume by account state"
      items={items}
      isLoading={isLoading}
      error={error}
      summary={summary}
    />
  );
}
