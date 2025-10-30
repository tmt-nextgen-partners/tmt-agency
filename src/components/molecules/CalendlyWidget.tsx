import React, { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { ExternalLink, Calendar } from 'lucide-react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

interface CalendlyWidgetProps {
  calendlyUrl: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: {
      [key: string]: string;
    };
  };
  onEventScheduled?: () => void;
}

const buildCalendlyUrl = (baseUrl: string, prefill?: CalendlyWidgetProps['prefill']): string => {
  if (!prefill) return baseUrl;
  
  const params = new URLSearchParams();
  
  if (prefill.name) params.append('name', prefill.name);
  if (prefill.email) params.append('email', prefill.email);
  
  // Add custom answers as a1, a2, a3, etc.
  if (prefill.customAnswers) {
    Object.values(prefill.customAnswers).forEach((value, index) => {
      if (value) params.append(`a${index + 1}`, value);
    });
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  prefill,
  onEventScheduled,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    
    const initializeWidget = () => {
      const widgetContainer = document.querySelector('.calendly-inline-widget');
      
      if (window.Calendly && widgetContainer) {
        // Manually initialize the inline widget
        window.Calendly.initInlineWidget({
          url: fullUrl,
          parentElement: widgetContainer as HTMLElement,
        });
        
        setScriptLoaded(true);
        
        // Check if iframe rendered within 3 seconds
        setTimeout(() => {
          const iframe = widgetContainer.querySelector('iframe');
          if (!iframe) {
            setShowFallback(true);
          }
        }, 3000);
      }
    };
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initializeWidget;
      document.body.appendChild(script);
    } else {
      // Script already loaded
      if (window.Calendly) {
        initializeWidget();
      } else {
        // Wait for script to be ready
        setTimeout(initializeWidget, 100);
      }
    }

    // Listen for Calendly event scheduled message
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && e.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.();
      }
    };
    
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [fullUrl, onEventScheduled]);

  const handleOpenPopup = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: fullUrl });
    }
  };

  return (
    <div className="calendly-widget-container min-h-[700px] bg-background rounded-lg">
      {showFallback ? (
        <div className="flex flex-col items-center justify-center min-h-[700px] gap-6 p-8 text-center">
          <Calendar className="w-16 h-16 text-primary" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Schedule Your Consultation</h3>
            <p className="text-muted-foreground mb-6">
              The embedded calendar couldn't load. Please use one of the options below:
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              onClick={handleOpenPopup}
              disabled={!scriptLoaded}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Open Scheduler Popup
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Tip: If you're in preview mode, try opening the app in a new browser tab
          </p>
        </div>
      ) : (
        <div 
          className="calendly-inline-widget" 
          style={{ minWidth: '320px', height: '700px' }}
        />
      )}
    </div>
  );
};
