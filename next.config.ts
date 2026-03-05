import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content-Security-Policy for this stack:
//   - Next.js App Router requires 'unsafe-inline' for its bootstrap scripts.
//     Nonce-based CSP is the stricter alternative but requires middleware changes.
//   - PostHog is reverse-proxied via /ingest/* so only 'self' is needed for connect-src.
//   - Geist font is self-hosted via next/font — no external font CDN needed.
//   - Three.js WebGL compiles shaders through the browser GPU, not JS eval().
//   - placehold.co is whitelisted for placeholder images used in development/PDF preview.
//   - Sentry sends error reports to *.ingest.sentry.io (client-side SDK only).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://placehold.co",
  "font-src 'self'",
  "connect-src 'self' https://*.ingest.sentry.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  // PostHog reverse proxy — routes ingestion through Next.js to avoid ad blockers
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ]
  },
  // Required to support PostHog trailing-slash API requests
  skipTrailingSlashRedirect: true,
};

export default withSentryConfig(nextConfig, {
  // Suppresses Sentry build output unless running in CI
  silent: !process.env.CI,

  // Upload source maps to Sentry for readable stack traces in production.
  // Requires SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT env vars.
  // Leave blank and source maps still work locally; just won't be symbolicated in Sentry UI.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Hides source maps from the browser bundle (they're uploaded to Sentry instead)
  hideSourceMaps: true,

  // Removes Sentry logger statements from the production bundle
  disableLogger: true,

  // Automatically instrument Vercel Cron Monitors (not used here, but harmless)
  automaticVercelMonitors: false,
});
