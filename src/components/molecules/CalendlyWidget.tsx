import React from 'react';
import { InlineWidget } from 'react-calendly';

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
  return (
    <div className="calendly-widget-container min-h-[700px] bg-background rounded-lg">
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
      {onEventScheduled && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('message', function(e) {
                if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                  window.calendlyEventScheduled && window.calendlyEventScheduled();
                }
              });
            `,
          }}
        />
      )}
    </div>
  );
};
