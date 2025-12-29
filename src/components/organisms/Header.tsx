import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { H5 } from '../atoms/Typography';
import { Menu, X, Phone, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConsultationModal } from '@/contexts/ConsultationModalContext';
import tmtLogo from '@/assets/tmt-logo.png';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useConsultationModal();

  const navigation = [
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-elevation-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src={tmtLogo} alt="TMT NextGen Partners" className="h-10 w-auto mr-3" />
            <H5 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              TMT NextGen Partners
            </H5>
          </div>

          {/* Desktop Navigation */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="tel:+1-847-275-8758" 
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">(847) 275-8758</span>
            </a>
            <Button variant="cta" size="sm" onClick={openModal}>
              Free Consultation
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          id="mobile-menu"
          className={cn(
            "md:hidden transition-all duration-300 overflow-hidden",
            isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav role="navigation" aria-label="Mobile navigation" className="py-4 space-y-4 border-t border-border">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <a 
                href="tel:+1-847-275-8758" 
                className="flex items-center text-primary font-medium"
              >
                <Phone className="w-4 h-4 mr-2" />
                (847) 275-8758
              </a>
              <Button 
                variant="cta" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  openModal();
                  setIsMenuOpen(false);
                }}
              >
                Free Consultation
              </Button>
              <Link to="/admin" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};