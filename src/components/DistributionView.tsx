import { Box } from '@mui/material';
import { DistributorBreakdown } from './DistributorBreakdown';
import { GeographicBreakdown } from './GeographicBreakdown';
import { KpiStrip } from './KpiStrip';
import { OrderAnalysis } from './OrderAnalysis';
import { ProductPerformance } from './ProductPerformance';
import { Recommendations } from './Recommendations';
import { RevenueTrendChart } from './RevenueTrendChart';
import { RiskDashboard } from './RiskDashboard';
import { WhatIfSimulator } from './WhatIfSimulator';
import { WhiteSpaceMatrix } from './WhiteSpaceMatrix';

/**
 * Distribution sub-view of the Sales page — the invoice / billing side.
 * Full MVP parity — ports every module from the MVP DashboardPage.
 */
export function DistributionView() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <KpiStrip />
      <RevenueTrendChart />
      <ProductPerformance />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        <GeographicBreakdown />
        <DistributorBreakdown />
      </Box>
      <WhiteSpaceMatrix />
      <OrderAnalysis />
      <RiskDashboard />
      <Recommendations />
      <WhatIfSimulator />
    </Box>
  );
}
