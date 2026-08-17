/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TechnicianTrackingContextValue {
  currentStageIndex: number;
  activeOrderId: number | null;
  activeSampleId: string;
  advanceStage: () => void;
  setStage: (index: number) => void;
  setActiveSample: (orderId: number | null, sampleId?: string) => void;
  resetTracking: () => void;
}

const TechnicianTrackingContext =
  createContext<TechnicianTrackingContextValue | null>(null);

export function TechnicianTrackingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentStageIndex, setCurrentStageIndex] = useState(2);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [activeSampleId, setActiveSampleId] = useState("");

  const advanceStage = useCallback(() => {
    setCurrentStageIndex((prev) => Math.min(prev + 1, 6));
  }, []);

  const setStage = useCallback((index: number) => {
    const safeIndex = Math.max(0, Math.min(index, 6));
    setCurrentStageIndex(safeIndex);
  }, []);

  const setActiveSample = useCallback((orderId: number | null, sampleId = "") => {
    setActiveOrderId(orderId && orderId > 0 ? orderId : null);
    setActiveSampleId(sampleId);
  }, []);

  const resetTracking = useCallback(() => {
    setCurrentStageIndex(2);
    setActiveOrderId(null);
    setActiveSampleId("");
  }, []);

  const value = useMemo(
    () => ({
      currentStageIndex,
      activeOrderId,
      activeSampleId,
      advanceStage,
      setStage,
      setActiveSample,
      resetTracking,
    }),
    [
      activeOrderId,
      activeSampleId,
      currentStageIndex,
      advanceStage,
      setStage,
      setActiveSample,
      resetTracking,
    ],
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
