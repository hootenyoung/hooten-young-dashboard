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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Header } from '../components/Header';
import {
  type CompetitorCategory,
  type CompetitorRow,
  useCompetitorWatch,
} from '../api/marketing';
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
type SortKey = 'avg_engagement_per_post' | 'followers' | 'total_posts' | 'followers_growth_pct';
type SortDir = 'desc' | 'asc';

/** Sort rows by the chosen column. HY is NOT pinned — its position in the
 *  leaderboard is the actual answer the marketing team wants ('where do
 *  we rank?'). HY row stays highlighted in gold so it's findable. Nulls
 *  sort to the bottom in either direction. */
function sortRows(rows: CompetitorRow[], key: SortKey, dir: SortDir): CompetitorRow[] {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return dir === 'desc' ? Number(bv) - Number(av) : Number(av) - Number(bv);
  });
}

export function MarketingCompetitorsPage() {
  const [category, setCategory] = useState<CompetitorCategory>('whiskey');
  const [sortKey, setSortKey] = useState<SortKey>('avg_engagement_per_post');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const { data, isLoading, error } = useCompetitorWatch(category);

  const sortedRows = useMemo(() => {
    if (!data?.rows) return [];
    return sortRows(data.rows, sortKey, sortDir);
  }, [data?.rows, sortKey, sortDir]);

  // Toggle: clicking the active column flips direction; clicking another
  // column switches to it (default desc — bigger = better for these metrics).
  const onSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

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
                      <TableCell align="right" sx={{ ...th, width: 50 }}>
                        Rank
                      </TableCell>
                      <TableCell sx={th}>Brand</TableCell>
                      <TableCell sx={th}>Category</TableCell>
                      <SortableHeader
                        label="Followers"
                        sortKey="followers"
                        active={sortKey}
                        dir={sortDir}
                        onSort={onSort}
                      />
                      <SortableHeader
                        label="Posts"
                        sortKey="total_posts"
                        active={sortKey}
                        dir={sortDir}
                        onSort={onSort}
                      />
                      <SortableHeader
                        label="Eng / post"
                        sortKey="avg_engagement_per_post"
                        active={sortKey}
                        dir={sortDir}
                        onSort={onSort}
                      />
                      <SortableHeader
                        label="Follower growth"
                        sortKey="followers_growth_pct"
                        active={sortKey}
                        dir={sortDir}
                        onSort={onSort}
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRows.map((r, i) => (
                      <TableRow
                        key={r.handle}
                        sx={{
                          bgcolor: r.is_hy ? `${colors.gold}15` : 'transparent',
                          '&:hover': { bgcolor: r.is_hy ? `${colors.gold}25` : '#fafafa' },
                        }}
                      >
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: r.is_hy ? colors.gold : colors.textMuted,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                        </TableCell>
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

/** Clickable column header. Shows an up/down arrow when the column is the
 *  active sort target; otherwise renders inert text. Numeric-aligned. */
function SortableHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const isActive = sortKey === active;
  return (
    <TableCell
      align="right"
      onClick={() => onSort(sortKey)}
      sx={{
        ...th,
        cursor: 'pointer',
        userSelect: 'none',
        color: isActive ? colors.goldDark : colors.textMuted,
        '&:hover': { color: colors.goldDark },
      }}
    >
      <Box
        component="span"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}
      >
        {label}
        {isActive ? (
          dir === 'desc' ? (
            <ArrowDropDownIcon sx={{ fontSize: 18, mr: -0.5 }} />
          ) : (
            <ArrowDropUpIcon sx={{ fontSize: 18, mr: -0.5 }} />
          )
        ) : null}
      </Box>
    </TableCell>
  );
}

