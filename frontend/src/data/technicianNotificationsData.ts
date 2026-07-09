import type { TechnicianNotification } from "../context/TechnicianNotificationsContext";

export const technicianNotificationsMock: TechnicianNotification[] = [
  {
    id: 1,
    title: "New Sample Received",
    message: "Blood sample #A-1025 is ready for analysis.",
    created_at: "2 minutes ago",
    is_read: false,
  },
  {
    id: 2,
    title: "Urgent Request",
    message: "Patient #P-204 requires urgent CBC analysis.",
    created_at: "10 minutes ago",
    is_read: false,
  },
  {
    id: 3,
    title: "Sample Collected",
    message: "Urine sample #U-315 has been scanned successfully.",
    created_at: "35 minutes ago",
    is_read: true,
  },
  {
    id: 4,
    title: "Analysis Completed",
    message: "Biochemistry report has been completed.",
    created_at: "1 hour ago",
    is_read: true,
  },
  {
    id: 5,
    title: "New Order",
    message: "A new laboratory order has been assigned to you.",
    created_at: "2 hours ago",
    is_read: false,
  },
  {
    id: 6,
    title: "Result Approved",
    message: "Your submitted result has been approved by the doctor.",
    created_at: "Yesterday",
    is_read: true,
  },
];