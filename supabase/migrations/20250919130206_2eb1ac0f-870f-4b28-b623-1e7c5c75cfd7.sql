-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing overly permissive policies for leads table
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;

-- Create secure policies for leads table - only admins can access
CREATE POLICY "Admins can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

-- Keep insert policy for lead generation from forms (needed for public consultation forms)
-- This allows the form submission to work while keeping read access restricted

-- Drop existing overly permissive policies for profiles table  
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create secure policy for profiles - users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to view all profiles for management purposes
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Drop existing overly permissive policies for lead_activities
DROP POLICY IF EXISTS "Authenticated users can view all activities" ON public.lead_activities;

-- Create secure policy for lead_activities - only admins can access
CREATE POLICY "Admins can view all lead activities" 
ON public.lead_activities 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Drop existing overly permissive policies for lead_scores
DROP POLICY IF EXISTS "Authenticated users can view all scores" ON public.lead_scores;

-- Create secure policy for lead_scores - only admins can access
CREATE POLICY "Admins can view all lead scores" 
ON public.lead_scores 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Grant admins full access to manage lead activities and scores
CREATE POLICY "Admins can insert lead activities" 
ON public.lead_activities 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can insert lead scores" 
ON public.lead_scores 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());