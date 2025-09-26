-- Fix security vulnerability: Remove public INSERT access to leads table
-- Replace with service role only access

-- Remove the vulnerable "Anyone can submit leads" policy
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

-- Create a secure policy that only allows service role access
-- This ensures only our edge functions can insert leads, not direct client access
CREATE POLICY "Service role can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add input validation trigger to ensure data quality
CREATE OR REPLACE FUNCTION public.validate_lead_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate email format
    IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate required fields
    IF NEW.email = '' THEN
        RAISE EXCEPTION 'Email cannot be empty';
    END IF;
    
    -- Sanitize and validate optional text fields
    IF NEW.first_name IS NOT NULL THEN
        NEW.first_name = trim(NEW.first_name);
        IF length(NEW.first_name) > 100 THEN
            RAISE EXCEPTION 'First name too long';
        END IF;
    END IF;
    
    IF NEW.last_name IS NOT NULL THEN
        NEW.last_name = trim(NEW.last_name);
        IF length(NEW.last_name) > 100 THEN
            RAISE EXCEPTION 'Last name too long';
        END IF;
    END IF;
    
    IF NEW.company_name IS NOT NULL THEN
        NEW.company_name = trim(NEW.company_name);
        IF length(NEW.company_name) > 200 THEN
            RAISE EXCEPTION 'Company name too long';
        END IF;
    END IF;
    
    -- Validate phone format if provided
    IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
        NEW.phone = regexp_replace(NEW.phone, '[^0-9+\-\(\)\s]', '', 'g');
        IF length(NEW.phone) < 10 OR length(NEW.phone) > 20 THEN
            RAISE EXCEPTION 'Invalid phone number format';
        END IF;
    END IF;
    
    -- Validate business goals and challenges length
    IF NEW.business_goals IS NOT NULL AND length(NEW.business_goals) > 2000 THEN
        RAISE EXCEPTION 'Business goals text too long';
    END IF;
    
    IF NEW.challenges IS NOT NULL AND length(NEW.challenges) > 2000 THEN
        RAISE EXCEPTION 'Challenges text too long';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Add the validation trigger
CREATE TRIGGER validate_lead_data_trigger
    BEFORE INSERT OR UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_lead_data();