import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

import PageHeaderBanner from "../../components/shared/PageHeaderBanner";
import CdssPredictionCard from "../../components/cdss/CdssPredictionCard";

import {
  ApiError,
  approveDoctorResult,
  getDoctorPendingResults,
  rejectDoctorResult,
} from "../../services";
import type { DoctorReviewItem, DoctorReviewResult } from "../../services/types";
import { useDoctorNotificationsOptional } from "../../context/DoctorNotificationsContext";

const statusBadge = (status: DoctorReviewItem["status"]) => {
  const map: Record<string, string> = {
    high: "bg-red-100 text-red-600",
    critical: "bg-red-200 text-red-800",
    low: "bg-blue-100 text-blue-600",
    normal: "bg-green-100 text-green-600",
  };
  return map[status] ?? "bg-green-100 text-green-600";
};

const DoctorResultsPage = () => {
  const [results, setResults] = useState<DoctorReviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const notifications = useDoctorNotificationsOptional();

  const load = () => {
    setLoading(true);
    getDoctorPendingResults()
      .then(setResults)
      .catch(() =>
        setError("Failed to load pending results. Please try again."),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    if (!notifications || notifications.unreadCount === 0) return;
    notifications.markAllRead().catch(() => {
      // Keep the page usable if mark-read fails.
    });
  }, [notifications]);

  const handleDecision = async (
    id: number,
    action: "approve" | "reject",
  ) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      if (action === "approve") {
        await approveDoctorResult(id);
        const message =
          "Result approved and sent to the patient. They can view it in Results and will receive a notification.";
        setSuccess(message);
        window.alert(message);
      } else {
        await rejectDoctorResult(id);
        setSuccess("Result rejected and returned for correction.");
      }
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : `Failed to ${action} the result.`,
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <PageHeaderBanner
        title="Result Review"
        description="Review laboratory results and CDSS decision support before approving."
      />

      {error && (
        <p className="rounded-2xl bg-red-100 px-4 py-3 text-red-700">{error}</p>
      )}

      {success && (
        <p className="rounded-2xl bg-emerald-100 px-4 py-3 text-emerald-800">
          {success}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#052836]" size={32} />
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-md">
          <p className="text-gray-600">No results are pending review.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {results.map((result) => (
            <div
              key={result.id}
              className="overflow-hidden rounded-3xl bg-white shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold text-[#052836]">
                    {result.reportName}
                    {result.isCdss && (
                      <span className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        <Sparkles size={12} /> CDSS
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <UserRound size={14} />
                    {result.patientName}
                    {result.patientCode ? ` · ${result.patientCode}` : ""}
                    {result.orderNumber ? ` · Order ${result.orderNumber}` : ""}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision(result.id, "reject")}
                    disabled={busyId === result.id}
                    className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                  <button
                    onClick={() => handleDecision(result.id, "approve")}
                    disabled={busyId === result.id}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {busyId === result.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                    Approve
                  </button>
                </div>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="min-w-full">
                    <thead className="bg-slate-100">
                      <tr className="text-sm font-semibold text-[#052836]">
                        <th className="px-4 py-3 text-left">Test</th>
                        <th className="px-4 py-3 text-center">Result</th>
                        <th className="px-4 py-3 text-center">Range</th>
                        <th className="px-4 py-3 text-center">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-4 py-3 font-medium text-[#052836]">
                            {item.testName}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.resultValue}
                            {item.unit ? ` ${item.unit}` : ""}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {item.normalRange ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge(
                                item.status,
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {result.isCdss && result.cdss ? (
                  <CdssPredictionCard cdss={result.cdss} compact />
                ) : (
                  <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-gray-400">
                    Standard result — no CDSS decision support.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DoctorResultsPage;
