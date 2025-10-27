import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ConsultationStep = 'form' | 'scheduling';

interface LeadData {
  leadId?: string;
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  goals?: string;
  challenges?: string;
}

interface ConsultationModalContextType {
  isOpen: boolean;
  currentStep: ConsultationStep;
  leadData: LeadData | null;
  openModal: () => void;
  closeModal: () => void;
  setStep: (step: ConsultationStep) => void;
  setLeadData: (data: LeadData) => void;
  resetModal: () => void;
}

const ConsultationModalContext = createContext<ConsultationModalContextType | undefined>(undefined);

interface ConsultationModalProviderProps {
  children: ReactNode;
}

export const ConsultationModalProvider: React.FC<ConsultationModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConsultationStep>('form');
  const [leadData, setLeadDataState] = useState<LeadData | null>(null);

  const openModal = () => {
    setIsOpen(true);
    setCurrentStep('form');
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const setStep = (step: ConsultationStep) => {
    setCurrentStep(step);
  };

  const setLeadData = (data: LeadData) => {
    setLeadDataState(data);
  };

  const resetModal = () => {
    setCurrentStep('form');
    setLeadDataState(null);
  };

  return (
    <ConsultationModalContext.Provider 
      value={{ 
        isOpen, 
        currentStep, 
        leadData,
        openModal, 
        closeModal, 
        setStep, 
        setLeadData,
        resetModal 
      }}
    >
      {children}
    </ConsultationModalContext.Provider>
  );
};

export const useConsultationModal = () => {
  const context = useContext(ConsultationModalContext);
  if (context === undefined) {
    throw new Error('useConsultationModal must be used within a ConsultationModalProvider');
  }
  return context;
};