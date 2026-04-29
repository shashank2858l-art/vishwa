-- ============================================
-- SUPABASE STORAGE — Bucket Setup
-- ============================================
-- Run this in the Supabase SQL Editor to create the storage bucket
-- and set up access policies.

-- Create the complaint-media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-media', 'complaint-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'complaint-media');

-- Policy: Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'complaint-media');

-- Policy: Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'complaint-media');
