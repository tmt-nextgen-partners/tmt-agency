import { useState, useCallback } from 'react';

export interface CalendlyPrefillData {
  name?: string;
  email?: string;
  customAnswers?: {
    company?: string;
    budget?: string;
    goals?: string;
    challenges?: string;
  };
}

interface UseCalendlyReturn {
  isScheduling: boolean;
  prefillData: CalendlyPrefillData | null;
  setPrefillData: (data: CalendlyPrefillData) => void;
  clearPrefillData: () => void;
  handleEventScheduled: () => void;
}

export const useCalendly = (): UseCalendlyReturn => {
  const [isScheduling, setIsScheduling] = useState(false);
  const [prefillData, setPrefillDataState] = useState<CalendlyPrefillData | null>(null);

  const setPrefillData = useCallback((data: CalendlyPrefillData) => {
    setPrefillDataState(data);
    setIsScheduling(true);
  }, []);

  const clearPrefillData = useCallback(() => {
    setPrefillDataState(null);
    setIsScheduling(false);
  }, []);

  const handleEventScheduled = useCallback(() => {
    setIsScheduling(false);
  }, []);

  return {
    isScheduling,
    prefillData,
    setPrefillData,
    clearPrefillData,
    handleEventScheduled,
  };
};
