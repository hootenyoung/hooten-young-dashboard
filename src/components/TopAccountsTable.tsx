import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTopAccounts } from '../api/depletions';
import type { DateRange } from '../api/sales';
import { colors } from '../theme';

interface TopAccountsTableProps {
  range?: DateRange;
  limit?: number;
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

function formatPeriod(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

export function TopAccountsTable({ range, limit = 20 }: TopAccountsTableProps) {
  const { data, isLoading, error } = useTopAccounts(range, limit);

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${colors.error}40`,
          bgcolor: `${colors.error}05`,
        }}
      >
        <Typography color="error">Failed to load top accounts: {error.message}</Typography>
      </Paper>
    );
  }

  const accounts = data?.accounts ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
          >
            Top Accounts
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ranked by 9-liter case volume — top {limit}
          </Typography>
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
          No data
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Account
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Distributor
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  9L Cases
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Products
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: colors.textMuted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Last Active
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, i) => (
                <TableRow key={account.account_id} hover>
                  <TableCell sx={{ color: colors.textMuted, fontSize: 13 }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>
                    {account.name}
                    {account.pct_of_9l > 0.05 && (
                      <Chip
                        label={`${(account.pct_of_9l * 100).toFixed(1)}%`}
                        size="small"
                        sx={{
                          ml: 1,
                          height: 18,
                          fontSize: 10.5,
                          bgcolor: `${colors.chartPrimary}10`,
                          color: colors.chartPrimary,
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {[account.city, account.state_code].filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {account.distributor_name ?? '—'}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: 13, fontWeight: 600, fontFeatureSettings: '"tnum"' }}
                  >
                    {numberFormatter.format(Number(account.cases_9l))}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {account.product_count}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, color: colors.textSecondary }}>
                    {formatPeriod(account.last_active_period)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
