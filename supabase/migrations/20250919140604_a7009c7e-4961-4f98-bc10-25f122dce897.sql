-- Drop the existing restrictive INSERT policy for leads
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;

-- Create new policy allowing anonymous users to insert leads
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);