/**
 * Typed marketing-API client.
 *
 * Mirrors the FastAPI response schemas in
 *   hooten-young-marketing/src/hy_marketing/api/routes/*.py
 *
 * All marketing endpoints live under /api/marketing/* and are served by the
 * hy-marketing-api-dev Cloud Run service. Set VITE_MARKETING_API_URL to the
 * deployed URL in prod; leave empty to use the Vite dev proxy.
 */

import { useMutation, useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiGet } from './client';

// -------------------- Competitor Watch --------------------

export interface CompetitorRow {
  handle: string;
  category: string;
  is_hy: boolean;
  followers: number | null;
  followers_growth_pct: number | null;
  total_posts: number | null;
  avg_engagement_per_post: number | null;
  avg_engagement_rate: number | null;
  gap_vs_hy_pct: number | null;
}

export interface CompetitorWatchSummary {
  n_peers: number;
  hy_avg_engagement: number | null;
  peer_median_engagement: number | null;
  category_leader_handle: string | null;
  category_leader_engagement: number | null;
}

export interface CompetitorWatchResponse {
  generated_at: string;
  hy_handle: string;
  rows: CompetitorRow[];
  summary: CompetitorWatchSummary;
}

export type CompetitorCategory = 'whiskey' | 'cigar' | 'lifestyle' | 'all';

export function useCompetitorWatch(
  category: CompetitorCategory = 'all',
): UseQueryResult<CompetitorWatchResponse> {
  return useQuery({
    queryKey: ['marketing', 'competitor-watch', category],
    queryFn: () =>
      apiGet<CompetitorWatchResponse>('marketing', '/api/marketing/competitor-watch', {
        category,
      }),
  });
}

// -------------------- Social Trends --------------------

export interface CategoryEngagement {
  category: string;
  posts: number;
  avg_engagement: number;
  avg_likes: number;
  avg_comments: number;
}

export interface WeeklySeriesPoint {
  week_start: string;
  category: string;
  posts: number;
  avg_engagement: number;
}

export interface SocialTrendsResponse {
  generated_at: string;
  window_days: number;
  category_summary: CategoryEngagement[];
  weekly_series: WeeklySeriesPoint[];
}

export function useSocialTrends(windowDays = 365): UseQueryResult<SocialTrendsResponse> {
  return useQuery({
    queryKey: ['marketing', 'social-trends', windowDays],
    queryFn: () =>
      apiGet<SocialTrendsResponse>('marketing', '/api/marketing/social-trends', {
        window_days: windowDays,
      }),
  });
}

// -------------------- Content Performance --------------------

export interface TopPost {
  handle: string;
  category: string | null;
  post_type: string | null;
  posted_on: string | null;
  likes: number | null;
  comments: number | null;
  url: string | null;
  caption_preview: string | null;
  engagement: number;
}

export interface FormatPerformance {
  category: string;
  post_type: string;
  posts: number;
  avg_engagement: number;
}

export interface CaptionBucket {
  category: string;
  bucket: string;
  posts: number;
  avg_engagement: number;
}

export interface ContentPerformanceResponse {
  generated_at: string;
  top_posts: TopPost[];
  format_performance: FormatPerformance[];
  caption_buckets: CaptionBucket[];
}

export type ContentCategory = 'whiskey' | 'cigar' | 'lifestyle' | 'all';

export function useContentPerformance(
  category: ContentCategory = 'all',
  limit = 10,
): UseQueryResult<ContentPerformanceResponse> {
  return useQuery({
    queryKey: ['marketing', 'content-performance', category, limit],
    queryFn: () =>
      apiGet<ContentPerformanceResponse>('marketing', '/api/marketing/content-performance', {
        category,
        limit_top_posts: limit,
      }),
  });
}

// -------------------- Audience Signals --------------------

export interface BestDayByCategory {
  category: string;
  top_day: string;
  top_day_share: number;
  distribution: Record<string, number>;
  n_brands: number;
}

export interface PostTypeMix {
  category: string;
  image: number;
  reel: number;
  carousel: number;
  other: number;
}

export interface GrowthLeader {
  handle: string;
  category: string;
  followers: number | null;
  followers_growth_pct: number | null;
}

export interface AudienceSignalsResponse {
  generated_at: string;
  best_day_by_category: BestDayByCategory[];
  post_type_mix: PostTypeMix[];
  growth_leaders: GrowthLeader[];
  hy_growth: GrowthLeader | null;
}

export function useAudienceSignals(): UseQueryResult<AudienceSignalsResponse> {
  return useQuery({
    queryKey: ['marketing', 'audience-signals'],
    queryFn: () => apiGet<AudienceSignalsResponse>('marketing', '/api/marketing/audience-signals'),
  });
}

// -------------------- Patterns --------------------

export interface Pattern {
  id: string;
  title: string;
  category: string | null;
  finding: string;
  evidence: Record<string, unknown>;
  confidence: string;
  actionable_for_hy: string;
}

export interface PatternsResponse {
  generated_at: string;
  count: number;
  patterns: Pattern[];
}

export function usePatterns(): UseQueryResult<PatternsResponse> {
  return useQuery({
    queryKey: ['marketing', 'patterns'],
    queryFn: () => apiGet<PatternsResponse>('marketing', '/api/marketing/patterns'),
  });
}

// -------------------- Briefs (AI Content Recommendation) --------------------

export interface ContentBrief {
  post_day?: string;
  post_time?: string;
  format?: string;
  theme?: string;
  caption_draft?: string;
  hashtags?: string[];
  visual_direction?: string;
  reasoning?: unknown;
  compliance_notes?: unknown;
  next_publish_date?: string;
  _generated_at?: string;
  _model?: string;
}

export interface ComplianceIssue {
  severity: string;
  quoted?: string;
  rule?: string;
  suggested_rewrite?: string;
}

export interface ComplianceReview {
  verdict: 'compliant' | 'revise' | 'block' | string;
  summary: string;
  issues: ComplianceIssue[];
  state_flags: string[];
  platform_flags: string[];
  notes?: string;
  _reviewed_at?: string;
}

export interface BriefResponse {
  generated_at: string;
  patterns_count: number;
  recommendation: ContentBrief;
  compliance: ComplianceReview;
  revised: boolean;
}

export function useLatestBrief(): UseQueryResult<BriefResponse | null> {
  return useQuery({
    queryKey: ['marketing', 'briefs', 'latest'],
    queryFn: () => apiGet<BriefResponse | null>('marketing', '/api/marketing/briefs/latest'),
  });
}

export function useGenerateBrief() {
  return useMutation({
    mutationFn: async () => {
      // POST — implemented in client below. For now, fetch wrapper inline.
      const base = (import.meta.env.VITE_MARKETING_API_URL ?? '').replace(/\/$/, '');
      const res = await fetch(`${base}/api/marketing/briefs/generate`, { method: 'POST' });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return (await res.json()) as BriefResponse;
    },
  });
}

// -------------------- Media generation (image + video) --------------------

export interface MediaResponse {
  /** Server-assigned id once the asset is persisted to Postgres. */
  id?: number;
  kind: 'image' | 'video';
  url: string;
  provider: string;
  cost_usd: number;
  duration_s: number;
  generated_at: string;
  used_reference?: boolean;
  reference_url?: string;
}

export interface GenerateImageRequest {
  visual_direction: string;
  aspect_ratio?: '1:1' | '9:16' | '16:9' | '4:5';
  /** Auto-pick a HY product photo as the conditioning reference (anchors
   *  bottle/label to HY's actual identity instead of letting Flux invent). */
  use_brand_reference?: boolean;
  /** Or explicitly pass a public URL of a reference image. */
  reference_image_url?: string;
}

export interface GenerateVideoRequest {
  visual_direction: string;
  aspect_ratio?: '9:16' | '16:9' | '1:1';
  duration_sec?: number;
  with_audio?: boolean;
}

const MARKETING_BASE = () => (import.meta.env.VITE_MARKETING_API_URL ?? '').replace(/\/$/, '');

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${MARKETING_BASE()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ''}`);
  }
  return (await res.json()) as T;
}

export function useGenerateImage() {
  return useMutation({
    mutationFn: (req: GenerateImageRequest) =>
      postJSON<MediaResponse>('/api/marketing/media/image', req),
  });
}

export function useGenerateVideo() {
  return useMutation({
    mutationFn: (req: GenerateVideoRequest) =>
      postJSON<MediaResponse>('/api/marketing/media/video', req),
  });
}

/** Resolve a server-relative URL (e.g. /static/generated/...) to absolute by
 *  prepending the marketing API base. */
export function resolveMediaUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${MARKETING_BASE()}${url}`;
}

// -------------------- Media history (server-persisted gallery) --------------------

export interface MediaHistoryResponse {
  count: number;
  assets: MediaResponse[];
}

export function useMediaHistory(): UseQueryResult<MediaHistoryResponse> {
  return useQuery({
    queryKey: ['marketing', 'media-history'],
    queryFn: () =>
      apiGet<MediaHistoryResponse>('marketing', '/api/marketing/media/history', { limit: 24 }),
  });
}
