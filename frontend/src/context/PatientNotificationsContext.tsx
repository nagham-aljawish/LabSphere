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
  markRelatedToResultAsRead: (resultId: number) => Promise<void>;
}

const PatientNotificationsContext =
  createContext<PatientNotificationsContextValue | null>(null);

export function PatientNotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const isPatient = isAuthenticated && user?.role === "patient";

  const refreshNotifications = useCallback(async (opts?: { silent?: boolean }) => {
    if (!isPatient) {
      return;
    }

    if (!opts?.silent) {
      setLoading(true);
    }

    try {
      const items = await getPatientNotifications();
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
  }, [isPatient]);

  useEffect(() => {
    if (!isPatient) {
      return;
    }

    void refreshNotifications();

    const interval = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      void refreshNotifications({ silent: true });
    }, 60000);

    return () => window.clearInterval(interval);
  }, [isPatient, refreshNotifications]);

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

  const markRelatedToResultAsRead = useCallback(
    async (resultId: number) => {
      let items = notifications;

      if (items.length === 0) {
        try {
          items = await getPatientNotifications();
          setNotifications(items);
        } catch {
          return;
        }
      }

      const related = items.filter(
        (item) =>
          !item.is_read &&
          item.reference_id === resultId &&
          (item.type === "lab_result" || item.type === "delta_check"),
      );

      if (related.length === 0) {
        return;
      }

      await Promise.all(related.map((item) => markAsRead(item.id)));
    },
    [markAsRead, notifications],
  );

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
      markRelatedToResultAsRead,
    }),
    [
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      markRelatedToResultAsRead,
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
