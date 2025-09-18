import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Globe, 
  Search, 
  MousePointer, 
  Share2, 
  PenTool, 
  BarChart3,
  LucideIcon 
} from 'lucide-react';

interface ServiceIconProps {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconVariants = {
  variant: {
    default: "bg-muted text-primary",
    primary: "bg-gradient-primary text-primary-foreground",
    success: "bg-gradient-success text-success-foreground",
  },
  size: {
    sm: "w-10 h-10 p-2",
    md: "w-12 h-12 p-3", 
    lg: "w-16 h-16 p-4",
  },
};

export const ServiceIcon: React.FC<ServiceIconProps> = ({ 
  icon: Icon, 
  variant = 'default', 
  size = 'md',
  className 
}) => {
  return (
    <div className={cn(
      "rounded-lg shadow-elevation-sm transition-all duration-300 hover:shadow-elevation-md hover:scale-105",
      iconVariants.variant[variant],
      iconVariants.size[size],
      className
    )}>
      <Icon className="w-full h-full" />
    </div>
  );
};

// Pre-configured service icons
export const WebDesignIcon = () => <ServiceIcon icon={Globe} variant="primary" />;
export const SEOIcon = () => <ServiceIcon icon={Search} variant="primary" />;
export const PPCIcon = () => <ServiceIcon icon={MousePointer} variant="primary" />;
export const SocialMediaIcon = () => <ServiceIcon icon={Share2} variant="primary" />;
export const ContentMarketingIcon = () => <ServiceIcon icon={PenTool} variant="primary" />;
export const AnalyticsIcon = () => <ServiceIcon icon={BarChart3} variant="primary" />;