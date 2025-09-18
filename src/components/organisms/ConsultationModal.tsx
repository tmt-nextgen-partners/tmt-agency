import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConsultationForm } from '@/components/molecules/ConsultationForm';
import { useConsultationModal } from '@/contexts/ConsultationModalContext';

export const ConsultationModal: React.FC = () => {
  const { isOpen, closeModal } = useConsultationModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Free Process Consultation</DialogTitle>
          <DialogDescription>
            Get your free business process consultation to discover transformation opportunities.
          </DialogDescription>
        </DialogHeader>
        <ConsultationForm isModal onSuccess={closeModal} />
      </DialogContent>
    </Dialog>
  );
};