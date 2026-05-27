import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { colors } from '../theme';

const TABS = [
  {
    value: 'distribution',
    label: 'Distribution',
    icon: ShowChartIcon,
    path: '/sales/distribution',
  },
  { value: 'depletions', label: 'Depletions', icon: LocalShippingIcon, path: '/sales/depletions' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

function tabValueFromPath(pathname: string): TabValue {
  if (pathname.startsWith('/sales/depletions')) return 'depletions';
  return 'distribution';
}

/**
 * Sales section wrapper.
 *
 * Owns the page chrome (header + tabs) and delegates the body to the
 * active sub-route via <Outlet/>. Routes:
 *   /sales              -> redirected to /sales/distribution
 *   /sales/distribution -> <DistributionView/>
 *   /sales/depletions   -> <DepletionsView/>
 */
export function SalesDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = tabValueFromPath(location.pathname);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header subtitle="Sales Intelligence" />

      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 4 } }}>
        <Box sx={{ mb: { xs: 1, md: 2 } }}>
          <Typography
            variant="h3"
            sx={{
              letterSpacing: '-0.02em',
              fontSize: { xs: 26, md: 36 },
            }}
          >
            Sales
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Distribution invoices + retail depletions across all channels.
          </Typography>
        </Box>

        <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, value: TabValue) => {
              const target = TABS.find((t) => t.value === value);
              if (target) navigate(target.path);
            }}
            sx={{
              minHeight: 44,
              '& .MuiTabs-indicator': {
                backgroundColor: colors.chartPrimary,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                minHeight: 44,
                fontWeight: 600,
                fontSize: { xs: 13, md: 14 },
                color: colors.textMuted,
                '&.Mui-selected': {
                  color: colors.chartPrimary,
                },
              },
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon sx={{ fontSize: 18 }} />
                      {tab.label}
                    </Box>
                  }
                />
              );
            })}
          </Tabs>
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ pb: { xs: 4, md: 6 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
