import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CampaignIcon from '@mui/icons-material/Campaign';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme';

const MotionBox = motion.create(Box);

interface CardConfig {
  key: 'sales' | 'marketing';
  path: string;
  icon: JSX.Element;
  title: string;
  subtitle: string;
  caption: string;
}

const cards: CardConfig[] = [
  {
    key: 'sales',
    path: '/sales',
    icon: <ShowChartIcon sx={{ fontSize: 32 }} />,
    title: 'Sales',
    subtitle: 'Distribution & Depletions',
    caption: 'Revenue, product mix, and retail pull-through across the chain.',
  },
  {
    key: 'marketing',
    path: '/marketing',
    icon: <CampaignIcon sx={{ fontSize: 32 }} />,
    title: 'Marketing',
    subtitle: 'Intelligence & Insights',
    caption: 'Competitor watch, social patterns, and content recommendations.',
  },
];

/** Art-deco style corner bracket — gold L-shape ornament. */
function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top = position.startsWith('t');
  const left = position.endsWith('l');
  const size = { xs: 24, md: 32, xl: 40 };
  const inset = { xs: 24, md: 36, xl: 48 };

  return (
    <Box
      sx={{
        position: 'absolute',
        ...(top ? { top: inset } : { bottom: inset }),
        ...(left ? { left: inset } : { right: inset }),
        width: size,
        height: size,
        pointerEvents: 'none',
        zIndex: 1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          bgcolor: colors.gold,
          opacity: 0.55,
        },
        '&::before': {
          ...(top ? { top: 0 } : { bottom: 0 }),
          ...(left ? { left: 0 } : { right: 0 }),
          width: '100%',
          height: '1px',
        },
        '&::after': {
          ...(top ? { top: 0 } : { bottom: 0 }),
          ...(left ? { left: 0 } : { right: 0 }),
          height: '100%',
          width: '1px',
        },
      }}
    />
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.brandCream,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 7, xl: 8 },
      }}
    >
      {/* Ambient warm wash centered on the focal point */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(195,151,72,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Right-side brand hero image — fades from right edge into the cream */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: { xs: 0, md: '40%', lg: '45%', xl: '48%' },
          backgroundImage: 'url(/brand/hero.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
          backgroundSize: 'cover',
          opacity: 0.38,
          maskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.9) 75%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.9) 75%, black 100%)',
          pointerEvents: 'none',
          filter: 'saturate(0.6) sepia(0.12)',
        }}
      />

      {/* Soft gold breathing wash on top of the hero */}
      <MotionBox
        animate={{ opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: { xs: 0, md: '58%' },
          backgroundImage:
            'radial-gradient(ellipse 60% 55% at 78% 50%, rgba(195,151,72,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top + bottom edge gold strips */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
        }}
      />

      {/* Corner brackets — gold L-shape ornaments */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      <Container
        maxWidth={false}
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: { xs: 720, md: 1100, xl: 1440 },
          px: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {/* Hero — logo + eyebrow + bridge */}
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{ textAlign: 'center', mb: { xs: 5, md: 7, xl: 9 } }}
        >
          <Box
            component="img"
            src="/brand/hy-logo.png"
            alt="Hooten Young"
            sx={{
              height: { xs: 110, md: 150, xl: 190 },
              width: 'auto',
              mb: { xs: 3, xl: 4 },
              display: 'block',
              mx: 'auto',
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 2.5, xl: 3 },
              maxWidth: { xs: 360, xl: 460 },
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${colors.gold})`,
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Avenir", "Inter", sans-serif',
                fontSize: { xs: 10, xl: 11.5 },
                fontWeight: 700,
                color: colors.gold,
                textTransform: 'uppercase',
                letterSpacing: '0.36em',
                whiteSpace: 'nowrap',
              }}
            >
              Internal Platform
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, ${colors.gold}, transparent)`,
              }}
            />
          </Box>
        </MotionBox>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4, xl: 6 },
            maxWidth: { xs: 480, md: 'none' },
            mx: 'auto',
          }}
        >
          {cards.map((card, i) => (
            <MotionBox
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 + i * 0.12, ease: 'easeOut' }}
            >
              <Box
                onClick={() => navigate(card.path)}
                sx={{
                  position: 'relative',
                  backgroundColor: 'rgba(253, 251, 245, 0.62)',
                  backdropFilter: 'blur(14px) saturate(1.1)',
                  WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  px: { xs: 4, md: 5, xl: 7 },
                  pt: { xs: 5, md: 6, xl: 8 },
                  pb: { xs: 4, md: 5, xl: 7 },
                  minHeight: { xs: 320, md: 380, xl: 480 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(45, 45, 44, 0.02), 0 12px 32px rgba(45, 45, 44, 0.06)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: colors.gold,
                    opacity: 0.85,
                    transition: 'height 0.4s ease, opacity 0.4s ease',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(253, 251, 245, 0.75)',
                    borderColor: `${colors.gold}66`,
                    boxShadow:
                      '0 4px 12px rgba(45, 45, 44, 0.06), 0 20px 48px rgba(195, 151, 72, 0.18)',
                    transform: 'translateY(-4px)',
                    '&::before': { height: '3px', opacity: 1 },
                    '& .icon-ring': {
                      borderColor: colors.gold,
                      transform: 'scale(1.05)',
                    },
                    '& .enter-cta': { color: colors.goldDark },
                    '& .enter-underline': { transform: 'scaleX(1)' },
                    '& .arrow': { transform: 'translateX(5px)' },
                  },
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box
                    className="icon-ring"
                    sx={{
                      width: { xs: 60, md: 68, xl: 80 },
                      height: { xs: 60, md: 68, xl: 80 },
                      borderRadius: '50%',
                      border: `1px solid ${colors.gold}45`,
                      color: colors.gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 2.5, xl: 3.5 },
                      transition: 'all 0.45s ease',
                      '& svg': {
                        fontSize: { xs: 28, md: 32, xl: 38 },
                      },
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", "Palatino", Georgia, serif',
                      fontSize: { xs: 30, md: 38, xl: 48 },
                      fontWeight: 600,
                      color: colors.brandDark,
                      lineHeight: 1.05,
                      mb: { xs: 1.75, xl: 2.25 },
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {card.title}
                  </Typography>

                  {/* Small gold hairline beneath title — structural, not decorative */}
                  <Box
                    sx={{
                      width: 28,
                      height: '1px',
                      bgcolor: `${colors.gold}80`,
                      mx: 'auto',
                      mb: { xs: 2, xl: 2.5 },
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: '"Avenir", "Inter", sans-serif',
                      fontSize: { xs: 10.5, xl: 11.5 },
                      fontWeight: 600,
                      color: colors.gold,
                      textTransform: 'uppercase',
                      letterSpacing: '0.26em',
                      mb: { xs: 2.5, xl: 3 },
                    }}
                  >
                    {card.subtitle}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Avenir", "Inter", sans-serif',
                      fontSize: { xs: 13, xl: 15 },
                      color: colors.textSecondary,
                      lineHeight: 1.65,
                      maxWidth: { xs: 320, xl: 420 },
                      mx: 'auto',
                    }}
                  >
                    {card.caption}
                  </Typography>
                </Box>

                <Box sx={{ width: '100%', mt: 3 }}>
                  <Box
                    sx={{
                      width: { xs: 36, xl: 48 },
                      height: '1px',
                      bgcolor: `${colors.gold}70`,
                      mx: 'auto',
                      mb: { xs: 2.25, xl: 3 },
                    }}
                  />

                  <Box
                    className="enter-cta"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      color: colors.gold,
                      position: 'relative',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Avenir", "Inter", sans-serif',
                        fontSize: { xs: 10.5, xl: 12 },
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Enter
                    </Typography>
                    <ArrowForwardIcon
                      className="arrow"
                      sx={{
                        fontSize: { xs: 14, xl: 16 },
                        transition: 'transform 0.3s ease',
                      }}
                    />
                    <Box
                      className="enter-underline"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: -4,
                        height: '1px',
                        bgcolor: colors.gold,
                        transform: 'scaleX(0)',
                        transformOrigin: 'center',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </MotionBox>
          ))}
        </Box>

        {/* Closing seal */}
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          sx={{ textAlign: 'center', mt: { xs: 5, md: 7, xl: 9 } }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              maxWidth: { xs: 320, xl: 400 },
              mx: 'auto',
              mb: 1.75,
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${colors.gold}55)`,
              }}
            />
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: colors.gold,
                opacity: 0.75,
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: '1px',
                background: `linear-gradient(90deg, ${colors.gold}55, transparent)`,
              }}
            />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Avenir", "Inter", sans-serif',
              fontSize: { xs: 10, xl: 11 },
              fontWeight: 600,
              color: colors.brandDark,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Made to Remember<sup style={{ fontSize: '0.6em', marginLeft: 1 }}>®</sup>
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Avenir", "Inter", sans-serif',
              fontSize: { xs: 9.5, xl: 10 },
              fontWeight: 500,
              color: colors.textMuted,
              letterSpacing: '0.12em',
              mt: 1.25,
            }}
          >
            &copy; {year} Hooten Young American Whiskey · All rights reserved
          </Typography>
        </MotionBox>
      </Container>
    </Box>
  );
}
