export interface TechnicianAnalysisData {
  patient: {
    name: string;
    id: string;
    age: number;
    gender: string;
    physician: string;
  };

  sample: {
    id: string;
    type: string;
    tube: string;
    collectionTime: string;
    priority: string;
    category: string;
  };

  tests: string[];

  analysisStatus: "Pending" | "In Progress" | "Completed";

  aiSupport: {
    cdss: boolean;
    deltaCheck: boolean;
    message: string;
    warning: string;
  };

  notes: string;
}

export const technicianAnalysisData: TechnicianAnalysisData = {
  patient: {
    name: "Ahmad Al-Rashidi",
    id: "PT-2026-04821",
    age: 47,
    gender: "Male",
    physician: "Dr. Sara Al-Mansouri",
  },

  sample: {
    id: "SMP-0709-0038",
    type: "Whole Blood",
    tube: "EDTA Purple Top",
    collectionTime: "2026-07-09 08:32 AM",
    priority: "Urgent",
    category: "Diabetes",
  },

  tests: [
    "Complete Blood Count (CBC)",
    "HbA1c",
    "Fasting Glucose",
    "Lipid Panel",
    "Insulin",
  ],

  analysisStatus: "In Progress",

  aiSupport: {
    cdss: true,
    deltaCheck: true,
    message:
      "Diabetes panel detected. Clinical Decision Support System will auto-run after result submission.",
    warning:
      "Automated delta check will compare with prior results for this patient.",
  },

  notes: "",
};