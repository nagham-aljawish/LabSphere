/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import {
  getTechnicianNotifications,
  markAllTechnicianNotificationsRead,
  markTechnicianNotificationRead,
  type TechnicianNotification,
} from "../services";

export type { TechnicianNotification };

interface TechnicianNotificationsContextValue {
  notifications: TechnicianNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const TechnicianNotificationsContext =
  createContext<TechnicianNotificationsContextValue | null>(null);

export function TechnicianNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();

  const [notifications, setNotifications] = useState<TechnicianNotification[]>(
    [],
  );

  const [loading, setLoading] = useState(false);

  const isTechnician = isAuthenticated && user?.role === "technician";

  const formatRelative = (dateInput?: string) => {
    if (!dateInput) return "Just now";

    const created = new Date(dateInput).getTime();
    const now = Date.now();
    const minutes = Math.max(1, Math.round((now - created) / 60000));

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const refreshNotifications = useCallback(async () => {
    if (!isTechnician) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    try {
      const notificationsList = await getTechnicianNotifications();
      const mapped = notificationsList.map((item) => ({
        ...item,
        created_at: formatRelative(item.created_at),
      }));

      const pendingQrCount = notificationsList.filter(
        (item) => !item.is_read && item.type === "technician_sample",
      ).length;

      if (pendingQrCount >= 4) {
        mapped.unshift({
          id: -1,
          title: "QR Queue Alert",
          message: `You have ${pendingQrCount} pending QR samples to process.`,
          type: "qr_backlog",
          is_read: false,
          created_at: "Now",
        });
      }

      setNotifications(
        mapped.map((item) => ({
          ...item,
          created_at: item.created_at,
        })),
      );
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isTechnician]);

  useEffect(() => {
    refreshNotifications();
    const interval = window.setInterval(() => {
      refreshNotifications();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [refreshNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    if (id > 0) {
      await markTechnicianNotificationRead(id);
    }
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllTechnicianNotificationsRead();
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true })),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    ],
  );

  return (
    <TechnicianNotificationsContext.Provider value={value}>
      {children}
    </TechnicianNotificationsContext.Provider>
  );
}

export function useTechnicianNotifications() {
  const context = useContext(TechnicianNotificationsContext);

  if (!context) {
    throw new Error(
      "useTechnicianNotifications must be used within TechnicianNotificationsProvider",
    );
  }

  return context;
}

export function useTechnicianNotificationsOptional() {
  return useContext(TechnicianNotificationsContext);
}
