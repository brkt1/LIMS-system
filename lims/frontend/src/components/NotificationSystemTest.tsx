import { AlertCircle, Bell, CheckCircle, Info } from "lucide-react";
import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";

const NotificationSystemTest: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    addNotification, 
    markAsRead, 
    deleteNotification,
    error 
  } = useNotifications();
  
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const result = `[${timestamp}] ${success ? '✅' : '❌'} ${message}`;
    setTestResults(prev => [result, ...prev.slice(0, 9)]);
  };

  const testAddNotification = () => {
    try {
      addNotification({
        title: "System Test Notification",
        message: "This notification was created to test the notification system functionality.",
        notification_type: 'info',
        priority: 'medium',
        is_global: false
      });
      addTestResult("Test notification added successfully");
    } catch (err) {
      addTestResult("Failed to add test notification", false);
    }
  };

  const testMarkAsRead = () => {
    if (notifications.length > 0) {
      const firstNotification = notifications[0];
      if (!firstNotification.is_read) {
        markAsRead(firstNotification.id);
        addTestResult("Notification marked as read");
      } else {
        addTestResult("No unread notifications to mark as read");
      }
    } else {
      addTestResult("No notifications available to test", false);
    }
  };

  const testDeleteNotification = () => {
    if (notifications.length > 0) {
      const firstNotification = notifications[0];
      deleteNotification(firstNotification.id);
      addTestResult("Notification deleted successfully");
    } else {
      addTestResult("No notifications available to delete", false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notification System Test
        </h2>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Notifications
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {notifications.length}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unread Count
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {unreadCount}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              System Status
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : error ? 'Error' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={testAddNotification}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Add Test Notification
        </button>
        <button
          onClick={testMarkAsRead}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          Mark First as Read
        </button>
        <button
          onClick={testDeleteNotification}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Delete First
        </button>
      </div>

      {/* Test Results */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Results
        </h3>
        {testResults.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tests run yet. Click a test button above.
          </p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs font-mono text-gray-600 dark:text-gray-300">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Notifications Preview */}
      {notifications.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Notifications (Preview)
          </h3>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.is_read 
                    ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.notification_type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        notification.notification_type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        notification.notification_type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        notification.notification_type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {notification.notification_type}
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {notification.priority}
                      </span>
                      {!notification.is_read && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystemTest;
