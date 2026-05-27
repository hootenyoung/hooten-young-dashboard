import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Chip,
  Container,
  Paper,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Header } from '../components/Header';
import { type CompetitorCategory, useCompetitorWatch } from '../api/marketing';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

const numberFormatter = new Intl.NumberFormat('en-US');
function n(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return numberFormatter.format(Math.round(Number(v)));
}
function pct(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return `${v > 0 ? '+' : ''}${Number(v).toFixed(1)}%`;
}

/**
 * Marketing → Competitive landscape.
 *
 * Detailed leaderboard with tabs by category (whiskey / cigar / all).
 * Each tab shows the same shape: brand · followers · posts · eng/post ·
 * gap vs HY, sorted by engagement-per-post descending, HY row pinned and
 * highlighted in gold.
 *
 * Reached from the "View landscape" button on /marketing.
 */
export function MarketingCompetitorsPage() {
  const [category, setCategory] = useState<CompetitorCategory>('whiskey');
  const { data, isLoading, error } = useCompetitorWatch(category);

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
            Competitive landscape
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
            HY vs The Field
          </Typography>
          <Typography sx={{ fontSize: 14, color: colors.textMuted, mb: 3, maxWidth: 720 }}>
            Where HY sits against its peer set in each category. Brands ranked by average engagement
            per post; HY row highlighted.
          </Typography>
        </MotionBox>

        {/* Tabs */}
        <Paper
          elevation={0}
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={category}
            onChange={(_, v) => setCategory(v)}
            sx={{
              borderBottom: `1px solid ${colors.border}`,
              px: 1,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 13.5,
                color: colors.textMuted,
                minWidth: 100,
              },
              '& .Mui-selected': {
                color: `${colors.goldDark} !important`,
              },
              '& .MuiTabs-indicator': {
                bgcolor: colors.gold,
                height: 3,
              },
            }}
          >
            <Tab value="whiskey" label="Whiskey" />
            <Tab value="cigar" label="Cigar" />
            <Tab value="lifestyle" label="Lifestyle" />
            <Tab value="all" label="All" />
          </Tabs>

          {isLoading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              Failed to load: {error.message}
            </Alert>
          ) : data ? (
            <>
              {/* Table */}
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={th}>Brand</TableCell>
                      <TableCell sx={th}>Category</TableCell>
                      <TableCell align="right" sx={th}>
                        Followers
                      </TableCell>
                      <TableCell align="right" sx={th}>
                        Posts
                      </TableCell>
                      <TableCell align="right" sx={th}>
                        Eng / post
                      </TableCell>
                      <TableCell align="right" sx={th}>
                        Follower growth
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.rows.map((r) => (
                      <TableRow
                        key={r.handle}
                        sx={{
                          bgcolor: r.is_hy ? `${colors.gold}15` : 'transparent',
                          '&:hover': { bgcolor: r.is_hy ? `${colors.gold}25` : '#fafafa' },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: 13.5,
                            fontWeight: r.is_hy ? 700 : 500,
                            color: colors.textPrimary,
                          }}
                        >
                          @{r.handle}{' '}
                          {r.is_hy ? (
                            <Chip
                              label="HY"
                              size="small"
                              sx={{
                                ml: 1,
                                height: 18,
                                fontSize: 10,
                                bgcolor: colors.gold,
                                color: '#fff',
                                fontWeight: 700,
                              }}
                            />
                          ) : null}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: 12,
                            color: colors.textMuted,
                            textTransform: 'capitalize',
                          }}
                        >
                          {r.category}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: 13, color: colors.textSecondary }}>
                          {n(r.followers)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: 13, color: colors.textSecondary }}>
                          {n(r.total_posts)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}
                        >
                          {n(r.avg_engagement_per_post)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: 12.5,
                            color:
                              (r.followers_growth_pct ?? 0) > 0 ? colors.success : colors.textMuted,
                          }}
                        >
                          {pct(r.followers_growth_pct)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </>
          ) : null}
        </Paper>
      </Container>
    </Box>
  );
}

const th = {
  fontWeight: 700,
  fontSize: 11.5,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
};

