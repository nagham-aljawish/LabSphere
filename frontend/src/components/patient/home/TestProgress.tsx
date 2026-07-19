import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClipboardList,
  FaFlask,
  FaMicroscope,
  FaTruck,
  FaVial,
  FaUserMd,
} from "react-icons/fa";

import SectionHeader from "../../shared/SectionHeader";
import { useAuth } from "../../../context/AuthContext";
import { getPatientTracking, type PatientTrackingOrder } from "../../../services";
import ProgressStepper from "./ProgressStepper";

const progressSteps = [
  { label: "Prepared", icon: FaClipboardList },
  { label: "Collected", icon: FaVial },
  { label: "Received in Lab", icon: FaTruck },
  { label: "Laboratory Analysis", icon: FaMicroscope },
  { label: "Result Entry", icon: FaFlask },
  { label: "Doctor Review", icon: FaUserMd },
  { label: "Completed", icon: FaCheckCircle },
];

function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "Prepared",
    sample_collected: "Collected",
    processing: "In Analysis",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return map[status] ?? status;
}

const TestProgress = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<PatientTrackingOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPatient = useMemo(() => user?.role === "patient", [user?.role]);

  const refreshTracking = useCallback(async () => {
    try {
      const data = await getPatientTracking();
      setCurrentOrder(data.currentOrder);
      setError("");
    } catch {
      setCurrentOrder(null);
      setError("Unable to load tracking details right now.");
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !isPatient) {
      setCurrentOrder(null);
      setError("");
      return;
    }

    setLoading(true);
    refreshTracking().finally(() => setLoading(false));

    const interval = window.setInterval(() => {
      refreshTracking();
    }, 20000);

    return () => window.clearInterval(interval);
  }, [authLoading, isAuthenticated, isPatient, refreshTracking]);

  return (
    <section id="track-sample" className="scroll-mt-20 bg-[#C4E2FA] py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader
          title="Track Your Test Progress"
          description="Follow your laboratory test status step by step."
        />

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-10">
          {loading ? (
            <p className="text-center text-gray-500">Loading your latest test progress...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : !currentOrder ? (
            <p className="text-center text-gray-500">
              No active tests to track right now. Create a lab request at the
              reception desk to follow your sample here.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-3 rounded-2xl bg-[#F4F8FB] p-4 text-sm text-[#052836] md:grid-cols-3">
                <p>
                  <strong>Order:</strong> {currentOrder.orderNumber}
                </p>
                <p>
                  <strong>Status:</strong> {formatOrderStatus(currentOrder.orderStatus)}
                </p>
                <p>
                  <strong>Tests:</strong> {currentOrder.tests.length}
                </p>
              </div>

              <ProgressStepper
                steps={progressSteps}
                currentStep={Math.min(
                  Math.max(currentOrder.currentStep, 0),
                  progressSteps.length - 1,
                )}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestProgress;
