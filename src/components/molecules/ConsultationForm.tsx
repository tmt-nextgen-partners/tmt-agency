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
          <H3>Get Your Free Process Consultation</H3>
          <Body className="text-sm">
            Discover how we can transform your business with our proven process optimization strategies.
          </Body>
        </div>

        {/* Form */}
        <form className="space-y-4" noValidate aria-label="Free consultation request form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <Input 
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                placeholder="First Name" 
                className="h-12"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <Input 
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                placeholder="Last Name" 
                className="h-12"
                aria-required="true"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="sr-only">Business Email</label>
            <Input 
              id="email"
              name="email"
              type="email" 
              autoComplete="email"
              required
              placeholder="Business Email" 
              className="h-12"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="sr-only">Phone Number</label>
            <Input 
              id="phone"
              name="phone"
              type="tel" 
              autoComplete="tel"
              required
              placeholder="Phone Number" 
              className="h-12"
              aria-required="true"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="sr-only">Company Name</label>
            <Input 
              id="company"
              name="company"
              autoComplete="organization"
              required
              placeholder="Company Name" 
              className="h-12"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="budget" className="sr-only">Monthly Budget</label>
            <Select name="budget">
              <SelectTrigger className="h-12" id="budget">
                <SelectValue placeholder="Monthly Budget for Process Optimization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-10k">Under $10,000</SelectItem>
                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                <SelectItem value="over-50k">Over $50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="details" className="sr-only">Business Goals and Challenges</label>
            <Textarea 
              id="details"
              name="details"
              placeholder="Tell us about your business goals and current operational challenges..."
              className="min-h-[100px] resize-none"
              aria-label="Describe your business goals and current challenges"
            />
          </div>

          <Button variant="cta" size="lg" className="w-full" type="submit">
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