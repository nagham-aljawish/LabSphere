import { useTechnicianNotifications } from "../../../context/TechnicianNotificationsContext";

import NotificationCard from "../notifications/TechnicianNotificationCard";
import EmptyNotifications from "./EmptyNotifications";


const NotificationsList = () => {
  const { notifications } = useTechnicianNotifications();

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
