import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useOrderAnalysis, type DateRange } from '../api/sales';
import { colors } from '../theme';

interface OrderAnalysisProps {
  range?: DateRange;
}

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

export function OrderAnalysis({ range }: OrderAnalysisProps) {
  const { data, isLoading, error } = useOrderAnalysis(range);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load order analysis: {error.message}</Typography>
      </Paper>
    );
  }

  if (isLoading || !data) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, mb: 2 }}
        >
          Order Analysis
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const bucketData = data.size_buckets.map((b) => ({
    label: b.label,
    count: b.count,
    revenue: Number(b.revenue),
  }));

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          Order Analysis
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Order size distribution, cross-sell patterns, and distributor reorder frequency.
        </Typography>
      </Box>

      {/* Summary tiles */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: 'Orders', value: numberFormatter.format(data.total_orders) },
          { label: 'Avg Value', value: formatShort(Number(data.avg_order_value)) },
          { label: 'Median', value: formatShort(Number(data.median_order_value)) },
          { label: 'Multi-Product', value: numberFormatter.format(data.multi_product_orders) },
          { label: 'Single-Product', value: numberFormatter.format(data.single_product_orders) },
          { label: 'Repeat Buyers', value: numberFormatter.format(data.repeat_buyers) },
        ].map((tile) => (
          <Box
            key={tile.label}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: `1px solid ${colors.borderLight}`,
              bgcolor: colors.surfaceSubtle,
            }}
          >
            <Typography
              sx={{
                fontSize: 10.5,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {tile.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 20,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              {tile.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Size buckets */}
        <Box>
          <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600, mb: 1 }}>
            Order Size Distribution
          </Typography>
          <Box sx={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bucketData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderLight} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: colors.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: colors.textMuted }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: colors.tooltipBg,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {bucketData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={colors.chartColors[i % colors.chartColors.length] ?? colors.chartPrimary}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Cross-sell pairs */}
        <Box>
          <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600, mb: 1 }}>
            Top Cross-Sell Product Pairs
          </Typography>
          {data.top_product_pairs.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: 13, py: 3 }}>
              Not enough multi-product orders yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.top_product_pairs.map((pair) => (
                <Box
                  key={`${pair.product_a_id}-${pair.product_b_id}`}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.25,
                    borderRadius: 1.5,
                    border: `1px solid ${colors.borderLight}`,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.textPrimary,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pair.product_a_name}{' '}
                      <Box component="span" sx={{ color: colors.textMuted, fontWeight: 400 }}>
                        +
                      </Box>{' '}
                      {pair.product_b_name}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.chartPrimary,
                      ml: 1,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {pair.count}x
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Distributor frequency */}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600, mb: 1 }}>
          Distributor Reorder Frequency
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 1,
          }}
        >
          {data.distributor_frequency.slice(0, 9).map((d) => (
            <Box
              key={d.distributor_id ?? d.distributor_name ?? 'unknown'}
              sx={{
                p: 1.25,
                borderRadius: 1.5,
                border: `1px solid ${colors.borderLight}`,
                bgcolor: colors.surfaceSubtle,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: colors.textPrimary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.distributor_name ?? 'Unmapped'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                  mt: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
                  {d.order_count} order{d.order_count !== 1 ? 's' : ''}
                </Typography>
                <Typography
                  sx={{ fontSize: 11.5, color: colors.textSecondary, fontWeight: 600 }}
                >
                  avg {formatShort(Number(d.avg_order_value))}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
