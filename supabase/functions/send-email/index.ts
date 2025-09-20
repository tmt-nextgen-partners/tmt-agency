import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Resend } from "npm:resend@4.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { LeadNotificationEmail } from './_templates/lead-notification.tsx';
import { WelcomeEmail } from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'lead_notification' | 'welcome_email' | 'template';
  recipient: string;
  leadId?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  subject?: string;
}

interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  monthly_budget?: string;
  business_goals?: string;
  challenges?: string;
  score: number;
  created_at: string;
  source_id?: string;
}

function replaceTemplateVariables(content: string, variables: Record<string, any>): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value || ''));
  }
  return result;
}

async function sendLeadNotificationEmail(lead: Lead) {
  // Get admin emails from profiles
  const { data: adminProfiles } = await supabase
    .from('profiles')
    .select('email')
    .eq('role', 'admin');

  if (!adminProfiles || adminProfiles.length === 0) {
    console.warn('No admin profiles found for notifications');
    return;
  }

  // Get lead source info
  const { data: sourceData } = await supabase
    .from('lead_sources')
    .select('name')
    .eq('id', lead.source_id)
    .single();

  const adminUrl = `${supabaseUrl.replace('.supabase.co', '')}/admin`;
  
  const templateData = {
    first_name: lead.first_name || '',
    last_name: lead.last_name || '',
    email: lead.email,
    company_name: lead.company_name || '',
    phone: lead.phone || '',
    monthly_budget: lead.monthly_budget || '',
    business_goals: lead.business_goals || '',
    challenges: lead.challenges || '',
    score: lead.score.toString(),
    source_name: sourceData?.name || 'Unknown',
    created_at: new Date(lead.created_at).toLocaleString(),
    admin_url: adminUrl,
  };

  const html = await renderAsync(
    React.createElement(LeadNotificationEmail, templateData)
  );

  for (const admin of adminProfiles) {
    try {
      const { data: emailResult, error } = await resend.emails.send({
        from: 'TMT Next Gen Partners <onboarding@resend.dev>',
        to: ['tmtnextgenpartners@gmail.com'], // Use verified email for testing
        subject: `New Lead Received - ${lead.first_name || ''} ${lead.last_name || ''}`,
        html,
      });

      // Log the email
      await supabase.from('email_logs').insert({
        email_id: emailResult?.id,
        recipient_email: admin.email,
        lead_id: lead.id,
        subject: `New Lead Received - ${lead.first_name || ''} ${lead.last_name || ''}`,
        status: error ? 'failed' : 'sent',
        error_message: error?.message,
        sent_at: new Date().toISOString(),
        metadata: { type: 'lead_notification', template_data: templateData },
      });

      if (error) {
        console.error('Error sending notification email:', error);
      } else {
        console.log('Notification email sent successfully to:', admin.email);
      }
    } catch (error) {
      console.error('Failed to send email to admin:', admin.email, error);
    }
  }
}

async function sendWelcomeEmail(lead: Lead) {
  const templateData = {
    first_name: lead.first_name || 'there',
    last_name: lead.last_name || '',
    email: lead.email,
    company_name: lead.company_name || '',
  };

  const html = await renderAsync(
    React.createElement(WelcomeEmail, templateData)
  );

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: 'TMT Next Gen Partners <onboarding@resend.dev>',
      to: ['tmtnextgenpartners@gmail.com'], // Use verified email for testing - change to lead.email when domain is verified
      subject: `Welcome ${lead.first_name || ''}! Your consultation request has been received`,
      html,
    });

    // Log the email
    await supabase.from('email_logs').insert({
      email_id: emailResult?.id,
      recipient_email: lead.email,
      lead_id: lead.id,
      subject: `Welcome ${lead.first_name || ''}! Your consultation request has been received`,
      status: error ? 'failed' : 'sent',
      error_message: error?.message,
      sent_at: new Date().toISOString(),
      metadata: { type: 'welcome_email', template_data: templateData },
    });

    // Create email subscription record
    await supabase.from('email_subscriptions').upsert({
      email: lead.email,
      lead_id: lead.id,
      subscribed: true,
      confirmed_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    } else {
      console.log('Welcome email sent successfully to:', lead.email);
    }
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

async function sendTemplateEmail(templateId: string, recipient: string, templateData: Record<string, any>, leadId?: string) {
  // Get template from database
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (templateError || !template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const subject = replaceTemplateVariables(template.subject, templateData);
  const htmlContent = replaceTemplateVariables(template.html_content, templateData);
  const textContent = template.text_content ? replaceTemplateVariables(template.text_content, templateData) : undefined;

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: 'no-reply@resend.dev',
      to: [recipient],
      subject,
      html: htmlContent,
      text: textContent,
    });

    // Log the email
    await supabase.from('email_logs').insert({
      email_id: emailResult?.id,
      recipient_email: recipient,
      lead_id: leadId,
      template_id: templateId,
      subject,
      status: error ? 'failed' : 'sent',
      error_message: error?.message,
      sent_at: new Date().toISOString(),
      metadata: { template_data: templateData },
    });

    if (error) {
      console.error('Error sending template email:', error);
      throw error;
    } else {
      console.log('Template email sent successfully to:', recipient);
    }

    return emailResult;
  } catch (error) {
    console.error('Failed to send template email:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipient, leadId, templateId, templateData, subject }: EmailRequest = await req.json();

    if (type === 'lead_notification' && leadId) {
      // Get lead data
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !lead) {
        throw new Error(`Lead not found: ${leadId}`);
      }

      await sendLeadNotificationEmail(lead);
      return new Response(JSON.stringify({ success: true, message: 'Lead notification sent' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'welcome_email' && leadId) {
      // Get lead data
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !lead) {
        throw new Error(`Lead not found: ${leadId}`);
      }

      await sendWelcomeEmail(lead);
      return new Response(JSON.stringify({ success: true, message: 'Welcome email sent' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'template' && templateId && recipient && templateData) {
      const result = await sendTemplateEmail(templateId, recipient, templateData, leadId);
      return new Response(JSON.stringify({ success: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid email request parameters');

  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});