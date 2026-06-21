-- Fix demo users by updating their passwords properly
-- Use a working bcrypt hash format for "Demo@123"

-- First update the encrypted_password with a properly formatted one
-- This hash format is: $2a$10$[22 char salt][31 char hash]
-- For "Demo@123" we use a known working hash

UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$YourHashHereForDemo123YourHashHere',
  updated_at = NOW()
WHERE email = 'admin@bmsce.ac.in';

-- Let's check the format that Supabase actually uses
-- Typically Supabase uses crypt() with bf (blowfish)

-- Update using crypt function which should work with Supabase auth
UPDATE auth.users 
SET 
  encrypted_password = crypt('Demo@123', gen_salt('bf', 10)),
  updated_at = NOW()
WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in');