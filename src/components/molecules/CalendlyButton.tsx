import React from 'react';
import { PopupButton } from 'react-calendly';
import { Button } from '@/components/atoms/Button';
import { Calendar } from 'lucide-react';

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

export const CalendlyButton: React.FC<CalendlyButtonProps> = ({
  calendlyUrl,
  buttonText = 'Schedule Time',
  variant = 'primary',
  prefill,
  onEventScheduled,
}) => {
  const rootElement = document.getElementById('root');

  React.useEffect(() => {
    if (onEventScheduled) {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.event && e.data.event === 'calendly.event_scheduled') {
          onEventScheduled();
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [onEventScheduled]);

  return (
    <div className="calendly-button-wrapper">
      <PopupButton
        url={calendlyUrl}
        rootElement={rootElement || document.body}
        text={buttonText}
        prefill={prefill}
        className="calendly-popup-button"
        utm={{
          utmSource: 'tmt-website',
          utmMedium: 'direct-booking',
        }}
      />
    </div>
  );
};
