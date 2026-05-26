import { useDepletionsByProduct } from '../api/depletions';
import type { DateRange } from '../api/sales';
import { RankedBarList, type RankedBarItem } from './RankedBarList';

interface DepletionsProductPerformanceProps {
  range?: DateRange;
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export function DepletionsProductPerformance({ range }: DepletionsProductPerformanceProps) {
  const { data, isLoading, error } = useDepletionsByProduct(range);

  const total9L = Number(data?.total_9l ?? 0);

  const items: RankedBarItem[] =
    data?.products.map((p) => ({
      id: p.product_id,
      label: p.product_name,
      value: Number(p.cases_9l),
      displayValue: `${numberFormatter.format(Number(p.cases_9l))} cs`,
      pct: p.pct_of_9l,
      sublabel: `${p.account_count} accounts · ${p.state_count} states`,
    })) ?? [];

  return (
    <RankedBarList
      title="Depletions by Product"
      caption="9-liter case volume per SKU, retail pull-through"
      items={items}
      isLoading={isLoading}
      error={error}
      summary={[
        { label: '9L Cases', value: numberFormatter.format(total9L) },
        { label: 'SKUs', value: String(items.length) },
      ]}
    />
  );
}
