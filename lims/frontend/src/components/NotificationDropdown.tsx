import {
  Bell,
  Check,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { useLanguage } from "../contexts/LanguageContext";

const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "bg-red-50 dark:bg-red-900/20";
      default:
        return "bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t("notifications.justNow");
    if (diffInSeconds < 3600)
      return t("notifications.minutesAgo").replace(
        "{count}",
        Math.floor(diffInSeconds / 60).toString()
      );
    if (diffInSeconds < 86400)
      return t("notifications.hoursAgo").replace(
        "{count}",
        Math.floor(diffInSeconds / 3600).toString()
      );
    return t("notifications.daysAgo").replace(
      "{count}",
      Math.floor(diffInSeconds / 86400).toString()
    );
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    // Handle navigation if actionUrl is provided
    if (notification.actionUrl) {
      // You can implement navigation here
      console.log("Navigate to:", notification.actionUrl);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !notification.read
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${getNotificationBgColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {notification.actionText && (
                          <button className="mt-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            {notification.actionText} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
