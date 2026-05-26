import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
//
// The /api proxy lets the dev server forward backend calls to the local
// hooten-young-sales FastAPI process running on :8000. This avoids CORS
// configuration in dev. In prod, the UI and API are on different
// Cloud Run services; CORS is enabled on the backend (FastAPI middleware).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Marketing backend serves generated images/videos under /static/generated/.
      // Proxy them so <img>/<video> can render in dev. In prod the UI uses
      // VITE_MARKETING_API_URL to address them directly.
      '/static/generated': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    target: 'es2022',
  },
});
