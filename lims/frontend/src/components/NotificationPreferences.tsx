import {
    AlertCircle,
    Bell,
    CheckCircle,
    Mail,
    Save,
    Settings,
    Smartphone
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { notificationAPI } from "../services/api";

interface NotificationPreferences {
  id?: number;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  notification_types: string[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  quiet_hours_enabled: boolean;
  digest_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  priority_filter: string[];
}

const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    push_enabled: true,
    sms_enabled: false,
    notification_types: ['info', 'success', 'warning', 'error', 'urgent'],
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    quiet_hours_enabled: false,
    digest_frequency: 'immediate',
    priority_filter: ['low', 'medium', 'high', 'critical']
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const notificationTypes = [
    { value: 'info', label: 'Information', color: 'text-blue-600' },
    { value: 'success', label: 'Success', color: 'text-green-600' },
    { value: 'warning', label: 'Warning', color: 'text-yellow-600' },
    { value: 'error', label: 'Error', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-purple-600' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-gray-600' },
    { value: 'medium', label: 'Medium', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' }
  ];

  const digestFrequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' }
  ];

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationAPI.getPreferences();
      if (response.data && response.data.length > 0) {
        setPreferences(response.data[0]);
      }
    } catch (err: any) {
      console.error('Failed to load preferences:', err);
      // Use default preferences if loading fails
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (field: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationTypeToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      notification_types: prev.notification_types.includes(type)
        ? prev.notification_types.filter(t => t !== type)
        : [...prev.notification_types, type]
    }));
  };

  const handlePriorityToggle = (priority: string) => {
    setPreferences(prev => ({
      ...prev,
      priority_filter: prev.priority_filter.includes(priority)
        ? prev.priority_filter.filter(p => p !== priority)
        : [...prev.priority_filter, priority]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      if (preferences.id) {
        await notificationAPI.updatePreference(preferences.id, preferences);
      } else {
        await notificationAPI.createPreference(preferences);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences({
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      notification_types: ['info', 'success', 'warning', 'error', 'urgent'],
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
      quiet_hours_enabled: false,
      digest_frequency: 'immediate',
      priority_filter: ['low', 'medium', 'high', 'critical']
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Customize how you receive notifications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 dark:text-green-200">Preferences saved successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Delivery Methods
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.email_enabled}
                onChange={(e) => handlePreferenceChange('email_enabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive browser push notifications
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.push_enabled}
                onChange={(e) => handlePreferenceChange('push_enabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    SMS Notifications
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive notifications via SMS (premium feature)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.sms_enabled}
                onChange={(e) => handlePreferenceChange('sms_enabled', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Types
          </h2>
          <div className="space-y-3">
            {notificationTypes.map((type) => (
              <label key={type.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${type.color.replace('text-', 'bg-')}`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notification_types.includes(type.value)}
                  onChange={() => handleNotificationTypeToggle(type.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Priority Filter
          </h2>
          <div className="space-y-3">
            {priorityLevels.map((priority) => (
              <label key={priority.value} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${priority.color.replace('text-', 'bg-')}`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {priority.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.priority_filter.includes(priority.value)}
                  onChange={() => handlePriorityToggle(priority.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Digest Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Digest Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digest Frequency
              </label>
              <select
                value={preferences.digest_frequency}
                onChange={(e) => handlePreferenceChange('digest_frequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {digestFrequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={preferences.quiet_hours_enabled}
                  onChange={(e) => handlePreferenceChange('quiet_hours_enabled', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Quiet Hours
                </span>
              </label>
              {preferences.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quiet_hours_start}
                      onChange={(e) => handlePreferenceChange('quiet_hours_start', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quiet_hours_end}
                      onChange={(e) => handlePreferenceChange('quiet_hours_end', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset to Defaults
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
