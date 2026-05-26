import { Box, Chip, CircularProgress, Paper, Tooltip, Typography } from '@mui/material';
import { useWhiteSpaceMatrix, type DateRange } from '../api/sales';
import { colors } from '../theme';

interface WhiteSpaceMatrixProps {
  range?: DateRange;
}

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value)}`;
}

function shortenProductName(name: string): string {
  return name
    .replace(/Hooten & Young /gi, '')
    .replace(/Hooten Young /gi, '')
    .replace(/HOOTEN.*?WHISKEY /gi, '')
    .replace(/ - 750.*$/i, '')
    .replace(/ - 6.*$/, '')
    .trim();
}

export function WhiteSpaceMatrix({ range }: WhiteSpaceMatrixProps) {
  const { data, isLoading, error } = useWhiteSpaceMatrix(range);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load white-space matrix: {error.message}</Typography>
      </Paper>
    );
  }

  const products = data?.products ?? [];
  const states = data?.states ?? [];
  const cellMap = new Map<string, { revenue: number; cases: number }>();
  for (const c of data?.cells ?? []) {
    cellMap.set(`${c.product_id}|${c.state_code}`, {
      revenue: Number(c.revenue),
      cases: Number(c.cases),
    });
  }

  // Maximum revenue across the matrix — drives the heatmap intensity.
  const maxRevenue = Math.max(
    1,
    ...products.flatMap((p) =>
      states.map((s) => cellMap.get(`${p.id}|${s.code}`)?.revenue ?? 0),
    ),
  );

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
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
            White Space Matrix
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Product x State revenue grid — empty cells are expansion opportunities
          </Typography>
        </Box>
        {data && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              label={`${data.filled_combos} / ${data.total_combos} filled`}
              sx={{
                bgcolor: `${colors.chartPrimary}10`,
                color: colors.chartPrimary,
                fontWeight: 600,
              }}
            />
            <Chip
              size="small"
              label={`${data.gap_count} gaps (${(data.gap_pct * 100).toFixed(0)}%)`}
              sx={{
                bgcolor: `${colors.warning}10`,
                color: colors.warning,
                fontWeight: 600,
              }}
            />
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 || states.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          Not enough data to build the matrix yet.
        </Typography>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `200px repeat(${states.length}, minmax(48px, 1fr))`,
              gap: 0.5,
              minWidth: 200 + states.length * 50,
            }}
          >
            {/* Top-left empty cell */}
            <Box sx={{ position: 'sticky', left: 0 }} />
            {/* State header row */}
            {states.map((s) => (
              <Box
                key={s.code}
                sx={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: colors.textSecondary,
                  pb: 0.5,
                }}
              >
                {s.code}
              </Box>
            ))}

            {/* Body rows */}
            {products.map((p) => (
              <Box key={p.id} sx={{ display: 'contents' }}>
                <Box
                  sx={{
                    fontSize: 12,
                    color: colors.textPrimary,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pr: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={p.name}
                >
                  {shortenProductName(p.name)}
                </Box>
                {states.map((s) => {
                  const cell = cellMap.get(`${p.id}|${s.code}`);
                  const value = cell?.revenue ?? 0;
                  const intensity = value > 0 ? Math.max(0.1, value / maxRevenue) : 0;
                  return (
                    <Tooltip
                      key={`${p.id}|${s.code}`}
                      title={
                        value > 0
                          ? `${shortenProductName(p.name)} · ${s.code} — ${formatShort(value)}`
                          : `${shortenProductName(p.name)} · ${s.code} — gap`
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          height: 28,
                          borderRadius: 0.75,
                          bgcolor:
                            value > 0
                              ? `rgba(79, 70, 229, ${intensity * 0.85})`
                              : colors.borderLight,
                          border: value > 0 ? 'none' : `1px dashed ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 600,
                          color: intensity > 0.5 ? '#fff' : colors.textSecondary,
                        }}
                      >
                        {value > 0 ? formatShort(value) : ''}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
