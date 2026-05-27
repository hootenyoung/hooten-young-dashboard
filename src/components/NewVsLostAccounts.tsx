import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useNewVsLostAccounts, type AccountBrief } from '../api/depletions';
import { colors } from '../theme';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

interface AccountListProps {
  title: string;
  icon: typeof PersonAddIcon;
  color: string;
  accounts: AccountBrief[];
  totalCases: number;
  count: number;
  caption: string;
}

function AccountList({
  title,
  icon: Icon,
  color,
  accounts,
  totalCases,
  count,
  caption,
}: AccountListProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${color}25`,
        bgcolor: `${color}05`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 18,
              fontWeight: 600,
              color: colors.textPrimary,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>{caption}</Typography>
        </Box>
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 22,
              fontWeight: 700,
              color,
              lineHeight: 1,
            }}
          >
            {count}
          </Typography>
          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
            {numberFormatter.format(totalCases)} 9L
          </Typography>
        </Box>
      </Box>
      {accounts.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 1 }}>
          No accounts in this group.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            mt: 1.5,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {accounts.slice(0, 50).map((acc) => (
            <Box
              key={acc.account_id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.75,
                px: 1,
                borderRadius: 1,
                bgcolor: '#fff',
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {acc.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                  {[acc.city, acc.state_code].filter(Boolean).join(', ')}{' '}
                  {acc.distributor_name ? `· ${acc.distributor_name}` : ''}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color,
                  fontFeatureSettings: '"tnum"',
                }}
              >
                {numberFormatter.format(Number(acc.cases_9l))}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export function NewVsLostAccounts() {
  const { data, isLoading, error } = useNewVsLostAccounts();

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 2, border: `1px solid ${colors.error}40`, bgcolor: `${colors.error}05` }}
      >
        <Typography color="error">Failed to load new vs lost accounts: {error.message}</Typography>
      </Paper>
    );
  }

  if (isLoading || !data) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, mb: 2 }}
        >
          New vs Lost Accounts
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  const recentLabel = `since ${new Date(data.recent_window_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  const priorLabel = `${new Date(data.prior_window_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(data.prior_window_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
        >
          New vs Lost Accounts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Accounts gained or lost between the recent {data.window_months}-month window and the prior{' '}
          {data.window_months}-month window.
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <AccountList
          title="New Accounts"
          icon={PersonAddIcon}
          color={colors.success}
          accounts={data.new_accounts}
          totalCases={Number(data.new_total_9l)}
          count={data.new_count}
          caption={`Active ${recentLabel}, silent before`}
        />
        <AccountList
          title="Lost Accounts"
          icon={PersonOffIcon}
          color={colors.error}
          accounts={data.lost_accounts}
          totalCases={Number(data.lost_total_9l)}
          count={data.lost_count}
          caption={`Active ${priorLabel}, silent since`}
        />
      </Box>
    </Paper>
  );
}
