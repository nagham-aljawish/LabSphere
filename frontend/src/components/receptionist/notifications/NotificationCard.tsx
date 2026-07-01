import { CheckCircle, FileText, Clock3 } from "lucide-react";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "payment" | "request" | "sample";
  isRead: boolean;
}

interface NotificationCardProps {
  notification: Notification;

  onMarkRead: (id: number) => void;
}

const NotificationCard = ({
  notification,
  onMarkRead,
}: NotificationCardProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case "payment":
        return <CheckCircle size={26} className="text-green-500" />;

      case "request":
        return <FileText size={26} className="text-purple-500" />;

      default:
        return <Clock3 size={26} className="text-blue-500" />;
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="rounded-2xl bg-slate-50 p-3">{getIcon()}</div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#052836]">{notification.title}</h3>

              {!notification.isRead && (
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
              )}
            </div>

            <p className="mt-1 text-gray-600">{notification.message}</p>

            <span className="mt-2 block text-sm text-gray-400">
              {notification.time}
            </span>
          </div>
        </div>

        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            className="rounded-xl bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-600 transition hover:bg-cyan-100"
          >
            Mark Read
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
