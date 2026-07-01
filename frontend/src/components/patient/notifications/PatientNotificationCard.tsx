import { Bell, HeartHandshake } from "lucide-react";

import type { PatientNotification } from "../../../services/types";

interface PatientNotificationCardProps {
  notification: PatientNotification;
}

const PatientNotificationCard = ({ notification }: PatientNotificationCardProps) => {
  const isUnread = !notification.is_read;

  return (
    <div
      className={`overflow-hidden rounded-3xl border shadow-sm ${
        isUnread ? "border-[#88D6E7] bg-white" : "border-gray-100 bg-white/90"
      }`}
    >
      <div className="flex">
        <div
          className={`w-1.5 shrink-0 ${
            isUnread ? "bg-[#D62221]" : "bg-transparent"
          }`}
        />

        <div className="flex flex-1 gap-4 p-5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              notification.type === "financial_aid"
                ? "bg-[#D62221]/10 text-[#D62221]"
                : "bg-cyan-50 text-cyan-600"
            }`}
          >
            {notification.type === "financial_aid" ? (
              <HeartHandshake size={22} />
            ) : (
              <Bell size={22} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-[#052836]">
                  {notification.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {notification.message}
                </p>
              </div>

              {isUnread && (
                <span className="mt-1 shrink-0 rounded-full bg-[#D62221] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  New
                </span>
              )}
            </div>

            <span className="mt-3 block text-xs text-gray-400">
              {new Date(notification.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientNotificationCard;
