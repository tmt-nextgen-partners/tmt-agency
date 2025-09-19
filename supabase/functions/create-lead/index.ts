import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  monthlyBudget?: string;
  businessGoals?: string;
  challenges?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Create lead function called');
    
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const formData: LeadFormData = await req.json();
    console.log('Received form data:', { ...formData, email: '[REDACTED]' });

    // Get consultation form source
    const { data: source, error: sourceError } = await supabase
      .from('lead_sources')
      .select('id')
      .eq('name', 'consultation_form')
      .single();

    if (sourceError) {
      console.error('Error fetching lead source:', sourceError);
    }

    // Calculate lead score
    const leadData = {
      company_name: formData.companyName,
      phone: formData.phone,
      monthly_budget: formData.monthlyBudget,
      business_goals: formData.businessGoals,
      challenges: formData.challenges,
    };

    const { data: scoreData, error: scoreError } = await supabase.rpc('calculate_lead_score', {
      lead_data: leadData
    });

    if (scoreError) {
      console.error('Error calculating lead score:', scoreError);
    }

    // Create the lead
    const { data: leadRecord, error: leadError } = await supabase
      .from('leads')
      .insert([
        {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.companyName,
          phone: formData.phone,
          monthly_budget: formData.monthlyBudget,
          business_goals: formData.businessGoals,
          challenges: formData.challenges,
          source_id: source?.id,
          score: scoreData || 0,
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      throw leadError;
    }

    console.log('Lead created successfully with ID:', leadRecord.id);

    // Create initial activity
    const { error: activityError } = await supabase
      .from('lead_activities')
      .insert([
        {
          lead_id: leadRecord.id,
          activity_type: 'form_submission',
          title: 'Consultation Form Submitted',
          description: `New lead from consultation form. Budget: ${formData.monthlyBudget}`,
          metadata: leadData,
        },
      ]);

    if (activityError) {
      console.error('Error creating lead activity:', activityError);
    }

    // Save score history
    if (scoreData && scoreData > 0) {
      const { error: scoreHistoryError } = await supabase
        .from('lead_scores')
        .insert([
          {
            lead_id: leadRecord.id,
            score: scoreData,
            reason: 'Initial lead scoring from form submission',
          },
        ]);

      if (scoreHistoryError) {
        console.error('Error saving score history:', scoreHistoryError);
      }
    }

    // Send notification and welcome emails
    try {
      console.log('Sending notification and welcome emails...');
      await Promise.all([
        // Send notification email to admins
        supabase.functions.invoke('send-email', {
          body: {
            type: 'lead_notification',
            leadId: leadRecord.id,
          },
        }),
        // Send welcome email to lead
        supabase.functions.invoke('send-email', {
          body: {
            type: 'welcome_email',
            leadId: leadRecord.id,
          },
        }),
      ]);
      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the lead creation if emails fail
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId: leadRecord.id,
        message: 'Lead created successfully'
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in create-lead function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An error occurred while creating the lead'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);