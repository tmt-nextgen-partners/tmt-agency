import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function processEmailQueue() {
  console.log('Processing email queue...');

  try {
    // Get queued emails that are ready to be sent
    const { data: queuedEmails, error: queueError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'queued')
      .lte('scheduled_at', new Date().toISOString())
      .lt('attempts', 3) // Don't retry more than 3 times
      .order('scheduled_at', { ascending: true })
      .limit(50); // Process up to 50 emails at a time

    if (queueError) {
      console.error('Error fetching queued emails:', queueError);
      return;
    }

    if (!queuedEmails || queuedEmails.length === 0) {
      console.log('No emails in queue to process');
      return;
    }

    console.log(`Processing ${queuedEmails.length} queued emails`);

    for (const queuedEmail of queuedEmails) {
      try {
        // Mark as processing
        await supabase
          .from('email_queue')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString() 
          })
          .eq('id', queuedEmail.id);

        // Send the email via the send-email function
        const emailRequest = {
          type: 'template',
          recipient: queuedEmail.recipient_email,
          templateId: queuedEmail.template_id,
          leadId: queuedEmail.lead_id,
          templateData: queuedEmail.metadata || {},
        };

        const sendResponse = await supabase.functions.invoke('send-email', {
          body: emailRequest,
        });

        if (sendResponse.error) {
          throw new Error(sendResponse.error.message);
        }

        // Mark as sent
        await supabase
          .from('email_queue')
          .update({ 
            status: 'sent',
            updated_at: new Date().toISOString() 
          })
          .eq('id', queuedEmail.id);

        console.log(`Successfully sent email to ${queuedEmail.recipient_email}`);

      } catch (error: any) {
        console.error(`Failed to send email to ${queuedEmail.recipient_email}:`, error);

        // Update queue record with error and increment attempts
        await supabase
          .from('email_queue')
          .update({ 
            status: queuedEmail.attempts + 1 >= queuedEmail.max_attempts ? 'failed' : 'queued',
            attempts: queuedEmail.attempts + 1,
            error_message: error.message,
            updated_at: new Date().toISOString() 
          })
          .eq('id', queuedEmail.id);
      }
    }

    console.log('Email queue processing completed');

  } catch (error: any) {
    console.error('Error processing email queue:', error);
  }
}

async function scheduleSequenceEmails() {
  console.log('Scheduling sequence emails...');

  try {
    // Get active email sequences
    const { data: sequences, error: sequenceError } = await supabase
      .from('email_sequences')
      .select(`
        *,
        email_sequence_steps (
          *,
          email_templates (*)
        )
      `)
      .eq('is_active', true);

    if (sequenceError) {
      console.error('Error fetching sequences:', sequenceError);
      return;
    }

    if (!sequences || sequences.length === 0) {
      console.log('No active email sequences found');
      return;
    }

    for (const sequence of sequences) {
      if (sequence.trigger_type === 'lead_created') {
        // Find new leads that haven't been added to this sequence yet
        const { data: newLeads, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .not('id', 'in', `(
            SELECT lead_id FROM email_queue 
            WHERE sequence_id = '${sequence.id}' 
            AND lead_id IS NOT NULL
          )`);

        if (leadsError) {
          console.error('Error fetching new leads:', leadsError);
          continue;
        }

        if (!newLeads || newLeads.length === 0) {
          continue;
        }

        console.log(`Found ${newLeads.length} new leads for sequence: ${sequence.name}`);

        // Schedule emails for each step in the sequence
        for (const lead of newLeads) {
          for (const step of sequence.email_sequence_steps) {
            const scheduledAt = new Date(
              new Date(lead.created_at).getTime() + 
              (step.delay_days * 24 * 60 * 60 * 1000) + 
              (step.delay_hours * 60 * 60 * 1000)
            );

            // Prepare template data
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
            };

            // Queue the email
            await supabase.from('email_queue').insert({
              recipient_email: lead.email,
              lead_id: lead.id,
              template_id: step.template_id,
              sequence_id: sequence.id,
              sequence_step_id: step.id,
              subject: step.email_templates.subject,
              html_content: step.email_templates.html_content,
              text_content: step.email_templates.text_content,
              scheduled_at: scheduledAt.toISOString(),
              metadata: templateData,
            });

            console.log(`Scheduled email for lead ${lead.email} at ${scheduledAt.toISOString()}`);
          }
        }
      }
    }

    console.log('Sequence email scheduling completed');

  } catch (error: any) {
    console.error('Error scheduling sequence emails:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Process both queue and sequences
    await Promise.all([
      processEmailQueue(),
      scheduleSequenceEmails(),
    ]);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email queue and sequences processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in process-email-queue function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});