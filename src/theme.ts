import { createTheme } from '@mui/material/styles';

/**
 * Hooten Young brand palette — light premium theme.
 *
 * Mirrors the MVP (hydashboard-mvp) so visual continuity is preserved
 * as the production app comes online. Headings in Playfair Display,
 * body in Inter, gold (#d4a84b) as primary brand color, indigo
 * (#4f46e5) as the chart accent.
 */
export const colors = {
  // Brand — sourced from hootenyoung.com (gold #c39748 is the canonical
  // HY brand color; cream + near-black are the surface palette they use).
  gold: '#c39748',
  goldLight: '#f4bc58',
  goldDark: '#bb8c3f',
  brandCream: '#f9f4ec',
  brandDark: '#2d2d2c',

  // Surfaces
  pageBg: '#f8f9fb',
  cardBg: '#ffffff',
  surfaceHover: '#f3f4f6',
  surfaceSubtle: '#f9fafb',

  // Text — WCAG AA on white
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6b7280',

  // Status
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  info: '#2563eb',

  // Borders
  border: '#e5e7eb',
  borderLight: '#f0f0f0',

  // Tooltip
  tooltipBg: '#1f2937',
  tooltipBorder: 'rgba(0, 0, 0, 0.12)',

  // Charts
  chartPrimary: '#4f46e5',
  chartSecondary: '#2563eb',
  chartTertiary: '#059669',
  chartColors: [
    '#4f46e5',
    '#2563eb',
    '#059669',
    '#d97706',
    '#7c3aed',
    '#0891b2',
    '#ea580c',
    '#db2777',
    '#0d9488',
    '#4f46e5',
    '#dc2626',
  ],
} as const;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.gold, light: colors.goldLight, dark: colors.goldDark },
    background: { default: colors.pageBg, paper: colors.cardBg },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
    divider: colors.border,
  },
  typography: {
    fontFamily:
      '"Inter", "Avenir", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Playfair Display", "Palatino", Georgia, serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", "Palatino", Georgia, serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", "Palatino", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", "Palatino", Georgia, serif', fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: colors.textMuted },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            borderColor: '#d1d5db',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          },
        },
      },
    },
  },
});
