import { FaDownload } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Result } from "../../../services";
import { ApiError, downloadResult } from "../../../services";

interface ResultRowProps {
  result: Result;
  highlightDownload?: boolean;
}

const ResultRow = ({ result, highlightDownload = false }: ResultRowProps) => {
  const navigate = useNavigate();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleViewDetails = () => {
    if (result.paymentRequired) {
      setShowPaymentPopup(true);
      return;
    }

    navigate(`/home/results/${result.id}`);
  };

  const handleDownload = async () => {
    setDownloadError("");

    if (result.paymentRequired) {
      setShowPaymentPopup(true);
      return;
    }

    setDownloading(true);
    try {
      await downloadResult(result.id, result.title || "lab-result");
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

  return (
    <>
      <tr
        className={`border-b border-[#AEE7F5] ${
          highlightDownload ? "bg-sky-50" : ""
        }`}
      >
        <td className="px-6 py-4 font-medium text-[#052836]">{result.title}</td>

        <td className="px-6 py-4">{result.date}</td>

        <td className="px-6 py-4">
          <span
            className={`rounded-lg px-4 py-1 text-sm font-medium
              ${
                result.status === "new"
                  ? "bg-[#052836] text-white"
                  : "bg-[#88D6E7] text-[#052836]"
              }
            `}
          >
            {result.status === "new" ? "New" : "Last"}
          </span>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleViewDetails}
                className="cursor-pointer rounded-lg border border-[#88D6E7] bg-white px-3 py-1 shadow transition"
              >
                View Details
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                title="Download PDF"
                className={`rounded p-2 text-white transition disabled:opacity-60 ${
                  highlightDownload
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-[#052836] hover:opacity-90"
                }`}
              >
                <FaDownload />
              </button>
            </div>
            {downloading && (
              <p className="text-xs text-slate-500">Preparing PDF...</p>
            )}
            {downloadError && (
              <p className="text-xs text-red-600">{downloadError}</p>
            )}
          </div>
        </td>
      </tr>

      {showPaymentPopup && (
        <tr className="hidden">
          <td colSpan={4}>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              onClick={() => setShowPaymentPopup(false)}
            >
              <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#052836]">
                  Payment Required
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  This result is ready, but cannot be viewed or downloaded until
                  you complete the remaining payment for order{" "}
                  {result.orderNumber}.
                </p>
                <p className="mt-3 text-sm font-semibold text-amber-700">
                  Remaining amount: ${result.payment?.remainingAmount ?? "0.00"}
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentPopup(false)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/home/payment?orderId=${result.orderId}`)
                    }
                    className="rounded-lg bg-[#052836] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ResultRow;
