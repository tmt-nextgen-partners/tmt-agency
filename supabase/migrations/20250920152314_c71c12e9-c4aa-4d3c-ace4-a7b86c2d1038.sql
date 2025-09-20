-- Insert an admin profile for receiving lead notifications
INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
VALUES (
  gen_random_uuid(),
  'tmtnextgenpartners@gmail.com',
  'Admin',
  'User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;