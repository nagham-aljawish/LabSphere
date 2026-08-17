import { AlertTriangle, Bell, FileText, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePatientNotifications } from "../../../context/PatientNotificationsContext";
import type { PatientNotification } from "../../../services/types";

interface PatientNotificationCardProps {
  notification: PatientNotification;
}

const PatientNotificationCard = ({
  notification,
}: PatientNotificationCardProps) => {
  const navigate = useNavigate();
  const { markAsRead } = usePatientNotifications();
  const isUnread = !notification.is_read;
  const isLabResult = notification.type === "lab_result";
  const isDeltaCheck = notification.type === "delta_check";
  const isFinancialAid =
    notification.type === "financial_aid" ||
    notification.type === "financial_aid_rejected";
  const isAidRejected = notification.type === "financial_aid_rejected";
  const resultPath =
    (isLabResult || isDeltaCheck) && notification.reference_id
      ? `/home/results/${notification.reference_id}`
      : isLabResult || isDeltaCheck
        ? "/home/results"
        : null;
  const aidPath = isFinancialAid ? "/home/financial-aid" : null;

  const iconWrapClass = isAidRejected
    ? "bg-red-50 text-red-600"
    : notification.type === "financial_aid"
      ? "bg-emerald-50 text-emerald-600"
      : isDeltaCheck
        ? "bg-amber-50 text-amber-600"
        : isLabResult
          ? "bg-emerald-50 text-emerald-600"
          : "bg-cyan-50 text-cyan-600";

  const handleOpen = async () => {
    if (isUnread) {
      await markAsRead(notification.id);
    }

    if (resultPath) {
      navigate(resultPath);
      return;
    }

    if (aidPath) {
      navigate(aidPath);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void handleOpen();
        }
      }}
      className={`cursor-pointer overflow-hidden rounded-3xl border shadow-sm transition hover:shadow-md ${
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
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconWrapClass}`}
          >
            {isFinancialAid ? (
              <HeartHandshake size={22} />
            ) : isDeltaCheck ? (
              <AlertTriangle size={22} />
            ) : isLabResult ? (
              <FileText size={22} />
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

                {resultPath && (
                  <span className="mt-3 inline-block text-sm font-semibold text-cyan-700">
                    {isDeltaCheck ? "View updated result" : "View result"}
                  </span>
                )}

                {aidPath && (
                  <span
                    className={`mt-3 inline-block text-sm font-semibold ${
                      isAidRejected ? "text-red-600" : "text-cyan-700"
                    }`}
                  >
                    View support request
                  </span>
                )}
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
