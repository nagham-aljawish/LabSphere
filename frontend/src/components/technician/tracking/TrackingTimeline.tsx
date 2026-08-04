import { technicianTrackingData } from "../../../data/technicianTrackingData";
import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";
import TrackingStageCard from "./TrackingStageCard";

interface TimelineStage {
  id: number;
  title: string;
  description: string;
  status?: "completed" | "current" | "pending";
}

interface Props {
  stages?: TimelineStage[];
  currentStageIndex?: number;
}

const TrackingTimeline = ({ stages, currentStageIndex }: Props) => {
  const tracking = useTechnicianTracking();
  const stageIndex = currentStageIndex ?? tracking.currentStageIndex;
  const list =
    stages ??
    technicianTrackingData.stages.map((stage, index) => {
      const isLast = index === technicianTrackingData.stages.length - 1;
      let status: "completed" | "current" | "pending";
      if (index < stageIndex || (index === stageIndex && isLast)) {
        status = "completed";
      } else if (index === stageIndex) {
        status = "current";
      } else {
        status = "pending";
      }

      return { ...stage, status };
    });

  return (
    <div className="space-y-6">
      {list.map((stage, index) => {
        const isLast = index === list.length - 1;
        const resolvedStatus =
          stage.status ??
          (index < stageIndex || (index === stageIndex && isLast)
            ? "completed"
            : index === stageIndex
              ? "current"
              : "pending");

        // Final "Completed" step should always show a checkmark when reached.
        const status =
          isLast &&
          (resolvedStatus === "current" || stageIndex >= list.length - 1)
            ? "completed"
            : resolvedStatus;

        return (
          <TrackingStageCard
            key={stage.id}
            stage={{
              ...stage,
              status,
            }}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
