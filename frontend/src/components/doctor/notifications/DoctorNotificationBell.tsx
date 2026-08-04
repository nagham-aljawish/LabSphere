import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useDoctorNotificationsOptional } from "../../../context/DoctorNotificationsContext";

const DoctorNotificationBell = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const notificationsContext = useDoctorNotificationsOptional();
  const unreadCount = notificationsContext?.unreadCount ?? 0;

  if (!isAuthenticated || user?.role !== "doctor") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/doctor/results")}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#052836] shadow-sm transition hover:bg-[#052836] hover:text-white"
      aria-label="Notifications"
      title={
        unreadCount > 0
          ? `${unreadCount} result(s) awaiting review`
          : "Pending reviews"
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

export default DoctorNotificationBell;
