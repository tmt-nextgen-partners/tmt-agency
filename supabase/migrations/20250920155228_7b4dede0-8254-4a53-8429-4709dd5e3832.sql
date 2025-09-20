-- Remove the overly permissive policy that allows anyone to view lead sources
DROP POLICY IF EXISTS "Anyone can view lead sources" ON public.lead_sources;

-- Create a secure admin-only policy for viewing lead sources
CREATE POLICY "Admins can view lead sources" 
ON public.lead_sources 
FOR SELECT 
USING (is_admin());

-- Keep the existing policy for admins to manage lead sources
-- (This already exists but ensuring it's documented)
-- CREATE POLICY "Authenticated users can manage lead sources" ON public.lead_sources FOR ALL USING (true);