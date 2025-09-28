import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Eye,
  EyeOff,
  Filter,
  Info,
  RefreshCw,
  Settings,
  Trash2
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationContext";

const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadNotifications,
    addNotification,
  } = useNotifications();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('NotificationDropdown - notifications:', notifications);
    console.log('NotificationDropdown - unreadCount:', unreadCount);
    console.log('NotificationDropdown - loading:', loading);
    console.log('NotificationDropdown - unread notifications:', notifications.filter(n => !n.is_read));
  }, [notifications, unreadCount, loading]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showRead, setShowRead] = useState(false);
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
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    // Handle navigation if action_url is provided
    if (notification.action_url) {
      // Open the action URL in a new tab
      window.open(notification.action_url, '_blank');
    }
  };

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter((notification) => {
    if (!showRead && notification.is_read) return false;
    if (filterType !== 'all' && notification.notification_type !== filterType) return false;
    if (filterPriority !== 'all' && notification.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ${
            unreadCount > 99 ? 'h-6 w-6 px-1' : 'h-5 w-5'
          }`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Filter notifications"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Notification preferences"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={loadNotifications}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Refresh notifications"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    addNotification({
                      title: "Test Notification",
                      message: "This is a test notification to verify the system is working correctly.",
                      notification_type: 'info',
                      priority: 'medium',
                      is_global: false
                    });
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Add test notification"
                >
                  <Bell className="w-4 h-4" />
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      notifications.forEach(notification => {
                        deleteNotification(notification.id);
                      });
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Debug Info */}
            <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              <div className="text-gray-600 dark:text-gray-400">
                Debug: Total: {notifications.length} | Unread: {unreadCount} | Filtered: {filteredNotifications.length}
              </div>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowRead(!showRead)}
                    className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300"
                  >
                    {showRead ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span>{showRead ? 'Show Read' : 'Hide Read'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-sm">
                  {notifications.length === 0 
                    ? "No notifications yet" 
                    : "No notifications match your filters"
                  }
                </p>
                {notifications.length > 0 && (
                  <p className="text-xs mt-1">
                    {notifications.length} total notifications
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      !notification.is_read
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${getNotificationBgColor(
                          notification.notification_type
                        )}`}
                      >
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.is_read
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </p>
                              <div className="flex items-center space-x-2">
                                {notification.is_global && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Global
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                  notification.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                  notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                }`}>
                                  {notification.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.is_read && (
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
                        {notification.action_url && (
                          <button 
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.action_url) {
                                window.open(notification.action_url, '_blank');
                              }
                            }}
                          >
                            View Details →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredNotifications.length > 10 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                View All ({filteredNotifications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
