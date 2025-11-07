import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConsultationForm } from '@/components/molecules/ConsultationForm';
import { CalendlyWidget } from '@/components/molecules/CalendlyWidget';
import { CalendlyInstructions } from '@/components/molecules/CalendlyInstructions';
import { useConsultationModal } from '@/contexts/ConsultationModalContext';
import { Button } from '@/components/atoms/Button';
import { ArrowLeft } from 'lucide-react';
import { H3, Body } from '@/components/atoms/Typography';

const CALENDLY_URL = 'https://calendly.com/tmtnextgenpartners/free-business-audit-consultation';

export const ConsultationModal: React.FC = () => {
  const { isOpen, closeModal, currentStep, leadData, setStep, resetModal } = useConsultationModal();
  
  console.log('[ConsultationModal] Current step:', currentStep);
  console.log('[ConsultationModal] Lead data:', leadData);
  
  // Check if Calendly is configured
  const isCalendlyConfigured = !CALENDLY_URL.includes('your-calendly-username');

  const handleClose = () => {
    closeModal();
    // Reset after a delay to avoid visual glitch
    setTimeout(() => resetModal(), 300);
  };

  const handleBackToForm = () => {
    setStep('form');
  };

  const handleSchedulingComplete = () => {
    // Show success message briefly then close
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {currentStep === 'form' ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Free Process Consultation</DialogTitle>
              <DialogDescription>
                Get your free business process consultation to discover transformation opportunities.
              </DialogDescription>
            </DialogHeader>
            <ConsultationForm isModal />
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToForm}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex-1">
                <H3>Schedule Your Consultation</H3>
                <Body className="text-muted-foreground">
                  Choose a time that works best for you
                </Body>
              </div>
            </div>

            {!isCalendlyConfigured && <CalendlyInstructions />}

            {isCalendlyConfigured ? (
              <CalendlyWidget
                calendlyUrl={CALENDLY_URL}
                mode="popup"
                prefill={{
                  name: leadData?.name,
                  email: leadData?.email,
                  customAnswers: {
                    company: leadData?.company || '',
                    budget: leadData?.budget || '',
                    goals: leadData?.goals || '',
                    challenges: leadData?.challenges || '',
                  },
                }}
                onEventScheduled={handleSchedulingComplete}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Body>Please configure your Calendly URL to enable scheduling.</Body>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handleClose}>
                Skip for Now - I'll Schedule Later
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};