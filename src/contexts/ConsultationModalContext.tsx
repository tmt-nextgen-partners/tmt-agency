import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ConsultationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ConsultationModalContext = createContext<ConsultationModalContextType | undefined>(undefined);

interface ConsultationModalProviderProps {
  children: ReactNode;
}

export const ConsultationModalProvider: React.FC<ConsultationModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ConsultationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
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