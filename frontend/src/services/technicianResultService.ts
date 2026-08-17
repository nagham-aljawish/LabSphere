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
  rejection_reason?: string | null;
}


export async function createTechnicianResult(
  payload: SubmitResultPayload,
): Promise<CreatedResult> {
  const { data } = await api.post<CreatedResult>("/technician/results", payload);
  return data;
}

/** Update an existing draft or rejected result. */
export async function updateTechnicianResult(
  resultId: number,
  payload: SubmitResultPayload,
): Promise<CreatedResult> {
  const { data } = await api.put<CreatedResult>(
    `/technician/results/${resultId}`,
    payload,
  );
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

export async function submitTechnicianResult(
  payload: SubmitResultPayload,
  existingResultId?: number | null,
): Promise<CreatedResult> {
  const saved = existingResultId
    ? await updateTechnicianResult(existingResultId, payload)
    : await createTechnicianResult(payload);

  await submitResultForReview(saved.id);
  return saved;
}

export { ApiError };
