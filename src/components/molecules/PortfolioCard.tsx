import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../atoms/Button';
import { LazyImage } from './LazyImage';
import { H4, Body, Caption } from '../atoms/Typography';
import { ExternalLink, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  results: string;
  improvement: string;
  className?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  title,
  category,
  description,
  image,
  results,
  improvement,
  className
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border-card-border bg-card hover:shadow-elevation-xl transition-all duration-300 hover:-translate-y-2 group",
      className
    )}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <LazyImage 
          src={image} 
          alt={`${title} - ${category} case study showcasing business process improvements`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={192}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 backdrop-blur-sm"
          aria-label={`View ${title} case study details`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Case Study
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <Caption className="text-primary mb-2">{category}</Caption>
          <H4 className="group-hover:text-primary transition-colors">{title}</H4>
        </div>
        
        <Body className="text-sm">{description}</Body>

        {/* Results */}
        <div className="bg-gradient-subtle rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <Caption className="text-success font-semibold">KEY RESULTS</Caption>
          </div>
          <Body className="text-sm font-medium text-foreground">{results}</Body>
          <Caption className="text-success">{improvement}</Caption>
        </div>
      </div>
    </Card>
  );
};