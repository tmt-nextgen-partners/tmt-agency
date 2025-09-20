-- First, add a unique constraint on email for profiles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

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