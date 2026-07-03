import api from "./api";
import type { ApiTest, LabTest } from "./types";

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
  const { data } = await api.get<ApiTest[]>("/tests");
  return data.map(mapTest);
}

export async function getTest(id: number): Promise<LabTest> {
  const { data } = await api.get<ApiTest>(`/tests/${id}`);
  return mapTest(data);
}
