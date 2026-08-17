import { AlertTriangle, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { TechnicianNotification } from "../../../context/TechnicianNotificationsContext";
import { useTechnicianNotifications } from "../../../context/TechnicianNotificationsContext";

interface Props {
  notification: TechnicianNotification;
}

const NotificationCard = ({ notification }: Props) => {
  const { markAsRead } = useTechnicianNotifications();
  const navigate = useNavigate();
  const isRejected = notification.type === "technician_result_rejected";
  const canFix = isRejected && notification.needsRework !== false;

  const handleOpen = async () => {
    await markAsRead(notification.id);

    if (!notification.orderId) {
      return;
    }

    if (isRejected) {
      // Already resubmitted — stay on notifications; entry page is locked anyway.
      if (!canFix) {
        return;
      }
      navigate(`/technician/resultentry/${notification.orderId}`);
      return;
    }

    const sampleQuery = notification.sampleId
      ? `&sampleId=${encodeURIComponent(notification.sampleId)}`
      : "";
    navigate(`/technician/scansample?orderId=${notification.orderId}${sampleQuery}`);
  };

  return (
    <div
      onClick={handleOpen}
      className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
        isRejected && canFix ? "cursor-pointer" : isRejected ? "cursor-default" : "cursor-pointer"
      } ${
        isRejected
          ? notification.is_read || !canFix
            ? "border-amber-200 bg-amber-50/60"
            : "border-amber-300 bg-amber-50"
          : notification.is_read
            ? "bg-white"
            : "border-cyan-200 bg-cyan-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-full p-3 text-white ${
            isRejected ? "bg-amber-500" : "bg-[#052836]"
          }`}
        >
          {isRejected ? <AlertTriangle size={18} /> : <Bell size={18} />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#052836]">
              {notification.title}
            </h3>

            <span className="text-xs text-gray-500">
              {notification.created_at}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600">{notification.message}</p>

          {notification.orderId ? (
            isRejected && !canFix ? (
              <p className="mt-3 text-xs font-medium text-amber-800">
                Already resubmitted — waiting for doctor review. You can edit again
                only if the doctor rejects it.
              </p>
            ) : (
              <button
                type="button"
                className={`mt-3 rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${
                  isRejected ? "bg-amber-600" : "bg-[#052836]"
                }`}
              >
                {isRejected ? "Fix & Resubmit" : "View Sample"}
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
