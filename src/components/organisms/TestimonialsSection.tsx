import React from 'react';
import { TestimonialCard } from '../molecules/TestimonialCard';
import { H2, BodyLarge, Caption } from '../atoms/Typography';

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechStore Inc",
    role: "CEO",
    testimonial: "TMT NextGen Partners completely transformed our online presence. Their strategic approach to SEO and PPC advertising resulted in incredible growth that exceeded all our expectations.",
    rating: 5,
    result: "450% increase in online sales"
  },
  {
    name: "Dr. Michael Chen",
    company: "HealthFirst Medical",
    role: "Practice Owner",
    testimonial: "The team's expertise in healthcare marketing is unmatched. They understood our unique needs and delivered a comprehensive digital strategy that brought in more patients than ever before.",
    rating: 5,
    result: "320% more patient appointments"
  },
  {
    name: "Robert Williams",
    company: "Premier Legal Associates",
    role: "Managing Partner",
    testimonial: "Professional, knowledgeable, and results-driven. TMT NextGen Partners helped us establish a strong digital presence that significantly improved our client acquisition and brand reputation.",
    rating: 5,
    result: "200% increase in qualified leads"
  },
  {
    name: "Emma Rodriguez",
    company: "Green Valley Restaurant",
    role: "Owner",
    testimonial: "From social media management to local SEO, they covered all aspects of our digital marketing. Our restaurant has never been busier, and our online reviews have improved dramatically.",
    rating: 5,
    result: "180% increase in reservations"
  },
  {
    name: "David Thompson",
    company: "Thompson Construction",
    role: "Director of Operations",
    testimonial: "The ROI we've seen from working with TMT NextGen Partners has been outstanding. Their data-driven approach and transparent reporting give us confidence in every marketing dollar spent.",
    rating: 5,
    result: "265% ROI improvement"
  },
  {
    name: "Lisa Park",
    company: "Bella Beauty Spa",
    role: "Founder",
    testimonial: "They took our small local spa and turned it into a regional destination. Their creative campaigns and strategic thinking have been instrumental in our rapid growth and expansion.",
    rating: 5,
    result: "300% revenue growth"
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Caption className="text-primary">CLIENT TESTIMONIALS</Caption>
          <H2>What Our Clients Say About Us</H2>
          <BodyLarge>
            Don't just take our word for it. Here's what business owners and decision-makers 
            say about working with TMT NextGen Partners.
          </BodyLarge>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={`${testimonial.name}-${testimonial.company}`}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Satisfied Clients</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-success">98%</div>
                <div className="text-muted-foreground">Client Retention Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-warning">4.9/5</div>
                <div className="text-muted-foreground">Average Review Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};