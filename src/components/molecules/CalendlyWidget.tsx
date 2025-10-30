import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { ExternalLink, Calendar, Loader2 } from 'lucide-react';

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
  if (!prefill) {
    console.log('[Calendly] No prefill data provided');
    return baseUrl;
  }
  
  const params = new URLSearchParams();
  
  if (prefill.name) {
    params.append('name', prefill.name);
    console.log('[Calendly] Prefilling name:', prefill.name);
  }
  if (prefill.email) {
    params.append('email', prefill.email);
    console.log('[Calendly] Prefilling email:', prefill.email);
  }
  
  // Add custom answers as a1, a2, a3, etc.
  if (prefill.customAnswers) {
    const answers = Object.values(prefill.customAnswers);
    console.log('[Calendly] Custom answers:', answers);
    answers.forEach((value, index) => {
      if (value) params.append(`a${index + 1}`, value);
    });
  }
  
  const queryString = params.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  console.log('[Calendly] Final URL built:', finalUrl);
  return finalUrl;
};

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  prefill,
  onEventScheduled,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);

  console.log('[Calendly] Component mounted with URL:', calendlyUrl);
  console.log('[Calendly] Prefill data:', prefill);

  useEffect(() => {
    console.log('[Calendly] useEffect triggered');
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    console.log('[Calendly] Existing script found:', !!existingScript);
    
    const initializeWidget = () => {
      console.log('[Calendly] initializeWidget called');
      console.log('[Calendly] widgetContainerRef.current:', widgetContainerRef.current);
      console.log('[Calendly] window.Calendly exists:', !!window.Calendly);
      
      if (window.Calendly && widgetContainerRef.current) {
        try {
          console.log('[Calendly] Initializing inline widget with URL:', fullUrl);
          
          // Clear any existing content
          widgetContainerRef.current.innerHTML = '';
          
          // Manually initialize the inline widget
          window.Calendly.initInlineWidget({
            url: fullUrl,
            parentElement: widgetContainerRef.current,
          });
          
          setScriptLoaded(true);
          console.log('[Calendly] Widget initialized successfully');
          
          // Check if iframe rendered within 3 seconds
          setTimeout(() => {
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              console.log('[Calendly] Iframe check - found:', !!iframe);
              
              if (!iframe) {
                console.warn('[Calendly] No iframe found after 3 seconds, showing fallback');
                setShowFallback(true);
              } else {
                setIsInitializing(false);
              }
            }
          }, 3000);
        } catch (error) {
          console.error('[Calendly] Error initializing widget:', error);
          setShowFallback(true);
          setIsInitializing(false);
        }
      } else {
        console.warn('[Calendly] Cannot initialize - Missing Calendly or container');
        console.log('[Calendly] window.Calendly:', window.Calendly);
        console.log('[Calendly] widgetContainerRef.current:', widgetContainerRef.current);
      }
    };
    
    if (!existingScript) {
      console.log('[Calendly] Loading script for the first time');
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('[Calendly] Script loaded successfully');
        initializeWidget();
      };
      script.onerror = (error) => {
        console.error('[Calendly] Script failed to load:', error);
        setShowFallback(true);
        setIsInitializing(false);
      };
      document.body.appendChild(script);
    } else {
      console.log('[Calendly] Script already exists');
      // Script already loaded
      if (window.Calendly) {
        console.log('[Calendly] Calendly API ready, initializing immediately');
        initializeWidget();
      } else {
        console.log('[Calendly] Script exists but Calendly not ready, waiting...');
        // Wait for script to be ready
        setTimeout(() => {
          console.log('[Calendly] Retrying initialization after delay');
          initializeWidget();
        }, 500);
      }
    }

    // Listen for Calendly event scheduled message
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && e.data.event === 'calendly.event_scheduled') {
        console.log('[Calendly] Event scheduled!');
        onEventScheduled?.();
      }
    };
    
    window.addEventListener('message', handleMessage);

    return () => {
      console.log('[Calendly] Cleanup - removing message listener');
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
        <div className="relative min-h-[700px]">
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading calendar...</p>
              </div>
            </div>
          )}
          <div 
            ref={widgetContainerRef}
            className="calendly-inline-widget" 
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      )}
    </div>
  );
};
