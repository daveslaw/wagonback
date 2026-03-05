import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% of traces for performance monitoring — adjust upward once stable
  tracesSampleRate: 0.1,

  // Only run Sentry when a DSN is set (keeps local dev clean)
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  debug: false,
})
