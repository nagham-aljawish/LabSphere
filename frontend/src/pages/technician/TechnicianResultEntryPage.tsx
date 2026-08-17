import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, FlaskConical, Loader2 } from "lucide-react";
import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import ResultHeader from "../../components/technician/result/ResultHeader";
import type { ResultHeaderInfo } from "../../components/technician/result/ResultHeader";
import ResultObservationTable, {
  computeFlag,
  flagToStatus,
  type EntryObservation,
} from "../../components/technician/result/ResultObservationTable";
import ResultActions from "../../components/technician/result/ResultActions";

import { diseasePanels } from "../../data/technicianDiseaseData";
import { TEST_REFERENCE, CDSS_TEST_CODE_TO_DISEASE } from "../../data/testReference";

import {
  ApiError,
  getTechnicianOrder,
  submitTechnicianResult,
} from "../../services";
import type {
  ApiOrderRecord,
  CdssDisease,
  ResultItemPayload,
} from "../../services/types";
import { useTechnicianTracking } from "../../context/TechnicianTrackingContext";
import { formatDateTime } from "../../utils/datetime";

const DISEASE_LABELS: Record<CdssDisease, string> = {
  diabetes: "Diabetes",
  anemia: "Anemia",
  thalassemia: "Thalassemia",
  liver: "Liver Disease",
};

const toEntries = (
  source: {
    id: number;
    testName: string;
    loinc: string;
    unit: string;
    referenceRange: string;
    feature?: string;
  }[],
): EntryObservation[] =>
  source.map((o) => ({
    id: o.id,
    testName: o.testName,
    loinc: o.loinc,
    unit: o.unit,
    referenceRange: o.referenceRange,
    feature: o.feature,
    value: "",
  }));

const TechnicianResultEntryPage = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setStage, setActiveSample, activeSampleId } = useTechnicianTracking();

  const sampleIdParam = searchParams.get("sampleId") || activeSampleId || "";

  const [order, setOrder] = useState<ApiOrderRecord | null>(null);
  const [orderLoading, setOrderLoading] = useState(Boolean(orderId));
  const [existingResultId, setExistingResultId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const [entries, setEntries] = useState<EntryObservation[]>([]);
  /** True when result is already pending_review/approved — no second edit until reject. */
  const [lockedAfterSubmit, setLockedAfterSubmit] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const matchedSample = useMemo(() => {
    if (!order) return null;
    const normalized = sampleIdParam.trim().toLowerCase();
    if (!normalized) return order.order_samples?.[0] ?? null;
    return (
      order.order_samples?.find(
        (sample) => sample.label_code?.toLowerCase() === normalized,
      ) ??
      order.order_samples?.[0] ??
      null
    );
  }, [order, sampleIdParam]);

  // The disease is dictated by the ordered CDSS test — not chosen by the tech.
  const cdssTest = useMemo(() => {
    if (!order) return undefined;
    if (matchedSample?.test_id) {
      const sampleTest = order.tests?.find((t) => t.id === matchedSample.test_id);
      if (sampleTest && CDSS_TEST_CODE_TO_DISEASE[sampleTest.code ?? ""]) {
        return sampleTest;
      }
      // Non-CDSS sample — don't pull another CDSS test from the order.
      return undefined;
    }
    return (order.tests ?? []).find((t) => CDSS_TEST_CODE_TO_DISEASE[t.code ?? ""]);
  }, [order, matchedSample]);
  const cdssDisease: CdssDisease | null = cdssTest
    ? CDSS_TEST_CODE_TO_DISEASE[cdssTest.code ?? ""]
    : null;
  const isCdss = cdssDisease !== null;

  const selectedPanel = useMemo(
    () =>
      cdssDisease ? diseasePanels.find((p) => p.id === cdssDisease) : undefined,
    [cdssDisease],
  );

  // Standard mode: enter results for the scanned sample's test only.
  const orderedTestRows = useMemo(() => {
    const tests = order?.tests ?? [];
    const scoped = matchedSample?.test_id
      ? tests.filter((t) => t.id === matchedSample.test_id)
      : tests;

    return scoped
      .filter((t) => !CDSS_TEST_CODE_TO_DISEASE[t.code ?? ""])
      .map((t) => {
        const ref = TEST_REFERENCE[t.code ?? ""];
        return {
          id: t.id,
          testName: t.name,
          loinc: t.code ?? "",
          unit: ref?.unit ?? "",
          referenceRange: ref?.range ?? "",
        };
      });
  }, [order, matchedSample]);

  
  useEffect(() => {
    const id = Number(orderId);
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderLoading(false);
      return;
    }

    setStage(4);
    setOrderLoading(true);
    getTechnicianOrder(id)
      .then((loaded) => {
        setOrder(loaded);
        const matched =
          loaded.order_samples?.find(
            (s) =>
              s.label_code?.toLowerCase() ===
              sampleIdParam.trim().toLowerCase(),
          ) ?? loaded.order_samples?.find((s) => s.label_code);

        const sample = matched?.label_code || sampleIdParam || "";
        setActiveSample(id, sample);
      })
      .catch(() => setError("Failed to load order."))
      .finally(() => setOrderLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reload when route orderId / sample changes
  }, [orderId, sampleIdParam]);

  // Build input rows once per order / sample / disease, and prefill draft/rejected values.
  useEffect(() => {
    if (!order) return;

    const source = isCdss
      ? (selectedPanel?.observations ?? [])
      : orderedTestRows;

    const samplePk = matchedSample?.id;
    const results = (order.lab_results ?? []).filter((result) =>
      samplePk
        ? result.order_sample_id === samplePk ||
          (result.order_sample_id == null &&
            (order.order_samples?.length ?? 0) <= 1)
        : true,
    );

    const editable = results
      .filter((result) => result.status === "draft" || result.status === "rejected")
      .sort((a, b) => b.id - a.id)[0];

    const awaitingDoctor = !editable
      && results.some(
        (result) =>
          result.status === "pending_review" || result.status === "approved",
      );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLockedAfterSubmit(awaitingDoctor);

    if (awaitingDoctor) {
     
      setEntries([]);
      
      setExistingResultId(null);
      setRejectionReason(null);
      setSubmitted(false);
      return;
    }

    const previousItems = editable?.items ?? [];

    const nextEntries = toEntries(source).map((entry) => {
      const previous =
        previousItems.find(
          (item) =>
            (item.test_code &&
              entry.loinc &&
              item.test_code.toLowerCase() === entry.loinc.toLowerCase()) ||
            item.test_name.toLowerCase() === entry.testName.toLowerCase(),
        ) ?? null;

      return previous
        ? { ...entry, value: String(previous.result_value ?? "") }
        : entry;
    });

   
    setEntries(nextEntries);
    
    setExistingResultId(editable?.id ?? null);
    
    setRejectionReason(
      editable?.status === "rejected"
        ? editable.rejection_reason?.trim() ||
            "The doctor rejected this result. Please correct and resubmit."
        : null,
    );
    
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by order/sample/disease
  }, [order?.id, matchedSample?.id, cdssDisease, orderedTestRows.length]);

  const handleValueChange = (id: number, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, value } : e)));
  };

  const headerInfo: ResultHeaderInfo | undefined = order
    ? (() => {
        const dob = order.patient?.date_of_birth;
        let age: number | null = null;
        if (dob) {
          const birth = new Date(dob);
          if (!Number.isNaN(birth.getTime())) {
            const today = new Date();
            age = today.getFullYear() - birth.getFullYear();
            const md = today.getMonth() - birth.getMonth();
            if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) {
              age -= 1;
            }
          }
        }

        const gender = order.patient?.gender
          ? order.patient.gender.charAt(0).toUpperCase() +
            order.patient.gender.slice(1).toLowerCase()
          : "";
        const ageGender = [age != null ? `${age} yrs` : "", gender]
          .filter(Boolean)
          .join(" / ");

        const sample = matchedSample;

        const collectionSource =
          order.sent_to_technician_at || order.created_at;
        const collectionTime = formatDateTime(collectionSource);

        const sampleTest = sample?.test_id
          ? order.tests?.find((t) => t.id === sample.test_id)
          : order.tests?.[0];

        return {
          patientName: order.patient?.user?.name?.trim() || "",
          patientId: order.patient?.patient_code?.trim() || "",
          ageGender,
          // No requesting-physician field exists on orders — omit intentionally.
          physician: "",
          sampleId:
            sample?.label_code ||
            sampleIdParam ||
            order.order_number ||
            "",
          sampleType: sampleTest?.sample_type || "",
          tubeType: sample?.tube_type || "",
          collectionTime,
          priority:
            order.status === "pending" || order.status === "sample_collected"
              ? "Urgent"
              : "Routine",
        };
      })()
    : undefined;

  // Submit is only enabled once every field of the ordered test is filled.
  const allFilled =
    entries.length > 0 && entries.every((e) => e.value.trim() !== "");

  const handleSubmit = async () => {
    setError("");

    const id = Number(orderId);
    if (!id) {
      setError("No order selected. Open result entry from an order.");
      return;
    }

    if (!allFilled) {
      setError("Please enter a value for every field before submitting.");
      return;
    }

    const items: ResultItemPayload[] = entries.map((e) => ({
      test_name: e.testName,
      test_code: e.loinc || null,
      result_value: e.value,
      unit: e.unit || null,
      normal_range: e.referenceRange || null,
      status: flagToStatus(computeFlag(e.value, e.referenceRange)),
    }));

    const reportName =
      isCdss && cdssDisease
        ? `${DISEASE_LABELS[cdssDisease]} — CDSS Report`
        : orderedTestRows[0]?.testName
          ? `${orderedTestRows[0].testName} Report`
          : "Laboratory Report";

    setSubmitting(true);
    try {
      const sampleMeta = {
        order_sample_id: matchedSample?.id ?? null,
        label_code: matchedSample?.label_code || sampleIdParam || null,
      };

      const payload =
        isCdss && cdssDisease
          ? {
              order_id: id,
              ...sampleMeta,
              report_name: reportName,
              items,
              is_cdss: true as const,
              cdss_disease: cdssDisease,
              cdss_features: entries.reduce<Record<string, number>>((acc, e) => {
                if (e.feature && !Number.isNaN(Number(e.value))) {
                  acc[e.feature] = Number(e.value);
                }
                return acc;
              }, {}),
            }
          : {
              order_id: id,
              ...sampleMeta,
              report_name: reportName,
              items,
            };

      await submitTechnicianResult(payload, existingResultId);

      // Same step the patient sees once status is pending_review.
      setStage(5);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to submit results. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (orderLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#052836]" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Result Entry"
        description="Enter laboratory observations for the ordered test."
      />

      {!orderId && (
        <p className="rounded-2xl bg-amber-100 px-4 py-3 text-amber-800">
          No order is linked to this screen. Open result entry from an order to
          submit results.
        </p>
      )}

      {error && (
        <p className="rounded-2xl bg-red-100 px-4 py-3 text-red-700">{error}</p>
      )}

      {submitted || lockedAfterSubmit ? (
        <div className="space-y-6">
          <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-800">
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} />
              {lockedAfterSubmit && !submitted
                ? "Results already submitted — editing is locked."
                : "Results submitted to the doctor for review."}
            </p>
            <p className="mt-1 text-sm">
              You can edit again only if the doctor rejects these results
              {isCdss ? ". The doctor can also view the CDSS decision support." : "."}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() =>
                navigate(
                  `/technician/sampletracking?orderId=${orderId}${
                    sampleIdParam || activeSampleId
                      ? `&sampleId=${encodeURIComponent(sampleIdParam || activeSampleId)}`
                      : ""
                  }`,
                )
              }
              className="rounded-xl border border-[#052836] px-6 py-3 font-semibold text-[#052836] transition hover:bg-[#052836] hover:text-white"
            >
              View Tracking
            </button>
            <button
              onClick={() => navigate("/technician/orders")}
              className="rounded-xl bg-[#052836] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Back to Orders
            </button>
          </div>
        </div>
      ) : (
        <>
          <ResultHeader info={headerInfo} />

          {rejectionReason && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-900">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle size={18} />
                Rejected by doctor — correction required
              </p>
              <p className="mt-1 text-sm">{rejectionReason}</p>
            </div>
          )}

          {orderId && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm">
              <span className="rounded-full bg-sky-100 p-2 text-sky-700">
                <FlaskConical size={18} />
              </span>
              <div className="flex-1">
                <p className="font-bold text-[#052836]">Result Entry</p>
                <p className="text-sm text-gray-500">
                  {cdssTest
                    ? `Ordered test: ${cdssTest.name}. Enter all values, then submit for doctor review.`
                    : `Enter the results for ${
                        orderedTestRows[0]?.testName ?? "this sample"
                      }.`}
                </p>
              </div>
            </div>
          )}

          {orderId && entries.length === 0 ? (
            <p className="rounded-2xl bg-amber-100 px-4 py-3 text-amber-800">
              This order has no tests to enter results for.
            </p>
          ) : (
            <ResultObservationTable
              observations={entries}
              onValueChange={handleValueChange}
            />
          )}

          {!allFilled && entries.length > 0 && (
            <p className="text-right text-sm text-gray-500">
              Enter a value for every field to enable submission.
            </p>
          )}

          <ResultActions
            onSubmit={handleSubmit}
            loading={submitting}
            disabled={!orderId || !allFilled}
            label={rejectionReason ? "Resubmit Result" : "Submit Result"}
          />
        </>
      )}
    </div>
  );
};

export default TechnicianResultEntryPage;
