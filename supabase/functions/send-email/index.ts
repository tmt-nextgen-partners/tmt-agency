import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

// Initialize logging
console.log('🚀 Starting send-email function...');

// Environment variable validation
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

console.log('📋 Environment check:');
console.log('- RESEND_API_KEY:', RESEND_API_KEY ? '✅ Present' : '❌ Missing');
console.log('- SUPABASE_URL:', SUPABASE_URL ? '✅ Present' : '❌ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Present' : '❌ Missing');

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing from environment variables');
  throw new Error('RESEND_API_KEY environment variable is required');
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase environment variables are missing');
  throw new Error('Supabase environment variables are required');
}

// Dynamic imports with better error handling
let Resend: any;
let React: any;
let renderAsync: any;
let LeadNotificationEmail: any;
let WelcomeEmail: any;

try {
  console.log('📦 Loading dependencies...');
  
  const resendModule = await import("https://esm.sh/resend@4.0.0");
  Resend = resendModule.Resend;
  console.log('✅ Resend loaded');
  
  React = await import("https://esm.sh/react@18.3.1");
  console.log('✅ React loaded');
  console.log('✅ React version in function:', React.version);
  
  const reactEmailModule = await import("https://esm.sh/@react-email/components@0.0.22?deps=react@18.3.1");
  renderAsync = reactEmailModule.renderAsync;
  console.log('✅ React Email loaded');
  
  const leadNotificationModule = await import('./_templates/lead-notification.tsx?deps=react@18.3.1');
  LeadNotificationEmail = leadNotificationModule.LeadNotificationEmail;
  console.log('✅ Lead notification template loaded');
  
  const welcomeEmailModule = await import('./_templates/welcome-email.tsx?deps=react@18.3.1');
  WelcomeEmail = welcomeEmailModule.WelcomeEmail;
  console.log('✅ Welcome email template loaded');
  
} catch (importError: any) {
  console.error('❌ Failed to load dependencies:', importError);
  throw new Error(`Failed to load dependencies: ${importError?.message || 'Unknown error'}`);
}

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('✅ Send-email function initialized successfully');

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
  console.log(`📧 Starting lead notification email for lead: ${lead.id}`);
  
  try {
    // Get admin emails from profiles
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'admin');

    if (adminError) {
      console.error('❌ Error fetching admin profiles:', adminError);
      throw adminError;
    }

    if (!adminProfiles || adminProfiles.length === 0) {
      console.warn('⚠️ No admin profiles found for notifications');
      return;
    }

    console.log(`✅ Found ${adminProfiles.length} admin(s) for notifications`);

  // Get lead source info
  const { data: sourceData } = await supabase
    .from('lead_sources')
    .select('name')
    .eq('id', lead.source_id)
    .single();

  const adminUrl = `${SUPABASE_URL?.replace('.supabase.co', '')}/admin`;
  
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

    console.log('🎨 Rendering email template with data:', templateData);
    
    let html: string;
    try {
      html = await renderAsync(
        React.createElement(LeadNotificationEmail, templateData)
      );
      console.log('✅ Email template rendered successfully');
    } catch (renderError) {
      console.error('❌ Template rendering failed, using fallback HTML:', renderError);
      html = `
        <h1>New Lead Notification</h1>
        <p><strong>Name:</strong> ${templateData.first_name} ${templateData.last_name}</p>
        <p><strong>Email:</strong> ${templateData.email}</p>
        <p><strong>Company:</strong> ${templateData.company_name}</p>
        <p><strong>Score:</strong> ${templateData.score}</p>
        <p><a href="${templateData.admin_url}">View in Admin Dashboard</a></p>
      `;
    }

  for (const admin of adminProfiles) {
    try {
      console.log(`📤 Sending notification email to: tmtnextgenpartners@gmail.com`);
      
      const { data: emailResult, error } = await resend.emails.send({
        from: 'TMT Next Gen Partners <onboarding@resend.dev>',
        to: ['tmtnextgenpartners@gmail.com'], // Use verified email for testing
        subject: `New Lead Received - ${lead.first_name || ''} ${lead.last_name || ''}`,
        html,
      });
      
      console.log('📧 Resend API response:', { emailResult, error });

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
        console.error('❌ Error sending notification email:', error);
      } else {
        console.log('✅ Notification email sent successfully to:', admin.email);
      }
    } catch (error) {
      console.error('❌ Failed to send email to admin:', admin.email, error);
      throw error; // Re-throw to handle at higher level
    }
  }
  
  console.log('✅ Lead notification email process completed');
  
  } catch (error) {
    console.error('❌ Error in sendLeadNotificationEmail:', error);
    throw error;
  }
}

async function sendWelcomeEmail(lead: Lead) {
  console.log(`📧 Starting welcome email for lead: ${lead.id}`);
  
  try {
    const templateData = {
      first_name: lead.first_name || 'there',
      last_name: lead.last_name || '',
      email: lead.email,
      company_name: lead.company_name || '',
    };

    console.log('🎨 Rendering welcome email template with data:', templateData);

    let html: string;
    try {
      html = await renderAsync(
        React.createElement(WelcomeEmail, templateData)
      );
      console.log('✅ Welcome email template rendered successfully');
    } catch (renderError) {
      console.error('❌ Template rendering failed, using fallback HTML:', renderError);
      html = `
        <h1>Welcome, ${templateData.first_name}!</h1>
        <p>Thank you for your consultation request. We'll be in touch soon!</p>
        <p>Best regards,<br>The Business Process Team</p>
      `;
    }

    console.log(`📤 Sending welcome email to: tmtnextgenpartners@gmail.com`);
    
    const { data: emailResult, error } = await resend.emails.send({
      from: 'TMT Next Gen Partners <onboarding@resend.dev>',
      to: ['tmtnextgenpartners@gmail.com'], // Use verified email for testing - change to lead.email when domain is verified
      subject: `Welcome ${lead.first_name || ''}! Your consultation request has been received`,
      html,
    });
    
    console.log('📧 Resend API response for welcome email:', { emailResult, error });

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
      console.error('❌ Error sending welcome email:', error);
      throw error;
    } else {
      console.log('✅ Welcome email sent successfully to:', lead.email);
    }
    
    console.log('✅ Welcome email process completed');
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
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
  console.log(`🌐 Received ${req.method} request to send-email function`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('📨 Request body:', requestBody);
    
    const { type, recipient, leadId, templateId, templateData, subject }: EmailRequest = requestBody;

    if (type === 'lead_notification' && leadId) {
      console.log(`🔍 Processing lead notification for leadId: ${leadId}`);
      
      // Get lead data
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !lead) {
        console.error(`❌ Lead not found: ${leadId}`, error);
        throw new Error(`Lead not found: ${leadId}`);
      }

      console.log('✅ Lead data retrieved:', { id: lead.id, email: lead.email });
      
      await sendLeadNotificationEmail(lead);
      
      console.log('✅ Lead notification completed successfully');
      
      return new Response(JSON.stringify({ success: true, message: 'Lead notification sent' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (type === 'welcome_email' && leadId) {
      console.log(`🔍 Processing welcome email for leadId: ${leadId}`);
      
      // Get lead data
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (error || !lead) {
        console.error(`❌ Lead not found: ${leadId}`, error);
        throw new Error(`Lead not found: ${leadId}`);
      }

      console.log('✅ Lead data retrieved:', { id: lead.id, email: lead.email });
      
      await sendWelcomeEmail(lead);
      
      console.log('✅ Welcome email completed successfully');
      
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
    console.error('❌ Error in send-email function:', error);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});