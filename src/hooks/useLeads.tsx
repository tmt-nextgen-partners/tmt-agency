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

export function useLeads(enableList: boolean = true) {
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
    enabled: enableList,
  });

  const createLeadMutation = useMutation({
    mutationFn: async (formData: LeadFormData) => {
      const { data, error } = await supabase.functions.invoke('create-lead', {
        body: formData,
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Failed to create lead');

      return data;
    },
    onSuccess: () => {
      if (enableList) {
        queryClient.invalidateQueries({ queryKey: ['leads'] });
      }
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