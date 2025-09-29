import {
  Bell,
  Globe,
  Plus,
  X,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { notificationAPI, superadminAPI } from "../../services/api";
import GlobalNotificationBroadcaster from "../superadmin/GlobalNotificationBroadcaster";

const Notifications: React.FC = () => {
  // State management for modals
  const [showSendNotificationModal, setShowSendNotificationModal] =
    useState(false);
  const [showNotificationHistoryModal, setShowNotificationHistoryModal] =
    useState(false);
  const [showGlobalBroadcaster, setShowGlobalBroadcaster] = useState(false);

  // Form states
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: "all",
    priority: "normal",
  });
  const [sending, setSending] = useState(false);

  // Notification history state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await notificationAPI.getAll();
        setNotifications(response.data || []);
      } catch (error: any) {
        console.error("Error fetching notifications:", error);
        setError(error.message || "Failed to load notifications");
        // Fallback to empty array if API fails
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handler functions
  const handleSendNotification = () => {
    setNotificationData({
      title: "",
      message: "",
      type: "info",
      recipients: "all",
      priority: "normal",
    });
    setShowSendNotificationModal(true);
  };

  const handleSendNotificationSubmit = async () => {
    try {
      // Validate required fields
      if (!notificationData.title.trim() || !notificationData.message.trim()) {
        alert("Please fill in all required fields");
        return;
      }

      setSending(true);

      // Prepare notification data for API
      const notificationPayload = {
        title: notificationData.title,
        message: notificationData.message,
        notification_type: notificationData.type,
        priority: notificationData.priority,
        target_audience: notificationData.recipients,
        created_by: "Support Staff", // You could get this from user context
        expires_in_hours: 24,
      };

      // Send notification via API
      const response = await notificationAPI.sendGlobal(notificationPayload);

      if (response.data.success) {
        // Refresh notifications list
        const updatedResponse = await notificationAPI.getAll();
        setNotifications(updatedResponse.data || []);

        // Close modal and reset form
        setShowSendNotificationModal(false);
        setNotificationData({
          title: "",
          message: "",
          type: "info",
          recipients: "all",
          priority: "normal",
        });

        alert("Notification sent successfully!");
      } else {
        alert(
          "Failed to send notification: " +
            (response.data.error || "Unknown error")
        );
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
      alert(
        "Error sending notification: " + (error.message || "Unknown error")
      );
    } finally {
      setSending(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase() || "") {
      case "info":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "alert":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "success":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase() || "") {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "normal":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage system notifications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowNotificationHistoryModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center"
          >
            <Bell className="w-4 h-4" />
            <span>History</span>
          </button>
          <button
            onClick={() => setShowGlobalBroadcaster(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Globe className="w-4 h-4" />
            <span>Global Broadcaster</span>
          </button>
          <button
            onClick={handleSendNotification}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Notifications
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading notifications...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications available
                </p>
              </div>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          notification.notification_type || notification.type
                        )}`}
                      >
                        {notification.notification_type || notification.type}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Recipients:{" "}
                        {notification.is_global
                          ? "All Users"
                          : notification.recipient_name || "Specific User"}
                      </span>
                      <span>
                        Sent:{" "}
                        {notification.created_at
                          ? new Date(notification.created_at).toLocaleString()
                          : "Unknown"}
                      </span>
                      <span
                        className={`${
                          notification.is_read
                            ? "text-green-600 dark:text-green-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        Status: {notification.is_read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Send Notification
              </h2>
              <button
                onClick={() => setShowSendNotificationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notification message"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={notificationData.type}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                    <option value="success">Success</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={notificationData.priority}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        priority: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipients
                </label>
                <select
                  value={notificationData.recipients}
                  onChange={(e) =>
                    setNotificationData({
                      ...notificationData,
                      recipients: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Users</option>
                  <option value="doctors">Doctors Only</option>
                  <option value="technicians">Technicians Only</option>
                  <option value="admins">Admins Only</option>
                  <option value="support">Support Team Only</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowSendNotificationModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotificationSubmit}
                disabled={sending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification History Modal */}
      {showNotificationHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Notification History
              </h2>
              <button
                onClick={() => setShowNotificationHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Loading notification history...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No notification history available
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                              notification.notification_type ||
                                notification.type
                            )}`}
                          >
                            {notification.notification_type ||
                              notification.type}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Recipients:{" "}
                          {notification.is_global
                            ? "All Users"
                            : notification.recipient_name || "Specific User"}
                        </span>
                        <span>
                          Sent:{" "}
                          {notification.created_at
                            ? new Date(notification.created_at).toLocaleString()
                            : "Unknown"}
                        </span>
                        <span
                          className={`${
                            notification.is_read
                              ? "text-green-600 dark:text-green-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          Status: {notification.is_read ? "Read" : "Unread"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowNotificationHistoryModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Notification Broadcaster Modal */}
      {showGlobalBroadcaster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Global Notification Broadcaster
              </h2>
              <button
                onClick={() => setShowGlobalBroadcaster(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <GlobalNotificationBroadcaster />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
