import api from "./api";
import type { TechnicianNotification } from "./types";

export async function getTechnicianNotifications(): Promise<
  TechnicianNotification[]
> {
  const { data } = await api.get<TechnicianNotification[]>(
    "/technician/notifications",
  );
  return data;
}

export async function markTechnicianNotificationRead(
  notificationId: number,
): Promise<void> {
  await api.patch(`/technician/notifications/${notificationId}/read`);
}

export async function markAllTechnicianNotificationsRead(): Promise<void> {
  await api.patch("/technician/notifications/read-all");
}
