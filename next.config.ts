import type { NextConfig } from "next";

// Content-Security-Policy for this stack:
//   - Next.js App Router requires 'unsafe-inline' for its bootstrap scripts.
//     Nonce-based CSP is the stricter alternative but requires middleware changes.
//   - PostHog is reverse-proxied via /ingest/* so only 'self' is needed for connect-src.
//   - Geist font is self-hosted via next/font — no external font CDN needed.
//   - Three.js WebGL compiles shaders through the browser GPU, not JS eval().
//   - placehold.co is whitelisted for placeholder images used in development/PDF preview.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://placehold.co",
  "font-src 'self'",
  "connect-src 'self'",
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

export default nextConfig;
