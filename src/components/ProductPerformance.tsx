import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { useSalesByProduct, type DateRange, type ProductPerformance as ProductPerformanceItem } from '../api/sales';
import { colors } from '../theme';

interface ProductPerformanceProps {
  range?: DateRange;
}

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 100_000) return `$${(value / 1_000).toFixed(0)}K`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

type PriceTier = 'Ultra Premium' | 'Premium' | 'Core';

function getPriceTier(avgPricePerCase: number | null): PriceTier {
  if (avgPricePerCase === null) return 'Core';
  if (avgPricePerCase >= 380) return 'Ultra Premium';
  if (avgPricePerCase >= 200) return 'Premium';
  return 'Core';
}

const TIER_STYLE: Record<PriceTier, { bg: string; color: string; border: string }> = {
  'Ultra Premium': { bg: 'rgba(139,92,246,0.06)', color: '#7c3aed', border: 'rgba(139,92,246,0.15)' },
  Premium: { bg: 'rgba(99,91,255,0.06)', color: '#635bff', border: 'rgba(99,91,255,0.15)' },
  Core: { bg: 'rgba(16,185,129,0.06)', color: '#059669', border: 'rgba(16,185,129,0.15)' },
};

function shortenName(name: string): string {
  return name
    .replace(/Hooten & Young /gi, '')
    .replace(/Hooten Young /gi, '')
    .replace(/HOOTEN.*?WHISKEY /gi, '')
    .replace(/ - 750.*$/i, '')
    .trim();
}

export function ProductPerformance({ range }: ProductPerformanceProps) {
  const { data, isLoading, error } = useSalesByProduct(range);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load product performance: {error.message}</Typography>
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
          Product Performance
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const products = data.products;
  const totalRevenue = Number(data.total_revenue);
  const totalCases = products.reduce((s, p) => s + Number(p.cases), 0);
  const topProduct = products[0];
  const maxRevenue = topProduct ? Number(topProduct.revenue) : 1;

  // Price tier breakdown
  const tierBreakdown: Record<PriceTier, { revenue: number; cases: number; products: string[] }> = {
    'Ultra Premium': { revenue: 0, cases: 0, products: [] },
    Premium: { revenue: 0, cases: 0, products: [] },
    Core: { revenue: 0, cases: 0, products: [] },
  };
  products.forEach((p) => {
    const tier = getPriceTier(p.avg_price_per_case ? Number(p.avg_price_per_case) : null);
    tierBreakdown[tier].revenue += Number(p.revenue);
    tierBreakdown[tier].cases += Number(p.cases);
    tierBreakdown[tier].products.push(shortenName(p.product_name));
  });

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
          >
            Product Performance
          </Typography>
          <Typography variant="caption" color="text.secondary">
            SKU-level revenue, pricing power, and distribution reach
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={`${products.length} SKUs`}
            sx={{ bgcolor: `${colors.chartPrimary}10`, color: colors.chartPrimary, fontWeight: 600 }}
          />
          <Chip
            size="small"
            label={`${formatShort(totalRevenue)} revenue`}
            sx={{ bgcolor: colors.surfaceSubtle, color: colors.textSecondary, fontWeight: 600 }}
          />
          <Chip
            size="small"
            label={`${numberFormatter.format(totalCases)} cases`}
            sx={{ bgcolor: colors.surfaceSubtle, color: colors.textSecondary, fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Top product highlight */}
      {topProduct && (
        <Box
          sx={{
            mt: 1,
            mb: 3,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${colors.chartPrimary}20`,
            bgcolor: `${colors.chartPrimary}05`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: `${colors.chartPrimary}15`,
              border: `2px solid ${colors.chartPrimary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.chartPrimary,
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Top Performing Product
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
              {shortenName(topProduct.product_name)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Revenue', value: formatShort(Number(topProduct.revenue)) },
              { label: 'Cases', value: numberFormatter.format(Number(topProduct.cases)) },
              {
                label: '$ / Case',
                value: topProduct.avg_price_per_case
                  ? formatCurrency(Number(topProduct.avg_price_per_case))
                  : '—',
              },
              { label: 'Share', value: `${(topProduct.pct_of_revenue * 100).toFixed(0)}%` },
            ].map((m) => (
              <Box key={m.label} sx={{ textAlign: 'center', minWidth: 60 }}>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{m.label}</Typography>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: 17,
                    fontWeight: 700,
                    color: colors.chartPrimary,
                  }}
                >
                  {m.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Product cards grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {products.map((p, i) => (
          <ProductCard
            key={p.product_id}
            product={p}
            rank={i + 1}
            color={colors.chartColors[i % colors.chartColors.length] ?? colors.chartPrimary}
            maxRevenue={maxRevenue}
          />
        ))}
      </Box>

      {/* Price tier breakdown */}
      <Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.textMuted,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          By Price Tier
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 1.5,
          }}
        >
          {(['Ultra Premium', 'Premium', 'Core'] as const).map((tier) => {
            const t = tierBreakdown[tier];
            if (t.products.length === 0) return null;
            const style = TIER_STYLE[tier];
            const pct = totalRevenue > 0 ? (t.revenue / totalRevenue) * 100 : 0;
            const avgPrice = t.cases > 0 ? t.revenue / t.cases : 0;
            return (
              <Box
                key={tier}
                sx={{ p: 2, borderRadius: 2, border: `1px solid ${style.border}`, bgcolor: style.bg }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
                >
                  <Chip
                    label={tier}
                    size="small"
                    sx={{
                      height: 22,
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: 'transparent',
                      color: style.color,
                      border: `1px solid ${style.border}`,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: 18,
                      fontWeight: 700,
                      color: style.color,
                    }}
                  >
                    {formatShort(t.revenue)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 5,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: `${pct}%`,
                      height: '100%',
                      bgcolor: style.color,
                      opacity: 0.5,
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 11.5, color: colors.textMuted, mb: 1 }}>
                  {pct.toFixed(0)}% of revenue · {numberFormatter.format(t.cases)} cases ·{' '}
                  avg {formatCurrency(avgPrice)} / case
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {t.products.map((p) => (
                    <Chip
                      key={p}
                      label={p}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        bgcolor: '#fff',
                        color: colors.textSecondary,
                        border: `1px solid ${colors.borderLight}`,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}

interface ProductCardProps {
  product: ProductPerformanceItem;
  rank: number;
  color: string;
  maxRevenue: number;
}

function ProductCard({ product, rank, color, maxRevenue }: ProductCardProps) {
  const avgPrice = product.avg_price_per_case ? Number(product.avg_price_per_case) : null;
  const tier = getPriceTier(avgPrice);
  const tierStyle = TIER_STYLE[tier];
  const revenue = Number(product.revenue);
  const cases = Number(product.cases);
  const revPct = (revenue / maxRevenue) * 100;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${colors.border}`,
        bgcolor: '#fff',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: '#d1d5db', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0, flex: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: colors.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={product.product_name}
          >
            {shortenName(product.product_name)}
          </Typography>
        </Box>
        <Box
          sx={{
            ml: 0.5,
            px: 0.75,
            py: 0.15,
            borderRadius: 1,
            fontSize: 11,
            fontWeight: 700,
            color: colors.textMuted,
            bgcolor: '#f3f4f6',
          }}
        >
          #{rank}
        </Box>
      </Box>

      <Chip
        label={`${tier} · ${avgPrice !== null ? formatCurrency(avgPrice) : '—'} / case`}
        size="small"
        sx={{ height: 20, fontSize: 11, fontWeight: 600, bgcolor: tierStyle.bg, color: tierStyle.color, mb: 1 }}
      />

      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 22,
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            {formatShort(revenue)}
          </Typography>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: colors.chartPrimary, alignSelf: 'flex-end' }}
          >
            {(product.pct_of_revenue * 100).toFixed(1)}%
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 5,
            bgcolor: colors.borderLight,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: `${revPct}%`, height: '100%', bgcolor: color, transition: 'width 0.4s' }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          mb: 1.5,
          fontSize: 12,
          color: colors.textSecondary,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 10.5, color: colors.textMuted, textTransform: 'uppercase' }}>
            Cases
          </Typography>
          <Typography sx={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
            {numberFormatter.format(cases)}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 10.5, color: colors.textMuted, textTransform: 'uppercase' }}>
            Invoices
          </Typography>
          <Typography sx={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
            {product.invoice_count}
          </Typography>
        </Box>
      </Box>

      {/* Distribution reach */}
      {product.state_count > 0 && (
        <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${colors.borderLight}` }}>
          <Typography
            sx={{
              fontSize: 10.5,
              color: colors.textMuted,
              fontWeight: 600,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {product.state_count} states
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
            {product.states.map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10.5,
                  fontWeight: 600,
                  bgcolor: `${colors.chartPrimary}10`,
                  color: colors.chartPrimary,
                  border: `1px solid ${colors.chartPrimary}25`,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
      {product.distributor_count > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: 10.5,
              color: colors.textMuted,
              fontWeight: 600,
              mb: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {product.distributor_count} distributors
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
            {product.distributors.slice(0, 6).map((d) => (
              <Chip
                key={d}
                label={d}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10.5,
                  fontWeight: 500,
                  bgcolor: `${colors.success}10`,
                  color: colors.success,
                  border: `1px solid ${colors.success}25`,
                }}
              />
            ))}
            {product.distributors.length > 6 && (
              <Chip
                label={`+${product.distributors.length - 6}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10.5,
                  fontWeight: 500,
                  bgcolor: colors.surfaceSubtle,
                  color: colors.textMuted,
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
