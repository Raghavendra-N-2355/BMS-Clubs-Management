-- Delete existing demo users and recreate - comprehensive cleanup
-- First null out foreign key references
UPDATE events SET created_by = NULL WHERE created_by IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Delete payments referencing these users
DELETE FROM payments WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Delete registrations referencing these users
DELETE FROM registrations WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Delete user_profiles first
DELETE FROM user_profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Delete identities
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Now delete the users
DELETE FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in');

-- Insert users with all required fields
INSERT INTO auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  is_sso_user,
  is_anonymous
)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001'::uuid,
    'admin@bmsce.ac.in',
    crypt('Demo@123', gen_salt('bf', 8)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Dr. Admin BMSCE"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002'::uuid,
    'student@bmsce.ac.in',
    crypt('Demo@123', gen_salt('bf', 8)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Raghavendra Kumar"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000010'::uuid,
    'viewer@bmsce.ac.in',
    crypt('Demo@123', gen_salt('bf', 8)),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Viewer Admin"}'::jsonb,
    NOW(),
    NOW(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    '',
    false,
    false
  );

-- Create identities for these users
INSERT INTO auth.identities (id, user_id, identity_data, provider, created_at, updated_at, provider_id)
SELECT 
  gen_random_uuid(),
  id,
  jsonb_build_object('sub', id::text, 'email', email),
  'email',
  NOW(),
  NOW(),
  id::text
FROM auth.users 
WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in');

-- Create user profiles
INSERT INTO user_profiles (user_id, name, email, role, semester, department_id)
SELECT 
  id,
  raw_user_meta_data->>'name',
  email,
  CASE WHEN email = 'admin@bmsce.ac.in' THEN 'superadmin'::text 
       WHEN email = 'viewer@bmsce.ac.in' THEN 'admin'::text
       ELSE 'student'::text END,
  CASE WHEN email = 'student@bmsce.ac.in' THEN 5 ELSE NULL END,
  CASE WHEN email = 'student@bmsce.ac.in' THEN (SELECT id FROM departments WHERE code = 'CSE' LIMIT 1) ELSE NULL END
FROM auth.users
WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in');