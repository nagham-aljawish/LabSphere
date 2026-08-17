import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import AnalysisInfoSection from "../../components/technician/analysis/AnalysisInfoSection";
import AnalysisSidebar from "../../components/technician/analysis/AnalysisSidebar";

import { useTechnicianTracking } from "../../context/TechnicianTrackingContext";
import { formatDateTime } from "../../utils/datetime";
import { CDSS_TEST_CODE_TO_DISEASE } from "../../data/testReference";
import {
  ApiError,
  getTechnicianOrder,
  markTechnicianOrderProcessing,
  type ApiOrderRecord,
} from "../../services";

function calcAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function formatGender(gender?: string): string {
  if (!gender) return "";
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

function findSample(order: ApiOrderRecord, sampleId: string) {
  const normalized = sampleId.trim().toLowerCase();
  if (!normalized) {
    return order.order_samples?.[0] ?? null;
  }

  return (
    order.order_samples?.find(
      (sample) => sample.label_code?.toLowerCase() === normalized,
    ) ??
    order.order_samples?.[0] ??
    null
  );
}

function analysisAlreadyStarted(
  order: ApiOrderRecord,
  sampleId: string,
): boolean {
  const sample = findSample(order, sampleId);
  if (!sample) {
    return false;
  }

  if (
    ["analyzing", "pending_review", "approved", "rejected"].includes(
      sample.status ?? "",
    )
  ) {
    return true;
  }

  const results = order.lab_results ?? [];
  return results.some(
    (result) =>
      result.order_sample_id === sample.id &&
      ["draft", "rejected", "pending_review", "approved"].includes(result.status),
  );
}

const TechnicianLabAnalysisPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeOrderId, activeSampleId, setStage, setActiveSample } =
    useTechnicianTracking();

  const orderId =
    Number(searchParams.get("orderId") || 0) || activeOrderId || 0;
  const sampleId = searchParams.get("sampleId") || activeSampleId || "";
  const verifiedScan = searchParams.get("verifiedScan") === "1";

  const [order, setOrder] = useState<ApiOrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);

  useEffect(() => {
    if (!orderId || !verifiedScan) {
      const params = new URLSearchParams();
      params.set("next", "analysis");
      if (orderId) params.set("orderId", String(orderId));
      if (sampleId) params.set("sampleId", sampleId);
      navigate(`/technician/scansample?${params.toString()}`, { replace: true });
      return;
    }

    setStage(3);
    setActiveSample(orderId, sampleId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");
    setAlreadyAnalyzed(false);

    let cancelled = false;

    (async () => {
      try {
        const loaded = await getTechnicianOrder(orderId);

        if (analysisAlreadyStarted(loaded, sampleId)) {
          if (!cancelled) {
            setOrder(loaded);
            setAlreadyAnalyzed(true);
          }
          return;
        }

        try {
          await markTechnicianOrderProcessing(orderId, sampleId || undefined);
        } catch (err) {
          if (err instanceof ApiError && err.status === 422) {
            const refreshed = await getTechnicianOrder(orderId);
            if (!cancelled) {
              setOrder(refreshed);
              setAlreadyAnalyzed(true);
            }
            return;
          }
          throw err;
        }

        const refreshed = await getTechnicianOrder(orderId);
        if (!cancelled) {
          setOrder(refreshed);
          setAlreadyAnalyzed(false);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load order details for analysis.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    navigate,
    orderId,
    sampleId,
    setActiveSample,
    setStage,
    verifiedScan,
  ]);

  const analysisView = useMemo(() => {
    if (!order) return null;

    const matchedSample =
      order.order_samples?.find(
        (sample) =>
          sample.label_code?.toLowerCase() === sampleId.trim().toLowerCase(),
      ) ??
      order.order_samples?.find((sample) => !!sample.label_code) ??
      order.order_samples?.[0];

    const matchedTest = matchedSample?.test_id
      ? order.tests?.find((test) => test.id === matchedSample.test_id)
      : order.tests?.[0];

    const age = calcAge(order.patient?.date_of_birth);
    const cdssTest = (order.tests ?? []).find(
      (test) => CDSS_TEST_CODE_TO_DISEASE[test.code ?? ""],
    );
    const isCdss = Boolean(cdssTest);

    return {
      patient: {
        name: order.patient?.user?.name ?? "Unknown patient",
        id: order.patient?.patient_code ?? "",
        age,
        gender: formatGender(order.patient?.gender),
        physician: "",
      },
      sample: {
        id:
          sampleId ||
          matchedSample?.label_code ||
          `SMP-${String(order.id).padStart(4, "0")}`,
        type: matchedTest?.sample_type || order.tests?.[0]?.sample_type || "",
        tube: matchedSample?.tube_type || "",
        collectionTime: formatDateTime(
          order.sent_to_technician_at || order.created_at,
        ),
        priority:
          order.status === "pending" || order.status === "sample_collected"
            ? "Urgent"
            : "Routine",
        category: matchedTest?.category || order.tests?.[0]?.category || "",
      },
      tests: matchedTest
        ? [matchedTest.name]
        : (order.tests?.map((test) => test.name) ?? []),
      analysisStatus: alreadyAnalyzed
        ? ("Completed" as const)
        : ("In Progress" as const),
      aiSupport: {
        cdss: isCdss,
        deltaCheck: true,
        message: isCdss
          ? `${cdssTest?.name ?? "CDSS panel"} detected. Clinical Decision Support will run after result submission.`
          : "Standard laboratory panel. Enter results after analysis completes.",
        warning:
          "Automated checks compare entered values against reference ranges for this order.",
      },
    };
  }, [alreadyAnalyzed, order, sampleId]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Laboratory Analysis"
        description="Review patient information and monitor the current laboratory analysis process."
      />

      {error && (
        <p className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading || !analysisView ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#052836]" size={32} />
        </div>
      ) : (
        <div className="space-y-6">
          {alreadyAnalyzed && (
            <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-800">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={18} />
                Laboratory analysis already started for this sample.
              </p>
              <p className="mt-1 text-sm">
                Analysis can only be started once. Review details below, then
                continue to result entry.
              </p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <AnalysisInfoSection
              patient={analysisView.patient}
              sample={analysisView.sample}
              tests={analysisView.tests}
            />

            <AnalysisSidebar
              analysisStatus={analysisView.analysisStatus}
              aiSupport={analysisView.aiSupport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianLabAnalysisPage;
