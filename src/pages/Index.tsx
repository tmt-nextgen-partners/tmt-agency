import React from 'react';
import { SEOHead } from '../components/atoms/SEOHead';
import { BusinessSchema } from '../components/atoms/Schema';
import { SkipLink } from '../components/atoms/SkipLink';
import { Header } from '../components/organisms/Header';
import { HeroSection } from '../components/organisms/HeroSection';
import { ServicesSection } from '../components/organisms/ServicesSection';
import { AboutSection } from '../components/organisms/AboutSection';
import { ConsultationSection } from '../components/organisms/ConsultationSection';
import { Footer } from '../components/organisms/Footer';

const Index = () => {
  return (
    <>
      <SEOHead />
      <BusinessSchema />
      <SkipLink />
      <div className="min-h-screen bg-background">
        <Header />
        <main role="main" id="main-content">
          <HeroSection />
          <ServicesSection />
          <AboutSection />
          <ConsultationSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
