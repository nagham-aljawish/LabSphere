import api, { ApiError } from "./api";
import type { ApiResultDetails, ApiResultSummary, Result, ResultDetails, TestItem } from "./types";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapStatus(index: number): Result["status"] {
  return index === 0 ? "new" : "last";
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
    date: formatDate(result.date),
    status: mapStatus(index),
  };
}

function mapDetails(result: ApiResultDetails): ResultDetails {
  return {
    id: result.id,
    reportName: result.reportName,
    patientName: result.patientName,
    orderNumber: result.orderNumber,
    patientId: result.patientId,
    date: formatDate(result.date),
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

export async function getMyResults(): Promise<Result[]> {
  const { data } = await api.get<ApiResultSummary[]>("/patient/results");
  return data.map(mapSummary);
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

    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Download failed", 500);
  }
}
