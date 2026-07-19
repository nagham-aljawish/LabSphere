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

  const handleOpen = async () => {
    await markAsRead(notification.id);

    if (notification.type === "qr_backlog") {
      navigate("/technician/orders");
      return;
    }

    if (notification.orderId) {
      const sampleQuery = notification.sampleId
        ? `&sampleId=${encodeURIComponent(notification.sampleId)}`
        : "";
      navigate(`/technician/scansample?orderId=${notification.orderId}${sampleQuery}`);
    }
  };

  const isBacklogAlert = notification.type === "qr_backlog";

  return (
    <div
      onClick={handleOpen}
      className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
        isBacklogAlert
          ? "border-amber-300 bg-amber-50"
          : notification.is_read
            ? "bg-white"
            : "border-cyan-200 bg-cyan-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-full p-3 text-white ${
            isBacklogAlert ? "bg-amber-500" : "bg-[#052836]"
          }`}
        >
          {isBacklogAlert ? <AlertTriangle size={18} /> : <Bell size={18} />}
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

          {isBacklogAlert ? (
            <button
              type="button"
              className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              Open QR Queue
            </button>
          ) : notification.orderId ? (
            <button
              type="button"
              className="mt-3 rounded-lg bg-[#052836] px-3 py-1.5 text-xs font-semibold text-white"
            >
              View Sample
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
