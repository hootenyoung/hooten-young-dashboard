import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useRiskDashboard, type ConcentrationMetric, type DateRange } from '../api/sales';
import { colors } from '../theme';

interface RiskDashboardProps {
  range?: DateRange;
}

function hhiLabel(hhi: number): { label: string; color: string } {
  if (hhi >= 2500) return { label: 'Highly Concentrated', color: colors.error };
  if (hhi >= 1500) return { label: 'Moderately Concentrated', color: colors.warning };
  return { label: 'Competitive / Diversified', color: colors.success };
}

interface ConcentrationCardProps {
  title: string;
  description: string;
  metric: ConcentrationMetric;
}

function ConcentrationCard({ title, description, metric }: ConcentrationCardProps) {
  const hhi = hhiLabel(metric.hhi);
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: '#fff',
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            fontSize: 17,
            color: colors.textPrimary,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
          {description}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, mb: 1.5 }}>
        {[
          { label: 'Top 1', value: metric.top_1_share },
          { label: 'Top 3', value: metric.top_3_share },
          { label: 'Top 5', value: metric.top_5_share },
        ].map((tile) => (
          <Box key={tile.label}>
            <Typography
              sx={{
                fontSize: 10,
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
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 22,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              {(tile.value * 100).toFixed(0)}%
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ pt: 1.5, borderTop: `1px solid ${colors.borderLight}` }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            HHI {metric.hhi.toFixed(0)} / 10000
          </Typography>
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: hhi.color }}>
            {hhi.label}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 6,
            bgcolor: colors.borderLight,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${Math.min(100, (metric.hhi / 10000) * 100)}%`,
              height: '100%',
              bgcolor: hhi.color,
              transition: 'width 0.4s ease',
            }}
          />
        </Box>
        <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.75 }}>
          {metric.entry_count} entries
        </Typography>
      </Box>
    </Box>
  );
}

export function RiskDashboard({ range }: RiskDashboardProps) {
  const { data, isLoading, error } = useRiskDashboard(range);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load risk dashboard: {error.message}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          Risk Dashboard
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Concentration risk across product, distributor, and state dimensions.
        </Typography>
      </Box>

      {isLoading || !data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <ConcentrationCard
            title="Product"
            description="Revenue concentration across SKUs."
            metric={data.product_concentration}
          />
          <ConcentrationCard
            title="Distributor"
            description="Dependency on individual distribution partners."
            metric={data.distributor_concentration}
          />
          <ConcentrationCard
            title="State / Territory"
            description="Geographic revenue concentration."
            metric={data.state_concentration}
          />
        </Box>
      )}
    </Paper>
  );
}
