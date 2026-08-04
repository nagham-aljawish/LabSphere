import type { CdssDisease } from "../services/types";

/**
 * Unit + reference range lookup keyed by the Test `code` stored in the backend
 * catalog (see database/seeders/TestSeeder.php). The `tests` table does not
 * carry unit/range, so the technician result-entry screen fills them from here
 * when rendering the actually-ordered tests. Unknown codes fall back to blank.
 */
export interface TestReference {
  unit: string;
  range: string;
}

export const TEST_REFERENCE: Record<string, TestReference> = {
  // Diabetes
  HBA1C: { unit: "%", range: "4.0 - 5.6" },
  FBS: { unit: "mg/dL", range: "70 - 99" },
  RBS: { unit: "mg/dL", range: "70 - 140" },
  "LOINC:23390-0": { unit: "mg/dL", range: "70 - 99" }, // Glucose

  // Hematology
  HGB: { unit: "g/dL", range: "12 - 16" },
  CBC: { unit: "x10³/uL", range: "4.0 - 10.0" },
  ESR: { unit: "mm/hr", range: "0 - 20" },
  RETIC: { unit: "%", range: "0.5 - 2.5" },

  // Kidney
  UREA: { unit: "mg/dL", range: "15 - 40" },
  BUN: { unit: "mg/dL", range: "7 - 20" },
  CREA: { unit: "mg/dL", range: "0.6 - 1.2" },

  // Electrolytes
  NA: { unit: "mmol/L", range: "135 - 145" },
  K: { unit: "mmol/L", range: "3.5 - 5.1" },
  CL: { unit: "mmol/L", range: "98 - 107" },
  CA: { unit: "mg/dL", range: "8.5 - 10.5" },
  MG: { unit: "mg/dL", range: "1.7 - 2.2" },
  PHOS: { unit: "mg/dL", range: "2.5 - 4.5" },
  UA: { unit: "mg/dL", range: "3.5 - 7.2" },

  // Liver Function
  ALT: { unit: "U/L", range: "7 - 56" },
  AST: { unit: "U/L", range: "10 - 40" },
  ALP: { unit: "U/L", range: "44 - 147" },
  GGT: { unit: "U/L", range: "9 - 48" },
  TBIL: { unit: "mg/dL", range: "0.2 - 1.2" },
  DBIL: { unit: "mg/dL", range: "0 - 0.3" },
  ALB: { unit: "g/dL", range: "3.5 - 5.5" },
  TP: { unit: "g/dL", range: "6.0 - 8.3" },

  // Lipid Profile
  CHOL: { unit: "mg/dL", range: "0 - 200" },
  TG: { unit: "mg/dL", range: "0 - 150" },
  HDL: { unit: "mg/dL", range: "40 - 60" },
  LDL: { unit: "mg/dL", range: "0 - 100" },

  // Thyroid
  TSH: { unit: "mIU/L", range: "0.4 - 4.0" },
  FT3: { unit: "pg/mL", range: "2.3 - 4.2" },
  FT4: { unit: "ng/dL", range: "0.8 - 1.8" },
};

/**
 * The dedicated orderable CDSS tests (see database/seeders/CdssTestSeeder.php),
 * mapping each test `code` 1:1 to its disease model. When one of these tests is
 * ordered, the result-entry screen locks to that disease's panel and runs the
 * CDSS on submit — the technician never picks the disease manually.
 */
export const CDSS_TEST_CODE_TO_DISEASE: Record<string, CdssDisease> = {
  "CDSS-DIABETES": "diabetes",
  "CDSS-ANEMIA": "anemia",
  "CDSS-THALASSEMIA": "thalassemia",
  "CDSS-LIVER": "liver",
};
