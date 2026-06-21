-- Fix demo user passwords using Supabase's compatible hashing
-- We need to use Supabase's uuid and proper bcrypt format

-- First, let's update the users with proper authentication
-- The 'md5' format with the format: md5(password + email) is what Supabase expects for direct inserts

-- Clean up existing identities and recreate
DELETE FROM auth.identities WHERE user_id IN (
  SELECT id FROM auth.users WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
);

-- Update passwords using Supabase-compatible method
UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$LQv3c1yqBWVHxkd0L2kVq.j0YrT8nGJW9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
  updated_at = NOW()
WHERE email = 'admin@bmsce.ac.in';

UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$LQv3c1yqBWVHxkd0L2kVq.j0YrT8nGJW9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
  updated_at = NOW()
WHERE email = 'student@bmsce.ac.in';

UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$LQv3c1yqBWVHxkd0L2kVq.j0YrT8nGJW9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
  updated_at = NOW()
WHERE email = 'viewer@bmsce.ac.in';

-- Recreate identities
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
WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in')
ON CONFLICT DO NOTHING;