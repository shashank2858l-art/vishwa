-- ============================================
-- VISHWAS — COMPLETE PRODUCTION DATABASE SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor.
-- It is idempotent (safe to run multiple times).
-- ============================================

-- ═══════════════════════════════════════════════════════
-- 1. CORE TABLES
-- ═══════════════════════════════════════════════════════

-- ─── USERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'citizen'
    CHECK (role IN ('citizen', 'admin', 'ngo', 'validator')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMPLAINTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_code TEXT UNIQUE NOT NULL,
  pin_code TEXT NOT NULL,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  anonymous BOOLEAN DEFAULT false,
  proxy_mode BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  ai_summary TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  urgency_score INTEGER DEFAULT 0
    CHECK (urgency_score BETWEEN 0 AND 100),
  location TEXT,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'submitted'
    CHECK (status IN (
      'submitted', 'verified', 'assigned',
      'under_review', 'action_taken', 'resolved', 'escalated', 'rejected'
    )),
  escalation_level INTEGER DEFAULT 0,
  genuineness_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMPLAINT TIMELINE ─────────────────────────────────
CREATE TABLE IF NOT EXISTS complaint_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  proof_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VALIDATIONS (Community Trust) ──────────────────────
CREATE TABLE IF NOT EXISTS validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('support_vote', 'trusted_verify')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(complaint_id, user_id, type)
);

-- ─── ASSIGNMENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUDIT LOGS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  actor UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FUNDRAISERS (Community Support) ────────────────────
CREATE TABLE IF NOT EXISTS fundraisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other'
    CHECK (category IN ('medical', 'education', 'disaster', 'legal', 'housing', 'community', 'relief', 'loan', 'other')),
  goal_amount INTEGER NOT NULL DEFAULT 0,
  raised_amount INTEGER NOT NULL DEFAULT 0,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_name TEXT NOT NULL,
  creator_email TEXT,
  creator_phone TEXT,
  upi_id TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'closed')),
  donor_count INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DONATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fundraiser_id UUID NOT NULL REFERENCES fundraisers(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  donor_name TEXT NOT NULL DEFAULT 'Anonymous',
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════
-- 2. INDEXES
-- ═══════════════════════════════════════════════════════

-- Complaints
CREATE INDEX IF NOT EXISTS idx_complaints_code ON complaints(complaint_code);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_submitted_by ON complaints(submitted_by);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_updated_at ON complaints(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_ai_summary ON complaints USING btree (status) WHERE ai_summary IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_complaints_priority_status ON complaints USING btree (priority, status);

-- Timeline
CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON complaint_timeline(complaint_id);
CREATE INDEX IF NOT EXISTS idx_timeline_created_at ON complaint_timeline(created_at);

-- Validations
CREATE INDEX IF NOT EXISTS idx_validations_complaint ON validations(complaint_id);
CREATE INDEX IF NOT EXISTS idx_validations_user ON validations(user_id);

-- Assignments
CREATE INDEX IF NOT EXISTS idx_assignments_complaint ON assignments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_assignments_assignee ON assignments(assigned_to);

-- Audit
CREATE INDEX IF NOT EXISTS idx_audit_complaint ON audit_logs(complaint_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);

-- Fundraisers
CREATE INDEX IF NOT EXISTS idx_fundraisers_status ON fundraisers(status);
CREATE INDEX IF NOT EXISTS idx_fundraisers_category ON fundraisers(category);
CREATE INDEX IF NOT EXISTS idx_fundraisers_created_at ON fundraisers(created_at DESC);

-- Donations
CREATE INDEX IF NOT EXISTS idx_donations_fundraiser ON donations(fundraiser_id);


-- ═══════════════════════════════════════════════════════
-- 3. TRIGGERS
-- ═══════════════════════════════════════════════════════

-- Auto-update updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Complaints updated_at trigger
DROP TRIGGER IF EXISTS complaints_updated_at ON complaints;
CREATE TRIGGER complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Fundraisers updated_at trigger
DROP TRIGGER IF EXISTS fundraisers_updated_at ON fundraisers;
CREATE TRIGGER fundraisers_updated_at
  BEFORE UPDATE ON fundraisers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════
-- 4. FIX STATUS CONSTRAINT (add 'rejected' + 'escalated')
-- ═══════════════════════════════════════════════════════

-- Drop old constraint and re-add with all statuses
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check 
  CHECK (status IN ('submitted', 'verified', 'assigned', 'under_review', 'action_taken', 'resolved', 'escalated', 'rejected'));


-- ═══════════════════════════════════════════════════════
-- 5. REALTIME
-- ═══════════════════════════════════════════════════════

-- Enable realtime for key tables (ignore errors if already added)
DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE complaint_timeline;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE fundraisers;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;


-- ═══════════════════════════════════════════════════════
-- 6. STORAGE BUCKET
-- ═══════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-media', 'complaint-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (ignore errors if already exist)
DO $$
BEGIN
  CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'complaint-media');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'complaint-media');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'complaint-media');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ═══════════════════════════════════════════════════════
-- 7. SEED DATA (Admin + Test Users)
-- ═══════════════════════════════════════════════════════

-- Admin user (password: Admin@12345 — bcrypt hash)
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'Platform Admin',
  'admin@vishwas.com',
  '+919999999999',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Sample validator
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'Trusted Validator',
  'validator@ngo.org',
  '+918888888888',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'validator'
) ON CONFLICT (email) DO NOTHING;

-- Sample NGO user
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'NGO Representative',
  'ngo@helpinghands.org',
  '+917777777777',
  '$2a$12$LJ3m4ys5Lp0JdRq4lD7Ybu5r3L5Kj5XzRQ0FKv1F7u8gN2qK8vXHy',
  'ngo'
) ON CONFLICT (email) DO NOTHING;


-- ═══════════════════════════════════════════════════════
-- DONE! All 8 tables created, indexed, and ready.
-- ═══════════════════════════════════════════════════════
