import { Bell, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import PatientNotificationCard from "../../components/patient/notifications/PatientNotificationCard";
import { usePatientNotifications } from "../../context/PatientNotificationsContext";

const PatientNotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markAllAsRead } =
    usePatientNotifications();

  return (
    <section className="min-h-screen bg-[#D7E4E9] pb-20 pt-28">
      <div className="mx-auto max-w-4xl px-6">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-4 text-sm font-medium text-[#052836]/70 transition hover:text-[#D62221]"
        >
          Back to Home
        </button>

        <div className="mb-8 rounded-3xl bg-[#052836] px-8 py-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Bell size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="mt-1 text-white/75">
                Updates about your support requests and lab activity
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-gray-600">
            {unreadCount > 0
              ? `${unreadCount} unread notification(s)`
              : "No unread notifications"}
          </p>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-[#052836]/15 px-4 py-2 text-sm font-medium text-[#052836] transition hover:bg-[#D7E4E9]"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#052836]" size={32} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center text-gray-500 shadow-md">
            <Bell className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="font-medium text-[#052836]">No notifications yet</p>
            <p className="mt-2 text-sm">
              You will receive a notification when your financial support request
              is reviewed.
            </p>
            <Link
              to="/home/financial-aid"
              className="mt-5 inline-block rounded-xl bg-[#D62221] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Request financial support
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <PatientNotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientNotificationsPage;
