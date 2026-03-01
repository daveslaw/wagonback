<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Wagon Back Solutions Next.js 16 (App Router) project. PostHog is now tracking the full lead-generation funnel — from the first CTA click on the landing page, through each assessment step, to server-confirmed submission, proposal delivery, and discovery call booking.

## What was set up

**Client-side initialisation** (`instrumentation-client.ts`) — uses the Next.js 15.3+ `instrumentation-client` pattern for zero-config PostHog boot. Initialised with the EU host, automatic exception capture (`capture_exceptions: true`), and an `/ingest` reverse proxy to improve reliability against ad blockers.

**Reverse proxy** (`next.config.ts`) — `/ingest/*` rewrites to `https://eu.i.posthog.com` added alongside the existing security headers. `skipTrailingSlashRedirect: true` enabled as required.

**Server-side client** (`lib/posthog-server.ts`) — lightweight `posthog-node` factory used in API routes. Each route creates a fresh instance with `flushAt: 1` / `flushInterval: 0` to guarantee immediate flushing in serverless environments, then calls `shutdown()`.

**User identification** — on assessment submission the user is identified client-side (`posthog.identify`) and server-side (`posthog.identify` via posthog-node) using their email as the distinct ID, enriched with name, business name, industry, and team size. The client's `distinct_id` and `session_id` are forwarded in `X-PostHog-Distinct-ID` / `X-PostHog-Session-ID` headers so server-side events are stitched to the same session.

**Error tracking** — `posthog.captureException(err)` added to the assessment submission error handler so unhandled exceptions appear in PostHog Error Tracking.

**Metadata** — moved from `app/confirmation/page.tsx` (now a client component) into a new `app/confirmation/layout.tsx` so Next.js can still export route metadata.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `assessment_cta_clicked` | User clicked a "Get Your Free Assessment" CTA. `source` property distinguishes `hero`, `cta_banner`, `nav_desktop`, `nav_mobile`. | `components/sections/Hero.tsx`, `components/sections/CTABanner.tsx`, `components/sections/Nav.tsx` |
| `how_it_works_section_viewed` | User clicked "See How It Works" from the hero — top-of-funnel engagement signal. | `components/sections/Hero.tsx` |
| `assessment_step_completed` | User advanced past a form step. `step` (1 or 2) plus relevant form values captured. | `app/assessment/page.tsx` |
| `assessment_submitted` | Full assessment successfully submitted (client confirms 200 response). Industry, team size, revenue range, budget, timeline, pain point count, and tool count captured. | `app/assessment/page.tsx` |
| `assessment_submission_failed` | Client-side submission error (API returned non-200). Error message captured. Also fires `captureException`. | `app/assessment/page.tsx` |
| `assessment_received` | **Server-side.** Assessment saved to Supabase. Correlated to the originating browser session via forwarded PostHog headers. | `app/api/assessment/route.ts` |
| `assessment_submission_error` | **Server-side.** DB error or unhandled exception in the assessment API route. | `app/api/assessment/route.ts` |
| `discovery_call_booked` | User clicked "Book a Discovery Call" on the confirmation page (opens Calendly). | `app/confirmation/page.tsx` |
| `proposal_sent` | **Server-side.** Proposal PDF generated and emailed to the prospect via the admin route. | `app/api/generate-proposal/route.ts` |

## New files created

| File | Purpose |
|---|---|
| `instrumentation-client.ts` | Client-side PostHog initialisation (Next.js 15.3+ pattern) |
| `lib/posthog-server.ts` | Server-side `posthog-node` client factory |
| `app/confirmation/layout.tsx` | Route metadata (moved from page.tsx after adding `'use client'`) |

## Packages installed

- `posthog-js` — client-side SDK
- `posthog-node` — server-side SDK

## Environment variables added

Set in `.env.local` (and required in Vercel environment variables):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_H6E5JoFNcVqlfYkZALaTt9YTQNGtwr3VZxeNLaRPTJp` |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics:** https://eu.posthog.com/project/133898/dashboard/546708

### Insights on the dashboard

| Insight | URL |
|---|---|
| Assessment Conversion Funnel | https://eu.posthog.com/project/133898/insights/w74lWCCB |
| Daily CTA Clicks vs Assessments Submitted | https://eu.posthog.com/project/133898/insights/TMlJ2NqF |
| CTA Click Source Breakdown | https://eu.posthog.com/project/133898/insights/oipnspMV |
| Assessments by Industry | https://eu.posthog.com/project/133898/insights/vMILIc3p |
| Proposal Pipeline: Received vs Sent | https://eu.posthog.com/project/133898/insights/I5xgRCCV |

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
