import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import {
  useRiskDashboard,
  useSalesByDistributor,
  useSalesByProduct,
  useSalesByState,
  useSalesTrend,
  type DateRange,
} from '../api/sales';
import { colors } from '../theme';

interface RecommendationsProps {
  range?: DateRange;
}

type RecType = 'success' | 'opportunity' | 'warning' | 'insight';

interface Recommendation {
  id: string;
  type: RecType;
  category: string;
  title: string;
  action: string;
  metrics: Array<{ label: string; value: string; highlight?: boolean }>;
}

const TYPE_STYLE: Record<RecType, { color: string; icon: typeof CheckCircleIcon }> = {
  success: { color: colors.success, icon: CheckCircleIcon },
  opportunity: { color: colors.chartPrimary, icon: InsightsIcon },
  warning: { color: colors.warning, icon: WarningAmberIcon },
  insight: { color: colors.info, icon: TrendingUpIcon },
};

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

export function Recommendations({ range }: RecommendationsProps) {
  const trend = useSalesTrend(range);
  const products = useSalesByProduct(range);
  const states = useSalesByState(range);
  const distributors = useSalesByDistributor(range);
  const risk = useRiskDashboard(range);

  const isLoading =
    trend.isLoading ||
    products.isLoading ||
    states.isLoading ||
    distributors.isLoading ||
    risk.isLoading;

  const recommendations: Recommendation[] = useMemo(() => {
    if (!trend.data || !products.data || !states.data || !distributors.data || !risk.data) {
      return [];
    }

    const recs: Recommendation[] = [];
    const trendPts = trend.data.points;
    const productList = products.data.products;
    const stateList = states.data.states.filter((s) => s.state_code !== null);
    const distList = distributors.data.distributors.filter((d) => d.distributor_name !== null);
    const totalRev = Number(products.data.total_revenue);

    // 1. Growth momentum (first vs last bucket)
    if (trendPts.length >= 2) {
      const first = Number(trendPts[0]?.revenue ?? 0);
      const last = Number(trendPts[trendPts.length - 1]?.revenue ?? 0);
      if (first > 0) {
        const growth = ((last - first) / first) * 100;
        if (growth > 20) {
          recs.push({
            id: 'growth-momentum',
            type: 'success',
            category: 'Growth',
            title: `Revenue Up ${growth.toFixed(0)}% Across Period`,
            action: 'Sustain trajectory — accelerate distributor activations and marketing spend.',
            metrics: [
              { label: 'First', value: formatShort(first) },
              { label: 'Latest', value: formatShort(last) },
              { label: 'Growth', value: `+${growth.toFixed(0)}%`, highlight: true },
            ],
          });
        } else if (growth < -10) {
          recs.push({
            id: 'growth-decline',
            type: 'warning',
            category: 'Growth',
            title: `Revenue Down ${Math.abs(growth).toFixed(0)}% Across Period`,
            action: 'Investigate root cause — distributor pullback, seasonality, or pricing pressure?',
            metrics: [
              { label: 'First', value: formatShort(first) },
              { label: 'Latest', value: formatShort(last), highlight: true },
              { label: 'Change', value: `${growth.toFixed(0)}%` },
            ],
          });
        }
      }
    }

    // 2. Product concentration (top 3 share)
    if (productList.length >= 3 && totalRev > 0) {
      const top3 = productList.slice(0, 3).reduce((s, p) => s + Number(p.revenue), 0);
      const top3Pct = (top3 / totalRev) * 100;
      if (top3Pct > 60) {
        recs.push({
          id: 'product-concentration',
          type: 'warning',
          category: 'Risk',
          title: `Top 3 Products = ${top3Pct.toFixed(0)}% of Revenue`,
          action: 'Grow the long-tail SKUs to reduce single-product dependency.',
          metrics: productList.slice(0, 3).map((p) => ({
            label: shortName(p.product_name),
            value: formatShort(Number(p.revenue)),
          })),
        });
      }
    }

    // 3. Distributor concentration
    if (distList.length >= 1 && totalRev > 0) {
      const top = distList[0];
      if (top) {
        const share = Number(top.revenue) / totalRev;
        if (share > 0.25) {
          recs.push({
            id: 'distributor-concentration',
            type: 'warning',
            category: 'Distribution',
            title: `${top.distributor_name} = ${(share * 100).toFixed(0)}% of Revenue`,
            action: 'Activate 2-3 additional regional distributors to reduce partner risk.',
            metrics: [
              {
                label: top.distributor_name ?? 'Top',
                value: formatShort(Number(top.revenue)),
                highlight: true,
              },
              { label: 'Share', value: `${(share * 100).toFixed(0)}%` },
              {
                label: 'Next',
                value: distList[1] ? formatShort(Number(distList[1].revenue)) : 'N/A',
              },
            ],
          });
        }
      }
    }

    // 4. Geographic expansion opportunity
    if (stateList.length >= 5) {
      const topState = stateList[0];
      const underperforming = stateList.filter((s) => Number(s.revenue) < 5000);
      if (topState && underperforming.length >= 3) {
        const topName = topState.state_code ?? 'top state';
        recs.push({
          id: 'geographic-expansion',
          type: 'opportunity',
          category: 'Expansion',
          title: `${underperforming.length} Underperforming Markets`,
          action: `Replicate the ${topName} activation playbook in ${underperforming
            .slice(0, 3)
            .map((s) => s.state_code)
            .join(', ')}.`,
          metrics: [
            {
              label: `${topName} (best)`,
              value: formatShort(Number(topState.revenue)),
              highlight: true,
            },
            { label: 'Underperforming', value: `${underperforming.length} states` },
            {
              label: 'Potential',
              value: formatShort(underperforming.length * Number(topState.revenue) * 0.3),
            },
          ],
        });
      }
    }

    // 5. HHI snapshot
    const productHhi = risk.data.product_concentration.hhi;
    if (productHhi > 0) {
      recs.push({
        id: 'concentration-snapshot',
        type: 'insight',
        category: 'Diversification',
        title: 'Portfolio Diversification Snapshot',
        action:
          productHhi < 1500
            ? 'Healthy spread across SKUs — keep nurturing the long tail.'
            : productHhi < 2500
              ? 'Moderately concentrated — keep an eye on second-tier SKU growth.'
              : 'Heavily concentrated — derisk by accelerating second-tier SKUs.',
        metrics: [
          {
            label: 'Product HHI',
            value: productHhi.toFixed(0),
            highlight: productHhi >= 2500,
          },
          {
            label: 'Distributor HHI',
            value: risk.data.distributor_concentration.hhi.toFixed(0),
          },
          {
            label: 'State HHI',
            value: risk.data.state_concentration.hhi.toFixed(0),
          },
        ],
      });
    }

    return recs;
  }, [trend.data, products.data, states.data, distributors.data, risk.data]);

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          Recommendations
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Data-driven action items derived from the current period.
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : recommendations.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3 }}>
          Not enough signal yet — ingest more data to see recommendations.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {recommendations.map((rec) => {
            const style = TYPE_STYLE[rec.type];
            const Icon = style.icon;
            return (
              <Box
                key={rec.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${style.color}25`,
                  bgcolor: `${style.color}05`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: `${style.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: style.color,
                    }}
                  >
                    <Icon sx={{ fontSize: 16 }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: style.color,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {rec.category}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: 17,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    mb: 0.5,
                  }}
                >
                  {rec.title}
                </Typography>
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 1.5 }}>
                  {rec.action}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {rec.metrics.map((metric, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: metric.highlight ? `${style.color}15` : '#fff',
                        border: `1px solid ${metric.highlight ? style.color + '30' : colors.borderLight}`,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                      >
                        {metric.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: metric.highlight ? style.color : colors.textPrimary,
                          fontFeatureSettings: '"tnum"',
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}

function shortName(name: string): string {
  return name
    .replace(/Hooten & Young /gi, '')
    .replace(/Hooten Young /gi, '')
    .replace(/HOOTEN.*?WHISKEY /gi, '')
    .replace(/ - 750.*$/i, '')
    .trim();
}
