import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Body, H5, Caption } from '../atoms/Typography';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  name: string;
  company: string;
  role: string;
  testimonial: string;
  avatar?: string;
  rating?: number;
  result?: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  company,
  role,
  testimonial,
  avatar,
  rating = 5,
  result,
  className
}) => {
  return (
    <Card className={cn(
      "p-6 border-card-border bg-card hover:shadow-elevation-lg transition-all duration-300 space-y-4",
      className
    )}>
      {/* Rating Stars */}
      <div className="flex space-x-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
        ))}
      </div>

      {/* Testimonial */}
      <Body className="text-sm italic">"{testimonial}"</Body>

      {/* Result Metric */}
      {result && (
        <div className="bg-gradient-success rounded-lg p-3">
          <Caption className="text-success-foreground font-semibold">{result}</Caption>
        </div>
      )}

      {/* Client Info */}
      <div className="flex items-center space-x-3 pt-2 border-t border-border">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <H5 className="text-sm mb-1">{name}</H5>
          <Caption>{role} at {company}</Caption>
        </div>
      </div>
    </Card>
  );
};