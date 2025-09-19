import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface EmailStatsCardProps {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalPending: number;
  deliveryRate?: number;
}

export const EmailStatsCard: React.FC<EmailStatsCardProps> = ({
  totalSent,
  totalDelivered,
  totalFailed,
  totalPending,
  deliveryRate = 0,
}) => {
  const stats = [
    {
      icon: Mail,
      label: 'Total Sent',
      value: totalSent,
      color: 'bg-blue-500',
    },
    {
      icon: CheckCircle,
      label: 'Delivered',
      value: totalDelivered,
      color: 'bg-green-500',
    },
    {
      icon: XCircle,
      label: 'Failed',
      value: totalFailed,
      color: 'bg-red-500',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: totalPending,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Email Performance</CardTitle>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <Badge variant={deliveryRate >= 90 ? 'default' : deliveryRate >= 80 ? 'secondary' : 'destructive'}>
            {deliveryRate.toFixed(1)}% delivery rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.label} className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};