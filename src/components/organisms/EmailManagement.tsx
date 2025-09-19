import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmailStatsCard } from '@/components/molecules/EmailStatsCard';
import { 
  useEmailTemplates, 
  useEmailLogs, 
  useEmailQueue, 
  useEmailActions 
} from '@/hooks/useEmailSystem';
import { 
  Mail, 
  Send, 
  PlayCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const EmailManagement: React.FC = () => {
  const { data: templates = [], isLoading: templatesLoading } = useEmailTemplates();
  const { data: logs = [], isLoading: logsLoading } = useEmailLogs();
  const { data: queue = [], isLoading: queueLoading } = useEmailQueue();
  const { 
    processEmailQueue, 
    isProcessingQueue,
    sendTestEmail,
    isTestEmailLoading 
  } = useEmailActions();

  const [testEmail, setTestEmail] = useState('');

  // Calculate email stats
  const totalSent = logs.filter(log => log.status === 'sent' || log.status === 'delivered').length;
  const totalDelivered = logs.filter(log => log.status === 'delivered').length;
  const totalFailed = logs.filter(log => log.status === 'failed' || log.status === 'bounced').length;
  const totalPending = queue.filter(q => q.status === 'queued').length;
  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
      case 'bounced':
      case 'complained':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      case 'queued':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'sent' || status === 'delivered' ? 'default' :
                  status === 'failed' || status === 'bounced' ? 'destructive' :
                  status === 'queued' || status === 'pending' ? 'secondary' : 'outline';
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  const handleSendTestEmail = (templateId: string) => {
    if (!testEmail) return;
    
    sendTestEmail({
      templateId,
      recipient: testEmail,
      templateData: {
        first_name: 'Test',
        last_name: 'User',
        email: testEmail,
        company_name: 'Test Company',
        phone: '(555) 123-4567',
        monthly_budget: '$10,000 - $25,000',
        business_goals: 'Improve efficiency and reduce costs',
        challenges: 'Manual processes and lack of automation',
        score: '85',
        source_name: 'Test',
        created_at: new Date().toLocaleString(),
        admin_url: window.location.origin + '/admin',
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Management</h2>
          <p className="text-muted-foreground">
            Manage email templates, campaigns, and monitor email performance
          </p>
        </div>
        <Button 
          onClick={() => processEmailQueue()} 
          disabled={isProcessingQueue}
          className="flex items-center gap-2"
        >
          {isProcessingQueue ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
          Process Queue
        </Button>
      </div>

      <EmailStatsCard
        totalSent={totalSent}
        totalDelivered={totalDelivered}
        totalFailed={totalFailed}
        totalPending={totalPending}
        deliveryRate={deliveryRate}
      />

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <input
                      type="email"
                      placeholder="Test email address"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <div className="grid gap-4">
                    {templates.map((template) => (
                      <div key={template.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.template_type}</Badge>
                            <Button
                              size="sm"
                              onClick={() => handleSendTestEmail(template.id)}
                              disabled={!testEmail || isTestEmailLoading}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Test
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created {formatDistanceToNow(new Date(template.created_at))} ago
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Logs (Last 100)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <p className="font-medium">{log.recipient_email}</p>
                          <p className="text-sm text-muted-foreground">{log.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at))} ago
                        </span>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No email logs found
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Email Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {queue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-medium">{item.recipient_email}</p>
                          <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className="text-xs text-muted-foreground">
                          Scheduled: {formatDistanceToNow(new Date(item.scheduled_at))} ago
                        </span>
                      </div>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No emails in queue
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};