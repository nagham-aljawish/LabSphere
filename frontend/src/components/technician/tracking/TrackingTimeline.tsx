import { technicianTrackingData } from "../../../data/technicianTrackingData";
import { useTechnicianTracking } from "../../../context/TechnicianTrackingContext";
import TrackingStageCard from "./TrackingStageCard";

const TrackingTimeline = () => {
  const { currentStageIndex } = useTechnicianTracking();
  console.log(technicianTrackingData.stages);
  return (
    <div className="space-y-6">
      {technicianTrackingData.stages.map((stage, index) => {
        let status: "completed" | "current" | "pending";

        if (index < currentStageIndex) {
          status = "completed";
        } else if (index === currentStageIndex) {
          status = "current";
        } else {
          status = "pending";
        }

        return (
          <TrackingStageCard
            key={stage.id}
            stage={{
              ...stage,
              status,
            }}
            isLast={index === technicianTrackingData.stages.length - 1}
          />
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
