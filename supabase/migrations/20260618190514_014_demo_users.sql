-- Create demo users via auth.users and user_profiles
-- Note: these are inserted directly into auth schema for demo purposes
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Dr. Admin BMSCE"}', NOW(), NOW(), 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000002', 'student@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Raghavendra Kumar"}', NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, created_at, updated_at, provider_id)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@bmsce.ac.in"}', 'email', NOW(), NOW(), '00000000-0000-0000-0000-000000000001'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '{"sub":"00000000-0000-0000-0000-000000000002","email":"student@bmsce.ac.in"}', 'email', NOW(), NOW(), '00000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

INSERT INTO user_profiles (user_id, name, email, role, semester, department_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Dr. Admin BMSCE', 'admin@bmsce.ac.in', 'superadmin', NULL, NULL),
  ('00000000-0000-0000-0000-000000000002', 'Raghavendra Kumar', 'student@bmsce.ac.in', 'student', 5, (SELECT id FROM departments WHERE code = 'CSE'))
ON CONFLICT (user_id) DO NOTHING;