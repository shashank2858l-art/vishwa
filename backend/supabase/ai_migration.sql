-- ============================================
-- AI MODERATION MIGRATION
-- Run this in Supabase SQL Editor (paste & click Run)
-- ============================================

-- 1. Drop the old status check constraint and add one that includes 'rejected'
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check 
  CHECK (status IN ('submitted', 'verified', 'assigned', 'under_review', 'action_taken', 'resolved', 'rejected'));

-- 2. Ensure ai_summary column exists (it should, but just in case)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'complaints' AND column_name = 'ai_summary') THEN
    ALTER TABLE complaints ADD COLUMN ai_summary TEXT;
  END IF;
END $$;

-- 3. Ensure urgency_score column exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'complaints' AND column_name = 'urgency_score') THEN
    ALTER TABLE complaints ADD COLUMN urgency_score INTEGER DEFAULT 0;
  END IF;
END $$;

-- 4. Ensure genuineness_score column exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'complaints' AND column_name = 'genuineness_score') THEN
    ALTER TABLE complaints ADD COLUMN genuineness_score INTEGER DEFAULT 0;
  END IF;
END $$;

-- 5. Index for fast AI queue lookups
CREATE INDEX IF NOT EXISTS idx_complaints_ai_summary ON complaints USING btree (status) WHERE ai_summary IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_complaints_priority_status ON complaints USING btree (priority, status);
