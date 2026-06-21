CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  poster_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('workshop', 'hackathon', 'seminar', 'competition', 'cultural', 'sports', 'technical', 'other')),
  event_type TEXT DEFAULT 'offline' CHECK (event_type IN ('online', 'offline', 'hybrid')),
  venue TEXT,
  online_link TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_registration_open BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  prerequisites TEXT,
  tags TEXT[],
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select_public" ON events FOR SELECT TO public USING (is_active = true);
CREATE POLICY "events_insert_admin" ON events FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')));
CREATE POLICY "events_update_admin" ON events FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')));
CREATE POLICY "events_delete_admin" ON events FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'superadmin'));
CREATE INDEX idx_events_club ON events(club_id);
CREATE INDEX idx_events_department ON events(department_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_approved ON events(is_approved);
CREATE INDEX idx_events_active ON events(is_active);