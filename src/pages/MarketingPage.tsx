import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VideocamIcon from '@mui/icons-material/Videocam';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Header } from '../components/Header';
import {
  type MediaResponse,
  resolveMediaUrl,
  useAudienceSignals,
  useCompetitorWatch,
  useContentPerformance,
  useGenerateBrief,
  useGenerateImage,
  useGenerateVideo,
  useLatestBrief,
  usePatterns,
} from '../api/marketing';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

const numberFormatter = new Intl.NumberFormat('en-US');
function n(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return numberFormatter.format(Math.round(Number(value)));
}
// =================================================================
// SECTION HEADER
// =================================================================
function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
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
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: { xs: 24, md: 30 },
          fontWeight: 700,
          color: colors.textPrimary,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography sx={{ fontSize: 14, color: colors.textMuted, mt: 0.75 }}>{subtitle}</Typography>
      ) : null}
    </Box>
  );
}

function SectionCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

// =================================================================
// HERO BRIEF (the headline card)
// =================================================================
function HeroBrief() {
  const { data, isLoading, error } = useLatestBrief();
  const queryClient = useQueryClient();
  const generate = useGenerateBrief();
  const generateImage = useGenerateImage();
  const generateVideo = useGenerateVideo();
  // List of generated assets, newest first. Each click appends — nothing
  // is replaced, so the team can compare image + reel side by side.
  //
  // Persisted to localStorage so navigating away (e.g. to /marketing/patterns)
  // and back doesn't blow them away. Capped to the last 24 to keep storage
  // sane; older results scroll off. Tied to the current brief's timestamp so
  // a fresh brief gives the team a clean slate.
  const briefStamp = data?.recommendation?._generated_at ?? '';
  const storageKey = briefStamp ? `hy-marketing-media:${briefStamp}` : 'hy-marketing-media:current';

  const [generatedMedia, setGeneratedMedia] = useState<MediaResponse[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as MediaResponse[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (generatedMedia.length === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(generatedMedia.slice(0, 24)));
      }
    } catch {
      // Quota exceeded or storage disabled — silently ignore; in-memory state still works.
    }
  }, [storageKey, generatedMedia]);

  // When a new brief is generated, drop stale entries tied to old briefs.
  useEffect(() => {
    if (!briefStamp) return;
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith('hy-marketing-media:') &&
          key !== storageKey &&
          key !== 'hy-marketing-media:current'
        ) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // ignore
    }
  }, [briefStamp, storageKey]);

  const removeMedia = (idx: number) =>
    setGeneratedMedia((prev) => prev.filter((_, i) => i !== idx));

  const handleGenerate = async () => {
    await generate.mutateAsync();
    setGeneratedMedia([]); // a fresh brief invalidates the old visuals
    queryClient.invalidateQueries({ queryKey: ['marketing', 'briefs', 'latest'] });
    queryClient.invalidateQueries({ queryKey: ['marketing', 'patterns'] });
  };

  if (isLoading) {
    return (
      <SectionCard sx={{ bgcolor: '#fefcf6' }}>
        <Skeleton variant="text" width={200} height={20} />
        <Skeleton variant="text" width="80%" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 1 }} />
      </SectionCard>
    );
  }

  if (error || !data) {
    return (
      <SectionCard sx={{ bgcolor: '#fefcf6' }}>
        <SectionTitle
          eyebrow="This week's AI brief"
          title="No brief yet"
          subtitle="Click 'Generate' to extract this week's patterns and produce a dated content recommendation."
        />
        <Button
          variant="contained"
          startIcon={
            generate.isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <AutoAwesomeIcon />
            )
          }
          onClick={handleGenerate}
          disabled={generate.isPending}
          sx={{ mt: 1, bgcolor: colors.gold, '&:hover': { bgcolor: colors.goldDark } }}
        >
          {generate.isPending ? 'Generating…' : "Generate this week's brief"}
        </Button>
      </SectionCard>
    );
  }

  const rec = data.recommendation;

  const fullCaption = [rec.caption_draft, (rec.hashtags ?? []).join(' ')]
    .filter(Boolean)
    .join('\n\n');

  const handleCopy = () => {
    if (!fullCaption) return;
    navigator.clipboard.writeText(fullCaption).catch(() => {});
  };

  const formatLabel = (rec.format ?? 'post').toString().trim();
  const formatBanner = formatLabel.toUpperCase();

  return (
    <SectionCard
      sx={{
        bgcolor: '#fefcf6',
        border: `1.5px solid ${colors.gold}40`,
        p: 0,
        overflow: 'hidden',
      }}
    >
      {/* FORMAT BANNER — visually announces what kind of post this is */}
      <Box
        sx={{
          px: { xs: 2.5, md: 3 },
          py: 1.25,
          bgcolor: colors.gold,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 13, md: 14 },
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {formatBanner}
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            opacity: 0.95,
          }}
        >
          Post date: {rec.post_day ?? '—'}
          {rec.post_time ? `, ${rec.post_time}` : ''}
        </Typography>
      </Box>

      {/* CARD BODY */}
      <Box sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2.5, md: 3 } }}>
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
          Recommended for this week
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: { xs: 24, md: 32 },
            fontWeight: 700,
            color: colors.textPrimary,
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Your next post
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: colors.textMuted, mb: 2.5, maxWidth: 720 }}>
          Built from this week's competitor signals and pre-checked for brand safety. Edit anything
          below, copy when ready, or click Regenerate for a fresh take.
        </Typography>

        {/* TIER 3: theme / visual direction */}
        <LabeledBlock label="Theme & visual direction">
          <Typography sx={{ fontSize: 14, color: colors.textPrimary, lineHeight: 1.65 }}>
            {rec.theme}
          </Typography>
        </LabeledBlock>

        {/* TIER 4: caption */}
        {rec.caption_draft ? (
          <LabeledBlock label="Caption (ready to copy)" accent>
            <Typography
              sx={{
                fontSize: 14,
                color: colors.textPrimary,
                whiteSpace: 'pre-line',
                lineHeight: 1.65,
              }}
            >
              {rec.caption_draft}
            </Typography>
          </LabeledBlock>
        ) : null}

        {/* TIER 5: hashtags */}
        {(rec.hashtags ?? []).length > 0 ? (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Hashtags
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ gap: 0.75 }}>
              {(rec.hashtags ?? []).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: colors.textSecondary, fontSize: 12 }}
                />
              ))}
            </Stack>
          </Box>
        ) : null}

        {/* TIER 6: actions */}
        <Stack direction="row" spacing={1.25} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}
            onClick={handleCopy}
            sx={{
              bgcolor: colors.gold,
              color: '#fff',
              '&:hover': { bgcolor: colors.goldDark },
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Copy caption + hashtags
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              generateImage.isPending ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <ImageIcon sx={{ fontSize: 16 }} />
              )
            }
            onClick={async () => {
              if (!rec.visual_direction) return;
              // Infer category from brief text so the backend picks a
              // category-appropriate HY product photo (whiskey bottle vs
              // cigar product). Default to whiskey — HY is primarily a
              // whiskey brand.
              const briefText = `${rec.theme ?? ''} ${rec.visual_direction ?? ''}`.toLowerCase();
              const category: 'whiskey' | 'cigar' | 'lifestyle' = briefText.includes('cigar')
                ? 'cigar'
                : briefText.match(/yeti|huckberry|tecovas|filson|outdoor|lifestyle/)
                ? 'lifestyle'
                : 'whiskey';
              const result = await generateImage.mutateAsync({
                visual_direction: rec.visual_direction,
                aspect_ratio: '1:1',
                use_brand_reference: true,
                category,
              });
              setGeneratedMedia((prev) => [result, ...prev]);
            }}
            disabled={generateImage.isPending || generateVideo.isPending || !rec.visual_direction}
            sx={{
              borderColor: colors.gold,
              color: colors.goldDark,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {generateImage.isPending ? 'Generating image…' : 'Generate image'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              generateVideo.isPending ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <VideocamIcon sx={{ fontSize: 16 }} />
              )
            }
            onClick={async () => {
              if (!rec.visual_direction) return;
              const result = await generateVideo.mutateAsync({
                visual_direction: rec.visual_direction,
                aspect_ratio: '9:16',
                duration_sec: 6,
              });
              setGeneratedMedia((prev) => [result, ...prev]);
            }}
            disabled={generateVideo.isPending || generateImage.isPending || !rec.visual_direction}
            sx={{
              borderColor: colors.gold,
              color: colors.goldDark,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {generateVideo.isPending ? 'Generating reel…' : 'Generate reel'}
          </Button>
          <Button
            variant="text"
            size="small"
            startIcon={
              generate.isPending ? <CircularProgress size={14} color="inherit" /> : <RefreshIcon />
            }
            onClick={handleGenerate}
            disabled={generate.isPending}
            sx={{
              color: colors.textMuted,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {generate.isPending ? 'Regenerating…' : 'Regenerate brief'}
          </Button>
        </Stack>

        {/* TIER 7: generated visual (if any) */}
        {generateImage.error || generateVideo.error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {generateImage.error?.message || generateVideo.error?.message}
          </Alert>
        ) : null}

        {generatedMedia.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: colors.textMuted,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Generated assets ({generatedMedia.length})
              </Typography>
              {generatedMedia.length > 1 ? (
                <Button
                  size="small"
                  onClick={() => setGeneratedMedia([])}
                  sx={{
                    fontSize: 11,
                    color: colors.textMuted,
                    textTransform: 'none',
                    minWidth: 'auto',
                  }}
                >
                  Clear all
                </Button>
              ) : null}
            </Stack>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {generatedMedia.map((m, idx) => (
                <Paper
                  key={`${m.generated_at}-${idx}`}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: '#fff',
                    border: `1px solid ${colors.border}`,
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Chip
                      label={m.kind === 'image' ? 'IMAGE' : 'REEL'}
                      size="small"
                      icon={
                        m.kind === 'image' ? (
                          <ImageIcon sx={{ fontSize: 13 }} />
                        ) : (
                          <VideocamIcon sx={{ fontSize: 13 }} />
                        )
                      }
                      sx={{
                        bgcolor: `${colors.gold}15`,
                        color: colors.goldDark,
                        fontWeight: 700,
                        fontSize: 10,
                        height: 22,
                        '& .MuiChip-icon': { color: colors.goldDark },
                      }}
                    />
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Button
                        component="a"
                        href={resolveMediaUrl(m.url)}
                        download={`hy-${m.kind}-${new Date(m.generated_at)
                          .toISOString()
                          .replace(/[:.]/g, '-')
                          .slice(0, 19)}.${m.kind === 'image' ? 'png' : 'mp4'}`}
                        size="small"
                        sx={{
                          minWidth: 'auto',
                          px: 0.75,
                          py: 0,
                          color: colors.textMuted,
                          '&:hover': { color: colors.goldDark, bgcolor: 'transparent' },
                        }}
                        aria-label="Download"
                        title="Download"
                      >
                        <DownloadIcon sx={{ fontSize: 16 }} />
                      </Button>
                      <Button
                        onClick={() => removeMedia(idx)}
                        size="small"
                        sx={{
                          minWidth: 'auto',
                          px: 0.75,
                          py: 0,
                          fontSize: 14,
                          color: colors.textMuted,
                          '&:hover': { color: colors.error, bgcolor: 'transparent' },
                        }}
                        aria-label="Dismiss"
                        title="Dismiss"
                      >
                        ✕
                      </Button>
                    </Stack>
                  </Stack>
                  {m.kind === 'image' ? (
                    <Box
                      component="img"
                      src={resolveMediaUrl(m.url)}
                      alt="Generated"
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        display: 'block',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={resolveMediaUrl(m.url)}
                      controls
                      sx={{
                        width: '100%',
                        borderRadius: 1,
                        display: 'block',
                        aspectRatio: '9 / 16',
                        objectFit: 'cover',
                        bgcolor: '#000',
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: colors.textMuted,
                      mt: 1,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {new Date(m.generated_at).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        ) : null}

        {/* Quiet footer: when this brief was generated */}
        <Typography
          sx={{
            fontSize: 11,
            color: colors.textMuted,
            mt: 2,
            letterSpacing: '0.02em',
          }}
        >
          Generated{' '}
          {rec._generated_at
            ? new Date(rec._generated_at).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : '—'}
        </Typography>
      </Box>
    </SectionCard>
  );
}

/** Reusable labeled block used for Theme and Caption sections. */
function LabeledBlock({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: accent ? colors.goldDark : colors.textMuted,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: '#fff',
          border: `1px solid ${colors.border}`,
          borderLeft: `3px solid ${accent ? colors.gold : colors.borderLight}`,
          borderRadius: 1,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

// =================================================================
// PATTERN INSIGHTS (what we learned from the data)
// =================================================================
function PatternInsights() {
  const { data, isLoading, error } = usePatterns();

  return (
    <SectionCard>
      <SectionTitle
        eyebrow="What we learned"
        title="Pattern Recognition"
        subtitle="Engagement signals distilled from the competitive landscape. Highest-confidence first."
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
      ) : error ? (
        <Alert severity="error">Failed to load patterns: {error.message}</Alert>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 36, md: 44 },
                fontWeight: 700,
                color: colors.gold,
                lineHeight: 1,
              }}
            >
              {data?.count ?? 0}
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.textSecondary, mt: 0.75 }}>
              insights extracted this week ·{' '}
              <Box component="span" sx={{ color: colors.success, fontWeight: 700 }}>
                {(data?.patterns ?? []).filter((p) => p.confidence === 'high').length}{' '}
                high-confidence
              </Box>
            </Typography>
          </Box>
          <RouterLink to="/marketing/patterns" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2.25,
                py: 1.1,
                borderRadius: '10px',
                bgcolor: colors.gold,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: `0 4px 14px ${colors.gold}35`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: colors.goldDark,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 18px ${colors.gold}50`,
                },
              }}
            >
              View insights
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </Box>
          </RouterLink>
        </Stack>
      )}
    </SectionCard>
  );
}

// =================================================================
// COMPETITOR LANDSCAPE LINK — compact summary tile that navigates
// to the dedicated /marketing/competitors page (tabs for whiskey,
// cigar, lifestyle).
// =================================================================
function CompetitorLandscapeLink() {
  const { data, isLoading } = useCompetitorWatch('all');
  const totalBrands = data?.rows.length ?? 0;

  return (
    <SectionCard>
      <SectionTitle
        eyebrow="Competitive landscape"
        title="HY vs The Field"
        subtitle="Where HY sits in whiskey, cigar, and lifestyle peer sets."
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={88} sx={{ borderRadius: 1 }} />
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 36, md: 44 },
                fontWeight: 700,
                color: colors.gold,
                lineHeight: 1,
              }}
            >
              {totalBrands}
            </Typography>
            <Typography sx={{ fontSize: 13, color: colors.textSecondary, mt: 0.75 }}>
              competitor brands tracked across categories
            </Typography>
          </Box>
          <RouterLink to="/marketing/competitors" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2.25,
                py: 1.1,
                borderRadius: '10px',
                bgcolor: colors.gold,
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: `0 4px 14px ${colors.gold}35`,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: colors.goldDark,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 18px ${colors.gold}50`,
                },
              }}
            >
              View landscape
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </Box>
          </RouterLink>
        </Stack>
      )}
    </SectionCard>
  );
}

// =================================================================
// FORMAT PERFORMANCE (mini bar chart)
// =================================================================
function FormatPerformance() {
  const { data, isLoading } = useContentPerformance('all', 10);

  const formatRows = (data?.format_performance ?? []).slice(0, 12);

  return (
    <SectionCard>
      <SectionTitle
        eyebrow="Content performance"
        title="What format wins?"
        subtitle="Average engagement per format, grouped by category. Higher bars = better."
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
      ) : (
        <Box sx={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={formatRows} layout="vertical" margin={{ left: 12, right: 24 }}>
              <CartesianGrid stroke={colors.borderLight} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11, fill: colors.textMuted }} />
              <YAxis
                type="category"
                dataKey={(d) => `${d.category} · ${d.post_type}`}
                width={140}
                tick={{ fontSize: 11, fill: colors.textSecondary }}
              />
              <Tooltip
                formatter={(value: number) => [`${n(value)} avg engagement`, '']}
                labelFormatter={(label) => label}
                contentStyle={{
                  background: colors.tooltipBg,
                  color: '#fff',
                  border: 'none',
                  fontSize: 12,
                  borderRadius: 6,
                }}
              />
              <Bar dataKey="avg_engagement" radius={[0, 6, 6, 0]}>
                {formatRows.map((r) => (
                  <Cell
                    key={`${r.category}-${r.post_type}`}
                    fill={
                      r.category === 'whiskey'
                        ? colors.gold
                        : r.category === 'cigar'
                          ? '#8b5cf6'
                          : colors.chartTertiary
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </SectionCard>
  );
}

// =================================================================
// AUDIENCE SIGNALS (best day / post-type mix)
// =================================================================
function AudienceSignals() {
  const { data, isLoading } = useAudienceSignals();

  return (
    <SectionCard>
      <SectionTitle
        eyebrow="Audience signals"
        title="When & how to post"
        subtitle="Per-category best-day signal + format distribution across the peer set."
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 1 }} />
      ) : data ? (
        <Stack direction="column" spacing={3}>
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              Best day to post by category
            </Typography>
            <Stack spacing={1}>
              {data.best_day_by_category.map((b) => (
                <Box key={b.category} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 80,
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.textPrimary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {b.category}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.round(b.top_day_share * 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': { bgcolor: colors.gold, borderRadius: 4 },
                      }}
                    />
                  </Box>
                  <Box sx={{ width: 110, fontSize: 12.5, color: colors.textSecondary }}>
                    {b.top_day} · {(b.top_day_share * 100).toFixed(0)}%
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              Post-type mix by category
            </Typography>
            <Box sx={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart
                  data={data.post_type_mix}
                  stackOffset="expand"
                  margin={{ left: 0, right: 16 }}
                >
                  <CartesianGrid stroke={colors.borderLight} strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: colors.textSecondary }} />
                  <YAxis
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                    tick={{ fontSize: 11, fill: colors.textMuted }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: colors.tooltipBg,
                      color: '#fff',
                      border: 'none',
                      fontSize: 12,
                      borderRadius: 6,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="reel" stackId="a" fill={colors.gold} />
                  <Bar dataKey="carousel" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="image" stackId="a" fill={colors.chartTertiary} />
                  <Bar dataKey="other" stackId="a" fill={colors.textMuted} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Stack>
      ) : null}
    </SectionCard>
  );
}

// =================================================================
// MAIN PAGE
// =================================================================
export function MarketingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.pageBg }}>
      <Header subtitle="Marketing Intelligence" />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <VerifiedUserIcon sx={{ color: colors.gold, fontSize: 24 }} />
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 28, md: 38 },
                fontWeight: 700,
                color: colors.textPrimary,
                lineHeight: 1.1,
              }}
            >
              Marketing Intelligence
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13.5, color: colors.textMuted, mb: 4 }}>
            Less guessing what to post. Each week, here's what's working in your category — and the
            post to match it.
          </Typography>
        </MotionBox>

        <Stack spacing={3}>
          {/* Tier 1 — the headline: what HY should post next */}
          <HeroBrief />

          {/* Tier 2 — supporting analysis. Two-column grid on desktop,
              stacked on mobile. Left: the "why" (patterns + audience).
              Right: the "who" (link to full landscape + format). */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
              gap: 3,
              alignItems: 'start',
            }}
          >
            <Stack spacing={3}>
              <PatternInsights />
              <AudienceSignals />
            </Stack>
            <Stack spacing={3}>
              <CompetitorLandscapeLink />
              <FormatPerformance />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
