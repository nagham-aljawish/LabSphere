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
  getPatientNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services";
import type { PatientNotification } from "../services/types";

interface PatientNotificationsContextValue {
  notifications: PatientNotification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const PatientNotificationsContext =
  createContext<PatientNotificationsContextValue | null>(null);

export function PatientNotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const isPatient = isAuthenticated && user?.role === "patient";

  const refreshNotifications = useCallback(async () => {
    if (!isPatient) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    try {
      const items = await getPatientNotifications();
      setNotifications(items);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isPatient]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    setNotifications((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target || target.is_read) {
        return prev;
      }

      return prev.map((item) =>
        item.id === id ? { ...item, is_read: true } : item,
      );
    });

    try {
      await markNotificationRead(id);
    } catch {
      await refreshNotifications();
    }
  }, [refreshNotifications]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));

    try {
      await markAllNotificationsRead();
    } catch {
      await refreshNotifications();
    }
  }, [refreshNotifications]);

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
    <PatientNotificationsContext.Provider value={value}>
      {children}
    </PatientNotificationsContext.Provider>
  );
}

export function usePatientNotifications() {
  const context = useContext(PatientNotificationsContext);

  if (!context) {
    throw new Error(
      "usePatientNotifications must be used within PatientNotificationsProvider",
    );
  }

  return context;
}

export function usePatientNotificationsOptional() {
  return useContext(PatientNotificationsContext);
}
