export interface TechnicianSample {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  physician: string;

  sampleId: string;
  sampleType: string;
  tube: string;
  collectionTime: string;

  priority: "Urgent" | "Normal";
  verification: "Verified" | "Unverified";

  tests: string[];
}

export const technicianSampleMock: TechnicianSample = {
  patientId: "PT-2026-04821",
  patientName: "Ahmad Al-Rashidi",
  age: 47,
  gender: "Male",
  physician: "Dr. Sara Al-Mansouri",

  sampleId: "SMP-0709-0038",
  sampleType: "Whole Blood",
  tube: "EDTA Purple Top",
  collectionTime: "2026-07-09 08:32",

  priority: "Urgent",
  verification: "Unverified",

  tests: [
    "Complete Blood Count (CBC)",
    "HbA1c",
    "Fasting Glucose",
    "Lipid Panel",
    "Insulin",
  ],
};