import React from 'react';
import { ServiceCard } from '../molecules/ServiceCard';
import { H2, BodyLarge, Caption } from '../atoms/Typography';
import { 
  Globe, 
  Search, 
  MousePointer, 
  Share2, 
  PenTool, 
  BarChart3 
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: "Web Design & Development",
    description: "Modern, responsive websites that convert visitors into customers with optimized user experience and cutting-edge design."
  },
  {
    icon: Search,
    title: "Search Engine Optimization",
    description: "Dominate search rankings with our proven SEO strategies that drive organic traffic and increase your online visibility."
  },
  {
    icon: MousePointer,
    title: "Pay-Per-Click Advertising",
    description: "Maximize ROI with targeted PPC campaigns across Google, Facebook, and LinkedIn that generate qualified leads."
  },
  {
    icon: Share2,
    title: "Social Media Marketing",
    description: "Build brand awareness and engage your audience with strategic social media campaigns that drive business growth."
  },
  {
    icon: PenTool,
    title: "Content Marketing",
    description: "Create compelling content that educates, engages, and converts your target audience into loyal customers."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Make data-driven decisions with comprehensive analytics and transparent reporting that tracks your success."
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Caption className="text-primary">OUR SERVICES</Caption>
          <H2>Complete Digital Marketing Solutions</H2>
          <BodyLarge>
            From strategy to execution, we provide end-to-end digital marketing services 
            that help businesses thrive in the digital era.
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
            <H2 className="mb-4">Need a Custom Solution?</H2>
            <BodyLarge className="mb-6">
              Every business is unique. Let's discuss how our services can be tailored to your specific needs.
            </BodyLarge>
            <button className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transform transition-all duration-300">
              Schedule Strategy Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};