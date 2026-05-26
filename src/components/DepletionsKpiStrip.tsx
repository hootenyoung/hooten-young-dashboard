import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { useDepletionsKpis } from '../api/depletions';
import type { DateRange } from '../api/sales';
import { colors } from '../theme';

interface DepletionsKpiStripProps {
  range?: DateRange;
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
const wholeNumberFormatter = new Intl.NumberFormat('en-US');

function formatCases(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return numberFormatter.format(Number(value));
}

function formatNumber(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return wholeNumberFormatter.format(Number(value));
}

export function DepletionsKpiStrip({ range }: DepletionsKpiStripProps) {
  const { data, isLoading, error } = useDepletionsKpis(range);

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
        <Typography color="error">Failed to load depletions KPIs: {error.message}</Typography>
      </Paper>
    );
  }

  const items = [
    { label: '9L Cases', value: formatCases(data?.total_9l) },
    { label: 'Physical Cases', value: formatCases(data?.total_physical) },
    { label: 'Accounts', value: formatNumber(data?.unique_accounts) },
    { label: 'Products', value: formatNumber(data?.unique_products) },
    { label: 'States', value: formatNumber(data?.unique_states) },
    { label: 'Avg 9L / Account', value: formatCases(data?.avg_9l_per_account) },
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
            transition: 'border-color 0.2s, box-shadow 0.2s',
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
