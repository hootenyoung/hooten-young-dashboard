import HomeIcon from '@mui/icons-material/Home';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../theme';

interface HeaderProps {
  /** Optional subtitle shown beneath the brand mark. */
  subtitle?: string;
  /** When true, render a home button that links back to /. */
  showHome?: boolean;
}

const MotionBox = motion.create(Box);

/**
 * Top-of-page brand header.
 *
 * Used on the dashboard pages (`/sales`, `/marketing`). The landing
 * page renders its own hero, so it doesn't use this component.
 */
export function Header({
  subtitle = 'Hooten Young American Whiskey',
  showHome = true,
}: HeaderProps) {
  return (
    <MotionBox
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      sx={{
        backgroundColor: '#fff',
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 1.5, md: 2 },
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, cursor: 'pointer' }}>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: 18, sm: 22, md: 26 },
                fontWeight: 700,
                color: colors.textPrimary,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              Hooten Young
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 11 },
                color: colors.textMuted,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: { xs: 'none', sm: 'inline' },
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </RouterLink>

        {showHome && (
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: { xs: 1, sm: 1.75 },
                py: { xs: 0.85, sm: 0.65 },
                borderRadius: { xs: '50%', sm: '20px' },
                width: { xs: 32, sm: 'auto' },
                height: { xs: 32, sm: 'auto' },
                justifyContent: 'center',
                bgcolor: '#f5f3ff',
                border: '1px solid #e9e5fa',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#ede9fe',
                  borderColor: '#c4b5fd',
                },
                '&:active': { bgcolor: '#ddd6fe' },
              }}
            >
              <HomeIcon sx={{ fontSize: 16, color: '#6d28d9' }} />
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#6d28d9',
                  letterSpacing: '0.03em',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Home
              </Typography>
            </Box>
          </RouterLink>
        )}
      </Box>
    </MotionBox>
  );
}
