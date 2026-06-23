import api from "./api";
import type { FinancialAidRequest } from "./types";

export interface FinancialAidPayload {
  full_name: string;
  phone?: string;
  reason: string;
  files?: File[];
}

export async function submitFinancialAid(
  payload: FinancialAidPayload,
): Promise<FinancialAidRequest> {
  const formData = new FormData();
  formData.append("full_name", payload.full_name);

  if (payload.phone) {
    formData.append("phone", payload.phone);
  }

  formData.append("reason", payload.reason);

  payload.files?.forEach((file) => {
    formData.append("files[]", file);
  });

  const { data } = await api.post<FinancialAidRequest>(
    "/financial-aid",
    formData,
  );
  return data;
}
