import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../atoms/Button';
import { H3, Body } from '../atoms/Typography';
import { CalendarDays, MessageSquare, Zap } from 'lucide-react';

export const ConsultationForm: React.FC = () => {
  return (
    <Card className="p-8 border-card-border bg-card shadow-elevation-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-full">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <H3>Get Your Free Marketing Consultation</H3>
          <Body className="text-sm">
            Discover how we can transform your business with our proven digital marketing strategies.
          </Body>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="First Name" 
              className="h-12"
              required 
            />
            <Input 
              placeholder="Last Name" 
              className="h-12"
              required 
            />
          </div>
          
          <Input 
            type="email" 
            placeholder="Business Email" 
            className="h-12"
            required 
          />
          
          <Input 
            type="tel" 
            placeholder="Phone Number" 
            className="h-12"
            required 
          />
          
          <Input 
            placeholder="Company Name" 
            className="h-12"
            required 
          />

          <Select>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Monthly Marketing Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5k">Under $5,000</SelectItem>
              <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
              <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
              <SelectItem value="over-50k">Over $50,000</SelectItem>
            </SelectContent>
          </Select>

          <Textarea 
            placeholder="Tell us about your business goals and current marketing challenges..."
            className="min-h-[100px] resize-none"
          />

          <Button variant="cta" size="lg" className="w-full">
            <CalendarDays className="w-5 h-5 mr-2" />
            Schedule Free Consultation
          </Button>
        </form>

        {/* Trust Indicators */}
        <div className="text-center pt-4 border-t border-border">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Free consultation
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              No obligations
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};