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

const TechnicianSampleTrackingPage = () => {
  const { currentStageIndex } = useTechnicianTracking();

  const currentStage = getCurrentStage(
    technicianTrackingData,
    currentStageIndex,
  );

  const progress = getProgress(technicianTrackingData, currentStageIndex);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Sample Tracking"
        description="Track every stage of the laboratory sample processing."
      />

      <TrackingSummaryCard
        sampleId={technicianTrackingData.sampleId}
        patientName={technicianTrackingData.patientName}
        currentStage={currentStage}
        progress={progress}
      />

      <TrackingTimeline />

      <TrackingActions currentStage={currentStage} />
    </div>
  );
};

export default TechnicianSampleTrackingPage;
