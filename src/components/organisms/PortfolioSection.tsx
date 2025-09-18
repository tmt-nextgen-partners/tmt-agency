import React from 'react';
import { PortfolioCard } from '../molecules/PortfolioCard';
import { H2, BodyLarge, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { ArrowRight } from 'lucide-react';
import ecommerceImage from '@/assets/portfolio-ecommerce.jpg';
import healthcareImage from '@/assets/portfolio-healthcare.jpg';
import legalImage from '@/assets/portfolio-legal.jpg';

const portfolioItems = [
  {
    title: "TechStore E-commerce Revolution",
    category: "E-commerce & SEO",
    description: "Complete digital transformation for a tech retailer, including website redesign, SEO optimization, and PPC campaigns.",
    image: ecommerceImage,
    results: "450% increase in online sales within 6 months",
    improvement: "↗ 285% organic traffic growth"
  },
  {
    title: "HealthFirst Medical Practice",
    category: "Healthcare Marketing",
    description: "Comprehensive digital marketing strategy for a medical practice including local SEO, content marketing, and patient acquisition.",
    image: healthcareImage,
    results: "320% increase in new patient appointments",
    improvement: "↗ 190% local search visibility"
  },
  {
    title: "Premier Legal Associates",
    category: "Professional Services",
    description: "Brand repositioning and digital presence overhaul for a law firm specializing in corporate law and litigation services.",
    image: legalImage,
    results: "200% increase in qualified leads",
    improvement: "↗ 156% conversion rate improvement"
  }
];

export const PortfolioSection: React.FC = () => {
  return (
    <section id="portfolio" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Caption className="text-primary">SUCCESS STORIES</Caption>
          <H2>Proven Results That Speak for Themselves</H2>
          <BodyLarge>
            See how we've helped businesses like yours achieve remarkable growth through 
            strategic digital marketing and business modernization.
          </BodyLarge>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {portfolioItems.map((item, index) => (
            <div 
              key={item.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <PortfolioCard {...item} />
            </div>
          ))}
        </div>

        {/* Results Summary */}
        <div className="bg-card border border-card-border rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$2.3M+</div>
              <div className="text-muted-foreground">Revenue Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">285%</div>
              <div className="text-muted-foreground">Average ROI</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-warning mb-2">500+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="primary" size="xl" className="group">
            View All Case Studies
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};