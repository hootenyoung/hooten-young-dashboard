import CampaignIcon from '@mui/icons-material/Campaign';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

/**
 * Marketing intelligence — placeholder.
 *
 * The marketing backend (hooten-young-marketing) is owned by another
 * team and isn't online yet. This page exists so the landing-page
 * card has a destination and the URL is reserved.
 */
export function MarketingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header subtitle="Marketing Intelligence" />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '20px',
              bgcolor: `${colors.success}10`,
              border: `1.5px solid ${colors.success}25`,
              color: colors.success,
              mb: 3,
            }}
          >
            <CampaignIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 }, mb: 1.5 }}>
            Marketing
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.success,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 3,
            }}
          >
            Coming Soon
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              color: colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: 520,
              mx: 'auto',
              mb: 4,
            }}
          >
            Social signal, competitor patterns, content performance, and audience
            trends will live here. The marketing backend is in active development —
            this view will light up once the API is available.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
              maxWidth: 540,
              mx: 'auto',
              textAlign: 'left',
            }}
          >
            {[
              { emoji: '📈', label: 'Social Trends', desc: 'Engagement patterns' },
              { emoji: '🎯', label: 'Competitor Watch', desc: 'Positioning gaps' },
              { emoji: '🎨', label: 'Content Performance', desc: 'What is working' },
              { emoji: '🔮', label: 'Audience Signals', desc: 'Behavior over time' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.25,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{item.emoji}</Typography>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: colors.textPrimary,
                      mb: 0.25,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
