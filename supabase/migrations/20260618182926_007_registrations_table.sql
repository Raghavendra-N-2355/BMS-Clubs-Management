-- Create registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'waitlisted')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id TEXT,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  ticket_number TEXT UNIQUE,
  qr_code TEXT,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  attended BOOLEAN DEFAULT false,
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrations
CREATE POLICY "registrations_select_own" ON registrations FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

CREATE POLICY "registrations_insert_own" ON registrations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "registrations_update_own" ON registrations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Create indexes
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_payment ON registrations(payment_status);
CREATE INDEX idx_registrations_ticket ON registrations(ticket_number);