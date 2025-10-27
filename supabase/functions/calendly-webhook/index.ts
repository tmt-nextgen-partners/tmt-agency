import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-calendly-webhook-signature',
};

interface CalendlyWebhookPayload {
  event: string;
  payload: {
    event_type: string;
    invitee: {
      uuid: string;
      email: string;
      name: string;
      created_at: string;
      canceled: boolean;
      rescheduled: boolean;
      questions_and_answers?: Array<{
        question: string;
        answer: string;
      }>;
    };
    event: {
      uuid: string;
      name: string;
      start_time: string;
      end_time: string;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const webhookPayload: CalendlyWebhookPayload = await req.json();
    console.log('Calendly webhook received:', webhookPayload.event);

    const { event, payload } = webhookPayload;

    // Handle different Calendly events
    if (event === 'invitee.created') {
      // Meeting scheduled
      const { invitee, event: meetingEvent } = payload;

      // Find the lead by email
      const { data: lead, error: findError } = await supabase
        .from('leads')
        .select('*')
        .eq('email', invitee.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding lead:', findError);
        throw findError;
      }

      if (lead) {
        // Update lead with Calendly event details
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            calendly_event_id: meetingEvent.uuid,
            meeting_scheduled_at: meetingEvent.start_time,
            status: 'meeting_scheduled',
            last_contacted_at: new Date().toISOString(),
          })
          .eq('id', lead.id);

        if (updateError) {
          console.error('Error updating lead:', updateError);
          throw updateError;
        }

        // Log activity
        const { error: activityError } = await supabase
          .from('lead_activities')
          .insert({
            lead_id: lead.id,
            activity_type: 'meeting',
            title: 'Consultation Scheduled',
            description: `Meeting scheduled for ${new Date(meetingEvent.start_time).toLocaleString()}`,
            metadata: {
              calendly_event_id: meetingEvent.uuid,
              event_name: meetingEvent.name,
              start_time: meetingEvent.start_time,
              end_time: meetingEvent.end_time,
              invitee_name: invitee.name,
            },
          });

        if (activityError) {
          console.error('Error logging activity:', activityError);
        }

        console.log(`Lead ${lead.id} updated with Calendly event ${meetingEvent.uuid}`);
      } else {
        console.log(`No lead found for email: ${invitee.email}`);
      }
    } else if (event === 'invitee.canceled') {
      // Meeting canceled
      const { invitee, event: meetingEvent } = payload;

      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('calendly_event_id', meetingEvent.uuid)
        .single();

      if (lead) {
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            status: 'contacted',
            meeting_scheduled_at: null,
          })
          .eq('id', lead.id);

        if (updateError) {
          console.error('Error updating canceled meeting:', updateError);
        }

        // Log cancellation activity
        await supabase.from('lead_activities').insert({
          lead_id: lead.id,
          activity_type: 'note',
          title: 'Consultation Canceled',
          description: 'Meeting was canceled by invitee',
          metadata: {
            calendly_event_id: meetingEvent.uuid,
            canceled_at: new Date().toISOString(),
          },
        });

        console.log(`Meeting canceled for lead ${lead.id}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in calendly-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
