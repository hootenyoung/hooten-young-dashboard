import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  useSalesByDistributor,
  useSalesByProduct,
  useSalesByState,
  type DateRange,
} from '../api/sales';
import { colors } from '../theme';

interface WhatIfSimulatorProps {
  range?: DateRange;
}

interface Scenario {
  newDistributors: number;
  newStates: number;
  priceLiftPct: number;
}

const DEFAULT_SCENARIO: Scenario = {
  newDistributors: 0,
  newStates: 0,
  priceLiftPct: 0,
};

function formatShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function WhatIfSimulator({ range }: WhatIfSimulatorProps) {
  const productsQ = useSalesByProduct(range);
  const statesQ = useSalesByState(range);
  const distributorsQ = useSalesByDistributor(range);
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);

  const isLoading = productsQ.isLoading || statesQ.isLoading || distributorsQ.isLoading;

  if (!productsQ.data || !statesQ.data || !distributorsQ.data) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, mb: 2 }}>
          What-If Simulator
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ py: 3 }}>
            Not enough data to simulate yet.
          </Typography>
        )}
      </Paper>
    );
  }

  // Baselines.
  const baselineRevenue = Number(productsQ.data.total_revenue);
  const knownDistributors = distributorsQ.data.distributors.filter(
    (d) => d.distributor_name !== null,
  );
  const distRevenues = knownDistributors.map((d) => Number(d.revenue));
  const avgDistRevenue =
    distRevenues.length > 0
      ? distRevenues.reduce((s, v) => s + v, 0) / distRevenues.length
      : 0;
  const medianDistRevenue =
    distRevenues.length > 0
      ? [...distRevenues].sort((a, b) => a - b)[Math.floor(distRevenues.length / 2)] ?? 0
      : 0;
  // Use the lower of mean / median to be conservative.
  const newDistAvg = Math.min(avgDistRevenue, medianDistRevenue);

  const knownStates = statesQ.data.states.filter((s) => s.state_code !== null);
  const stateRevenues = knownStates.map((s) => Number(s.revenue));
  const avgStateRevenue =
    stateRevenues.length > 0
      ? stateRevenues.reduce((s, v) => s + v, 0) / stateRevenues.length
      : 0;
  // For new states, assume 30% of average existing state revenue (per MVP heuristic).
  const newStateAvg = avgStateRevenue * 0.3;

  // Projected deltas.
  const deltaDistributors = scenario.newDistributors * newDistAvg;
  const deltaStates = scenario.newStates * newStateAvg;
  const deltaPrice = baselineRevenue * (scenario.priceLiftPct / 100);
  const totalDelta = deltaDistributors + deltaStates + deltaPrice;
  const projectedRevenue = baselineRevenue + totalDelta;
  const liftPct = baselineRevenue > 0 ? (totalDelta / baselineRevenue) * 100 : 0;

  const reset = () => setScenario(DEFAULT_SCENARIO);

  return (
    <Paper elevation={0} sx={{ p: 3, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TuneOutlinedIcon sx={{ color: colors.chartPrimary, fontSize: 22 }} />
          <Box>
            <Typography
              variant="h6"
              sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600 }}
            >
              What-If Simulator
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Adjust the levers — see projected revenue impact on the current baseline.
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={reset}
          size="small"
          startIcon={<RestartAltIcon />}
          sx={{
            color: colors.textSecondary,
            borderColor: colors.borderLight,
            '&:hover': { bgcolor: colors.surfaceSubtle },
          }}
        >
          Reset
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 320px' },
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        {/* Levers */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <LeverRow
            label="Activate new distributors"
            description={`Each new distributor estimated at ${formatShort(newDistAvg)} based on current portfolio.`}
            value={scenario.newDistributors}
            max={10}
            unit={scenario.newDistributors === 1 ? 'distributor' : 'distributors'}
            delta={deltaDistributors}
            onChange={(v) => setScenario((s) => ({ ...s, newDistributors: v }))}
          />
          <LeverRow
            label="Expand into new states"
            description={`Each new state estimated at ${formatShort(newStateAvg)} (30% of avg existing state).`}
            value={scenario.newStates}
            max={15}
            unit={scenario.newStates === 1 ? 'state' : 'states'}
            delta={deltaStates}
            onChange={(v) => setScenario((s) => ({ ...s, newStates: v }))}
          />
          <LeverRow
            label="Pricing lift across portfolio"
            description="Applies a flat percentage increase to all products."
            value={scenario.priceLiftPct}
            max={25}
            unit="%"
            delta={deltaPrice}
            onChange={(v) => setScenario((s) => ({ ...s, priceLiftPct: v }))}
          />
        </Box>

        {/* Projection summary */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: `1px solid ${colors.chartPrimary}25`,
            bgcolor: `${colors.chartPrimary}05`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Baseline
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 22,
              fontWeight: 600,
              color: colors.textSecondary,
            }}
          >
            {formatShort(baselineRevenue)}
          </Typography>

          <Box sx={{ my: 2, height: 1, bgcolor: colors.borderLight }} />

          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 700,
              color: colors.chartPrimary,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Projected
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 32,
              fontWeight: 700,
              color: colors.chartPrimary,
              lineHeight: 1.1,
            }}
          >
            {formatShort(projectedRevenue)}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: liftPct >= 0 ? colors.success : colors.error,
              mt: 0.5,
            }}
          >
            {liftPct >= 0 ? '+' : ''}
            {liftPct.toFixed(1)}% · {liftPct >= 0 ? '+' : ''}
            {formatShort(totalDelta)}
          </Typography>

          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${colors.borderLight}` }}>
            <Typography sx={{ fontSize: 11, color: colors.textMuted, mb: 1 }}>
              Breakdown
            </Typography>
            <DeltaRow label="Distributors" value={deltaDistributors} />
            <DeltaRow label="New states" value={deltaStates} />
            <DeltaRow label="Pricing lift" value={deltaPrice} />
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: 11,
          color: colors.textMuted,
          mt: 3,
          fontStyle: 'italic',
        }}
      >
        Estimates assume new distributors / states perform at average levels. Real-world results
        depend on activation pace, channel mix, and pricing acceptance.
      </Typography>
    </Paper>
  );
}

interface LeverRowProps {
  label: string;
  description: string;
  value: number;
  max: number;
  unit: string;
  delta: number;
  onChange: (v: number) => void;
}

function LeverRow({ label, description, value, max, unit, delta, onChange }: LeverRowProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 20,
              fontWeight: 700,
              color: colors.chartPrimary,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {value} <Box component="span" sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>{unit}</Box>
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 11.5, color: colors.textMuted, mb: 1 }}>
        {description}
      </Typography>
      <Slider
        value={value}
        min={0}
        max={max}
        step={1}
        onChange={(_, v) => onChange(typeof v === 'number' ? v : v[0] ?? 0)}
        sx={{
          color: colors.chartPrimary,
          height: 4,
          '& .MuiSlider-thumb': { width: 14, height: 14 },
          '& .MuiSlider-rail': { color: colors.borderLight, opacity: 1 },
        }}
      />
      <Typography
        sx={{
          fontSize: 12,
          color: delta > 0 ? colors.success : colors.textMuted,
          fontWeight: 600,
          mt: -0.5,
        }}
      >
        {delta > 0 ? '+' : ''}
        {formatShort(delta)} projected delta
      </Typography>
    </Box>
  );
}

interface DeltaRowProps {
  label: string;
  value: number;
}

function DeltaRow({ label, value }: DeltaRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.4 }}>
      <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: value > 0 ? colors.success : value < 0 ? colors.error : colors.textMuted,
          fontFeatureSettings: '"tnum"',
        }}
      >
        {value > 0 ? '+' : ''}
        {formatShort(value)}
      </Typography>
    </Box>
  );
}
