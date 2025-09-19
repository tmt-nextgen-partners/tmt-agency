import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_type: string;
  variables: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  email_id?: string;
  recipient_email: string;
  lead_id?: string;
  campaign_id?: string;
  template_id?: string;
  subject: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'complained' | 'failed';
  error_message?: string;
  opened_at?: string;
  clicked_at?: string;
  sent_at?: string;
  delivered_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template_id?: string;
  status: 'draft' | 'sending' | 'sent' | 'paused';
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
  updated_at: string;
}

export interface EmailQueue {
  id: string;
  recipient_email: string;
  lead_id?: string;
  template_id?: string;
  campaign_id?: string;
  sequence_id?: string;
  sequence_step_id?: string;
  subject: string;
  html_content: string;
  text_content?: string;
  scheduled_at: string;
  status: 'queued' | 'processing' | 'sent' | 'failed';
  attempts: number;
  max_attempts: number;
  error_message?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailTemplate[];
    },
  });
}

export function useEmailLogs() {
  return useQuery({
    queryKey: ['email-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as EmailLog[];
    },
  });
}

export function useEmailCampaigns() {
  return useQuery({
    queryKey: ['email-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailCampaign[];
    },
  });
}

export function useEmailQueue() {
  return useQuery({
    queryKey: ['email-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .order('scheduled_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      return data as EmailQueue[];
    },
  });
}

export function useEmailActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendTestEmail = useMutation({
    mutationFn: async ({ 
      templateId, 
      recipient, 
      templateData 
    }: { 
      templateId: string; 
      recipient: string; 
      templateData: Record<string, any> 
    }) => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'template',
          templateId,
          recipient,
          templateData,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      toast({
        title: "Success",
        description: "Test email sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send test email",
        variant: "destructive",
      });
    },
  });

  const processEmailQueue = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('process-email-queue');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-queue'] });
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      toast({
        title: "Success",
        description: "Email queue processed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process email queue",
        variant: "destructive",
      });
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('email_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create email template",
        variant: "destructive",
      });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<EmailTemplate> 
    }) => {
      const { data, error } = await supabase
        .from('email_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: "Success",
        description: "Email template updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update email template",
        variant: "destructive",
      });
    },
  });

  return {
    sendTestEmail: sendTestEmail.mutate,
    isTestEmailLoading: sendTestEmail.isPending,
    processEmailQueue: processEmailQueue.mutate,
    isProcessingQueue: processEmailQueue.isPending,
    createTemplate: createTemplate.mutate,
    isCreatingTemplate: createTemplate.isPending,
    updateTemplate: updateTemplate.mutate,
    isUpdatingTemplate: updateTemplate.isPending,
  };
}