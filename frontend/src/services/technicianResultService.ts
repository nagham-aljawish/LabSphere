import api, { ApiError } from "./api";
import type { SubmitResultPayload } from "./types";

export interface CreatedResult {
  id: number;
  status: string;
  is_cdss?: boolean;
  cdss_disease?: string | null;
  cdss_outcome?: string | null;
  cdss_prediction?: string | null;
  cdss_confidence?: number | null;
  cdss_recommendation?: string | null;
}

/**
 * Create a lab result as a draft. When the payload carries `is_cdss`, the
 * backend runs the disease model and stores the prediction on the result.
 */
export async function createTechnicianResult(
  payload: SubmitResultPayload,
): Promise<CreatedResult> {
  const { data } = await api.post<CreatedResult>("/technician/results", payload);
  return data;
}

/** Move a draft/rejected result into the doctor's review queue. */
export async function submitResultForReview(
  resultId: number,
): Promise<CreatedResult> {
  const { data } = await api.patch<CreatedResult>(
    `/technician/results/${resultId}/submit-review`,
  );
  return data;
}

/**
 * Convenience helper for the result-entry screen: create the result and
 * immediately submit it for the doctor's review. Returns the created result so
 * the UI can show the CDSS prediction back to the technician.
 */
export async function submitTechnicianResult(
  payload: SubmitResultPayload,
): Promise<CreatedResult> {
  const created = await createTechnicianResult(payload);
  await submitResultForReview(created.id);
  return created;
}

export { ApiError };
