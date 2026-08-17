import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useTechnicianNotificationsOptional } from "../../../context/TechnicianNotificationsContext";

const TechnicianNotificationBell = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const notificationsContext = useTechnicianNotificationsOptional();
  const unreadCount = notificationsContext?.unreadCount ?? 0;

  if (!isAuthenticated || user?.role !== "technician") {
    return null;
  }

  const handleClick = () => {
    navigate("/technician/notifications");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#052836] shadow-sm transition hover:bg-[#052836] hover:text-white"
      aria-label="Notifications"
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

export default TechnicianNotificationBell;
