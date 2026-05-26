/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the hooten-young-sales backend (handles sales + depletions). */
  readonly VITE_SALES_API_URL?: string;
  /** Base URL for the hooten-young-marketing backend (not yet deployed). */
  readonly VITE_MARKETING_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
