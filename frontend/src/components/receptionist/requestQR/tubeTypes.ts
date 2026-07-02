export interface RequestTest {
  id: number;
  name: string;
  code?: string;
  category?: string;
  sampleType?: string;
  tubeType: string;
  tubeReason: string;
  quantity: number;
}


export interface TubeTypeDefinition {
  name: string;
  colorClass: string;
  hexColor: string;
  colorLabel: string;
  additive: string;
  useFor: string;
}

export interface TestTubeInput {
  code?: string;
  category?: string;
  sampleType?: string;
  name?: string;
}

export interface ResolvedTube {
  tubeType: string;
  reason: string;
}

export const TUBE_TYPES: Record<string, TubeTypeDefinition> = {
  EDTA: {
    name: "EDTA",
    colorClass: "bg-purple-500",
    hexColor: "#A855F7",
    colorLabel: "Purple",
    additive: "K2/K3 EDTA",
    useFor: "Hematology and whole-blood tests (CBC, Hb, blood group, HbA1c)",
  },
  SST: {
    name: "SST",
    colorClass: "bg-yellow-500",
    hexColor: "#F4B000",
    colorLabel: "Gold",
    additive: "Clot activator + gel separator",
    useFor: "Serum chemistry, hormones, serology, immunology, and liver tests",
  },
  Citrate: {
    name: "Citrate",
    colorClass: "bg-blue-500",
    hexColor: "#3B82F6",
    colorLabel: "Light Blue",
    additive: "Sodium citrate (9NC)",
    useFor: "Coagulation studies (PT, PTT, INR)",
  },
  Heparin: {
    name: "Heparin",
    colorClass: "bg-green-500",
    hexColor: "#22C55E",
    colorLabel: "Green",
    additive: "Lithium heparin",
    useFor: "Plasma electrolytes and tests requiring heparinized plasma",
  },
  Fluoride: {
    name: "Fluoride",
    colorClass: "bg-gray-400",
    hexColor: "#9CA3AF",
    colorLabel: "Gray",
    additive: "Sodium fluoride + potassium oxalate",
    useFor: "Glucose preservation (fasting/random blood sugar)",
  },
  Plain: {
    name: "Plain",
    colorClass: "bg-red-500",
    hexColor: "#EF4444",
    colorLabel: "Red",
    additive: "No additive",
    useFor: "Serum tests when no gel separator is required",
  },
  Urine: {
    name: "Urine",
    colorClass: "bg-amber-400",
    hexColor: "#FBBF24",
    colorLabel: "Amber",
    additive: "Sterile urine container",
    useFor: "Urinalysis and urine-based tests",
  },
  Stool: {
    name: "Stool",
    colorClass: "bg-orange-700",
    hexColor: "#C2410C",
    colorLabel: "Brown",
    additive: "Stool specimen container",
    useFor: "Stool analysis and occult blood",
  },
  "Culture Swab": {
    name: "Culture Swab",
    colorClass: "bg-teal-500",
    hexColor: "#14B8A6",
    colorLabel: "Teal",
    additive: "Viral/ bacterial transport medium",
    useFor: "Swab cultures (throat, nasopharyngeal)",
  },
  Sputum: {
    name: "Sputum",
    colorClass: "bg-slate-500",
    hexColor: "#64748B",
    colorLabel: "Slate",
    additive: "Sterile sputum container",
    useFor: "Sputum culture and microscopy",
  },
  "Blood Culture": {
    name: "Blood Culture",
    colorClass: "bg-indigo-900",
    hexColor: "#312E81",
    colorLabel: "Dark Purple",
    additive: "Blood culture bottle",
    useFor: "Aerobic/anaerobic blood culture",
  },
};

export const tubeTypeColors: Record<string, string> = Object.fromEntries(
  Object.values(TUBE_TYPES).map((tube) => [tube.name, tube.colorClass]),
);

const FLUORIDE_CODES = new Set(["FBS", "RBS", "LOINC:23390-0"]);
const EDTA_CODES = new Set([
  "CBC",
  "HGB",
  "ESR",
  "BT",
  "CT",
  "BLOOD-GROUP",
  "RETIC",
  "HBA1C",
]);
const CITRATE_CODES = new Set(["PT", "PTT", "INR"]);
const HEPARIN_CODES = new Set(["NA", "K", "CL"]);
const BLOOD_CULTURE_CODES = new Set(["BLOOD-CULT"]);
const URINE_CODES = new Set(["URINE", "URINE-CULT", "PREG-URINE"]);
const STOOL_CODES = new Set(["STOOL", "STOOL-OB"]);
const SWAB_CODES = new Set(["COVID-PCR", "COVID-AG", "THROAT-CULT"]);
const SPUTUM_CODES = new Set(["SPUTUM-CULT"]);

function normalizeSampleType(sampleType?: string): string {
  return sampleType?.trim().toLowerCase() ?? "";
}

function normalizeCategory(category?: string): string {
  return category?.trim().toLowerCase() ?? "";
}

function normalizeCode(code?: string): string {
  return code?.trim().toUpperCase() ?? "";
}

export function resolveTubeType(test: TestTubeInput): ResolvedTube {
  const code = normalizeCode(test.code);
  const category = normalizeCategory(test.category);
  const sampleType = normalizeSampleType(test.sampleType);

  if (sampleType.includes("urine") || URINE_CODES.has(code)) {
    return {
      tubeType: "Urine",
      reason: "Urine specimen requires a sterile urine container.",
    };
  }

  if (sampleType.includes("stool") || STOOL_CODES.has(code)) {
    return {
      tubeType: "Stool",
      reason: "Stool specimen requires a dedicated stool container.",
    };
  }

  if (
    sampleType.includes("swab") ||
    sampleType.includes("nasopharyngeal") ||
    SWAB_CODES.has(code)
  ) {
    return {
      tubeType: "Culture Swab",
      reason: "Swab samples need transport medium to preserve organisms.",
    };
  }

  if (sampleType.includes("sputum") || SPUTUM_CODES.has(code)) {
    return {
      tubeType: "Sputum",
      reason: "Sputum culture requires a sterile sputum container.",
    };
  }

  if (BLOOD_CULTURE_CODES.has(code)) {
    return {
      tubeType: "Blood Culture",
      reason: "Blood culture must be collected in a blood culture bottle.",
    };
  }

  if (CITRATE_CODES.has(code) || category === "coagulation") {
    return {
      tubeType: "Citrate",
      reason: "Coagulation tests require citrate anticoagulant (9:1 ratio).",
    };
  }

  if (FLUORIDE_CODES.has(code)) {
    return {
      tubeType: "Fluoride",
      reason: "Glucose tests need fluoride/oxalate to prevent glycolysis.",
    };
  }

  if (EDTA_CODES.has(code) || category === "hematology") {
    return {
      tubeType: "EDTA",
      reason: "Hematology tests require EDTA to preserve cell morphology.",
    };
  }

  if (HEPARIN_CODES.has(code) || category === "electrolytes") {
    return {
      tubeType: "Heparin",
      reason: "Electrolytes are best measured in lithium-heparin plasma.",
    };
  }

  if (category === "diabetes") {
    return {
      tubeType: "Fluoride",
      reason: "Diabetes monitoring samples need glucose stabilization.",
    };
  }

  if (
    category === "kidney function" ||
    category === "liver function" ||
    category === "lipid profile" ||
    category === "thyroid" ||
    category === "inflammation" ||
    category === "immunology" ||
    category === "iron studies" ||
    category === "vitamins" ||
    category === "hormones" ||
    category === "serology" ||
    category === "tumor markers" ||
    category === "chemistry" ||
    category === "microbiology"
  ) {
    return {
      tubeType: "SST",
      reason: "Serum separator tube is standard for this test category.",
    };
  }

  return {
    tubeType: "SST",
    reason: "Default serum tube for general blood chemistry.",
  };
}

export function buildRequestTest(input: {
  id: number;
  name: string;
  code?: string;
  category?: string;
  sampleType?: string;
  tubeType?: string;
  quantity?: number;
}): RequestTest {
  return {
    id: input.id,
    name: input.name,
    code: input.code,
    category: input.category,
    sampleType: input.sampleType,
    tubeType: input.tubeType ?? "",
    tubeReason: "",
    quantity: input.quantity ?? 1,
  };
}


export const TUBE_TYPE_OPTIONS = Object.keys(TUBE_TYPES);

export function getTubeHexColor(
  tubeType: string,
  tubeMap?: Record<string, TubeTypeDefinition>,
): string {
  if (tubeMap && tubeMap[tubeType]) {
    return tubeMap[tubeType].hexColor;
  }

  return TUBE_TYPES[tubeType]?.hexColor ?? "#94A3B8";
}