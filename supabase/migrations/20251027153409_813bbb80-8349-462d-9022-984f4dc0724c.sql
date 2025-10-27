-- Add Calendly integration fields to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS calendly_event_id TEXT,
ADD COLUMN IF NOT EXISTS meeting_scheduled_at TIMESTAMP WITH TIME ZONE;

-- Add new status for leads with scheduled meetings
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'lead_status' AND e.enumlabel = 'meeting_scheduled'
  ) THEN
    ALTER TYPE lead_status ADD VALUE 'meeting_scheduled';
  END IF;
END $$;

-- Create index for faster Calendly event lookups
CREATE INDEX IF NOT EXISTS idx_leads_calendly_event_id ON public.leads(calendly_event_id);

-- Comment the columns
COMMENT ON COLUMN public.leads.calendly_event_id IS 'UUID of the Calendly event associated with this lead';
COMMENT ON COLUMN public.leads.meeting_scheduled_at IS 'Timestamp when the consultation meeting was scheduled via Calendly';
