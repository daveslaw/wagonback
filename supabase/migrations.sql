-- WagonBack — Supabase manual migrations
-- Run each section in the Supabase SQL Editor (dashboard.supabase.com → SQL Editor)
-- Safe to run multiple times — each statement checks before applying.

-- ─────────────────────────────────────────────────────────────────────────────
-- J: Add submitter_ip column for IP-based rate limiting
--    Required for the rate limit check in app/api/assessment/route.ts
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS submitter_ip TEXT;


-- ─────────────────────────────────────────────────────────────────────────────
-- K: Indexes for admin dashboard query performance
--    Speeds up the filtered/sorted fetch in app/admin/page.tsx
-- ─────────────────────────────────────────────────────────────────────────────

-- Most common filter: non-archived rows ordered by date (the default admin view)
CREATE INDEX IF NOT EXISTS idx_assessments_archived_created
  ON assessments (archived, created_at DESC);

-- Status filter (used in AdminClientPanel dropdowns)
CREATE INDEX IF NOT EXISTS idx_assessments_status
  ON assessments (status);

-- Email lookup (used by the rate limiter)
CREATE INDEX IF NOT EXISTS idx_assessments_email
  ON assessments (email);

-- IP lookup (used by the rate limiter once submitter_ip column exists)
CREATE INDEX IF NOT EXISTS idx_assessments_submitter_ip
  ON assessments (submitter_ip);
