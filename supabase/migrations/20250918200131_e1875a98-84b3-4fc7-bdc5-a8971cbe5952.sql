-- Fix security warnings by setting proper search_path for functions

-- Drop and recreate functions with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.calculate_lead_score(JSONB);

-- Function to update timestamps with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to handle new user signup with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to calculate lead score with secure search_path
CREATE OR REPLACE FUNCTION public.calculate_lead_score(lead_data JSONB)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Base score for providing contact info
    score := score + 10;
    
    -- Company name provided
    IF lead_data->>'company_name' IS NOT NULL AND length(lead_data->>'company_name') > 0 THEN
        score := score + 15;
    END IF;
    
    -- Phone number provided
    IF lead_data->>'phone' IS NOT NULL AND length(lead_data->>'phone') > 0 THEN
        score := score + 10;
    END IF;
    
    -- Budget scoring
    CASE lead_data->>'monthly_budget'
        WHEN '$5,000 - $10,000' THEN score := score + 20;
        WHEN '$10,000 - $25,000' THEN score := score + 30;
        WHEN '$25,000+' THEN score := score + 40;
        WHEN '$1,000 - $5,000' THEN score := score + 10;
        ELSE score := score + 5;
    END CASE;
    
    -- Business goals and challenges provided
    IF lead_data->>'business_goals' IS NOT NULL AND length(lead_data->>'business_goals') > 50 THEN
        score := score + 15;
    END IF;
    
    IF lead_data->>'challenges' IS NOT NULL AND length(lead_data->>'challenges') > 50 THEN
        score := score + 15;
    END IF;
    
    RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;