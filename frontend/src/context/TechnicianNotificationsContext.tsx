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
import { technicianNotificationsMock } from "../data/technicianNotificationsData";

export interface TechnicianNotification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

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

  const refreshNotifications = useCallback(async () => {
    if (!isTechnician) {
      setNotifications([]);
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setNotifications(technicianNotificationsMock);

    setLoading(false);
  }, [isTechnician]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
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
