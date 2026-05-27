import { Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useFollowUpTracker, type FollowUpBucket } from '../api/depletions';
import { colors } from '../theme';

const BUCKET_COLORS: Record<string, string> = {
  '0-30 days': colors.success,
  '30-60 days': '#3b82f6',
  '60-90 days': colors.warning,
  '90-120 days': '#f97316',
  '120+ days': colors.error,
};

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function FollowUpTracker() {
  const { data, isLoading, error } = useFollowUpTracker();
  const [activeBucket, setActiveBucket] = useState<string>('0-30 days');

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load follow-up tracker: {error.message}</Typography>
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
          Follow-Up Tracker
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const totalAccounts = data.buckets.reduce((s, b) => s + b.count, 0);
  const currentBucket: FollowUpBucket | undefined =
    data.buckets.find((b) => b.label === activeBucket) ?? data.buckets[0];

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          Follow-Up Tracker
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Accounts grouped by days since their last recorded depletion (
          {formatDate(data.reference_date)} reference).
        </Typography>
      </Box>

      {/* Bucket tabs */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' },
          gap: 1,
          mb: 2,
        }}
      >
        {data.buckets.map((bucket) => {
          const color = BUCKET_COLORS[bucket.label] ?? colors.chartPrimary;
          const pct = totalAccounts > 0 ? (bucket.count / totalAccounts) * 100 : 0;
          const isActive = bucket.label === activeBucket;
          return (
            <Box
              key={bucket.label}
              onClick={() => setActiveBucket(bucket.label)}
              role="button"
              sx={{
                cursor: 'pointer',
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${isActive ? color : colors.borderLight}`,
                bgcolor: isActive ? `${color}10` : '#fff',
                transition: 'border-color 0.2s, background-color 0.2s',
                '&:hover': { borderColor: color },
              }}
            >
              <Typography
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {bucket.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.textPrimary,
                }}
              >
                {bucket.count}
              </Typography>
              <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                {pct.toFixed(0)}% · {numberFormatter.format(Number(bucket.total_9l))} 9L
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Account list for the active bucket */}
      {currentBucket && (
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: colors.textMuted,
              mb: 1,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {currentBucket.label} · {currentBucket.count} account
            {currentBucket.count !== 1 ? 's' : ''}
          </Typography>
          {currentBucket.accounts.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: colors.textMuted, py: 2 }}>
              No accounts in this bucket.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.75,
                maxHeight: 360,
                overflowY: 'auto',
              }}
            >
              {currentBucket.accounts.slice(0, 50).map((acc) => (
                <Box
                  key={acc.account_id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1,
                    px: 1.25,
                    borderRadius: 1,
                    border: `1px solid ${colors.borderLight}`,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  <Chip
                    size="small"
                    label={`${acc.days_since}d`}
                    sx={{
                      height: 22,
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: `${BUCKET_COLORS[currentBucket.label] ?? colors.chartPrimary}15`,
                      color: BUCKET_COLORS[currentBucket.label] ?? colors.chartPrimary,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: colors.textSecondary,
                      width: 70,
                      textAlign: 'right',
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {numberFormatter.format(Number(acc.total_9l))} 9L
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
