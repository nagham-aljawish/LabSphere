/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import StaffRequestCard from "./StaffRequestCard";
import {
  ApiError,
  getStaffRequests,
  updateStaffStatus,
  type AdminUserRecord,
} from "../../services";

const roleLabels: Record<string, string> = {
  doctor: "Doctor",
  technician: "Technician",
  reception: "Reception",
};

interface StaffRequestsPanelProps {
  compact?: boolean;
  onUpdated?: () => void;
}

const StaffRequestsPanel = ({
  compact = false,
  onUpdated,
}: StaffRequestsPanelProps) => {
  const [requests, setRequests] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadRequests = () => {
    setLoading(true);
    getStaffRequests("pending")
      .then(setRequests)
      .catch(() => setError("Failed to load staff registration requests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleReview = async (userId: number, status: "active" | "blocked") => {
    setProcessingId(userId);
    setError("");

    try {
      await updateStaffStatus(userId, { status });
      setRequests((prev) => prev.filter((item) => item.id !== userId));
      onUpdated?.();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update request.");
    } finally {
      setProcessingId(null);
    }
  };

  const visibleRequests = compact ? requests.slice(0, 3) : requests;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#052836]" size={28} />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      {visibleRequests.length === 0 ? (
        <div className="rounded-2xl bg-white/80 p-6 text-center text-sm text-gray-500">
          No pending staff registration requests.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleRequests.map((request) => (
            <StaffRequestCard
              key={request.id}
              name={request.name}
              email={request.email}
              phone={request.phone}
              role={roleLabels[request.role] ?? request.role}
              createdAt={request.created_at}
              processing={processingId === request.id}
              onApprove={() => handleReview(request.id, "active")}
              onReject={() => handleReview(request.id, "blocked")}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffRequestsPanel;
