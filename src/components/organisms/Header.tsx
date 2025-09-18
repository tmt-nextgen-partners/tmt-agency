import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { H5 } from '../atoms/Typography';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Results', href: '#results' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-elevation-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-primary p-2 rounded-lg mr-3">
              <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
            </div>
            <H5 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              TMT NextGen Partners
            </H5>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
              href="tel:+1-555-0123" 
              className="flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">(555) 012-3456</span>
            </a>
            <Button variant="cta" size="sm">
              Free Consultation
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="py-4 space-y-4 border-t border-border">
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
                href="tel:+1-555-0123" 
                className="flex items-center text-primary font-medium"
              >
                <Phone className="w-4 h-4 mr-2" />
                (555) 012-3456
              </a>
              <Button variant="cta" size="sm" className="w-full">
                Free Consultation
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};