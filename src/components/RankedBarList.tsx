import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { colors } from '../theme';

/** One row in a ranked-bar visualization. */
export interface RankedBarItem {
  /** Stable identifier (used as React key). */
  id: string | number;
  /** The label shown beside the bar. */
  label: string;
  /** Numeric value driving bar width (e.g. revenue). */
  value: number;
  /** Pre-formatted display value (e.g. "$12.4K"). */
  displayValue: string;
  /** 0..1 share of total. */
  pct: number;
  /** Optional secondary text shown under the label. */
  sublabel?: string;
}

interface RankedBarListProps {
  title: string;
  caption?: string;
  items: RankedBarItem[];
  isLoading?: boolean;
  error?: { message: string } | null;
  /** Color override; defaults to indigo. */
  color?: string;
  /** Optional summary chip(s) shown in the header. */
  summary?: Array<{ label: string; value: string }>;
  /** Max bar height; defaults to fit content. */
  maxHeight?: number;
}

/**
 * Reusable ranked-bar visualization.
 *
 * Used by Product Performance, Geographic Breakdown, Distributor Breakdown.
 * Each row has a label on the left and a horizontal bar with the value
 * pinned to its right edge.
 */
export function RankedBarList({
  title,
  caption,
  items,
  isLoading = false,
  error = null,
  color = colors.chartPrimary,
  summary,
  maxHeight,
}: RankedBarListProps) {
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
        <Typography color="error">
          Failed to load {title.toLowerCase()}: {error.message}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        minHeight: 300,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
          mb: caption ? 0.5 : 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          {title}
        </Typography>
        {summary && summary.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {summary.map((s) => (
              <Box
                key={s.label}
                sx={{
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 1,
                  bgcolor: '#f9fafb',
                  border: `1px solid ${colors.borderLight}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: colors.textSecondary,
                  }}
                >
                  {s.value}{' '}
                  <Box component="span" sx={{ color: colors.textMuted, fontWeight: 500 }}>
                    {s.label}
                  </Box>
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {caption && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {caption}
        </Typography>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          No data
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            maxHeight,
            overflowY: maxHeight ? 'auto' : 'visible',
          }}
        >
          {items.map((item, i) => {
            const colorForRow = colors.chartColors[i % colors.chartColors.length] ?? color;
            return (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ flex: '0 0 200px', minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={item.label}
                  >
                    {item.label}
                  </Typography>
                  {item.sublabel && (
                    <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                      {item.sublabel}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1, position: 'relative' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 10,
                      bgcolor: colors.borderLight,
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${Math.max(2, item.pct * 100)}%`,
                        height: '100%',
                        bgcolor: colorForRow,
                        borderRadius: 5,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: '0 0 110px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {item.displayValue}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: colors.textMuted,
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {(item.pct * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
