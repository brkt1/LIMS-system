import type { ReactNode } from "react";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { notificationAPI } from "../services/api";
import { useAuth } from "./AuthContext";

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
  // Global notification methods
  sendGlobalNotification: (data: GlobalNotificationData) => Promise<boolean>;
  sendToRoles: (data: RoleNotificationData) => Promise<boolean>;
  sendToTenants: (data: TenantNotificationData) => Promise<boolean>;
  sendMaintenanceAlert: (data: MaintenanceAlertData) => Promise<boolean>;
  sendSecurityAlert: (data: SecurityAlertData) => Promise<boolean>;
  // Real-time updates
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

interface GlobalNotificationData {
  title: string;
  message: string;
  notification_type?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  target_audience?: 'all' | 'roles' | 'tenants';
  target_roles?: string[];
  target_tenants?: string[];
  action_url?: string;
  expires_in_hours?: number;
}

interface RoleNotificationData {
  title: string;
  message: string;
  roles: string[];
  notification_type?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  action_url?: string;
  expires_in_hours?: number;
}

interface TenantNotificationData {
  title: string;
  message: string;
  tenants: string[];
  notification_type?: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  action_url?: string;
  expires_in_hours?: number;
}

interface MaintenanceAlertData {
  title: string;
  message: string;
  maintenance_type?: 'scheduled' | 'emergency' | 'planned';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  affected_services?: string[];
}

interface SecurityAlertData {
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
  action_required?: boolean;
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
  const [isPolling, setIsPolling] = useState(false);
  const { user } = useAuth();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Global notification methods
  const sendGlobalNotification = useCallback(async (data: GlobalNotificationData): Promise<boolean> => {
    try {
      const response = await notificationAPI.sendGlobal(data);
      if (response.status === 201) {
        // Reload notifications to show the new one
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send global notification");
      console.error("Failed to send global notification:", err);
      return false;
    }
  }, []);

  const sendToRoles = useCallback(async (data: RoleNotificationData): Promise<boolean> => {
    try {
      const response = await notificationAPI.sendToRoles(data);
      if (response.status === 201) {
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send notification to roles");
      console.error("Failed to send notification to roles:", err);
      return false;
    }
  }, []);

  const sendToTenants = useCallback(async (data: TenantNotificationData): Promise<boolean> => {
    try {
      const response = await notificationAPI.sendToTenants(data);
      if (response.status === 201) {
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send notification to tenants");
      console.error("Failed to send notification to tenants:", err);
      return false;
    }
  }, []);

  const sendMaintenanceAlert = useCallback(async (data: MaintenanceAlertData): Promise<boolean> => {
    try {
      const response = await notificationAPI.sendMaintenanceAlert(data);
      if (response.status === 201) {
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send maintenance alert");
      console.error("Failed to send maintenance alert:", err);
      return false;
    }
  }, []);

  const sendSecurityAlert = useCallback(async (data: SecurityAlertData): Promise<boolean> => {
    try {
      const response = await notificationAPI.sendSecurityAlert(data);
      if (response.status === 201) {
        await loadNotifications();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send security alert");
      console.error("Failed to send security alert:", err);
      return false;
    }
  }, []);

  // Real-time polling methods
  const startPolling = useCallback(() => {
    if (isPolling || !user) return;
    
    setIsPolling(true);
    pollingIntervalRef.current = setInterval(async () => {
      try {
        await loadNotifications();
      } catch (err) {
        console.error("Error polling notifications:", err);
      }
    }, 30000); // Poll every 30 seconds
  }, [isPolling, user]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Load notifications on mount and start polling
  useEffect(() => {
    if (user) {
      loadNotifications();
      startPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [user]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

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
    // Global notification methods
    sendGlobalNotification,
    sendToRoles,
    sendToTenants,
    sendMaintenanceAlert,
    sendSecurityAlert,
    // Real-time updates
    startPolling,
    stopPolling,
    isPolling,
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
