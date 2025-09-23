import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { notificationAPI } from "../services/api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  category?: string;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read">
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

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(parseInt(id));
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
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
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) =>
          notificationAPI.markAsRead(parseInt(n.id))
        )
      );
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Failed to mark all notifications as read"
      );
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Assuming there's a delete endpoint
      // await notificationAPI.delete(parseInt(id));
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete notification");
      console.error("Failed to delete notification:", err);
    }
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
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
