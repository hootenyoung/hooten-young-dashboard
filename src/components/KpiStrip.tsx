import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useSalesKpis, type DateRange } from '../api/sales';
import { colors } from '../theme';

interface KpiStripProps {
  range?: DateRange;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return currencyFormatter.format(Number(value));
}

function formatNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return numberFormatter.format(Number(value));
}

export function KpiStrip({ range }: KpiStripProps) {
  const { data, isLoading, error } = useSalesKpis(range);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${colors.error}40`,
          bgcolor: `${colors.error}05`,
        }}
      >
        <Typography color="error">Failed to load KPIs: {error.message}</Typography>
      </Paper>
    );
  }

  const items = [
    { label: 'Revenue', value: formatCurrency(data?.total_revenue) },
    { label: 'Cases', value: formatNumber(data?.total_cases) },
    { label: 'Commission (10%)', value: formatCurrency(data?.total_commission) },
    { label: 'Invoices', value: formatNumber(data?.total_invoices) },
    { label: 'Products', value: formatNumber(data?.unique_products) },
    { label: 'Customers', value: formatNumber(data?.unique_customers) },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 2,
      }}
    >
      {items.map((item) => (
        <Paper
          key={item.label}
          elevation={0}
          sx={{
            p: 2.5,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: '#d1d5db',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {item.label}
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: 22, md: 26 },
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            {isLoading ? <Skeleton width={120} /> : item.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
