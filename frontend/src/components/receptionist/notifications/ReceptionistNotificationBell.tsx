import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { getReceptionDashboard } from "../../../services";

const ReceptionistNotificationBell = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "reception") {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getReceptionDashboard();
      setUnreadCount(
        data.notifications.filter((item) => !item.isRead).length,
      );
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshUnread();

    const interval = window.setInterval(() => {
      refreshUnread();
    }, 15000);

    const onFocus = () => {
      refreshUnread();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshUnread]);

  if (!isAuthenticated || user?.role !== "reception") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/receptionist/notifications")}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#052836] shadow-sm transition hover:bg-[#052836] hover:text-white"
      aria-label="Notifications"
      title={
        unreadCount > 0
          ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
          : "Notifications"
      }
    >
      <Bell size={18} />

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#D62221] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#D7E4E9]">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default ReceptionistNotificationBell;
