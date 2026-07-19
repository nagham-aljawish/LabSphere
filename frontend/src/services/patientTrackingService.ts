import api from "./api";
import type { PatientTrackingResponse } from "./types";

export async function getPatientTracking(): Promise<PatientTrackingResponse> {
  const { data } = await api.get<PatientTrackingResponse>("/patient/tracking");
  return data;
}
