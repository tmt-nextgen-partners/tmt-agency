import React, { useState, useEffect } from 'react';
import { InlineWidget, PopupButton } from 'react-calendly';
import { Button } from '@/components/atoms/Button';
import { ExternalLink, Calendar } from 'lucide-react';

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

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  prefill,
  onEventScheduled,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const rootElement = document.getElementById('root');

  useEffect(() => {
    // Check if iframe loads within 5 seconds
    const timer = setTimeout(() => {
      const calendlyIframe = document.querySelector('iframe[src*="calendly.com"]');
      if (!calendlyIframe) {
        setShowFallback(true);
      }
    }, 5000);

    // Listen for event scheduled message
    if (onEventScheduled) {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.event && e.data.event === 'calendly.event_scheduled') {
          onEventScheduled();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('message', handleMessage);
      };
    }

    return () => clearTimeout(timer);
  }, [onEventScheduled]);

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
            <PopupButton
              url={calendlyUrl}
              rootElement={rootElement || document.body}
              text="Open Scheduler Popup"
              prefill={prefill}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              utm={{
                utmSource: 'tmt-website',
                utmMedium: 'consultation-fallback',
              }}
            />
            <Button
              variant="outline"
              asChild
            >
              <a
                href={calendlyUrl}
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
        <InlineWidget
          url={calendlyUrl}
          prefill={prefill}
          styles={{
            height: '700px',
            width: '100%',
          }}
          pageSettings={{
            backgroundColor: 'ffffff',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: '2563eb',
            textColor: '1f2937',
          }}
          utm={{
            utmSource: 'tmt-website',
            utmMedium: 'consultation-form',
          }}
        />
      )}
    </div>
  );
};
