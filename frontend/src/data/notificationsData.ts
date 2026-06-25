export interface Notification {
  id: number;

  title: string;

  message: string;

  time: string;

  type: "payment" | "request" | "sample";

  isRead: boolean;
}

export const notificationsData: Notification[] = [
  {
    id: 1,
    title: "Payment Received",
    message: "Payment of $280 received for REQ-001 (John Smith)",
    time: "5 minutes ago",
    type: "payment",
    isRead: false,
  },

  {
    id: 2,
    title: "New Lab Request Created",
    message: "Lab request REQ-008 created for Sarah Miller",
    time: "15 minutes ago",
    type: "request",
    isRead: false,
  },

  {
    id: 3,
    title: "Sample Collected",
    message: "Samples collected for REQ-005 (James Brown)",
    time: "1 hour ago",
    type: "sample",
    isRead: false,
  },

  {
    id: 4,
    title: "Request Completed",
    message: "Results ready for REQ-003",
    time: "2 hours ago",
    type: "request",
    isRead: true,
  },
];