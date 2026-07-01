/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";

import PageHeader from "../../components/shared/PageHeader";
import NotificationCard from "../../components/receptionist/notifications/NotificationCard";
import { getReceptionDashboard, type ReceptionNotification } from "../../services";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<ReceptionNotification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    getReceptionDashboard()
      .then((data) => setNotifications(data.notifications))
      .catch(() => setNotifications([]));
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((item) => !item.isRead);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <PageHeader
        title="Notifications"
        description="View and manage system notifications"
      />

      <div className="rounded-3xl border bg-gradient-to-r from-slate-50 to-purple-50 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500 p-4 text-white">
              <Bell />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#052836]">Notifications</h2>
              <p className="text-gray-500">
                You have {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:bg-cyan-600 disabled:opacity-60"
          >
            <CheckCircle2 size={18} />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-4 shadow-md">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-5 py-3 font-medium ${
              activeTab === "all" ? "bg-cyan-500 text-white" : "bg-slate-100"
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`rounded-xl px-5 py-3 font-medium ${
              activeTab === "unread" ? "bg-cyan-500 text-white" : "bg-slate-100"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-md">
            No notifications yet.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default NotificationsPage;
