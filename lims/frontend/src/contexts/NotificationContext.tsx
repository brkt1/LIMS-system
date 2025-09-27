import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { notificationAPI } from "../services/api";

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: "info" | "success" | "warning" | "error" | "urgent";
  priority: "low" | "medium" | "high" | "critical";
  is_read: boolean;
  is_global: boolean;
  recipient?: number;
  tenant?: string;
  action_url?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  addNotification: (
    notification: Omit<
      Notification,
      "id" | "created_at" | "updated_at" | "is_read"
    >
  ) => void;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load notifications");
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to mark notification as read"
      );
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to mark all notifications as read"
      );
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationAPI.delete(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete notification");
      console.error("Failed to delete notification:", err);
    }
  };

  const addNotification = (
    notification: Omit<
      Notification,
      "id" | "created_at" | "updated_at" | "is_read"
    >
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const clearError = () => {
    setError(null);
  };

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
