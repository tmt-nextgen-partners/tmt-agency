-- Create lead management schema with proper security and indexing

-- Create enum types for better data integrity
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost');
CREATE TYPE public.lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.activity_type AS ENUM ('form_submission', 'email_sent', 'call_made', 'meeting_scheduled', 'proposal_sent', 'follow_up', 'note_added');

-- Lead sources table for tracking where leads come from
CREATE TABLE public.lead_sources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Main leads table
CREATE TABLE public.leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    phone TEXT,
    monthly_budget TEXT,
    business_goals TEXT,
    challenges TEXT,
    source_id UUID REFERENCES public.lead_sources(id),
    status public.lead_status NOT NULL DEFAULT 'new',
    priority public.lead_priority NOT NULL DEFAULT 'medium',
    score INTEGER DEFAULT 0,
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Lead activities table for tracking all interactions
CREATE TABLE public.lead_activities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB
);

-- Lead scores history table
CREATE TABLE public.lead_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table for team management
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default lead sources
INSERT INTO public.lead_sources (name, description) VALUES
('consultation_form', 'Main consultation form on website'),
('newsletter', 'Newsletter subscription'),
('contact_form', 'General contact form'),
('referral', 'Referred by existing client'),
('social_media', 'Social media channels'),
('organic_search', 'Found via search engines'),
('paid_ads', 'Paid advertising campaigns'),
('direct', 'Direct website visit');

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_source_id ON public.leads(source_id);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created_at ON public.lead_activities(created_at DESC);
CREATE INDEX idx_lead_scores_lead_id ON public.lead_scores(lead_id);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads (admin access only for now)
CREATE POLICY "Authenticated users can view all leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert leads" 
ON public.leads 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated 
USING (true);

-- RLS Policies for lead_sources (public read, admin write)
CREATE POLICY "Anyone can view lead sources" 
ON public.lead_sources 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage lead sources" 
ON public.lead_sources 
FOR ALL 
TO authenticated 
USING (true);

-- RLS Policies for lead_activities
CREATE POLICY "Authenticated users can view all activities" 
ON public.lead_activities 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert activities" 
ON public.lead_activities 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- RLS Policies for lead_scores
CREATE POLICY "Authenticated users can view all scores" 
ON public.lead_scores 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert scores" 
ON public.lead_scores 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_sources_updated_at
    BEFORE UPDATE ON public.lead_sources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate lead score
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
$$ LANGUAGE plpgsql;