-- Add admin_id column to clubs for club-specific admin
ALTER TABLE clubs ADD COLUMN admin_id UUID REFERENCES auth.users(id);

-- Create club_members table for membership tracking
CREATE TABLE club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(club_id, user_id)
);

-- Enable RLS
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for club_members
CREATE POLICY "club_members_select" ON club_members FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "club_members_insert_own" ON club_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "club_members_delete_own" ON club_members FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_club_members_club ON club_members(club_id);
CREATE INDEX idx_club_members_user ON club_members(user_id);