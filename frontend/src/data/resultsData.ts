export interface Result {
  id: number;
  title: string;
  date: string;
  status: "new" | "last";
}

export const resultsData: Result[] = [
  {
    id: 1,
    title: "Blood Test Report",
    date: "20 Apr 2026",
    status: "new",
  },
  {
    id: 2,
    title: "Liver Panel",
    date: "18 Apr 2026",
    status: "last",
  },
  {
    id: 3,
    title: "CBC Analysis",
    date: "18 Apr 2026",
    status: "last",
  },
  {
    id: 4,
    title: "COVID-19 PCR",
    date: "17 Apr 2026",
    status: "last",
  },
];

export interface TestItem {
  name: string;
  code: string;
  result: string;
  range: string;
  status:"Normal"| "High"| "Low"| "Critical";
}

export interface ResultDetails {
  id: number;
  reportName: string;
  patientName: string;
  orderNumber: string;
  patientId: string;
  date: string;
  tests: TestItem[];
}

export const resultsDetailsData: ResultDetails[] = [
  {
    id: 1,
    reportName: "Blood Test Report",
    patientName: "Mohamed Salhab",
    orderNumber: "ORD-10453",
    patientId: "PAT-32045",
    date: "20 Apr 2026",

    tests: [
      {
        name: "Glucose",
        code: "LOINC:23390-0",
        result: "135 mg/dL",
        range: "70-100 mg/dL",
        status: "High",
      },
      {
        name: "Hemoglobin",
        code: "LOINC:718-7",
        result: "10.2 g/dL",
        range: "13.2-16.6 g/dL",
        status: "Low",
      },
      {
        name: "Potassium",
        code: "LOINC:2823-3",
        result: "7.1 mmol/L",
        range: "3.5-5.1 mmol/L",
        status: "Critical",
      },
      {
        name: "WBC",
        code: "LOINC:6690-2",
        result: "6.8 x10³/μL",
        range: "4.0-11.0 x10³/μL",
        status: "Normal",
      },
    ],
  },

  {
    id: 2,
    reportName: "Liver Panel",
    patientName: "Mohamed Salhab",
    orderNumber: "ORD-10454",
    patientId: "PAT-32045",
    date: "18 Apr 2026",

    tests: [
      {
        name: "ALT",
        code: "LOINC:1742-6",
        result: "32 U/L",
        range: "7-56 U/L",
        status: "Normal",
      },
      {
        name: "AST",
        code: "LOINC:1920-8",
        result: "28 U/L",
        range: "10-40 U/L",
        status: "Normal",
      },
    ],
  },

  {
    id: 3,
    reportName: "CBC Analysis",
    patientName: "Mohamed Salhab",
    orderNumber: "ORD-10455",
    patientId: "PAT-32045",
    date: "18 Apr 2026",

    tests: [
      {
        name: "RBC",
        code: "LOINC:789-8",
        result: "5.1 M/uL",
        range: "4.5-5.9 M/uL",
        status: "Normal",
      },
      {
        name: "Platelets",
        code: "LOINC:777-3",
        result: "260 K/uL",
        range: "150-450 K/uL",
        status: "Normal",
      },
    ],
  },

  {
    id: 4,
    reportName: "COVID-19 PCR",
    patientName: "Mohamed Salhab",
    orderNumber: "ORD-10456",
    patientId: "PAT-32045",
    date: "17 Apr 2026",

    tests: [
      {
        name: "SARS-CoV-2",
        code: "PCR-001",
        result: "Negative",
        range: "Negative",
        status: "Normal",
      },
    ],
  },
];