import {
  Box,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSalesTrend, type DateRange } from '../api/sales';
import { colors } from '../theme';

interface RevenueTrendChartProps {
  range?: DateRange;
}

type Grain = 'month' | 'week';

function formatPeriod(iso: string, grain: Grain): string {
  const d = new Date(iso);
  if (grain === 'week') {
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function RevenueTrendChart({ range }: RevenueTrendChartProps) {
  const [grain, setGrain] = useState<Grain>('month');
  const { data, isLoading, error } = useSalesTrend(range, grain);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load revenue trend: {error.message}</Typography>
      </Paper>
    );
  }

  const chartData =
    data?.points.map((point) => ({
      period: formatPeriod(point.period, grain),
      revenue: Number(point.revenue),
      cases: Number(point.cases),
    })) ?? [];

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, minHeight: 380, border: `1px solid ${colors.border}`, borderRadius: 2 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
          >
            Revenue Trend
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {grain === 'month'
              ? 'Total invoice amount per month'
              : 'Total invoice amount per ISO week'}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={grain}
          exclusive
          size="small"
          onChange={(_, v: Grain | null) => v && setGrain(v)}
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.75,
              py: 0.4,
              fontSize: 12,
              fontWeight: 600,
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
              '&.Mui-selected': {
                bgcolor: `${colors.chartPrimary}10`,
                color: colors.chartPrimary,
                borderColor: `${colors.chartPrimary}40`,
              },
            },
          }}
        >
          <ToggleButton value="month">Monthly</ToggleButton>
          <ToggleButton value="week">Weekly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chartPrimary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.chartPrimary} stopOpacity={0.04} />
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
                tickFormatter={(value) => currencyFormatter.format(Number(value))}
                tickLine={false}
                axisLine={false}
                width={80}
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
                formatter={(value: number | string) => currencyFormatter.format(Number(value))}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={colors.chartPrimary}
                strokeWidth={2.5}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
