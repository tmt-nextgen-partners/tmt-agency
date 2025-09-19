import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  monthly_budget?: string;
  business_goals?: string;
  challenges?: string;
  source_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiating' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  monthlyBudget?: string;
  businessGoals?: string;
  challenges?: string;
}

export function useLeads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_sources (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (formData: LeadFormData) => {
      // Get consultation form source
      const { data: source } = await supabase
        .from('lead_sources')
        .select('id')
        .eq('name', 'consultation_form')
        .single();

      // Calculate lead score
      const leadData = {
        company_name: formData.companyName,
        phone: formData.phone,
        monthly_budget: formData.monthlyBudget,
        business_goals: formData.businessGoals,
        challenges: formData.challenges,
      };

      const { data: scoreData } = await supabase.rpc('calculate_lead_score', {
        lead_data: leadData
      });

      // Create the lead
      const { data, error } = await supabase
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

      if (error) throw error;

      // Create initial activity
      await supabase
        .from('lead_activities')
        .insert([
          {
            lead_id: data.id,
            activity_type: 'form_submission',
            title: 'Consultation Form Submitted',
            description: `New lead from consultation form. Budget: ${formData.monthlyBudget}`,
            metadata: leadData,
          },
        ]);

      // Save score history
      if (scoreData > 0) {
        await supabase
          .from('lead_scores')
          .insert([
            {
              lead_id: data.id,
              score: scoreData,
              reason: 'Initial lead scoring from form submission',
            },
          ]);
      }

      // Send notification and welcome emails
      try {
        await Promise.all([
          // Send notification email to admins
          supabase.functions.invoke('send-email', {
            body: {
              type: 'lead_notification',
              leadId: data.id,
            },
          }),
          // Send welcome email to lead
          supabase.functions.invoke('send-email', {
            body: {
              type: 'welcome_email',
              leadId: data.id,
            },
          }),
        ]);
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Don't fail the lead creation if emails fail
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Success!",
        description: "Your consultation request has been submitted. We'll get back to you soon!",
      });
    },
    onError: (error: any) => {
      console.error('Error creating lead:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return {
    leads: leadsQuery.data || [],
    isLoading: leadsQuery.isLoading,
    error: leadsQuery.error,
    createLead: createLeadMutation.mutate,
    updateLead: updateLeadMutation.mutate,
    isCreating: createLeadMutation.isPending,
    isUpdating: updateLeadMutation.isPending,
  };
}