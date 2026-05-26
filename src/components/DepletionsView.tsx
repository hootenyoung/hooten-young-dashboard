import { Box } from '@mui/material';
import { DepletionsGeographicBreakdown } from './DepletionsGeographicBreakdown';
import { DepletionsKpiStrip } from './DepletionsKpiStrip';
import { DepletionsProductPerformance } from './DepletionsProductPerformance';
import { DepletionsTrendChart } from './DepletionsTrendChart';
import { FollowUpTracker } from './FollowUpTracker';
import { NewVsLostAccounts } from './NewVsLostAccounts';
import { TopAccountsTable } from './TopAccountsTable';
import { VelocityAnalysis } from './VelocityAnalysis';

/**
 * Depletions sub-view of the Sales page — the retail pull-through side.
 * Full MVP parity — ports every module from the MVP DepletionsPage.
 */
export function DepletionsView() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <DepletionsKpiStrip />
      <DepletionsTrendChart />
      <FollowUpTracker />
      <VelocityAnalysis />
      <TopAccountsTable />
      <NewVsLostAccounts />
      <DepletionsProductPerformance />
      <DepletionsGeographicBreakdown />
    </Box>
  );
}
