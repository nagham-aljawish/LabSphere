import api, { ApiError } from "./api";
import type {
  DoctorDashboardData,
  DoctorReviewResult,
  PaginatedResponse,
} from "./types";

export async function getDoctorDashboard(): Promise<DoctorDashboardData> {
  const { data } = await api.get<DoctorDashboardData>("/doctor/dashboard");
  return data;
}

export async function getDoctorPendingResults(): Promise<DoctorReviewResult[]> {
  return getDoctorResults("pending");
}

export async function getDoctorResults(
  filter: "pending" | "approved" | "rejected" | "critical" = "pending",
): Promise<DoctorReviewResult[]> {
  const { data } = await api.get<PaginatedResponse<DoctorReviewResult>>(
    "/doctor/results",
    { params: { filter } },
  );
  return data.data;
}

export async function approveDoctorResult(resultId: number): Promise<void> {
  await api.patch(`/doctor/results/${resultId}/approve`);
}

export async function rejectDoctorResult(
  resultId: number,
  reason?: string,
): Promise<void> {
  await api.patch(`/doctor/results/${resultId}/reject`, {
    reason: reason?.trim() || null,
  });
}

export { ApiError };
