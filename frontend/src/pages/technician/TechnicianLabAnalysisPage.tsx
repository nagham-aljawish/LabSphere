import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";

import AnalysisInfoSection from "../../components/technician/analysis/AnalysisInfoSection";
import AnalysisSidebar from "../../components/technician/analysis/AnalysisSidebar";
import TechnicianNotesCard from "../../components/technician/analysis/TechnicianNotesCard";

import { useTechnicianTracking } from "../../context/TechnicianTrackingContext";
import { CDSS_TEST_CODE_TO_DISEASE } from "../../data/testReference";
import {
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

function formatDateTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
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
    setLoading(true);
    setError("");

    Promise.all([
      getTechnicianOrder(orderId),
      markTechnicianOrderProcessing(orderId).catch(() => null),
    ])
      .then(([loaded]) => setOrder(loaded))
      .catch(() => setError("Failed to load order details for analysis."))
      .finally(() => setLoading(false));
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
      tests: order.tests?.map((test) => test.name) ?? [],
      analysisStatus: "In Progress" as const,
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
  }, [order, sampleId]);

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
        <>
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

          <TechnicianNotesCard />
        </>
      )}
    </div>
  );
};

export default TechnicianLabAnalysisPage;
