-- Create more demo users and add registrations for dashboard stats

-- Insert additional demo users
DO $$
DECLARE
    student_id UUID;
BEGIN
    -- Create demo students
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role)
    VALUES 
      ('00000000-0000-0000-0000-000000000003', 'priya.sharma@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Priya Sharma"}', NOW(), NOW(), 'authenticated', 'authenticated'),
      ('00000000-0000-0000-0000-000000000004', 'rahul.verma@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Rahul Verma"}', NOW(), NOW(), 'authenticated', 'authenticated'),
      ('00000000-0000-0000-0000-000000000005', 'ananya.patel@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Ananya Patel"}', NOW(), NOW(), 'authenticated', 'authenticated')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (id, user_id, identity_data, provider, created_at, updated_at, provider_id)
    VALUES
      (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '{"sub":"00000000-0000-0000-0000-000000000003","email":"priya.sharma@bmsce.ac.in"}', 'email', NOW(), NOW(), '00000000-0000-0000-0000-000000000003'),
      (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', '{"sub":"00000000-0000-0000-0000-000000000004","email":"rahul.verma@bmsce.ac.in"}', 'email', NOW(), NOW(), '00000000-0000-0000-0000-000000000004'),
      (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', '{"sub":"00000000-0000-0000-0000-000000000005","email":"ananya.patel@bmsce.ac.in"}', 'email', NOW(), NOW(), '00000000-0000-0000-0000-000000000005')
    ON CONFLICT DO NOTHING;

    -- Get CSE department ID
    SELECT id INTO student_id FROM departments WHERE code = 'CSE' LIMIT 1;
    
    INSERT INTO user_profiles (user_id, name, email, role, semester, department_id, usn)
    VALUES 
      ('00000000-0000-0000-0000-000000000003', 'Priya Sharma', 'priya.sharma@bmsce.ac.in', 'student', 6, student_id, '1BM21CS101'),
      ('00000000-0000-0000-0000-000000000004', 'Rahul Verma', 'rahul.verma@bmsce.ac.in', 'student', 4, student_id, '1BM23CS045'),
      ('00000000-0000-0000-0000-000000000005', 'Ananya Patel', 'ananya.patel@bmsce.ac.in', 'student', 5, student_id, '1BM22CS078')
    ON CONFLICT (user_id) DO NOTHING;
END $$;

-- Create sample registrations for demo events
INSERT INTO registrations (
    event_id, user_id, status, payment_status, ticket_number,
    qr_code, amount_paid, attended
)
SELECT 
    e.id,
    u.user_id,
    CASE WHEN random() < 0.7 THEN 'confirmed' WHEN random() < 0.9 THEN 'pending' ELSE 'waitlisted' END,
    CASE WHEN random() < 0.6 THEN 'completed' WHEN random() < 0.8 THEN 'pending' ELSE 'failed' END,
    'TIX-' || upper(substring(random()::text, 3, 8)),
    'QR-' || upper(substring(random()::text, 3, 12)),
    CASE WHEN e.registration_fee > 0 THEN e.registration_fee ELSE 0 END,
    random() < 0.3
FROM events e
CROSS JOIN (
    SELECT user_id FROM user_profiles 
    WHERE role = 'student' OR email LIKE '%@bmsce.ac.in'
    LIMIT 5
) u
WHERE e.is_active = true AND e.is_approved = true
AND NOT EXISTS (
    SELECT 1 FROM registrations r WHERE r.event_id = e.id AND r.user_id = u.user_id
)
LIMIT 50;

-- Update event participant counts
UPDATE events e SET current_participants = (
    SELECT COUNT(*) FROM registrations WHERE event_id = e.id
) WHERE is_active = true;