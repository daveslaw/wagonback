import { PostHog } from 'posthog-node'

/**
 * Creates a new PostHog server-side client per call.
 * flushAt=1 / flushInterval=0 ensures events flush immediately,
 * which is required for short-lived Next.js API routes and serverless functions.
 * Always call `await posthog.shutdown()` after capturing events.
 */
export function getPostHogClient(): PostHog {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
}
