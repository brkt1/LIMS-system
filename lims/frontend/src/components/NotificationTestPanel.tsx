import {
    AlertCircle,
    Bell,
    Send,
    Shield,
    TestTube,
    Users,
    Wrench
} from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const NotificationTestPanel: React.FC = () => {
  const { 
    sendGlobalNotification, 
    sendToRoles, 
    sendMaintenanceAlert, 
    sendSecurityAlert,
    addNotification,
    error,
    clearError 
  } = useNotifications();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string, success: boolean = true) => {
    const timestamp = new Date().toLocaleTimeString();
    const result = `[${timestamp}] ${success ? '✅' : '❌'} ${message}`;
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const testGlobalNotification = async () => {
    setIsLoading(true);
    try {
      const success = await sendGlobalNotification({
        title: "Test Global Notification",
        message: `This is a test notification sent by ${user?.email || 'Test User'}. The global notification system is working correctly!`,
        notification_type: 'info',
        priority: 'medium',
        target_audience: 'all',
        expires_in_hours: 1
      });
      
      if (success) {
        addTestResult("Global notification sent successfully");
      } else {
        addTestResult("Failed to send global notification", false);
      }
    } catch (err) {
      addTestResult("Error sending global notification", false);
    } finally {
      setIsLoading(false);
    }
  };

  const testRoleNotification = async () => {
    setIsLoading(true);
    try {
      const success = await sendToRoles({
        title: "Test Role Notification",
        message: "This is a test notification sent to specific roles. Only users with matching roles will receive this.",
        roles: ['doctor', 'technician'],
        notification_type: 'success',
        priority: 'medium',
        expires_in_hours: 1
      });
      
      if (success) {
        addTestResult("Role-based notification sent successfully");
      } else {
        addTestResult("Failed to send role-based notification", false);
      }
    } catch (err) {
      addTestResult("Error sending role-based notification", false);
    } finally {
      setIsLoading(false);
    }
  };

  const testMaintenanceAlert = async () => {
    setIsLoading(true);
    try {
      const success = await sendMaintenanceAlert({
        title: "Test Maintenance Alert",
        message: "This is a test maintenance alert. The system will be undergoing scheduled maintenance.",
        maintenance_type: 'scheduled',
        priority: 'high',
        affected_services: ['Database', 'API Services']
      });
      
      if (success) {
        addTestResult("Maintenance alert sent successfully");
      } else {
        addTestResult("Failed to send maintenance alert", false);
      }
    } catch (err) {
      addTestResult("Error sending maintenance alert", false);
    } finally {
      setIsLoading(false);
    }
  };

  const testSecurityAlert = async () => {
    setIsLoading(true);
    try {
      const success = await sendSecurityAlert({
        title: "Test Security Alert",
        message: "This is a test security alert. Please review your account security settings.",
        severity: 'medium',
        action_required: false
      });
      
      if (success) {
        addTestResult("Security alert sent successfully");
      } else {
        addTestResult("Failed to send security alert", false);
      }
    } catch (err) {
      addTestResult("Error sending security alert", false);
    } finally {
      setIsLoading(false);
    }
  };

  const testLocalNotification = () => {
    addNotification({
      title: "Test Local Notification",
      message: "This is a local notification added directly to your notification list.",
      notification_type: 'info',
      priority: 'low',
      is_global: false
    });
    addTestResult("Local notification added successfully");
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Test Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Test the global notification system functionality
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TestTube className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={testGlobalNotification}
          disabled={isLoading}
          className="flex items-center space-x-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Bell className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Global Notification</div>
            <div className="text-sm opacity-90">Send to all users</div>
          </div>
        </button>

        <button
          onClick={testRoleNotification}
          disabled={isLoading}
          className="flex items-center space-x-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Users className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Role Notification</div>
            <div className="text-sm opacity-90">Send to specific roles</div>
          </div>
        </button>

        <button
          onClick={testMaintenanceAlert}
          disabled={isLoading}
          className="flex items-center space-x-3 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Wrench className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Maintenance Alert</div>
            <div className="text-sm opacity-90">System maintenance</div>
          </div>
        </button>

        <button
          onClick={testSecurityAlert}
          disabled={isLoading}
          className="flex items-center space-x-3 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Shield className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Security Alert</div>
            <div className="text-sm opacity-90">Security incident</div>
          </div>
        </button>

        <button
          onClick={testLocalNotification}
          disabled={isLoading}
          className="flex items-center space-x-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
          <div className="text-left">
            <div className="font-medium">Local Notification</div>
            <div className="text-sm opacity-90">Add to your list</div>
          </div>
        </button>
      </div>

      {/* Test Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Results
          </h2>
          <button
            onClick={clearResults}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear Results
          </button>
        </div>
        
        {testResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No test results yet. Click a test button above to start testing.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-mono"
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          How to Test
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p>1. Click any test button above to send a notification</p>
          <p>2. Check the notification bell icon in the header for new notifications</p>
          <p>3. Open the notification dropdown to see the sent notifications</p>
          <p>4. Test different notification types and priorities</p>
          <p>5. Try the filtering and preferences features</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPanel;
