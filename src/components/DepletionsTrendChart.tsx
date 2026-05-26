import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useDepletionsTrend } from '../api/depletions';
import type { DateRange } from '../api/sales';
import { colors } from '../theme';

interface DepletionsTrendChartProps {
  range?: DateRange;
}

function monthLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export function DepletionsTrendChart({ range }: DepletionsTrendChartProps) {
  const { data, isLoading, error } = useDepletionsTrend(range);

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
        <Typography color="error">Failed to load depletion trend: {error.message}</Typography>
      </Paper>
    );
  }

  const chartData =
    data?.points.map((point) => ({
      period: monthLabel(point.period),
      cases_9l: Number(point.cases_9l),
      cases_physical: Number(point.cases_physical),
      active_accounts: point.active_accounts,
    })) ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        minHeight: 380,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 0.5, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
      >
        Monthly Depletion Volume
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        9-liter equivalents and physical cases per month
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : chartData.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          No data
        </Typography>
      ) : (
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="depletion9LFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chartPrimary} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.chartPrimary} stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="depletionPhysicalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chartTertiary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.chartTertiary} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} />
              <XAxis
                dataKey="period"
                stroke={colors.textMuted}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke={colors.textMuted}
                tickFormatter={(value) => numberFormatter.format(Number(value))}
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: colors.tooltipBg,
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: 8,
                  color: '#fff',
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number | string) => numberFormatter.format(Number(value))}
              />
              <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
              <Area
                type="monotone"
                name="9L Cases"
                dataKey="cases_9l"
                stroke={colors.chartPrimary}
                strokeWidth={2.5}
                fill="url(#depletion9LFill)"
              />
              <Area
                type="monotone"
                name="Physical Cases"
                dataKey="cases_physical"
                stroke={colors.chartTertiary}
                strokeWidth={2}
                fill="url(#depletionPhysicalFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
