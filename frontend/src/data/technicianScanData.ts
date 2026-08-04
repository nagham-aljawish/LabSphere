export interface TechnicianSample {
  patientId: string;
  patientName: string;
  age: number | null;
  gender: string;
  physician: string;

  sampleId: string;
  sampleType: string;
  tube: string;
  collectionTime: string;

  priority: "Urgent" | "Normal";
  verification: "Verified" | "Unverified";

  tests: string[];
  orderNumber?: string;
}
