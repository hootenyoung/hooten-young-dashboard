/**
 * Typed sales-API client.
 *
 * These types mirror the FastAPI response schemas in
 *   hooten-young-sales/src/hy_sales/schemas/sales.py
 *
 * Numeric fields come back as JSON numbers in many cases but Pydantic
 * Decimal values are serialized as strings. We model them as `string`
 * here and convert with `Number(...)` at the display layer; this
 * preserves precision in transit.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiGet } from './client';

export interface DateRange {
  from?: string;
  to?: string;
}

export interface SalesKpis {
  total_revenue: string;
  total_cases: string;
  total_commission: string;
  commission_rate: string;
  total_invoices: number;
  avg_invoice_value: string | null;
  unique_customers: number;
  unique_products: number;
  unique_distributors: number;
  unique_states: number;
  period_start: string | null;
  period_end: string | null;
}

export interface SalesTrendPoint {
  period: string;
  revenue: string;
  cases: string;
  invoices: number;
}

export interface SalesTrendResponse {
  grain: string;
  points: SalesTrendPoint[];
}

export function useSalesKpis(range?: DateRange): UseQueryResult<SalesKpis> {
  return useQuery({
    queryKey: ['sales', 'kpis', range ?? {}],
    queryFn: () =>
      apiGet<SalesKpis>('sales', '/api/sales/kpis', { from: range?.from, to: range?.to }),
  });
}

export type TrendGrain = 'month' | 'week';

export function useSalesTrend(
  range?: DateRange,
  grain: TrendGrain = 'month',
): UseQueryResult<SalesTrendResponse> {
  return useQuery({
    queryKey: ['sales', 'trend', grain, range ?? {}],
    queryFn: () =>
      apiGet<SalesTrendResponse>('sales', '/api/sales/trend', {
        from: range?.from,
        to: range?.to,
        grain,
      }),
  });
}

// ---- by-product ----

export interface ProductPerformance {
  product_id: number;
  product_name: string;
  revenue: string;
  cases: string;
  invoice_count: number;
  pct_of_revenue: number;
  avg_price_per_case: string | null;
  state_count: number;
  states: string[];
  distributor_count: number;
  distributors: string[];
}

export interface ProductPerformanceResponse {
  products: ProductPerformance[];
  total_revenue: string;
}

export function useSalesByProduct(
  range?: DateRange,
  limit?: number,
): UseQueryResult<ProductPerformanceResponse> {
  return useQuery({
    queryKey: ['sales', 'by-product', range ?? {}, limit ?? null],
    queryFn: () =>
      apiGet<ProductPerformanceResponse>('sales', '/api/sales/by-product', {
        from: range?.from,
        to: range?.to,
        limit,
      }),
  });
}

// ---- by-state ----

export interface StatePerformance {
  state_code: string | null;
  revenue: string;
  cases: string;
  invoice_count: number;
  customer_count: number;
  pct_of_revenue: number;
}

export interface StatePerformanceResponse {
  states: StatePerformance[];
  total_revenue: string;
}

export function useSalesByState(range?: DateRange): UseQueryResult<StatePerformanceResponse> {
  return useQuery({
    queryKey: ['sales', 'by-state', range ?? {}],
    queryFn: () =>
      apiGet<StatePerformanceResponse>('sales', '/api/sales/by-state', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

// ---- by-distributor ----

export interface DistributorPerformance {
  distributor_id: number | null;
  distributor_name: string | null;
  channel: string | null;
  revenue: string;
  cases: string;
  invoice_count: number;
  customer_count: number;
  pct_of_revenue: number;
}

export interface DistributorPerformanceResponse {
  distributors: DistributorPerformance[];
  total_revenue: string;
}

export function useSalesByDistributor(
  range?: DateRange,
): UseQueryResult<DistributorPerformanceResponse> {
  return useQuery({
    queryKey: ['sales', 'by-distributor', range ?? {}],
    queryFn: () =>
      apiGet<DistributorPerformanceResponse>('sales', '/api/sales/by-distributor', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

// ---- white-space matrix ----

export interface WhiteSpaceProduct {
  id: number;
  name: string;
  revenue: string;
}

export interface WhiteSpaceState {
  code: string;
  revenue: string;
}

export interface WhiteSpaceCell {
  product_id: number;
  state_code: string;
  revenue: string;
  cases: string;
}

export interface WhiteSpaceMatrixResponse {
  products: WhiteSpaceProduct[];
  states: WhiteSpaceState[];
  cells: WhiteSpaceCell[];
  total_combos: number;
  filled_combos: number;
  gap_count: number;
  gap_pct: number;
}

export function useWhiteSpaceMatrix(
  range?: DateRange,
): UseQueryResult<WhiteSpaceMatrixResponse> {
  return useQuery({
    queryKey: ['sales', 'white-space', range ?? {}],
    queryFn: () =>
      apiGet<WhiteSpaceMatrixResponse>('sales', '/api/sales/white-space', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

// ---- order analysis ----

export interface OrderSizeBucket {
  label: string;
  min: number;
  max: number | null;
  count: number;
  revenue: string;
}

export interface OrderProductPair {
  product_a_id: number;
  product_a_name: string;
  product_b_id: number;
  product_b_name: string;
  count: number;
}

export interface OrderDistributorFrequency {
  distributor_id: number | null;
  distributor_name: string | null;
  order_count: number;
  total_revenue: string;
  avg_order_value: string;
}

export interface OrderMonthlyPoint {
  period: string;
  orders: number;
  revenue: string;
  avg_value: string;
}

export interface OrderAnalysisResponse {
  total_orders: number;
  total_revenue: string;
  avg_order_value: string;
  median_order_value: string;
  size_buckets: OrderSizeBucket[];
  multi_product_orders: number;
  single_product_orders: number;
  avg_multi_value: string;
  avg_single_value: string;
  top_product_pairs: OrderProductPair[];
  distributor_frequency: OrderDistributorFrequency[];
  repeat_buyers: number;
  one_time_buyers: number;
  monthly_orders: OrderMonthlyPoint[];
}

export function useOrderAnalysis(range?: DateRange): UseQueryResult<OrderAnalysisResponse> {
  return useQuery({
    queryKey: ['sales', 'order-analysis', range ?? {}],
    queryFn: () =>
      apiGet<OrderAnalysisResponse>('sales', '/api/sales/order-analysis', {
        from: range?.from,
        to: range?.to,
      }),
  });
}

// ---- risk / concentration ----

export interface ConcentrationMetric {
  top_1_share: number;
  top_3_share: number;
  top_5_share: number;
  hhi: number;
  entry_count: number;
}

export interface RiskDashboardResponse {
  product_concentration: ConcentrationMetric;
  distributor_concentration: ConcentrationMetric;
  state_concentration: ConcentrationMetric;
}

export function useRiskDashboard(range?: DateRange): UseQueryResult<RiskDashboardResponse> {
  return useQuery({
    queryKey: ['sales', 'risk', range ?? {}],
    queryFn: () =>
      apiGet<RiskDashboardResponse>('sales', '/api/sales/risk', {
        from: range?.from,
        to: range?.to,
      }),
  });
}
