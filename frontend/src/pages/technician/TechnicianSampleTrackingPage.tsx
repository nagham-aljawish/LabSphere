import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import TrackingSummaryCard from "../../components/technician/tracking/TrackingSummaryCard";
import TrackingTimeline from "../../components/technician/tracking/TrackingTimeline";
import TrackingActions from "../../components/technician/tracking/TrackingActions";

import {
  technicianTrackingData,
  getCurrentStage,
  getProgress,
} from "../../data/technicianTrackingData";

import { useTechnicianTracking } from "../../context/TechnicianTrackingContext";
import {
  getTechnicianOrderTracking,
  type TechnicianOrderTracking,
} from "../../services";

const TechnicianSampleTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const {
    currentStageIndex,
    activeOrderId,
    activeSampleId,
    setActiveSample,
    setStage,
  } = useTechnicianTracking();

  const orderId =
    Number(searchParams.get("orderId") || 0) || activeOrderId || 0;
  const sampleIdParam = searchParams.get("sampleId") || activeSampleId || "";

  const [tracking, setTracking] = useState<TechnicianOrderTracking | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!orderId) {
      setTracking(null);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getTechnicianOrderTracking(orderId);
      setTracking(data);
      setStage(data.currentStep);
      setActiveSample(data.orderId, data.sampleId || sampleIdParam);
    } catch {
      setError("Failed to load live tracking for this order.");
    } finally {
      setLoading(false);
    }
  }, [orderId, sampleIdParam, setActiveSample, setStage]);

  useEffect(() => {
    refresh();
    if (!orderId) return;

    const interval = window.setInterval(() => {
      refresh();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [orderId, refresh]);

  const stageIndex = tracking?.currentStep ?? currentStageIndex;
  const currentStage =
    tracking?.currentStepLabel ??
    getCurrentStage(technicianTrackingData, stageIndex);
  const progress = tracking
    ? Math.round(((tracking.currentStep + 1) / 7) * 100)
    : getProgress(technicianTrackingData, stageIndex);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Sample Tracking"
        description="Track every stage of the laboratory sample processing."
      />

      {!orderId && (
        <p className="rounded-2xl bg-amber-100 px-4 py-3 text-amber-800">
          Open tracking from a scanned sample or order so live status can be
          loaded.
        </p>
      )}

      {error && (
        <p className="rounded-2xl bg-red-100 px-4 py-3 text-red-700">{error}</p>
      )}

      {loading && !tracking ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-[#052836]" size={30} />
        </div>
      ) : (
        <>
          <TrackingSummaryCard
            sampleId={tracking?.sampleId || sampleIdParam || "—"}
            patientName={tracking?.patientName || "—"}
            currentStage={currentStage}
            progress={progress}
          />

          <TrackingTimeline
            stages={
              tracking?.stages?.map((stage) => ({
                id: stage.id,
                title: stage.title,
                description:
                  technicianTrackingData.stages.find((s) => s.id === stage.id)
                    ?.description ?? "",
                status: stage.status,
              })) ?? undefined
            }
            currentStageIndex={stageIndex}
          />

          <TrackingActions currentStage={currentStage} />
        </>
      )}
    </div>
  );
};

export default TechnicianSampleTrackingPage;
