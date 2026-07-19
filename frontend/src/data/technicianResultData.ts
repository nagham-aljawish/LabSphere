export interface PatientInfo {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  physician: string;
}

export interface SampleInfo {
  sampleId: string;
  sampleType: string;
  tubeType: string;
  collectionTime: string;
  priority: string;
}

export interface Observation {
  id: number;
  testName: string;
  loinc: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low";
  status: "Pending" | "Final";
  verified: boolean;
}

export interface TechnicianResultData {
  patient: PatientInfo;
  sample: SampleInfo;
  observations: Observation[];
}

export const technicianResultData: TechnicianResultData = {
  patient: {
    patientId: "P-10024",
    patientName: "Sarah Ahmed",
    age: 32,
    gender: "Female",
    physician: "Dr. Mohammed Salhab",
  },

  sample: {
    sampleId: "LAB-2026-001",
    sampleType: "Whole Blood",
    tubeType: "EDTA",
    collectionTime: "17 Jul 2026 • 09:15 AM",
    priority: "Routine",
  },

  observations: [
    {
      id: 1,
      testName: "Complete Blood Count (CBC)",
      loinc: "57021-8",
      value: "",
      unit: "x10³/uL",
      referenceRange: "4.0 - 10.0",
      flag: "Normal",
      status: "Pending",
      verified: false,
    },

    {
      id: 2,
      testName: "Glucose",
      loinc: "2345-7",
      value: "",
      unit: "mg/dL",
      referenceRange: "70 - 99",
      flag: "Normal",
      status: "Pending",
      verified: false,
    },

    {
      id: 3,
      testName: "HbA1c",
      loinc: "4548-4",
      value: "",
      unit: "%",
      referenceRange: "4.0 - 5.6",
      flag: "Normal",
      status: "Pending",
      verified: false,
    },

    {
      id: 4,
      testName: "Creatinine",
      loinc: "2160-0",
      value: "",
      unit: "mg/dL",
      referenceRange: "0.6 - 1.2",
      flag: "Normal",
      status: "Pending",
      verified: false,
    },

    {
      id: 5,
      testName: "Alanine Aminotransferase (ALT)",
      loinc: "1742-6",
      value: "",
      unit: "U/L",
      referenceRange: "7 - 56",
      flag: "Normal",
      status: "Pending",
      verified: false,
    },
  ],
};