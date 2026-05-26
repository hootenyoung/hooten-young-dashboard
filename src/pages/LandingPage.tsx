import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

interface CardConfig {
  key: 'sales' | 'marketing';
  path: string;
  enabled: boolean;
  icon: JSX.Element;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  highlights: Array<{ emoji: string; label: string; desc: string }>;
  color: string;
  gradient: string;
}

const cards: CardConfig[] = [
  {
    key: 'sales',
    path: '/sales',
    enabled: true,
    icon: <ShowChartIcon sx={{ fontSize: 32 }} />,
    title: 'Sales',
    subtitle: 'Distribution & Depletions',
    badge: 'Live Data',
    description:
      'Track invoiced revenue, retail pull-through, product mix, and geographic reach across the full distribution chain — from QuickBooks invoices to retail account depletions.',
    highlights: [
      { emoji: '📊', label: 'Revenue & KPIs', desc: 'Revenue, cases, commission, trends' },
      { emoji: '🥃', label: 'Product & Geography', desc: 'Performance by SKU, state, distributor' },
      { emoji: '🔲', label: 'White Space', desc: 'Gap analysis and ordering patterns' },
      { emoji: '🏆', label: 'Account Intelligence', desc: 'Top buyers, velocity, follow-up tracker' },
    ],
    color: '#4f46e5',
    gradient:
      'linear-gradient(160deg, rgba(99,91,255,0.05) 0%, rgba(59,130,246,0.02) 50%, transparent 100%)',
  },
  {
    key: 'marketing',
    path: '/marketing',
    enabled: false,
    icon: <CampaignIcon sx={{ fontSize: 32 }} />,
    title: 'Marketing',
    subtitle: 'Brand & Audience Intelligence',
    badge: 'Coming Soon',
    description:
      'Social signal, competitor patterns, content performance, and audience trends. Backend in active development — this view will light up once the marketing team ships their API.',
    highlights: [
      { emoji: '📈', label: 'Social Trends', desc: 'Engagement patterns across platforms' },
      { emoji: '🎯', label: 'Competitor Watch', desc: 'Positioning gaps and blind spots' },
      { emoji: '🎨', label: 'Content Performance', desc: 'What is working in creative' },
      { emoji: '🔮', label: 'Audience Signals', desc: 'Trends and behavior over time' },
    ],
    color: '#059669',
    gradient:
      'linear-gradient(160deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.02) 50%, transparent 100%)',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #fdfcfa 0%, #f7f5f0 40%, #faf8f5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft warm radial accents */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '10%',
          width: { xs: 250, md: 500 },
          height: { xs: 250, md: 500 },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(194,154,69,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: { xs: 200, md: 400 },
          height: { xs: 200, md: 400 },
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,91,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 5, md: 8 },
          pb: 8,
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero */}
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.gold,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              mb: 2,
            }}
          >
            Hooten Young American Whiskey
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: 32, sm: 40, md: 52 },
              fontWeight: 700,
              color: colors.textPrimary,
              lineHeight: 1.1,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Hooten Young Platform
          </Typography>

          {/* Decorative divider */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 2.5,
            }}
          >
            <Box sx={{ width: 40, height: 1, bgcolor: colors.gold, opacity: 0.4 }} />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: colors.gold,
                opacity: 0.5,
              }}
            />
            <Box sx={{ width: 40, height: 1, bgcolor: colors.gold, opacity: 0.4 }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 13, md: 15 },
              color: colors.textMuted,
              textAlign: 'center',
              letterSpacing: '0.01em',
            }}
          >
            Sales & marketing intelligence in one place
          </Typography>
        </MotionBox>

        {/* Explore divider */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          sx={{ textAlign: 'center', mb: 3.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                flex: 1,
                maxWidth: 120,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${colors.border})`,
              }}
            />
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
              }}
            >
              Explore
            </Typography>
            <Box
              sx={{
                flex: 1,
                maxWidth: 120,
                height: 1,
                background: `linear-gradient(90deg, ${colors.border}, transparent)`,
              }}
            />
          </Box>
        </MotionBox>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {cards.map((card, i) => (
            <MotionBox
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.12 }}
            >
              <Box
                onClick={() => card.enabled && navigate(card.path)}
                sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  border: `1px solid ${card.color}18`,
                  bgcolor: 'rgba(255,255,255,0.97)',
                  overflow: 'hidden',
                  cursor: card.enabled ? 'pointer' : 'not-allowed',
                  opacity: card.enabled ? 1 : 0.78,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': card.enabled
                    ? {
                        borderColor: `${card.color}45`,
                        boxShadow: `0 20px 60px ${card.color}14, 0 4px 16px rgba(0,0,0,0.04)`,
                        transform: 'translateY(-6px)',
                        '& .arrow-icon': { transform: 'translateX(6px)' },
                        '& .card-glow': { opacity: 1 },
                      }
                    : {},
                }}
              >
                {/* Top color accent bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${card.color} 0%, ${card.color}60 100%)`,
                  }}
                />

                {/* Background gradient */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: card.gradient,
                    pointerEvents: 'none',
                  }}
                />

                {/* Corner glow on hover */}
                <Box
                  className="card-glow"
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${card.color}12 0%, transparent 70%)`,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                />

                <Box sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
                  {/* Icon + badge row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: `${card.color}08`,
                        border: `1.5px solid ${card.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.color,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.5,
                        py: 0.4,
                        borderRadius: '7px',
                        bgcolor: `${card.color}06`,
                        border: `1px solid ${card.color}12`,
                      }}
                    >
                      {!card.enabled && (
                        <LockOutlinedIcon sx={{ fontSize: 12, color: card.color }} />
                      )}
                      <Typography
                        sx={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: card.color,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {card.badge}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title + subtitle */}
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: { xs: 26, md: 32 },
                      fontWeight: 700,
                      color: colors.textPrimary,
                      lineHeight: 1.15,
                      letterSpacing: '-0.01em',
                      mb: 0.5,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: card.color,
                      letterSpacing: '0.02em',
                      mb: 2,
                    }}
                  >
                    {card.subtitle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: { xs: 13, md: 14 },
                      color: colors.textSecondary,
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    {card.description}
                  </Typography>

                  {/* Separator */}
                  <Box sx={{ height: 1, bgcolor: `${card.color}10`, mb: 2.5 }} />

                  {/* Highlights */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                      gap: 1.75,
                      mb: 3,
                    }}
                  >
                    {card.highlights.map((h) => (
                      <Box
                        key={h.label}
                        sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                      >
                        <Typography sx={{ fontSize: 15, lineHeight: 1.3, flexShrink: 0 }}>
                          {h.emoji}
                        </Typography>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: colors.textPrimary,
                              lineHeight: 1.3,
                              mb: 0.15,
                            }}
                          >
                            {h.label}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 10.5, color: '#9ca3af', lineHeight: 1.45 }}
                          >
                            {h.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* CTA */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 1.25,
                      borderRadius: '10px',
                      bgcolor: card.enabled ? card.color : `${card.color}40`,
                      color: '#fff',
                      boxShadow: card.enabled
                        ? `0 4px 14px ${card.color}35`
                        : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {card.enabled ? 'View Insights' : 'Coming Soon'}
                    </Typography>
                    {card.enabled && (
                      <ArrowForwardIcon
                        className="arrow-icon"
                        sx={{ fontSize: 17, color: '#fff', transition: 'transform 0.25s ease' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </MotionBox>
          ))}
        </Box>

        {/* Footer */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          sx={{ mt: { xs: 5, md: 8 }, pb: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                flex: 1,
                maxWidth: 200,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${colors.gold}30)`,
              }}
            />
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                bgcolor: colors.gold,
                opacity: 0.4,
              }}
            />
            <Box
              sx={{
                flex: 1,
                maxWidth: 200,
                height: 1,
                background: `linear-gradient(90deg, ${colors.gold}30, transparent)`,
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 18, md: 22 },
                fontStyle: 'italic',
                fontWeight: 400,
                color: colors.textSecondary,
                letterSpacing: '0.02em',
                lineHeight: 1.4,
                mb: 2,
              }}
            >
              Insights made to remember.
            </Typography>
            <Typography
              sx={{ fontSize: 10.5, color: '#c4c9d0', letterSpacing: '0.03em' }}
            >
              &copy; {new Date().getFullYear()} Hooten Young American Whiskey
            </Typography>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
