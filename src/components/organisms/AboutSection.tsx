import React from 'react';
import { H2, BodyLarge, Caption } from '../atoms/Typography';
import { Building2, Target, Lightbulb } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <Caption className="text-primary">ABOUT TMT NEXTGEN PARTNERS</Caption>
          <H2>Bridging Traditional Business with Digital Innovation</H2>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Mission Statement */}
            <div className="lg:col-span-2 space-y-6">
              <BodyLarge>
                At TMT NextGen Partners, we democratize enterprise capabilities for small businesses through agentic AI 
                solutions. As a specialized business modernization agency, we understand that small businesses are the 
                backbone of the economy, yet have traditionally lacked access to the sophisticated automation tools that 
                drive large corporation success.
              </BodyLarge>
              
              <BodyLarge>
                Our mission is simple: to make powerful agentic AI products and custom automation solutions affordable and 
                accessible for any business. We leverage cutting-edge AI-driven technology to deliver enterprise-level 
                capabilities at a fraction of traditional costs, ensuring every business can compete in the digital marketplace 
                regardless of size or budget.
              </BodyLarge>
              
              <BodyLarge>
                From intelligent workflow automation and AI-powered customer experiences to adaptive business process optimization, 
                we serve as your trusted partner in integrating transformational AI into your operations. We don't just implement 
                technology—we reimagine how your business can thrive with the power of agentic AI at your fingertips.
              </BodyLarge>
            </div>

            {/* Key Values */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-primary p-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <H2 className="text-lg">Foundation</H2>
                </div>
                <BodyLarge className="text-sm">
                  Small businesses are the backbone of our economy, deserving world-class technology solutions.
                </BodyLarge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-secondary p-2 rounded-lg">
                    <Target className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <H2 className="text-lg">Purpose</H2>
                </div>
                <BodyLarge className="text-sm">
                  Empowering businesses with strategic insights that unlock their true growth potential.
                </BodyLarge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-accent p-2 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                    <Lightbulb className="w-5 h-5 text-accent-foreground relative z-10" />
                  </div>
                  <H2 className="text-lg">Vision</H2>
                </div>
                <BodyLarge className="text-sm">
                  Reimagining business operations for the digital era, not just implementing technology.
                </BodyLarge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};