# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Wagon Back Solutions — AI automation and integration landing page. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and Three.js.

## Commands

```bash
npm run dev       # Start local dev server at http://localhost:3000
npm run build     # Production build (required before deploying)
npm run start     # Run production build locally
```

## Architecture

```
app/
  layout.tsx                  # Root layout — ThemeProvider (dark default), metadata, Geist fonts
  page.tsx                    # Landing page — assembles all section components
  assessment/page.tsx         # Multi-step assessment form (3 steps, client component)
  confirmation/page.tsx       # Post-submit confirmation page with Calendly link
  api/assessment/route.ts     # POST handler: Supabase → PDF → Resend email
components/
  ui/
    dot-shader-background.tsx # Three.js animated dot grid (from 21st.dev, 'use client')
    button.tsx, card.tsx, badge.tsx  # shadcn/ui primitives
  sections/
    Nav.tsx          # Fixed navbar with hamburger on mobile
    Hero.tsx         # Full-screen Three.js hero section
    ValueProps.tsx   # 3-card value proposition section
    HowItWorks.tsx   # 3-step process section
    Integrations.tsx # Platform logos grid
    Tools.tsx        # Workato / Make.com / n8n cards
    CTABanner.tsx    # Repeated CTA section
    Footer.tsx       # Footer with contact info
lib/
  supabase.ts            # Supabase browser client + createServerClient() (service role)
  generateProposal.tsx   # @react-pdf/renderer document template
  sendProposalEmail.ts   # Resend email sender (proposal PDF + internal notification)
types/
  assessment.ts          # AssessmentFormData type + all form option constants
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (server-only) |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_CALENDLY_URL` | Your Calendly booking URL |
| `INTERNAL_NOTIFICATION_EMAIL` | (Optional) Your email for lead notifications |

## Supabase Schema

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  business_name text,
  contact_name text,
  email text,
  phone text,
  industry text,
  team_size text,
  revenue_range text,
  pain_points text[],
  current_tools text[],
  time_drains text,
  desired_outcomes text,
  budget_range text,
  timeline text,
  additional_notes text
);
```

## Netlify Deployment

```bash
npm install -g netlify-cli
netlify login
netlify init          # Create & configure a new site
netlify deploy --prod # Deploy to production
```

Add all environment variables in Netlify dashboard: **Site Settings → Environment Variables** before deploying.

## Design Tokens

- Background: `#0d0d0d`, Surface: `#161616`, Border: `#2a2a2a`
- Accent: `#00c8ff` (electric cyan) — used as `text-[#00c8ff]` / `bg-[#00c8ff]`
- Text: `#f5f5f5` primary, `#888` muted
- Headings: `font-extralight tracking-wide uppercase`
- All sections use `container mx-auto px-4 md:px-8 lg:px-16` for gutters

## Key Patterns

- Mobile-first: `pointer-events-none` on Three.js canvas on mobile (`isMobile` state in Hero.tsx)
- The `DotScreenShader` component is CPU/GPU intensive — keep it only on the hero section
- `createServerClient()` (service role key) is used only in API routes — never in client components
- `renderToBuffer` from `@react-pdf/renderer` runs server-side in the API route — this is expected and correct
