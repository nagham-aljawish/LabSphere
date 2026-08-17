import type { CdssDisease } from "../services/types";


export interface TestReference {
  unit: string;
  range: string;
}

const diabetes = {
  HBA1C: { unit: "%", range: "4.0 - 5.6" },
  "LOINC:4548-4": { unit: "%", range: "4.0 - 5.6" },
  FBS: { unit: "mg/dL", range: "70 - 99" },
  "LOINC:1558-6": { unit: "mg/dL", range: "70 - 99" },
  RBS: { unit: "mg/dL", range: "70 - 140" },
  "LOINC:2345-7": { unit: "mg/dL", range: "70 - 140" },
  "LOINC:2339-0": { unit: "mg/dL", range: "70 - 99" },
  "LOINC:23390-0": { unit: "mg/dL", range: "70 - 99" },
} satisfies Record<string, TestReference>;

const hematology = {
  HGB: { unit: "g/dL", range: "12 - 16" },
  "LOINC:718-7": { unit: "g/dL", range: "12 - 16" },
  CBC: { unit: "x10³/uL", range: "4.0 - 10.0" },
  "LOINC:58410-2": { unit: "x10³/uL", range: "4.0 - 10.0" },
  ESR: { unit: "mm/hr", range: "0 - 20" },
  "LOINC:30341-2": { unit: "mm/hr", range: "0 - 20" },
  RETIC: { unit: "%", range: "0.5 - 2.5" },
  "LOINC:14196-0": { unit: "%", range: "0.5 - 2.5" },
} satisfies Record<string, TestReference>;

const kidney = {
  UREA: { unit: "mg/dL", range: "15 - 40" },
  "LOINC:3094-0": { unit: "mg/dL", range: "15 - 40" },
  BUN: { unit: "mg/dL", range: "7 - 20" },
  "LOINC:6299-2": { unit: "mg/dL", range: "7 - 20" },
  CREA: { unit: "mg/dL", range: "0.6 - 1.2" },
  "LOINC:2160-0": { unit: "mg/dL", range: "0.6 - 1.2" },
} satisfies Record<string, TestReference>;

const electrolytes = {
  NA: { unit: "mmol/L", range: "135 - 145" },
  "LOINC:2951-2": { unit: "mmol/L", range: "135 - 145" },
  K: { unit: "mmol/L", range: "3.5 - 5.1" },
  "LOINC:2823-3": { unit: "mmol/L", range: "3.5 - 5.1" },
  CL: { unit: "mmol/L", range: "98 - 107" },
  "LOINC:2075-0": { unit: "mmol/L", range: "98 - 107" },
  CA: { unit: "mg/dL", range: "8.5 - 10.5" },
  "LOINC:17861-6": { unit: "mg/dL", range: "8.5 - 10.5" },
  MG: { unit: "mg/dL", range: "1.7 - 2.2" },
  "LOINC:2601-3": { unit: "mg/dL", range: "1.7 - 2.2" },
  PHOS: { unit: "mg/dL", range: "2.5 - 4.5" },
  "LOINC:2777-1": { unit: "mg/dL", range: "2.5 - 4.5" },
  UA: { unit: "mg/dL", range: "3.5 - 7.2" },
  "LOINC:3084-1": { unit: "mg/dL", range: "3.5 - 7.2" },
} satisfies Record<string, TestReference>;

const liver = {
  ALT: { unit: "U/L", range: "7 - 56" },
  "LOINC:1742-6": { unit: "U/L", range: "7 - 56" },
  AST: { unit: "U/L", range: "10 - 40" },
  "LOINC:1920-8": { unit: "U/L", range: "10 - 40" },
  ALP: { unit: "U/L", range: "44 - 147" },
  "LOINC:6768-6": { unit: "U/L", range: "44 - 147" },
  GGT: { unit: "U/L", range: "9 - 48" },
  "LOINC:2324-2": { unit: "U/L", range: "9 - 48" },
  TBIL: { unit: "mg/dL", range: "0.2 - 1.2" },
  "LOINC:1975-2": { unit: "mg/dL", range: "0.2 - 1.2" },
  DBIL: { unit: "mg/dL", range: "0 - 0.3" },
  "LOINC:1968-7": { unit: "mg/dL", range: "0 - 0.3" },
  ALB: { unit: "g/dL", range: "3.5 - 5.5" },
  "LOINC:1751-7": { unit: "g/dL", range: "3.5 - 5.5" },
  TP: { unit: "g/dL", range: "6.0 - 8.3" },
  "LOINC:2885-2": { unit: "g/dL", range: "6.0 - 8.3" },
  LFT: { unit: "", range: "" },
  "LOINC:24325-3": { unit: "", range: "" },
} satisfies Record<string, TestReference>;

const lipid = {
  CHOL: { unit: "mg/dL", range: "0 - 200" },
  "LOINC:2093-3": { unit: "mg/dL", range: "0 - 200" },
  TG: { unit: "mg/dL", range: "0 - 150" },
  "LOINC:2571-8": { unit: "mg/dL", range: "0 - 150" },
  HDL: { unit: "mg/dL", range: "40 - 60" },
  "LOINC:2085-9": { unit: "mg/dL", range: "40 - 60" },
  LDL: { unit: "mg/dL", range: "0 - 100" },
  "LOINC:13457-7": { unit: "mg/dL", range: "0 - 100" },
  LIPID: { unit: "", range: "" },
  "LOINC:24331-1": { unit: "", range: "" },
} satisfies Record<string, TestReference>;

const thyroid = {
  TSH: { unit: "mIU/L", range: "0.4 - 4.0" },
  "LOINC:3016-3": { unit: "mIU/L", range: "0.4 - 4.0" },
  FT3: { unit: "pg/mL", range: "2.3 - 4.2" },
  "LOINC:3051-0": { unit: "pg/mL", range: "2.3 - 4.2" },
  FT4: { unit: "ng/dL", range: "0.8 - 1.8" },
  "LOINC:3024-7": { unit: "ng/dL", range: "0.8 - 1.8" },
  T3: { unit: "ng/dL", range: "0.8 - 2.0" },
  "LOINC:3053-6": { unit: "ng/dL", range: "0.8 - 2.0" },
  T4: { unit: "ug/dL", range: "4.5 - 12.0" },
  "LOINC:3026-2": { unit: "ug/dL", range: "4.5 - 12.0" },
} satisfies Record<string, TestReference>;

const inflammation = {
  CRP: { unit: "mg/L", range: "0 - 5" },
  "LOINC:1988-5": { unit: "mg/L", range: "0 - 5" },
} satisfies Record<string, TestReference>;

const immunology = {
  RF: { unit: "IU/mL", range: "0 - 14" },
  "LOINC:11572-5": { unit: "IU/mL", range: "0 - 14" },
  ASO: { unit: "IU/mL", range: "0 - 200" },
  "LOINC:4625-0": { unit: "IU/mL", range: "0 - 200" },
} satisfies Record<string, TestReference>;

const coagulation = {
  PT: { unit: "sec", range: "11 - 13.5" },
  "LOINC:5902-2": { unit: "sec", range: "11 - 13.5" },
  PTT: { unit: "sec", range: "25 - 35" },
  "LOINC:3173-2": { unit: "sec", range: "25 - 35" },
  INR: { unit: "", range: "0.8 - 1.2" },
  "LOINC:6301-6": { unit: "", range: "0.8 - 1.2" },
  BT: { unit: "min", range: "2 - 7" },
  "LOINC:11067-0": { unit: "min", range: "2 - 7" },
  CT: { unit: "min", range: "5 - 10" },
  "LOINC:3184-9": { unit: "min", range: "5 - 10" },
  "LOINC:882-1": { unit: "", range: "A / B / AB / O · Rh+/-" },
} satisfies Record<string, TestReference>;

const iron = {
  FERR: { unit: "ng/mL", range: "30 - 400" },
  "LOINC:2276-4": { unit: "ng/mL", range: "30 - 400" },
  FE: { unit: "ug/dL", range: "60 - 170" },
  "LOINC:2498-4": { unit: "ug/dL", range: "60 - 170" },
  TIBC: { unit: "ug/dL", range: "250 - 400" },
  "LOINC:2500-7": { unit: "ug/dL", range: "250 - 400" },
} satisfies Record<string, TestReference>;

const vitamins = {
  VITD: { unit: "ng/mL", range: "30 - 100" },
  "LOINC:1989-3": { unit: "ng/mL", range: "30 - 100" },
  B12: { unit: "pg/mL", range: "200 - 900" },
  "LOINC:2132-9": { unit: "pg/mL", range: "200 - 900" },
  FOL: { unit: "ng/mL", range: "3 - 17" },
  "LOINC:2284-8": { unit: "ng/mL", range: "3 - 17" },
} satisfies Record<string, TestReference>;

const urineStool = {
  URINE: { unit: "", range: "See report" },
  "LOINC:24357-6": { unit: "", range: "See report" },
  STOOL: { unit: "", range: "See report" },
  "LOINC:50175-9": { unit: "", range: "See report" },
  FOB: { unit: "", range: "Negative" },
  "LOINC:2335-8": { unit: "", range: "Negative" },
} satisfies Record<string, TestReference>;

const hormones = {
  UPT: { unit: "", range: "Negative / Positive" },
  "LOINC:2106-3": { unit: "", range: "Negative / Positive" },
  BHCG: { unit: "mIU/mL", range: "0 - 5" },
  "LOINC:2118-8": { unit: "mIU/mL", range: "0 - 5" },
  PRL: { unit: "ng/mL", range: "4 - 23" },
  "LOINC:2842-3": { unit: "ng/mL", range: "4 - 23" },
} satisfies Record<string, TestReference>;

const serology = {
  "LOINC:5195-3": { unit: "", range: "Non-reactive" },
  "LOINC:16935-9": { unit: "mIU/mL", range: ">= 10" },
  "LOINC:16128-1": { unit: "", range: "Non-reactive" },
  "LOINC:7918-6": { unit: "", range: "Non-reactive" },
  "LOINC:43896-9": { unit: "titer", range: "< 1:80" },
  "LOINC:5196-1": { unit: "titer", range: "< 1:80" },
  "LOINC:5292-8": { unit: "", range: "Non-reactive" },
} satisfies Record<string, TestReference>;

const microbiology = {
  "LOINC:94500-6": { unit: "", range: "Not detected" },
  "LOINC:96119-3": { unit: "", range: "Negative" },
  "LOINC:600-7": { unit: "", range: "No growth" },
  "LOINC:630-4": { unit: "", range: "No growth" },
  "LOINC:626-2": { unit: "", range: "No growth" },
  "LOINC:6460-0": { unit: "", range: "No growth" },
} satisfies Record<string, TestReference>;

const tumorMarkers = {
  PSA: { unit: "ng/mL", range: "0 - 4.0" },
  "LOINC:2857-1": { unit: "ng/mL", range: "0 - 4.0" },
} satisfies Record<string, TestReference>;

export const TEST_REFERENCE: Record<string, TestReference> = {
  ...diabetes,
  ...hematology,
  ...kidney,
  ...electrolytes,
  ...liver,
  ...lipid,
  ...thyroid,
  ...inflammation,
  ...immunology,
  ...coagulation,
  ...iron,
  ...vitamins,
  ...urineStool,
  ...hormones,
  ...serology,
  ...microbiology,
  ...tumorMarkers,
};

export const CDSS_TEST_CODE_TO_DISEASE: Record<string, CdssDisease> = {
  "CDSS-DIABETES": "diabetes",
  "CDSS-ANEMIA": "anemia",
  "CDSS-THALASSEMIA": "thalassemia",
  "CDSS-LIVER": "liver",
};
