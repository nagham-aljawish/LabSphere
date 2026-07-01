import api, { ApiError } from "./api";
import type { ApiOrderRecord, PaginatedResponse } from "./types";

export interface TechnicianSamplePayload {
  test_id: number;
  tube_type: string;
  quantity: number;
}

export async function getTechnicianOrders(): Promise<ApiOrderRecord[]> {
  const { data } = await api.get<PaginatedResponse<ApiOrderRecord>>(
    "/technician/orders",
  );

  return data.data;
}

export async function getTechnicianOrder(orderId: number): Promise<ApiOrderRecord> {
  const { data } = await api.get<ApiOrderRecord>(`/technician/orders/${orderId}`);
  return data;
}

export async function assignTechnicianSamples(
  orderId: number,
  samples: TechnicianSamplePayload[],
): Promise<ApiOrderRecord> {
  const { data } = await api.post<{ order: ApiOrderRecord }>(
    `/technician/orders/${orderId}/samples`,
    { samples },
  );

  return data.order;
}

export { ApiError };
