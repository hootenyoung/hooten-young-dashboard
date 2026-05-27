/**
 * Typed depletions-API client.
 *
 * Mirrors the FastAPI schemas in
 *   hooten-young-sales/src/hy_sales/schemas/depletions.py
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiGet } from './client';
import type { DateRange } from './sales';

export interface DepletionsKpis {
  total_9l: string;
  total_physical: string;
  unique_accounts: number;
  unique_products: number;
  unique_states: number;
  unique_distributors: number;
  period_start: string | null;
  period_end: string | null;
  avg_9l_per_account: string | null;
}

export function useDepletionsKpis(range?: DateRange): UseQueryResult<DepletionsKpis> {
  return useQuery({
    queryKey: ['depletions', 'kpis', range ?? {}],
    queryFn: () =>
      apiGet<DepletionsKpis>('sales', '/api/depletions/kpis', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

export interface DepletionsTrendPoint {
  period: string;
  cases_9l: string;
  cases_physical: string;
  active_accounts: number;
}

export interface DepletionsTrendResponse {
  grain: string;
  points: DepletionsTrendPoint[];
}

export function useDepletionsTrend(
  range?: DateRange,
  grain: 'month' = 'month',
): UseQueryResult<DepletionsTrendResponse> {
  return useQuery({
    queryKey: ['depletions', 'trend', grain, range ?? {}],
    queryFn: () =>
      apiGet<DepletionsTrendResponse>('sales', '/api/depletions/trend', {
        from: range?.from,
        to: range?.to,
        grain,
      }),
  });
}

export interface DepletionsProductPerformance {
  product_id: number;
  product_name: string;
  cases_9l: string;
  cases_physical: string;
  account_count: number;
  state_count: number;
  pct_of_9l: number;
}

export interface DepletionsProductResponse {
  products: DepletionsProductPerformance[];
  total_9l: string;
}

export function useDepletionsByProduct(
  range?: DateRange,
): UseQueryResult<DepletionsProductResponse> {
  return useQuery({
    queryKey: ['depletions', 'by-product', range ?? {}],
    queryFn: () =>
      apiGet<DepletionsProductResponse>('sales', '/api/depletions/by-product', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

export interface DepletionsStatePerformance {
  state_code: string | null;
  cases_9l: string;
  cases_physical: string;
  account_count: number;
  pct_of_9l: number;
}

export interface DepletionsStateResponse {
  states: DepletionsStatePerformance[];
  total_9l: string;
}

export function useDepletionsByState(range?: DateRange): UseQueryResult<DepletionsStateResponse> {
  return useQuery({
    queryKey: ['depletions', 'by-state', range ?? {}],
    queryFn: () =>
      apiGet<DepletionsStateResponse>('sales', '/api/depletions/by-state', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

export interface TopAccount {
  account_id: number;
  name: string;
  state_code: string | null;
  city: string | null;
  distributor_name: string | null;
  cases_9l: string;
  cases_physical: string;
  product_count: number;
  last_active_period: string | null;
  pct_of_9l: number;
}

export interface TopAccountsResponse {
  accounts: TopAccount[];
  total_9l: string;
}

export function useTopAccounts(range?: DateRange, limit = 20): UseQueryResult<TopAccountsResponse> {
  return useQuery({
    queryKey: ['depletions', 'top-accounts', range ?? {}, limit],
    queryFn: () =>
      apiGet<TopAccountsResponse>('sales', '/api/depletions/top-accounts', {
        from: range?.from,
        to: range?.to,
        limit,
      }),
  });
}

// ---- follow-up tracker ----

export interface FollowUpAccount {
  account_id: number;
  name: string;
  state_code: string | null;
  city: string | null;
  distributor_name: string | null;
  last_active: string;
  days_since: number;
  total_9l: string;
  product_count: number;
}

export interface FollowUpBucket {
  label: string;
  count: number;
  total_9l: string;
  accounts: FollowUpAccount[];
}

export interface FollowUpTrackerResponse {
  reference_date: string;
  buckets: FollowUpBucket[];
}

export function useFollowUpTracker(): UseQueryResult<FollowUpTrackerResponse> {
  return useQuery({
    queryKey: ['depletions', 'follow-ups'],
    queryFn: () => apiGet<FollowUpTrackerResponse>('sales', '/api/depletions/follow-ups'),
  });
}

// ---- new vs lost accounts ----

export interface AccountBrief {
  account_id: number;
  name: string;
  state_code: string | null;
  city: string | null;
  distributor_name: string | null;
  cases_9l: string;
}

export interface NewVsLostAccountsResponse {
  reference_date: string;
  window_months: number;
  recent_window_start: string;
  prior_window_start: string;
  prior_window_end: string;
  new_count: number;
  lost_count: number;
  new_total_9l: string;
  lost_total_9l: string;
  new_accounts: AccountBrief[];
  lost_accounts: AccountBrief[];
}

export function useNewVsLostAccounts(windowMonths = 3): UseQueryResult<NewVsLostAccountsResponse> {
  return useQuery({
    queryKey: ['depletions', 'new-vs-lost', windowMonths],
    queryFn: () =>
      apiGet<NewVsLostAccountsResponse>('sales', '/api/depletions/new-vs-lost', {
        window_months: windowMonths,
      }),
  });
}

// ---- velocity analysis ----

export type VelocityCategory = 'accelerating' | 'steady' | 'declining' | 'new' | 'silent';

export interface VelocityAccount {
  account_id: number;
  name: string;
  state_code: string | null;
  city: string | null;
  distributor_name: string | null;
  months_active: number;
  total_9l: string;
  avg_9l_per_month: string;
  recent_3m_avg: string;
  prior_3m_avg: string;
  velocity_change_pct: number | null;
  category: VelocityCategory;
}

export interface VelocityCategoryStats {
  category: VelocityCategory;
  count: number;
  total_9l: string;
}

export interface VelocityAnalysisResponse {
  reference_date: string;
  accounts: VelocityAccount[];
  category_stats: VelocityCategoryStats[];
}

export function useVelocityAnalysis(): UseQueryResult<VelocityAnalysisResponse> {
  return useQuery({
    queryKey: ['depletions', 'velocity'],
    queryFn: () => apiGet<VelocityAnalysisResponse>('sales', '/api/depletions/velocity'),
  });
}
