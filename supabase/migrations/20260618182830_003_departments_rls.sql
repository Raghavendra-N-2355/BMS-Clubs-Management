-- Enable RLS on departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (public read, admin write)
CREATE POLICY "departments_select_public" ON departments FOR SELECT
  TO public USING (true);

CREATE POLICY "departments_insert_admin" ON departments FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "departments_update_admin" ON departments FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "departments_delete_admin" ON departments FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'superadmin'
    )
  );