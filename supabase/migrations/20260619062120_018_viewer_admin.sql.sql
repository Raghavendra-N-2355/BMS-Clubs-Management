-- Create a read-only demo admin that can view but NOT create events
DO $$
DECLARE
    view_admin_id UUID := '00000000-0000-0000-0000-000000000010'::uuid;
BEGIN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role)
    VALUES 
      (view_admin_id, 'viewer@bmsce.ac.in', crypt('Demo@123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Viewer Admin"}', NOW(), NOW(), 'authenticated', 'authenticated')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (id, user_id, identity_data, provider, created_at, updated_at, provider_id)
    VALUES
      (gen_random_uuid(), view_admin_id, '{"sub":"00000000-0000-0000-0000-000000000010","email":"viewer@bmsce.ac.in"}', 'email', NOW(), NOW(), view_admin_id)
    ON CONFLICT DO NOTHING;

    INSERT INTO user_profiles (user_id, name, email, role, semester, department_id)
    VALUES 
      (view_admin_id, 'Viewer Admin', 'viewer@bmsce.ac.in', 'admin', NULL, NULL)
    ON CONFLICT (user_id) DO NOTHING;
END $$;