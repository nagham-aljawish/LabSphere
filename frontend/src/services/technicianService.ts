import api, { ApiError } from "./api";
import type { ApiOrderRecord, PaginatedResponse } from "./types";

export interface TechnicianSamplePayload {
  test_id: number;
  tube_type: string;
  quantity: number;
}

export async function getTechnicianOrders(
  filter: string = "all",
): Promise<ApiOrderRecord[]> {
  const { data } = await api.get<PaginatedResponse<ApiOrderRecord>>(
    "/technician/orders",
    {
      params: filter && filter !== "all" ? { filter } : undefined,
    },
  );

  return data.data;
}

export async function getTechnicianOrder(
  orderId: number,
): Promise<ApiOrderRecord> {
  const { data } = await api.get<ApiOrderRecord>(
    `/technician/orders/${orderId}`,
  );
  return data;
}

export interface TechnicianOrderTracking {
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  labResultStatus?: string | null;
  patientName: string;
  patientCode?: string;
  sampleId: string;
  tests: string[];
  currentStep: number;
  currentStepLabel: string;
  stages: Array<{
    id: number;
    title: string;
    status: "completed" | "current" | "pending";
  }>;
}

export async function getTechnicianOrderTracking(
  orderId: number,
): Promise<TechnicianOrderTracking> {
  const { data } = await api.get<TechnicianOrderTracking>(
    `/technician/orders/${orderId}/tracking`,
  );
  return data;
}

/** Resolve an order from a scanned QR / sample label code. */
export async function getTechnicianOrderByLabel(
  labelCode: string,
): Promise<ApiOrderRecord> {
  const { data } = await api.get<ApiOrderRecord>("/technician/orders", {
    params: { label_code: labelCode },
  });
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

export async function markTechnicianOrderReceived(
  orderId: number,
): Promise<void> {
  await api.patch(`/technician/orders/${orderId}/mark-received`);
}

export async function markTechnicianOrderProcessing(
  orderId: number,
): Promise<void> {
  await api.patch(`/technician/orders/${orderId}/mark-processing`);
}

export { ApiError };
