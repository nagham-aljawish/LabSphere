import { Loader2 } from "lucide-react";
import { useTechnicianNotifications } from "../../../context/TechnicianNotificationsContext";

import NotificationCard from "../notifications/TechnicianNotificationCard";
import EmptyNotifications from "./EmptyNotifications";


const NotificationsList = () => {
  const { notifications, loading } = useTechnicianNotifications();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-[#052836]" size={28} />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyNotifications />;
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsList;
