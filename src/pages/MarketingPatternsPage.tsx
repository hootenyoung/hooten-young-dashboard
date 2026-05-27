import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Chip, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { Header } from '../components/Header';
import { usePatterns } from '../api/marketing';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

/**
 * Marketing intelligence → Pattern Recognition.
 *
 * Lives at /marketing/patterns. Reached via the "View patterns" button on
 * the main MarketingPage. Shows every pattern the engine extracted, sorted
 * high-confidence first. Each pattern has a finding + an actionable line
 * for HY's marketing team.
 */
export function MarketingPatternsPage() {
  const { data, isLoading, error } = usePatterns();

  const sorted = (data?.patterns ?? []).slice().sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
    return (order[a.confidence] ?? 9) - (order[b.confidence] ?? 9);
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.pageBg }}>
      <Header subtitle="Marketing Intelligence" />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Box sx={{ mb: 2 }}>
            <RouterLink
              to="/marketing"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: colors.textMuted,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Back to Marketing
            </RouterLink>
          </Box>

          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.gold,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Pattern Recognition
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: 28, md: 38 },
              fontWeight: 700,
              color: colors.textPrimary,
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            What we learned from the data
          </Typography>
          <Typography sx={{ fontSize: 14, color: colors.textMuted, mb: 4, maxWidth: 720 }}>
            Engagement signals extracted from 4,142 posts across 40 peer brands. Each pattern
            includes a finding, supporting evidence, and a specific action for Hooten Young's
            content team.
          </Typography>
        </MotionBox>

        {isLoading ? (
          <Stack spacing={1.5}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} variant="rectangular" height={88} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>
        ) : error ? (
          <Alert severity="error">Failed to load patterns: {error.message}</Alert>
        ) : (
          <Stack spacing={1.5}>
            {sorted.map((p) => (
              <Paper
                key={p.id}
                elevation={0}
                sx={{
                  p: 2.25,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    borderColor: '#d1d5db',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={1.5}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>
                        {p.title}
                      </Typography>
                      {p.category ? (
                        <Chip
                          label={p.category}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: 10,
                            bgcolor: '#f3f4f6',
                            color: colors.textMuted,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      ) : null}
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        color: colors.textSecondary,
                        mt: 0.5,
                        lineHeight: 1.55,
                      }}
                    >
                      {p.finding}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: colors.goldDark,
                        mt: 1,
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}
                    >
                      → {p.actionable_for_hy}
                    </Typography>
                  </Box>
                  <Chip
                    label={p.confidence}
                    size="small"
                    sx={{
                      flexShrink: 0,
                      bgcolor:
                        p.confidence === 'high'
                          ? `${colors.success}15`
                          : p.confidence === 'medium'
                            ? `${colors.warning}15`
                            : '#f3f4f6',
                      color:
                        p.confidence === 'high'
                          ? colors.success
                          : p.confidence === 'medium'
                            ? colors.warning
                            : colors.textMuted,
                      fontSize: 10.5,
                      fontWeight: 700,
                    }}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
