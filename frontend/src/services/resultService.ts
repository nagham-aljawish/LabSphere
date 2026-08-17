import api, { ApiError } from "./api";
import type {
  ApiResultDetails,
  ApiResultSummary,
  PaginatedResponse,
  Result,
  ResultDetails,
  TestItem,
} from "./types";

const VIEWED_RESULTS_KEY = "labsphere_viewed_result_ids";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getViewedResultIds(): Set<number> {
  try {
    const raw = localStorage.getItem(VIEWED_RESULTS_KEY);
    if (!raw) {
      return new Set();
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(
      parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0),
    );
  } catch {
    return new Set();
  }
}

export function markResultAsViewed(resultId: number): void {
  if (!Number.isFinite(resultId) || resultId <= 0) {
    return;
  }

  const viewed = getViewedResultIds();
  if (viewed.has(resultId)) {
    return;
  }

  viewed.add(resultId);
  localStorage.setItem(VIEWED_RESULTS_KEY, JSON.stringify([...viewed]));
}

function mapStatus(resultId: number, index: number): Result["status"] {
  // Newest report stays "New" only until the patient opens it.
  if (index === 0 && !getViewedResultIds().has(resultId)) {
    return "new";
  }

  return "last";
}

function capitalizeStatus(status: string): TestItem["status"] {
  const normalized = status.toLowerCase();
  const map: Record<string, TestItem["status"]> = {
    normal: "Normal",
    high: "High",
    low: "Low",
    critical: "Critical",
  };

  return map[normalized] ?? "Normal";
}

function mapSummary(result: ApiResultSummary, index: number): Result {
  return {
    id: result.id,
    title: result.reportName,
    orderId: result.orderId,
    orderNumber: result.orderNumber,
    date: formatDate(result.date),
    status: mapStatus(result.id, index),
    paymentRequired: result.paymentRequired ?? false,
    payment: result.payment,
  };
}

function mapDetails(result: ApiResultDetails): ResultDetails {
  return {
    id: result.id,
    reportName: result.reportName,
    patientName: result.patientName,
    orderId: result.orderId,
    orderNumber: result.orderNumber,
    patientId: result.patientId,
    date: formatDate(result.date),
    isCdss: result.isCdss ?? false,
    cdss: result.cdss ?? null,
    paymentRequired: result.paymentRequired ?? false,
    payment: result.payment,
    tests: result.tests.map((test) => ({
      name: test.name,
      code: test.code,
      result: test.unit ? `${test.result} ${test.unit}` : test.result,
      range: test.range,
      status: capitalizeStatus(test.status),
      preparationInstructions:
        test.preparationInstructions || "No special preparation required.",
    })),
  };
}

export async function getMyResults(page = 1): Promise<{
  results: Result[];
  currentPage: number;
  lastPage: number;
  total: number;
}> {
  const { data } = await api.get<PaginatedResponse<ApiResultSummary>>(
    "/patient/results",
    { params: { page, per_page: 15 } },
  );

  return {
    results: data.data.map(mapSummary),
    currentPage: data.current_page,
    lastPage: data.last_page ?? 1,
    total: data.total,
  };
}

export async function getResultDetails(id: number): Promise<ResultDetails> {
  const { data } = await api.get<ApiResultDetails>(`/patient/results/${id}`);
  return mapDetails(data);
}

export async function downloadResult(
  id: number,
  fileName: string,
): Promise<void> {
  try {
    const { data } = await api.get<Blob>(`/patient/results/${id}/download`, {
      responseType: "blob",
    });

    if (data.type === "application/json") {
      const body = JSON.parse(await data.text()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      throw new ApiError(body.message || "Download failed", 404, body.errors);
    }

    const safeName = fileName.replace(/\.pdf$/i, "") || "lab-result";
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Download failed", 500);
  }
}
