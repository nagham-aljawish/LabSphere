import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, FlaskConical, Loader2 } from "lucide-react";

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
  const navigate = useNavigate();
  const { setStage, setActiveSample, activeSampleId } = useTechnicianTracking();

  const [order, setOrder] = useState<ApiOrderRecord | null>(null);
  const [orderLoading, setOrderLoading] = useState(Boolean(orderId));

  const [entries, setEntries] = useState<EntryObservation[]>([]);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // The disease is dictated by the ordered CDSS test — not chosen by the tech.
  const cdssTest = useMemo(
    () => (order?.tests ?? []).find((t) => CDSS_TEST_CODE_TO_DISEASE[t.code ?? ""]),
    [order],
  );
  const cdssDisease: CdssDisease | null = cdssTest
    ? CDSS_TEST_CODE_TO_DISEASE[cdssTest.code ?? ""]
    : null;
  const isCdss = cdssDisease !== null;

  const selectedPanel = useMemo(
    () =>
      cdssDisease ? diseasePanels.find((p) => p.id === cdssDisease) : undefined,
    [cdssDisease],
  );

  // Standard mode shows exactly the (non-CDSS) tests ordered for this patient.
  const orderedTestRows = useMemo(
    () =>
      (order?.tests ?? [])
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
        }),
    [order],
  );

  // Load the real order this result belongs to.
  // Depend only on orderId — setStage/setActiveSample are stable (useCallback).
  // Re-running this after submit was wiping the success state and form values.
  useEffect(() => {
    const id = Number(orderId);
    if (!id) {
      setOrderLoading(false);
      return;
    }

    setStage(4);
    setOrderLoading(true);
    getTechnicianOrder(id)
      .then((loaded) => {
        setOrder(loaded);
        const sample =
          loaded.order_samples?.find((s) => s.label_code)?.label_code || "";
        if (sample) {
          setActiveSample(id, sample);
        } else {
          setActiveSample(id, activeSampleId || "");
        }
      })
      .catch(() => setError("Failed to load order."))
      .finally(() => setOrderLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reload when route orderId changes
  }, [orderId]);

  // Build input rows once per order / disease. Do NOT reset when `order` is
  // re-fetched with a new object identity (that cleared values after submit).
  useEffect(() => {
    if (!order) return;

    const source = isCdss
      ? (selectedPanel?.observations ?? [])
      : orderedTestRows;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntries(toEntries(source));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by order id + disease only
  }, [order?.id, cdssDisease]);

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

        const sample =
          order.order_samples?.find((s) => s.label_code) ??
          order.order_samples?.[0];

        const collectionSource =
          order.sent_to_technician_at || order.created_at;
        const collectionTime = collectionSource
          ? new Date(collectionSource).toLocaleString()
          : "";

        return {
          patientName: order.patient?.user?.name?.trim() || "",
          patientId: order.patient?.patient_code?.trim() || "",
          ageGender,
          // No requesting-physician field exists on orders — omit intentionally.
          physician: "",
          sampleId:
            sample?.label_code ||
            order.order_number ||
            "",
          sampleType:
            order.tests?.[0]?.sample_type ||
            "",
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
        : "Laboratory Report";

    setSubmitting(true);
    try {
      const payload =
        isCdss && cdssDisease
          ? {
              order_id: id,
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
          : { order_id: id, report_name: reportName, items };

      await submitTechnicianResult(payload);

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

      {submitted ? (
        <div className="space-y-6">
          <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-800">
            <p className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} />
              Results submitted to the doctor for review.
            </p>
            <p className="mt-1 text-sm">
              Please wait for the doctor to accept or reject these results
              {isCdss ? ". The doctor can also view the CDSS decision support." : "."}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={() =>
                navigate(
                  `/technician/sampletracking?orderId=${orderId}${
                    activeSampleId
                      ? `&sampleId=${encodeURIComponent(activeSampleId)}`
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
                    : `Enter the results for the ordered test${
                        orderedTestRows.length > 1 ? "s" : ""
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
              notes={notes}
              onNotesChange={setNotes}
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
            label="Submit Result"
          />
        </>
      )}
    </div>
  );
};

export default TechnicianResultEntryPage;
