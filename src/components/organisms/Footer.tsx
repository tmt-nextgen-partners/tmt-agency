import React from 'react';
import { H5, Body, Caption } from '../atoms/Typography';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook,
  Award,
  Clock
} from 'lucide-react';


export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-gradient-primary p-2 rounded-lg mr-3">
                <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
              </div>
              <H5 className="text-lg font-bold">TMT NextGen Partners</H5>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+1-847-275-8758" className="text-sm hover:text-primary transition-colors">
                  (847) 275-8758
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:tmtnextgenpartners@gmail.com" className="text-sm hover:text-primary transition-colors">
                  tmtnextgenpartners@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">1735 W Diversey Parkway<br />Chicago, IL 60614</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-6">
            <H5 className="text-base font-semibold">Business Hours</H5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Sat: 10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Sun: Closed</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-6">
            <H5 className="text-base font-semibold">Certifications</H5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">Google Analytics Certified Professional</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">Microsoft Power BI Certified Analyst</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">Certified Business Process Professional</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">Agentic AI Product Development Specialist</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">HubSpot Certified Agency</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-success" />
                <span className="text-sm">Tableau Desktop Certified Professional</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <Caption className="text-secondary-foreground/60">
              © 2024 TMT NextGen Partners. All rights reserved. | Privacy Policy | Terms of Service
            </Caption>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};