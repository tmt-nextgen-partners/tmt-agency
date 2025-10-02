import React from 'react';
import { ConsultationForm } from '../molecules/ConsultationForm';
import { H2, BodyLarge, Caption, Body } from '../atoms/Typography';
import { CheckCircle, Clock, Users, Award } from 'lucide-react';

const benefits = [
  {
    icon: CheckCircle,
    title: "Comprehensive Process Audit",
    description: "Complete analysis of your current workflows and automation opportunities"
  },
  {
    icon: Clock,
    title: "60-Minute Assessment Session",
    description: "Dedicated time with our experts to evaluate your business processes"
  },
  {
    icon: Users,
    title: "Custom Automation Plan",
    description: "Personalized roadmap for process optimization and efficiency improvements"
  },
  {
    icon: Award,
    title: "No Obligation Consultation",
    description: "Free expert process evaluation with no pressure or commitment required"
  }
];

export const ConsultationSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Caption className="text-primary">FREE PROCESS AUDIT</Caption>
              <H2>Ready to Optimize Your Operations?</H2>
              <BodyLarge>
                Get expert insights and a custom automation strategy tailored specifically 
                to your business processes. No cost, no obligation - just valuable advice from 
                business transformation professionals.
              </BodyLarge>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">What You'll Get:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit.title}
                    className="flex items-start space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-gradient-primary p-2 rounded-lg flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                      <Body className="text-sm">{benefit.description}</Body>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Why Choose TMT NextGen Partners?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Certified Process Optimization Experts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">5+ Years of Business Transformation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">100+ Successful Automation Projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Transparent Process & ROI Reporting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-slide-up">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
};