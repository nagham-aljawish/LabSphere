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
  const { data } = await api.get<PaginatedResponse<DoctorReviewResult>>(
    "/doctor/results/pending",
  );
  return data.data;
}

export async function approveDoctorResult(resultId: number): Promise<void> {
  await api.patch(`/doctor/results/${resultId}/approve`);
}

export async function rejectDoctorResult(resultId: number): Promise<void> {
  await api.patch(`/doctor/results/${resultId}/reject`);
}

export { ApiError };
