-- Migration to add is_public column to notes table
-- Run this in your Supabase SQL Editor

-- Add is_public column (defaults to true for new notes)
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;

-- Drop the old select policy
DROP POLICY IF EXISTS "Allow logged in select" ON notes;

-- Create new select policy that allows users to see their own notes OR public notes
CREATE POLICY "Allow logged in select" ON notes
  FOR select USING (
    auth.role() = 'authenticated' and
    (user_id = auth.uid() or is_public = true)
  );
