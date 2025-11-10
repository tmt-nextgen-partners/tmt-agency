import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  mode?: 'popup' | 'inline' | 'auto';
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
  
  if (prefill.customAnswers) {
    const answers = Object.values(prefill.customAnswers);
    answers.forEach((value, index) => {
      if (value) params.append(`a${index + 1}`, value);
    });
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

const waitForCalendly = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Calendly) {
      resolve(true);
      return;
    }
    
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.Calendly || attempts > 20) {
        clearInterval(interval);
        resolve(!!window.Calendly);
      }
      attempts++;
    }, 100);
  });
};

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  mode = 'popup',
  prefill,
  onEventScheduled,
}) => {
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [showFallback, setShowFallback] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);
  
  // Determine effective mode
  const isPreviewEnvironment = 
    window.location.hostname.includes('lovableproject.com') || 
    window.location.hostname === 'localhost';
  const effectiveMode = mode === 'auto' ? (isPreviewEnvironment ? 'popup' : 'inline') : mode;

  // Load Calendly script
  React.useEffect(() => {
    console.log(`[Calendly] Initializing - Mode: ${effectiveMode}, URL: ${fullUrl.substring(0, 50)}...`);
    
    const existingScript = document.querySelector('script[src*="calendly.com"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('[Calendly] Script loaded');
        setScriptLoaded(true);
        if (effectiveMode === 'inline') initializeInlineWidget();
      };
      script.onerror = () => {
        console.error('[Calendly] Script failed to load');
        setShowFallback(true);
      };
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
      if (window.Calendly && effectiveMode === 'inline') {
        initializeInlineWidget();
      }
    }

    // Listen for event scheduling
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && e.data.event === 'calendly.event_scheduled') {
        console.log('[Calendly] Event scheduled');
        onEventScheduled?.();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [fullUrl, onEventScheduled, effectiveMode]);

  const initializeInlineWidget = () => {
    if (!containerRef.current || isInitialized || !window.Calendly) return;

    try {
      console.log('[Calendly] Initializing inline widget');
      window.Calendly.initInlineWidget({
        url: fullUrl,
        parentElement: containerRef.current,
      });
      setIsInitialized(true);
      
      // Fallback timer if iframe doesn't load
      setTimeout(() => {
        if (containerRef.current && !containerRef.current.querySelector('iframe')) {
          console.warn('[Calendly] Inline widget failed to load - showing fallback');
          setShowFallback(true);
        }
      }, 3000);
    } catch (error) {
      console.error('[Calendly] Initialization error:', error);
      setShowFallback(true);
    }
  };

  const handleOpenPopup = async () => {
    console.log('[Calendly] Opening popup - checking availability...');
    
    // Wait for Calendly to be available (with timeout)
    const isAvailable = await waitForCalendly();
    
    if (window.Calendly?.initPopupWidget && isAvailable) {
      console.log('[Calendly] Initializing popup widget');
      try {
        window.Calendly.initPopupWidget({ url: fullUrl });
      } catch (error) {
        console.error('[Calendly] Popup initialization failed:', error);
        // Fallback to new tab
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      console.warn('[Calendly] Calendly object not available, opening in new tab');
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenNewTab = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  // Popup mode rendering
  if (effectiveMode === 'popup') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 text-center space-y-4 border border-border/50">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Ready to Schedule?</h3>
            <p className="text-muted-foreground">
              Click below to open our scheduling calendar and choose a time that works best for you.
            </p>
          </div>
          <Button
            onClick={handleOpenPopup}
            disabled={!scriptLoaded}
            size="lg"
            className="gap-2"
          >
            <Calendar className="w-5 h-5" />
            {scriptLoaded ? 'Schedule Your Consultation' : 'Loading...'}
          </Button>
          <p className="text-sm text-muted-foreground">
            Opens in a secure overlay • Takes 2 minutes
          </p>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleOpenNewTab}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Prefer to open in a new tab instead?
          </button>
        </div>
      </div>
    );
  }

  // Inline mode - fallback UI if blocked
  if (showFallback) {
    return (
      <div className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Schedule Your Consultation</h3>
            <p className="text-muted-foreground">Choose how you'd like to schedule:</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleOpenPopup} className="gap-2">
              <Calendar className="w-4 h-4" />
              Open Calendar
            </Button>
            
            <Button onClick={handleOpenNewTab} variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              New Tab
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline widget rendering
  return (
    <div className="space-y-4">
      {!isInitialized && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="calendly-inline-widget"
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  );
};
