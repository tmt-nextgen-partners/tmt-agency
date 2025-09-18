import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useLeads } from '@/hooks/useLeads';
import { SEOHead } from '@/components/atoms/SEOHead';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Mail, 
  Phone, 
  Building, 
  Target,
  LogOut,
  Star
} from 'lucide-react';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { leads, isLoading } = useLeads();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const stats = {
    total: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'proposal_sent': return 'bg-purple-500';
      case 'won': return 'bg-emerald-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <>
      <SEOHead 
        title="Admin Dashboard - TMT NextGen Partners"
        description="Manage leads and track business development progress"
        noindex={true}
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Lead Management Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.new}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qualified</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.qualified}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgScore}</div>
              </CardContent>
            </Card>
          </div>

          {/* Leads List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                Latest leads from your consultation form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading leads...</div>
              ) : leads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leads yet. Leads will appear here when users submit the consultation form.
                </div>
              ) : (
                <div className="space-y-6">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">
                              {lead.first_name} {lead.last_name}
                            </h3>
                            <Badge variant={getPriorityColor(lead.priority)}>
                              {lead.priority}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <div 
                                className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}
                              />
                              <span className="text-sm text-muted-foreground capitalize">
                                {lead.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.company_name && (
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {lead.company_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Score</div>
                          <div className="text-xl font-bold">{lead.score}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {lead.monthly_budget && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Budget:</span>
                            <span className="text-sm">{lead.monthly_budget}</span>
                          </div>
                        </div>
                      )}

                      {lead.business_goals && (
                        <div className="mb-3">
                          <div className="text-sm font-medium mb-1">Business Goals:</div>
                          <p className="text-sm text-muted-foreground">{lead.business_goals}</p>
                        </div>
                      )}

                      {lead.challenges && (
                        <div>
                          <div className="text-sm font-medium mb-1">Challenges:</div>
                          <p className="text-sm text-muted-foreground">{lead.challenges}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Admin;