import React from 'react';
import { Body, Caption } from '@/components/atoms/Typography';
import { AlertCircle } from 'lucide-react';

export const CalendlyInstructions: React.FC = () => {
  return (
    <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <Body className="font-semibold">Setup Required: Configure Your Calendly URL</Body>
          <Caption className="text-muted-foreground">
            To enable scheduling functionality, you need to:
          </Caption>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
            <li>Open <code className="bg-background px-1.5 py-0.5 rounded text-xs">src/components/organisms/ConsultationModal.tsx</code></li>
            <li>Replace the placeholder <code className="bg-background px-1.5 py-0.5 rounded text-xs">CALENDLY_URL</code> with your actual Calendly link</li>
            <li>Example: <code className="bg-background px-1.5 py-0.5 rounded text-xs">https://calendly.com/your-username/consultation</code></li>
            <li>Configure webhook in Calendly to point to your edge function</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
