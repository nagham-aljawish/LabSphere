/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import ResultDetailsTable from "../../components/patient/results/ResultDetailsTable";
import CdssPredictionCard from "../../components/cdss/CdssPredictionCard";
import { useAuth } from "../../context/AuthContext";
import { usePatientNotificationsOptional } from "../../context/PatientNotificationsContext";
import type { ResultDetails } from "../../services";
import {
  ApiError,
  downloadResult,
  getResultDetails,
  markResultAsViewed,
} from "../../services";

const ResultDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const notifications = usePatientNotificationsOptional();

  const [result, setResult] = useState<ResultDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!id) {
      setError("Invalid result");
      setLoading(false);
      return;
    }

    const resultId = Number(id);

    getResultDetails(resultId)
      .then((details) => {
        setResult(details);
        markResultAsViewed(resultId);
        void notifications?.markRelatedToResultAsRead(resultId);
      })
      .catch(() => setError("Result not found"))
      .finally(() => setLoading(false));
    // Mark-as-read helpers are stable enough; avoid re-fetching when notification state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate]);

  const handleDownload = async () => {
    if (!result) return;
    setDownloadError("");
    setDownloading(true);
    try {
      await downloadResult(result.id, result.reportName || "lab-result");
    } catch (err) {
      setDownloadError(
        err instanceof ApiError
          ? err.message
          : "Failed to download PDF. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
        <div className="mx-auto max-w-6xl px-6 text-center text-[#052836]">
          Loading result...
        </div>
      </section>
    );
  }

  if (error || !result) {
    return (
      <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
        <div className="mx-auto max-w-6xl px-6 text-center text-red-700">
          {error || "Result Not Found"}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#052836] transition hover:text-[#D62221]"
        >
          <FaArrowLeft />

          <span>Back</span>
        </button>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-3xl bg-[#052836] p-8 text-white">
          <div>
            <h1 className="text-3xl font-bold">{result.reportName}</h1>
            <p className="mt-2 text-white/80">FHIR-Based Laboratory Result</p>
          </div>

          {!result.paymentRequired && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-[#052836] transition hover:bg-sky-50 disabled:opacity-60"
              >
                <FaDownload />
                {downloading ? "Preparing PDF..." : "Download PDF"}
              </button>
              {downloadError && (
                <p className="mt-2 text-sm text-red-200">{downloadError}</p>
              )}
            </div>
          )}
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <div className="grid gap-4 md:grid-cols-2">
            <p>
              <strong>Patient:</strong> {result.patientName}
            </p>

            <p>
              <strong>Patient ID:</strong> {result.patientId}
            </p>

            <p>
              <strong>Order Number:</strong> {result.orderNumber}
            </p>

            <p>
              <strong>Date:</strong> {result.date}
            </p>
          </div>
        </div>

        {result.paymentRequired ? (
          <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-amber-800">Payment Required</h2>
            <p className="mt-2 text-sm text-amber-700">
              This result is ready, but it cannot be displayed until you complete
              the remaining payment.
            </p>
            <div className="mt-4 space-y-1 text-sm text-amber-800">
              <p>Remaining amount: ${result.payment?.remainingAmount ?? "0.00"}</p>
              {!!result.payment?.discountPercentage && (
                <p>
                  Support discount: {result.payment.discountPercentage}% (-$
                  {result.payment.discountAmount ?? "0.00"})
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate(`/home/payment?orderId=${result.orderId}`)}
              className="mt-5 rounded-xl bg-[#052836] px-5 py-2.5 font-semibold text-white transition hover:bg-[#041f2a]"
            >
              Complete Payment
            </button>
          </div>
        ) : (
          <>
            {result.isCdss && result.cdss && (
              <div className="mb-8">
                <CdssPredictionCard cdss={result.cdss} />
              </div>
            )}

            <ResultDetailsTable tests={result.tests} />
          </>
        )}
      </div>
    </section>
  );
};

export default ResultDetailsPage;
