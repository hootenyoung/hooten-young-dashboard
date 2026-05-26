# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the hooten-young-dashboard React SPA.
#
# Stage 1 (builder): Node 20 + npm ci + vite build. The VITE_API_BASE_URL
# build-arg is baked into the bundle, so each environment gets its own
# image pointing at its backend.
#
# Stage 2 (runtime): nginx-alpine serving static files from /dist on
# port 8080 (Cloud Run's default). nginx.conf routes all non-asset
# paths to index.html (React Router SPA fallback).

# -----------------------------------------------------------------
# Builder
# -----------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps with cache mount.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Build with per-domain backend URLs baked in.
ARG VITE_SALES_API_URL=""
ARG VITE_MARKETING_API_URL=""
ENV VITE_SALES_API_URL=${VITE_SALES_API_URL}
ENV VITE_MARKETING_API_URL=${VITE_MARKETING_API_URL}

COPY . .
RUN npm run build


# -----------------------------------------------------------------
# Runtime
# -----------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Replace the default site with our SPA-aware config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# nginx in foreground for proper Docker signal handling.
CMD ["nginx", "-g", "daemon off;"]
