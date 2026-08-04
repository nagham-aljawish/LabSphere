import api from "./api";
import type { PaginatedResponse } from "./types";

export interface DoctorNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  reference_type?: string | null;
  reference_id?: number | null;
}

export async function getDoctorNotifications(): Promise<DoctorNotification[]> {
  const { data } = await api.get<PaginatedResponse<DoctorNotification>>(
    "/doctor/notifications",
  );
  return data.data;
}

export async function markDoctorNotificationRead(
  notificationId: number,
): Promise<DoctorNotification> {
  const { data } = await api.patch<DoctorNotification>(
    `/doctor/notifications/${notificationId}/read`,
  );
  return data;
}

export async function markAllDoctorNotificationsRead(): Promise<void> {
  await api.patch("/doctor/notifications/read-all");
}
