import api from "./api";
import type { PaginatedResponse, PatientNotification } from "./types";

export async function getPatientNotifications(): Promise<PatientNotification[]> {
  const { data } = await api.get<PaginatedResponse<PatientNotification>>(
    "/patient/notifications",
  );

  return data.data;
}

export async function markNotificationRead(
  notificationId: number,
): Promise<PatientNotification> {
  const { data } = await api.patch<PatientNotification>(
    `/patient/notifications/${notificationId}/read`,
  );

  return data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch("/patient/notifications/read-all");
}
