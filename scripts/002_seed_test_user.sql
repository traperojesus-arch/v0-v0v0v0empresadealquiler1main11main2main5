-- This script creates a test admin user
-- Note: In Supabase, you need to create the auth user through the dashboard or API
-- This is a reference for the credentials you should create manually

-- IMPORTANT: Create this user in Supabase Auth Dashboard:
-- Email: admin@empresa.com
-- Password: admin123
-- Then run this script to create the profile

-- Insert admin profile (replace the UUID with the actual user ID from auth.users)
-- You can get the user ID by running: SELECT id FROM auth.users WHERE email = 'admin@empresa.com';

-- For now, this is a placeholder. After creating the user in Supabase Auth,
-- the trigger will automatically create the profile with role 'standard'.
-- You'll need to update it to 'admin' manually or through the app.

-- Example update query (run after user is created):
-- UPDATE public.profiles 
-- SET role = 'admin', full_name = 'Administrador'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@empresa.com');

-- Note: Since we can't directly insert into auth.users via SQL in Supabase,
-- you need to either:
-- 1. Use the Supabase Dashboard to create the user
-- 2. Use the signup form in the app
-- 3. Use the Supabase API/SDK

COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';
