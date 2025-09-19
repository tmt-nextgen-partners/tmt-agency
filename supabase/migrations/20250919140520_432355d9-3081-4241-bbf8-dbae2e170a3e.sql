-- Drop the existing restrictive INSERT policy for leads
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;

-- Create new policy allowing anonymous users to insert leads
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Ensure the existing admin policies remain intact for viewing and updating
-- (These should already exist but adding them here to be explicit)
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
USING (is_admin())
ON CONFLICT DO NOTHING;

CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
USING (is_admin())
ON CONFLICT DO NOTHING;