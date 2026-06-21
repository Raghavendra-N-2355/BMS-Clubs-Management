CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  faculty_coordinator_name TEXT,
  faculty_coordinator_email TEXT,
  student_coordinator_name TEXT,
  student_coordinator_email TEXT,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  admin_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, department_id)
);
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clubs_select_public" ON clubs FOR SELECT TO public USING (true);
CREATE POLICY "clubs_insert_admin" ON clubs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')));
CREATE POLICY "clubs_update_admin" ON clubs FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')));
CREATE POLICY "clubs_delete_admin" ON clubs FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'superadmin'));
CREATE INDEX idx_clubs_department ON clubs(department_id);
CREATE INDEX idx_clubs_name ON clubs(name);
CREATE INDEX idx_clubs_active ON clubs(is_active);