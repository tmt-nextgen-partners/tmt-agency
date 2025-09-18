import React from 'react';
import { Card } from '@/components/ui/card';
import { ServiceIcon } from '../atoms/ServiceIcon';
import { H4, Body } from '../atoms/Typography';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  className
}) => {
  return (
    <Card className={cn(
      "p-6 border-card-border bg-card hover:shadow-elevation-lg transition-all duration-300 hover:-translate-y-1 group",
      className
    )}>
      <div className="space-y-4">
        <div className="group-hover:scale-110 transition-transform duration-300">
          <ServiceIcon icon={icon} variant="primary" size="lg" />
        </div>
        <div className="space-y-2">
          <H4 className="group-hover:text-primary transition-colors">{title}</H4>
          <Body className="text-sm">{description}</Body>
        </div>
      </div>
    </Card>
  );
};