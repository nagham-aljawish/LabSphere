import { Bell } from "lucide-react";

import type { TechnicianNotification } from "../../../context/TechnicianNotificationsContext";
import { useTechnicianNotifications } from "../../../context/TechnicianNotificationsContext";

interface Props {
  notification: TechnicianNotification;
}

const NotificationCard = ({ notification }: Props) => {
  const { markAsRead } = useTechnicianNotifications();

  return (
    <div
      onClick={() => markAsRead(notification.id)}
      className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
        notification.is_read ? "bg-white" : "border-cyan-200 bg-cyan-50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-[#052836] p-3 text-white">
          <Bell size={18} />
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
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
