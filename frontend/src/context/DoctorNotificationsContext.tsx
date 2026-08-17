/* eslint-disable react-refresh/only-export-components */

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
  getDoctorNotifications,
  markAllDoctorNotificationsRead,
  markDoctorNotificationRead,
  type DoctorNotification,
} from "../services/doctorNotificationService";

interface DoctorNotificationsContextValue {
  notifications: DoctorNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const DoctorNotificationsContext =
  createContext<DoctorNotificationsContextValue | null>(null);

export function DoctorNotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const isDoctor = user?.role === "doctor";

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!isAuthenticated || !isDoctor) {
      return;
    }

    if (!opts?.silent) {
      setLoading(true);
    }

    try {
      const items = await getDoctorNotifications();
      setNotifications(items);
    } catch {
      if (!opts?.silent) {
        setNotifications([]);
      }
    } finally {
      if (!opts?.silent) {
        setLoading(false);
      }
    }
  }, [isAuthenticated, isDoctor]);

  useEffect(() => {
    if (!isAuthenticated || !isDoctor) return;

    void refresh();

    const interval = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      void refresh({ silent: true });
    }, 60000);

    return () => window.clearInterval(interval);
  }, [isAuthenticated, isDoctor, refresh]);

  const markRead = useCallback(async (id: number) => {
    await markDoctorNotificationRead(id);
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_read: true } : item,
      ),
    );
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllDoctorNotificationsRead();
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
      refresh,
      markRead,
      markAllRead,
    }),
    [loading, markAllRead, markRead, notifications, refresh, unreadCount],
  );

  return (
    <DoctorNotificationsContext.Provider value={value}>
      {children}
    </DoctorNotificationsContext.Provider>
  );
}

export function useDoctorNotifications() {
  const context = useContext(DoctorNotificationsContext);
  if (!context) {
    throw new Error(
      "useDoctorNotifications must be used within DoctorNotificationsProvider",
    );
  }
  return context;
}

export function useDoctorNotificationsOptional() {
  return useContext(DoctorNotificationsContext);
}
