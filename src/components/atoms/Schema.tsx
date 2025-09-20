import React from 'react';
import { Helmet } from 'react-helmet-async';

export const BusinessSchema: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "TMT NextGen Partners",
    "description": "Business modernization agency specializing in process optimization, workflow automation, and digital transformation",
    "url": "https://tmtnextgen.com",
    "telephone": "+1-847-275-8758",
    "email": "hello@tmtnextgen.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1735 W Diversey Parkway",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "postalCode": "60614",
      "addressCountry": "US"
    },
    "serviceType": [
      "Business Process Optimization",
      "Workflow Automation",
      "Digital Transformation",
      "Performance Analytics",
      "Data Integration"
    ],
    "areaServed": "United States",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "147"
    },
    "priceRange": "$$$",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Business Modernization Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Process Optimization",
            "description": "Streamline business operations for maximum efficiency"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Workflow Automation",
            "description": "Automate repetitive tasks and improve productivity"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};