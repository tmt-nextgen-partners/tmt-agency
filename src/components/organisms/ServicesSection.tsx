import React from 'react';
import { ServiceCard } from '../molecules/ServiceCard';
import { H2, BodyLarge, Caption } from '../atoms/Typography';
import { Button } from '@/components/ui/button';
import { useConsultationModal } from '@/contexts/ConsultationModalContext';
import { 
  Cog, 
  Zap, 
  Database, 
  Workflow, 
  BarChart3,
  Code
} from 'lucide-react';

const services = [
  {
    icon: Cog,
    title: "Business Process Optimization",
    description: "Streamline your operations with data-driven process improvements that eliminate bottlenecks and boost efficiency."
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and workflows to save time, reduce errors, and free up your team for strategic work."
  },
  {
    icon: BarChart3,
    title: "Personalized Performance Dashboards",
    description: "Custom analytics dashboards that track KPIs, measure ROI, and provide actionable insights to optimize your business performance in real-time."
  },
  {
    icon: Database,
    title: "Data Integration & Management",
    description: "Unify your business data across platforms for better decision-making and streamlined operations."
  },
  {
    icon: Workflow,
    title: "Digital Transformation Strategy",
    description: "Comprehensive roadmap to modernize your business processes and embrace digital-first operations."
  },
  {
    icon: Code,
    title: "Web Application Development",
    description: "Build custom web applications tailored to your business needs, from customer portals to internal tools that streamline operations."
  }
];

export const ServicesSection: React.FC = () => {
  const { openModal } = useConsultationModal();
  
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Caption className="text-primary">OUR SERVICES</Caption>
          <H2>Complete Business Modernization Solutions</H2>
          <BodyLarge>
            From process analysis to implementation, we provide end-to-end business transformation services 
            that help companies operate more efficiently and profitably.
          </BodyLarge>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
            <H2 className="mb-4">Start the Conversation Today to Implement Any of These Services in Your Business</H2>
            <BodyLarge className="mb-6">
              Begin with a free consultation to discuss how we can help transform your business. No cost, no obligation - just valuable insights from our business transformation experts.
            </BodyLarge>
            <Button 
              onClick={openModal}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow hover:scale-105 transform transition-all duration-300"
            >
              Get Your Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};