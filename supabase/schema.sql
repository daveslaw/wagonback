-- WagonBack Solutions — Supabase Schema
-- Last updated: 2026-03-05
--
-- This file documents the live schema in the Supabase cloud console.
-- There are no automated migrations — apply changes manually via the
-- Supabase SQL editor at https://app.supabase.com
--
-- To regenerate from the live DB:
--   supabase db dump --schema-only > supabase/schema.sql

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assessments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL    DEFAULT now(),

  -- Step 1: Contact details
  business_name    TEXT        NOT NULL,
  contact_name     TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  phone            TEXT,

  -- Step 1 & 3: Business profile
  -- Allowed values are enforced in the API (see types/assessment.ts constants)
  industry         TEXT        NOT NULL,   -- INDUSTRIES constant
  team_size        TEXT        NOT NULL,   -- TEAM_SIZES constant
  revenue_range    TEXT,                   -- REVENUE_RANGES constant
  budget_range     TEXT        NOT NULL,   -- BUDGET_RANGES constant
  timeline         TEXT        NOT NULL,   -- TIMELINES constant

  -- Step 2: Challenges
  pain_points      TEXT[],                 -- multi-select from PAIN_POINTS
  current_tools    TEXT[],                 -- multi-select from TOOL_OPTIONS
  time_drains      TEXT,                   -- max 2000 chars (enforced in API)

  -- Step 3: Goals
  desired_outcomes TEXT,                   -- max 2000 chars
  additional_notes TEXT,                   -- max 2000 chars

  -- Admin / pipeline
  status           TEXT        NOT NULL    DEFAULT 'new',
                                           -- enum: new | contacted | in_discussion | won | lost
  admin_notes      TEXT,                   -- max 5000 chars (enforced in API)
  archived         BOOLEAN     NOT NULL    DEFAULT false,
  proposal_sent_at TIMESTAMPTZ,

  -- Rate limiting
  -- Added via: ALTER TABLE assessments ADD COLUMN submitter_ip TEXT;
  -- If this column is absent the app silently skips IP rate limiting (non-fatal).
  submitter_ip     TEXT
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- Run these in the Supabase SQL editor.
-- Use CONCURRENTLY to avoid locking the table in production.

-- Required for email + IP rate limiting (runs on every public form submission)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_email
  ON assessments (email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_submitter_ip
  ON assessments (submitter_ip);

-- Required for date-range filtering in rate limit queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_created_at
  ON assessments (created_at DESC);

-- Required for admin panel default query (archived=false ORDER BY created_at DESC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_archived_created
  ON assessments (archived, created_at DESC);

-- ── Notes ─────────────────────────────────────────────────────────────────────
-- • No ORM — all queries use the Supabase JS query builder directly
-- • Service role key is used server-side; RLS is not the primary auth mechanism
-- • email is not UNIQUE — the same email can resubmit after the 24h rate limit window
-- • No foreign keys — assessments is a standalone table
