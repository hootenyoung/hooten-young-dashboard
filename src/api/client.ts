/**
 * Thin typed fetch wrapper used by the API hooks in src/api/*.ts.
 *
 * Two backend domains exist in the HY platform:
 *   - `sales`     — hooten-young-sales (handles /api/sales/* + /api/depletions/*)
 *   - `marketing` — hooten-young-marketing (handles /api/marketing/*, not yet deployed)
 *
 * Each call specifies which domain it targets; the client resolves the
 * base URL from VITE_SALES_API_URL or VITE_MARKETING_API_URL.
 *
 * In local dev you have two options:
 *   (a) Set VITE_SALES_API_URL=http://localhost:8000 in .env.local —
 *       calls go cross-origin directly to the FastAPI backend (CORS is
 *       enabled for localhost in the backend).
 *   (b) Leave VITE_SALES_API_URL empty — the Vite dev proxy in
 *       vite.config.ts routes /api/* to localhost:8000 same-origin.
 */

const SALES_BASE = (import.meta.env.VITE_SALES_API_URL ?? '').replace(/\/$/, '');
const MARKETING_BASE = (import.meta.env.VITE_MARKETING_API_URL ?? '').replace(/\/$/, '');

const BASES = {
  sales: SALES_BASE,
  marketing: MARKETING_BASE,
} as const;

export type ApiDomain = keyof typeof BASES;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type QueryParams = Record<string, string | number | undefined | null>;

function buildUrl(domain: ApiDomain, path: string, params?: QueryParams): string {
  const base = BASES[domain];
  const url = `${base}${path}`;
  if (!params) return url;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function apiGet<T>(
  domain: ApiDomain,
  path: string,
  params?: QueryParams,
): Promise<T> {
  const url = buildUrl(domain, path, params);
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    let body = '';
    try {
      body = await response.text();
    } catch {
      // ignore
    }
    throw new ApiError(
      response.status,
      `${response.status} ${response.statusText}${body ? ` — ${body.slice(0, 200)}` : ''}`,
    );
  }
  return (await response.json()) as T;
}
