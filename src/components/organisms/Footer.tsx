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

const services = [
  "Web Design & Development",
  "Search Engine Optimization", 
  "Pay-Per-Click Advertising",
  "Social Media Marketing",
  "Content Marketing",
  "Analytics & Reporting"
];

const resources = [
  "Case Studies",
  "Marketing Blog",
  "Industry Reports",
  "Free Resources",
  "Success Stories",
  "Client Portal"
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-gradient-primary p-2 rounded-lg mr-3">
                <div className="w-6 h-6 bg-primary-foreground rounded-sm" />
              </div>
              <H5 className="text-lg font-bold">TMT NextGen Partners</H5>
            </div>
            <Body className="text-sm">
              Leading digital marketing agency specializing in business modernization 
              and growth acceleration through innovative marketing strategies.
            </Body>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">(847) 275-8758</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">hello@tmtnextgen.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">123 Business Ave, Suite 100<br />Innovation City, IC 12345</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <H5 className="text-base font-semibold">Our Services</H5>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a 
                    href={`#${service.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <H5 className="text-base font-semibold">Resources</H5>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource}>
                  <a 
                    href={`#${resource.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Info & Certifications */}
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

            {/* Certifications */}
            <div className="space-y-3">
              <H5 className="text-base font-semibold">Certifications</H5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-success" />
                  <span className="text-sm">Google Certified Partner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-success" />
                  <span className="text-sm">Facebook Marketing Partner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-success" />
                  <span className="text-sm">HubSpot Certified Agency</span>
                </div>
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