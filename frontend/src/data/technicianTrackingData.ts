export interface TrackingStage {
  id: number;
  title: string;
  description: string;
}

export interface TechnicianTrackingData {
  sampleId: string;
  patientName: string;
  stages: TrackingStage[];
}

export const technicianTrackingData: TechnicianTrackingData = {
  sampleId: "LAB-2026-001",

  patientName: "Sarah Ahmed",

  stages: [
    {
      id: 1,
      title: "Prepared",
      description: "Sample request has been prepared.",
    },

    {
      id: 2,
      title: "Collected",
      description: "Sample has been collected from the patient.",
    },

    {
      id: 3,
      title: "Received in Laboratory",
      description: "Sample has arrived at the laboratory.",
    },

    {
      id: 4,
      title: "Laboratory Analysis",
      description: "Sample is being analyzed.",
    },

    {
      id: 5,
      title: "Result Entry",
      description: "Laboratory results are being entered.",
    },

    {
      id: 6,
      title: "Doctor Review",
      description: "Doctor is reviewing the laboratory report.",
    },

    {
      id: 7,
      title: "Completed",
      description: "Report has been delivered successfully.",
    },
  ],
};

export const getCurrentStage = (
  data: TechnicianTrackingData,
  currentStageIndex: number,
) => {
  return data.stages[currentStageIndex].title;
};

export const getProgress = (
  data: TechnicianTrackingData,
  currentStageIndex: number,
) => {
  return Math.round(
    ((currentStageIndex + 1) / data.stages.length) * 100,
  );
};