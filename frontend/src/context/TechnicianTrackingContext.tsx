/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TechnicianTrackingContextValue {
  currentStageIndex: number;
  advanceStage: () => void;
  setStage: (index: number) => void;
  resetTracking: () => void;
}

const TechnicianTrackingContext =
  createContext<TechnicianTrackingContextValue | null>(null);

export function TechnicianTrackingProvider({
  children,
}: {
  children: ReactNode;
}) {
  // البداية من مرحلة Received in Laboratory
  const [currentStageIndex, setCurrentStageIndex] = useState(2);

  const advanceStage = () => {
    setCurrentStageIndex((prev) => Math.min(prev + 1, 6));
  };

  const setStage = (index: number) => {
    setCurrentStageIndex(index);
  };

  const resetTracking = () => {
    // الرجوع لأول مرحلة فعلية عند بدء عينة جديدة
    setCurrentStageIndex(2);
  };

  const value = useMemo(
    () => ({
      currentStageIndex,
      advanceStage,
      setStage,
      resetTracking,
    }),
    [currentStageIndex],
  );

  return (
    <TechnicianTrackingContext.Provider value={value}>
      {children}
    </TechnicianTrackingContext.Provider>
  );
}

export function useTechnicianTracking() {
  const context = useContext(TechnicianTrackingContext);

  if (!context) {
    throw new Error(
      "useTechnicianTracking must be used within TechnicianTrackingProvider",
    );
  }

  return context;
}
