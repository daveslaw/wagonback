import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: 'https://eu.posthog.com',
  // Required defaults snapshot — do not remove
  defaults: '2026-01-30',
  // Capture unhandled exceptions via PostHog Error Tracking
  capture_exceptions: true,
  // Debug logging in development
  debug: process.env.NODE_ENV === 'development',
})

// IMPORTANT: Never combine this with a PostHogProvider component.
// instrumentation-client.ts is the correct initialisation approach for Next.js 15.3+.
