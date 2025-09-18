import React from 'react';
import { Header } from '../components/organisms/Header';
import { HeroSection } from '../components/organisms/HeroSection';
import { ServicesSection } from '../components/organisms/ServicesSection';
import { PortfolioSection } from '../components/organisms/PortfolioSection';
import { TestimonialsSection } from '../components/organisms/TestimonialsSection';
import { ConsultationSection } from '../components/organisms/ConsultationSection';
import { Footer } from '../components/organisms/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <ConsultationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
