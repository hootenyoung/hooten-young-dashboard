import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import {
  useVelocityAnalysis,
  type VelocityAccount,
  type VelocityCategory,
} from '../api/depletions';
import { colors } from '../theme';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const CATEGORY_STYLE: Record<
  VelocityCategory,
  { label: string; color: string; icon: typeof TrendingUpIcon }
> = {
  accelerating: { label: 'Accelerating', color: colors.success, icon: TrendingUpIcon },
  steady: { label: 'Steady', color: colors.info, icon: TrendingFlatIcon },
  declining: { label: 'Declining', color: colors.error, icon: TrendingDownIcon },
  new: { label: 'New', color: colors.warning, icon: TrendingUpIcon },
  silent: { label: 'Silent', color: colors.textMuted, icon: TrendingFlatIcon },
};

const CATEGORY_ORDER: VelocityCategory[] = [
  'accelerating',
  'steady',
  'declining',
  'new',
  'silent',
];

export function VelocityAnalysis() {
  const { data, isLoading, error } = useVelocityAnalysis();
  const [activeCategory, setActiveCategory] = useState<VelocityCategory>('accelerating');

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load velocity analysis: {error.message}</Typography>
      </Paper>
    );
  }

  if (isLoading || !data) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, mb: 2 }}>
          Velocity Analysis
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const statsMap = new Map<VelocityCategory, { count: number; total_9l: string }>(
    data.category_stats.map((s) => [
      s.category,
      { count: s.count, total_9l: s.total_9l },
    ]),
  );
  const accountsByCategory = new Map<VelocityCategory, VelocityAccount[]>();
  for (const account of data.accounts) {
    const list = accountsByCategory.get(account.category) ?? [];
    list.push(account);
    accountsByCategory.set(account.category, list);
  }

  const currentAccounts = accountsByCategory.get(activeCategory) ?? [];

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          Velocity Analysis
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Account momentum: recent 3-month vs prior 3-month average 9L cases per month.
        </Typography>
      </Box>

      {/* Category tiles */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
          gap: 1.25,
          mb: 2.5,
        }}
      >
        {CATEGORY_ORDER.map((cat) => {
          const stats = statsMap.get(cat);
          const style = CATEGORY_STYLE[cat];
          const Icon = style.icon;
          const isActive = cat === activeCategory;
          const count = stats?.count ?? 0;
          const total9l = stats?.total_9l ?? '0';
          return (
            <Box
              key={cat}
              onClick={() => setActiveCategory(cat)}
              role="button"
              sx={{
                cursor: 'pointer',
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${isActive ? style.color : colors.borderLight}`,
                bgcolor: isActive ? `${style.color}10` : '#fff',
                '&:hover': { borderColor: style.color },
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Icon sx={{ fontSize: 14, color: style.color }} />
                <Typography
                  sx={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: style.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {style.label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  lineHeight: 1.1,
                }}
              >
                {count}
              </Typography>
              <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                {numberFormatter.format(Number(total9l))} 9L
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Account list for active category */}
      <Box>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.textMuted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          {CATEGORY_STYLE[activeCategory].label} · {currentAccounts.length} account
          {currentAccounts.length !== 1 ? 's' : ''}
        </Typography>
        {currentAccounts.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: colors.textMuted, py: 2 }}>
            No accounts in this category.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 380, overflowY: 'auto' }}>
            {currentAccounts.slice(0, 50).map((acc) => (
              <Box
                key={acc.account_id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 90px 90px 100px',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  px: 1.25,
                  borderRadius: 1,
                  border: `1px solid ${colors.borderLight}`,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
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
                    {acc.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                    {[acc.city, acc.state_code].filter(Boolean).join(', ')}{' '}
                    {acc.distributor_name ? `· ${acc.distributor_name}` : ''}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: colors.textSecondary,
                    fontFeatureSettings: '"tnum"',
                    textAlign: 'right',
                  }}
                >
                  prior {numberFormatter.format(Number(acc.prior_3m_avg))}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11.5,
                    color: colors.textPrimary,
                    fontWeight: 600,
                    fontFeatureSettings: '"tnum"',
                    textAlign: 'right',
                  }}
                >
                  recent {numberFormatter.format(Number(acc.recent_3m_avg))}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {acc.velocity_change_pct === null ? (
                    <Chip
                      size="small"
                      label="—"
                      sx={{
                        height: 22,
                        fontWeight: 700,
                        fontSize: 11,
                        bgcolor: colors.surfaceSubtle,
                        color: colors.textMuted,
                      }}
                    />
                  ) : (
                    (() => {
                      const accStyle = CATEGORY_STYLE[acc.category];
                      return (
                        <Chip
                          size="small"
                          label={`${acc.velocity_change_pct >= 0 ? '+' : ''}${acc.velocity_change_pct.toFixed(0)}%`}
                          sx={{
                            height: 22,
                            fontWeight: 700,
                            fontSize: 11,
                            bgcolor: `${accStyle.color}15`,
                            color: accStyle.color,
                          }}
                        />
                      );
                    })()
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
