import { useNavigate } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { usePatientNotifications } from "../../../context/PatientNotificationsContext";
import PatientNotificationCard from "./PatientNotificationCard";

const PatientNotificationsSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { notifications, unreadCount, loading, markAllAsRead } =
    usePatientNotifications();

  const handleViewAll = async () => {
    if (unreadCount > 0) {
      await markAllAsRead();
    }

    navigate("/home/notifications");
  };

  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }

  const recentNotifications = notifications.slice(0, 3);

  return (
    <section className="bg-[#D7E4E9] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="rounded-3xl bg-white p-6 shadow-md sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#052836] text-white">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#052836]">Notifications</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification(s)`
                    : "You are all caught up"}
                </p>
              </div>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleViewAll}
                className="rounded-xl bg-[#052836] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                View all
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#052836]" size={28} />
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="rounded-2xl bg-[#D7E4E9] p-8 text-center text-gray-500">
              No notifications yet. You will be notified when your support
              request is reviewed.
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <PatientNotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PatientNotificationsSection;
