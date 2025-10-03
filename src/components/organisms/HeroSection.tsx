import React from 'react';
import { Button } from '../atoms/Button';
import { H1, BodyLarge } from '../atoms/Typography';
import { LazyImage } from '../molecules/LazyImage';
import { ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { useConsultationModal } from '@/contexts/ConsultationModalContext';
import heroImage from '@/assets/hero-business-team.jpg';

export const HeroSection: React.FC = () => {
  const { openModal } = useConsultationModal();
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-primary rounded-full blur-3xl opacity-10 animate-glow-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-secondary rounded-full blur-3xl opacity-10 animate-glow-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-gradient-success px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-success-foreground mr-2" />
              <span className="text-success-foreground text-sm font-medium">
                Certified Business Transformation Experts
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <H1 className="leading-tight">
                Modernize Your Business with{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Process Optimization
                </span>
              </H1>
              <BodyLarge>
                We bring enterprise-level capabilities to small businesses through agentic AI products and custom solutions 
                at a fraction of traditional costs. Our intelligent automation expands your operations and unlocks growth 
                potential previously reserved for large corporations.
              </BodyLarge>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Clients Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">285%</div>
                <div className="text-sm text-muted-foreground">Avg ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="cta" size="xl" className="group" onClick={openModal}>
                Get Free Process Audit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 pt-6 border-t border-border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">$2.3M+</strong> revenue generated for clients
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">98%</strong> client satisfaction
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-elevation-xl">
              <LazyImage 
                src={heroImage} 
                alt="Professional team implementing business process automation and modernization solutions for enhanced operational efficiency"
                className="w-full h-auto object-cover"
                width={600}
                height={400}
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-card-border rounded-xl p-4 shadow-elevation-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-success p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground">↗ 347%</div>
                  <div className="text-xs text-muted-foreground">Growth This Quarter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};