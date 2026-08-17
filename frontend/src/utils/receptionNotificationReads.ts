import type { ReceptionNotification } from "../services";

const storageKey = (userId: number) =>
  `labsphere.reception.notifications.read.${userId}`;

export const RECEPTION_NOTIFICATIONS_UPDATED =
  "reception-notifications-updated";

function notifyUpdated() {
  window.dispatchEvent(new Event(RECEPTION_NOTIFICATIONS_UPDATED));
}

export function getReceptionReadIds(userId: number): Set<number> {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((id): id is number => typeof id === "number"),
    );
  } catch {
    return new Set();
  }
}

function saveReceptionReadIds(userId: number, ids: Set<number>) {
  localStorage.setItem(storageKey(userId), JSON.stringify([...ids]));
  notifyUpdated();
}

export function applyReceptionReadState(
  userId: number,
  notifications: ReceptionNotification[],
): ReceptionNotification[] {
  const readIds = getReceptionReadIds(userId);
  return notifications.map((notification) => ({
    ...notification,
    isRead: notification.isRead || readIds.has(notification.id),
  }));
}

export function markReceptionNotificationRead(userId: number, id: number) {
  const ids = getReceptionReadIds(userId);
  ids.add(id);
  saveReceptionReadIds(userId, ids);
}

export function markAllReceptionNotificationsRead(
  userId: number,
  notificationIds: number[],
) {
  const ids = getReceptionReadIds(userId);
  notificationIds.forEach((id) => ids.add(id));
  saveReceptionReadIds(userId, ids);
}
