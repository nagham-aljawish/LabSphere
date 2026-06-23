import api from "./api";
import type { ApiTest } from "./types";
import type { LabTest } from "../data/testsData";

function mapTest(test: ApiTest): LabTest {
  return {
    id: test.id,
    name: test.name,
    description: test.description || "No special preparation required.",
    price: Number(test.price),
    available: test.is_active,
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
