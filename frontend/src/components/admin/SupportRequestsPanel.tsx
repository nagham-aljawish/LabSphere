/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import SupportRequestCard from "./SupportRequestCard";
import {
  ApiError,
  getSupportRequests,
  updateSupportRequest,
  type FinancialAidRequest,
} from "../../services";

const statuses = ["pending", "under_review", "approved", "rejected", "all"];

interface SupportRequestsPanelProps {
  compact?: boolean;
  defaultFilter?: string;
  onUpdated?: () => void;
}

const SupportRequestsPanel = ({
  compact = false,
  defaultFilter = "pending",
  onUpdated,
}: SupportRequestsPanelProps) => {
  const [filter, setFilter] = useState(defaultFilter);
  const [requests, setRequests] = useState<FinancialAidRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    getSupportRequests(filter === "all" ? undefined : filter)
      .then(setRequests)
      .catch(() => setError("Failed to load support requests."))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleReview = async (
    requestId: number,
    status: "approved" | "rejected",
    discountPercentage?: number,
    adminNotes?: string,
  ) => {
    setProcessingId(requestId);
    setError("");

    try {
      await updateSupportRequest(requestId, {
        status,
        discount_percentage: status === "approved" ? discountPercentage : undefined,
        admin_notes: adminNotes,
      });

      if (filter === "pending" || filter === "under_review" || compact) {
        setRequests((prev) => prev.filter((item) => item.id !== requestId));
      } else {
        setRequests((prev) =>
          prev.map((item) =>
            item.id === requestId
              ? {
                  ...item,
                  status,
                  discount_percentage: String(discountPercentage ?? ""),
                }
              : item,
          ),
        );
      }

      onUpdated?.();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update support request.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const visibleRequests = compact ? requests.slice(0, 3) : requests;

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
                filter === status
                  ? "bg-cyan-500 text-white"
                  : "bg-white text-[#052836] shadow-sm"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#052836]" size={28} />
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="rounded-2xl bg-white/80 p-6 text-center text-sm text-gray-500">
          No support requests found.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleRequests.map((request) => (
            <SupportRequestCard
              key={request.id}
              request={request}
              processing={processingId === request.id}
              onApprove={(discount, notes) =>
                handleReview(request.id, "approved", discount, notes)
              }
              onReject={(notes) =>
                handleReview(request.id, "rejected", undefined, notes)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportRequestsPanel;
