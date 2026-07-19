import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";

import { ApiError, downloadSupportFile, type FinancialAidRequest } from "../../services";

interface SupportRequestCardProps {
  request: FinancialAidRequest;
  processing?: boolean;
  onApprove: (discountPercentage: number, adminNotes?: string) => void;
  onReject: (adminNotes?: string) => void;
}

const SupportRequestCard = ({
  request,
  processing = false,
  onApprove,
  onReject,
}: SupportRequestCardProps) => {
  const [discount, setDiscount] = useState("30");
  const [notes, setNotes] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState("");

  const isPending =
    request.status === "pending" || request.status === "under_review";

  const handleDownload = async (fileId: number, fileName: string) => {
    setDownloadingId(fileId);
    setDownloadError("");

    try {
      const blob = await downloadSupportFile(request.id, fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(
        err instanceof ApiError ? err.message : "Failed to download file.",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-[#052836]">
            {request.full_name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {request.phone || "No phone"} •{" "}
            {new Date(request.created_at).toLocaleDateString()}
          </p>
          <p className="mt-4 text-gray-700">{request.reason}</p>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-[#052836]">
              Attached Documents
            </p>

            {request.files && request.files.length > 0 ? (
              <div className="space-y-2">
                {request.files.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => handleDownload(file.id, file.original_name)}
                    disabled={downloadingId === file.id}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100 disabled:opacity-60"
                  >
                    {downloadingId === file.id ? (
                      <Loader2 size={18} className="animate-spin text-cyan-600" />
                    ) : (
                      <FileText size={18} className="text-cyan-600" />
                    )}
                    <span className="truncate text-sm text-[#052836]">
                      {file.original_name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No documents attached</p>
            )}

            {downloadError && (
              <p className="mt-2 text-sm text-red-600">{downloadError}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#D62221]/10 px-3 py-1 text-xs font-medium text-[#D62221]">
              {request.status.replace("_", " ")}
            </span>
            {request.discount_percentage && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Discount: {request.discount_percentage}%
              </span>
            )}
          </div>

          {request.admin_notes && (
            <p className="mt-3 text-sm text-gray-500">
              Admin notes: {request.admin_notes}
            </p>
          )}
        </div>

        {isPending && (
          <div className="w-full space-y-4 lg:w-80 lg:flex-shrink-0">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#052836]">
                Discount Percentage (%)
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {[30, 50, 70].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDiscount(String(value))}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      Number(discount) === value
                        ? "bg-[#052836] text-white"
                        : "bg-slate-100 text-[#052836] hover:bg-slate-200"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-[#052836]"
              />
            </div>

            <textarea
              placeholder="Admin notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-[#052836]"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={processing}
                onClick={() => onReject(notes || undefined)}
                className="flex-1 rounded-xl border border-red-200 py-3 font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={processing || !discount}
                onClick={() => onApprove(Number(discount), notes || undefined)}
                className="flex-1 rounded-xl bg-[#D62221] py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {processing ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportRequestCard;
