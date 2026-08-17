import api from "./api";
import type { ApiTest, LabTest } from "./types";

let testsCache: LabTest[] | null = null;
let testsCacheAt = 0;
const TESTS_CACHE_TTL_MS = 5 * 60 * 1000;

function mapTest(test: ApiTest): LabTest {
  return {
    id: test.id,
    name: test.name,
    code: test.code,

    description:
      test.description || "Laboratory diagnostic test.",

    preparationInstructions:
      test.preparation_instructions || "No special preparation required.",

    price: Number(test.price),
    available: test.is_active,
    category: test.category,
    sampleType: test.sample_type,
  };
}

export async function getTests(): Promise<LabTest[]> {
  if (testsCache && Date.now() - testsCacheAt < TESTS_CACHE_TTL_MS) {
    return testsCache;
  }

  const { data } = await api.get<ApiTest[]>("/tests");
  testsCache = data.map(mapTest);
  testsCacheAt = Date.now();
  return testsCache;
}

export async function getTest(id: number): Promise<LabTest> {
  const { data } = await api.get<ApiTest>(`/tests/${id}`);
  return mapTest(data);
}
