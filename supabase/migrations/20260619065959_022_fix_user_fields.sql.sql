-- Update required fields for demo users
UPDATE auth.users SET
  instance_id = '00000000-0000-0000-0000-000000000000',
  is_sso_user = false,
  is_anonymous = false,
  confirmation_token = '',
  recovery_token = ''
WHERE email IN ('admin@bmsce.ac.in', 'student@bmsce.ac.in', 'viewer@bmsce.ac.in');