-- Create email system tables

-- Email templates table for managing reusable email templates
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type TEXT NOT NULL DEFAULT 'notification',
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email campaigns table for tracking email campaigns
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_id UUID REFERENCES public.email_templates(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'paused')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email subscriptions for managing user email preferences
CREATE TABLE public.email_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  subscribed BOOLEAN NOT NULL DEFAULT true,
  subscription_types JSONB DEFAULT '{"notifications": true, "newsletters": true, "marketing": true}',
  unsubscribe_token TEXT UNIQUE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, lead_id)
);

-- Email logs for tracking all sent emails
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id TEXT, -- Resend email ID
  recipient_email TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  campaign_id UUID REFERENCES public.email_campaigns(id),
  template_id UUID REFERENCES public.email_templates(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'complained', 'failed')),
  error_message TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email sequences for automated email series
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'lead_created' CHECK (trigger_type IN ('lead_created', 'form_submitted', 'manual', 'scheduled')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email sequence steps for defining the steps in an automated sequence
CREATE TABLE public.email_sequence_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  template_id UUID NOT NULL REFERENCES public.email_templates(id),
  delay_hours INTEGER NOT NULL DEFAULT 0,
  delay_days INTEGER NOT NULL DEFAULT 0,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sequence_id, step_number)
);

-- Email queue for managing scheduled and queued emails
CREATE TABLE public.email_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  template_id UUID REFERENCES public.email_templates(id),
  campaign_id UUID REFERENCES public.email_campaigns(id),
  sequence_id UUID REFERENCES public.email_sequences(id),
  sequence_step_id UUID REFERENCES public.email_sequence_steps(id),
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'sent', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all email tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage email templates" ON public.email_templates FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view email subscriptions" ON public.email_subscriptions FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage email sequences" ON public.email_sequences FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage sequence steps" ON public.email_sequence_steps FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage email queue" ON public.email_queue FOR ALL TO authenticated USING (public.is_admin());

-- Create updated_at triggers
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_subscriptions_updated_at BEFORE UPDATE ON public.email_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_logs_updated_at BEFORE UPDATE ON public.email_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON public.email_sequences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_sequence_steps_updated_at BEFORE UPDATE ON public.email_sequence_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE ON public.email_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, variables) VALUES
(
  'lead_notification',
  'New Lead Received - {first_name} {last_name}',
  '<h1>New Lead Alert!</h1><p>A new lead has been received:</p><ul><li><strong>Name:</strong> {first_name} {last_name}</li><li><strong>Email:</strong> {email}</li><li><strong>Company:</strong> {company_name}</li><li><strong>Phone:</strong> {phone}</li><li><strong>Budget:</strong> {monthly_budget}</li><li><strong>Goals:</strong> {business_goals}</li><li><strong>Challenges:</strong> {challenges}</li><li><strong>Lead Score:</strong> {score}</li><li><strong>Source:</strong> {source_name}</li><li><strong>Submitted:</strong> {created_at}</li></ul><p><a href="{admin_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Admin Dashboard</a></p>',
  'New Lead Alert!\n\nA new lead has been received:\n\nName: {first_name} {last_name}\nEmail: {email}\nCompany: {company_name}\nPhone: {phone}\nBudget: {monthly_budget}\nGoals: {business_goals}\nChallenges: {challenges}\nLead Score: {score}\nSource: {source_name}\nSubmitted: {created_at}\n\nView in Admin Dashboard: {admin_url}',
  'notification',
  '{"first_name": "", "last_name": "", "email": "", "company_name": "", "phone": "", "monthly_budget": "", "business_goals": "", "challenges": "", "score": 0, "source_name": "", "created_at": "", "admin_url": ""}'
),
(
  'welcome_email',
  'Welcome {first_name}! Your consultation request has been received',
  '<h1>Thank you for your interest, {first_name}!</h1><p>We have received your consultation request and will get back to you within 24 hours.</p><p><strong>What happens next:</strong></p><ol><li>Our team will review your information</li><li>We will prepare a customized consultation agenda</li><li>You will receive a calendar link to schedule your consultation</li></ol><p>In the meantime, feel free to explore our resources or contact us if you have any questions.</p><p>Best regards,<br>The Team</p>',
  'Thank you for your interest, {first_name}!\n\nWe have received your consultation request and will get back to you within 24 hours.\n\nWhat happens next:\n1. Our team will review your information\n2. We will prepare a customized consultation agenda\n3. You will receive a calendar link to schedule your consultation\n\nIn the meantime, feel free to explore our resources or contact us if you have any questions.\n\nBest regards,\nThe Team',
  'welcome',
  '{"first_name": "", "last_name": "", "email": "", "company_name": ""}'
);

-- Insert default email sequence
INSERT INTO public.email_sequences (name, description, trigger_type, is_active) VALUES
(
  'New Lead Welcome Series',
  'Automated welcome sequence for new leads who submit consultation forms',
  'lead_created',
  true
);

-- Insert sequence steps
INSERT INTO public.email_sequence_steps (sequence_id, step_number, template_id, delay_hours, delay_days)
SELECT 
  es.id,
  1,
  et.id,
  0,
  0
FROM public.email_sequences es, public.email_templates et
WHERE es.name = 'New Lead Welcome Series' AND et.name = 'welcome_email';