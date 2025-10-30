import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Calendar } from 'lucide-react';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

interface CalendlyButtonProps {
  calendlyUrl: string;
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: {
      [key: string]: string;
    };
  };
  onEventScheduled?: () => void;
}

const buildCalendlyUrl = (baseUrl: string, prefill?: CalendlyButtonProps['prefill']): string => {
  if (!prefill) return baseUrl;
  
  const params = new URLSearchParams();
  
  if (prefill.name) params.append('name', prefill.name);
  if (prefill.email) params.append('email', prefill.email);
  
  if (prefill.customAnswers) {
    Object.values(prefill.customAnswers).forEach((value, index) => {
      if (value) params.append(`a${index + 1}`, value);
    });
  }
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  calendlyUrl,
  buttonText = 'Schedule Time',
  variant = 'primary',
  prefill,
  onEventScheduled,
}) => {
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);

  React.useEffect(() => {
    // Load Calendly script if not already loaded
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    // Listen for Calendly event scheduled message
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && e.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.();
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEventScheduled]);

  const handleClick = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: fullUrl });
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleClick}
      disabled={!scriptLoaded}
    >
      <Calendar className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};
