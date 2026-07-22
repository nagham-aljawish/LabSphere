export interface DiseaseObservation {
  id: number;
  testName: string;
  loinc: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low";
  status: "Pending" | "Final";
}

export interface DiseasePanel {
  id: string;
  title: string;
  observations: DiseaseObservation[];
}

export const diseasePanels: DiseasePanel[] = [
  {
    id: "diabetes",
    title: "Diabetes",
    observations: [
      {
        id: 1,
        testName: "HbA1c",
        loinc: "4548-4",
        value: "",
        unit: "%",
        referenceRange: "4.0 - 5.6",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 2,
        testName: "Blood Glucose",
        loinc: "2345-7",
        value: "",
        unit: "mg/dL",
        referenceRange: "70 - 99",
        flag: "Normal",
        status: "Pending",
      },
    ],
  },

  {
    id: "anemia",
    title: "Anemia",
    observations: [
      {
        id: 1,
        testName: "Hemoglobin",
        loinc: "718-7",
        value: "",
        unit: "g/dL",
        referenceRange: "12 - 16",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 2,
        testName: "MCH",
        loinc: "785-6",
        value: "",
        unit: "pg",
        referenceRange: "27 - 33",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 3,
        testName: "MCHC",
        loinc: "786-4",
        value: "",
        unit: "g/dL",
        referenceRange: "32 - 36",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 4,
        testName: "MCV",
        loinc: "787-2",
        value: "",
        unit: "fL",
        referenceRange: "80 - 100",
        flag: "Normal",
        status: "Pending",
      },
    ],
  },

  {
    id: "thalassemia",
    title: "Thalassemia",
    observations: [
      {
        id: 1,
        testName: "Hb",
        loinc: "718-7",
        value: "",
        unit: "g/dL",
        referenceRange: "12 - 16",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 2,
        testName: "Hct",
        loinc: "4544-3",
        value: "",
        unit: "%",
        referenceRange: "36 - 46",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 3,
        testName: "MCV",
        loinc: "787-2",
        value: "",
        unit: "fL",
        referenceRange: "80 - 100",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 4,
        testName: "MCH",
        loinc: "785-6",
        value: "",
        unit: "pg",
        referenceRange: "27 - 33",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 5,
        testName: "MCHC",
        loinc: "786-4",
        value: "",
        unit: "g/dL",
        referenceRange: "32 - 36",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 6,
        testName: "RDW",
        loinc: "788-0",
        value: "",
        unit: "%",
        referenceRange: "11.5 - 14.5",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 7,
        testName: "RBC Count",
        loinc: "789-8",
        value: "",
        unit: "10⁶/uL",
        referenceRange: "4.2 - 5.9",
        flag: "Normal",
        status: "Pending",
      },
    ],
  },

  {
    id: "liver",
    title: "Liver Disease",
    observations: [
      {
        id: 1,
        testName: "Total Bilirubin",
        loinc: "1975-2",
        value: "",
        unit: "mg/dL",
        referenceRange: "0.2 - 1.2",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 2,
        testName: "Direct Bilirubin",
        loinc: "1968-7",
        value: "",
        unit: "mg/dL",
        referenceRange: "0 - 0.3",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 3,
        testName: "Alkaline Phosphatase",
        loinc: "6768-6",
        value: "",
        unit: "U/L",
        referenceRange: "44 - 147",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 4,
        testName: "ALT",
        loinc: "1742-6",
        value: "",
        unit: "U/L",
        referenceRange: "7 - 56",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 5,
        testName: "AST",
        loinc: "1920-8",
        value: "",
        unit: "U/L",
        referenceRange: "10 - 40",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 6,
        testName: "Total Protein",
        loinc: "2885-2",
        value: "",
        unit: "g/dL",
        referenceRange: "6.0 - 8.3",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 7,
        testName: "Albumin",
        loinc: "1751-7",
        value: "",
        unit: "g/dL",
        referenceRange: "3.5 - 5.5",
        flag: "Normal",
        status: "Pending",
      },
      {
        id: 8,
        testName: "Albumin / Globulin Ratio",
        loinc: "1759-0",
        value: "",
        unit: "",
        referenceRange: "1.0 - 2.5",
        flag: "Normal",
        status: "Pending",
      },
    ],
  },
];