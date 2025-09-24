import { Plus, Bell, X, Send, Users, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

const Notifications: React.FC = () => {
  // State management for modals
  const [showSendNotificationModal, setShowSendNotificationModal] =
    useState(false);
  const [showNotificationHistoryModal, setShowNotificationHistoryModal] =
    useState(false);

  // Form states
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: "all",
    priority: "normal",
  });

  // Notification history state
  const [notifications, setNotifications] = useState([
    {
      id: "NOTIF001",
      title: "System Maintenance Scheduled",
      message:
        "Scheduled maintenance will occur tonight from 2 AM to 4 AM. Please save your work.",
      type: "warning",
      recipients: "all",
      priority: "high",
      sentDate: "2025-01-22 10:00 AM",
      status: "sent",
    },
    {
      id: "NOTIF002",
      title: "New Feature Available",
      message:
        "The new reporting dashboard is now available. Check it out in your dashboard.",
      type: "info",
      recipients: "doctors",
      priority: "normal",
      sentDate: "2025-01-21 3:30 PM",
      status: "sent",
    },
    {
      id: "NOTIF003",
      title: "Security Update Required",
      message:
        "Please update your password to meet the new security requirements.",
      type: "alert",
      recipients: "all",
      priority: "high",
      sentDate: "2025-01-20 9:15 AM",
      status: "sent",
    },
  ]);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("supportNotifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem("supportNotifications", JSON.stringify(notifications));
  }, [notifications]);

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

  const handleSendNotificationSubmit = () => {
    const newNotification = {
      id: `NOTIF${String(notifications.length + 1).padStart(3, "0")}`,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type,
      recipients: notificationData.recipients,
      priority: notificationData.priority,
      sentDate: new Date().toLocaleString(),
      status: "sent",
    };
    setNotifications([newNotification, ...notifications]);
    setShowSendNotificationModal(false);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (priority.toLowerCase()) {
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
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {notification.type}
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
                    <span>Recipients: {notification.recipients}</span>
                    <span>Sent: {notification.sentDate}</span>
                    <span className="text-green-600 dark:text-green-400">
                      Status: {notification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Notification
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
                            notification.type
                          )}`}
                        >
                          {notification.type}
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
                      <span>Recipients: {notification.recipients}</span>
                      <span>Sent: {notification.sentDate}</span>
                      <span className="text-green-600 dark:text-green-400">
                        Status: {notification.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default Notifications;
