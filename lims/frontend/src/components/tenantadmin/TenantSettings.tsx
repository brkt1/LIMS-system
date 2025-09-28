import {
    AlertCircle,
    Building2,
    CheckCircle,
    Save,
    Settings,
    Shield,
    Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { profileAPI } from "../../services/api";

const TenantSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    organizationName: "MediCare Clinic",
    organizationType: "Medical Clinic",
    address: "123 Medical Center Dr, Health City, HC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@medicareclinic.com",
    website: "www.medicareclinic.com",
    licenseNumber: "MC-2024-001",
    taxId: "12-3456789",
    timezone: "America/New_York",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
    language: "English",
    maxUsers: 50,
    dataRetentionDays: 2555,
    backupFrequency: "Daily",
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      testResultAlerts: true,
      systemUpdates: true,
    },
    securitySettings: {
      twoFactorAuth: true,
      passwordExpiry: 90,
      sessionTimeout: 30,
      ipWhitelist: false,
      auditLogging: true,
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from backend API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await profileAPI.getProfile();
        if (response.data) {
          setSettings({
            ...settings,
            organizationName:
              response.data.organizationName || settings.organizationName,
            organizationType:
              response.data.organizationType || settings.organizationType,
            address: response.data.address || settings.address,
            phone: response.data.phone || settings.phone,
            email: response.data.email || settings.email,
            website: response.data.website || settings.website,
          });
        }
      } catch (error: any) {
        console.error("Error fetching settings:", error);
        setError(error.message || "Failed to load settings");
        // Set default settings when API fails
        setSettings({
          tenantName: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          timezone: "UTC",
          currency: "USD",
          language: "en",
          businessHours: {
            monday: { open: "09:00", close: "17:00", closed: false },
            tuesday: { open: "09:00", close: "17:00", closed: false },
            wednesday: { open: "09:00", close: "17:00", closed: false },
            thursday: { open: "09:00", close: "17:00", closed: false },
            friday: { open: "09:00", close: "17:00", closed: false },
            saturday: { open: "09:00", close: "17:00", closed: true },
            sunday: { open: "09:00", close: "17:00", closed: true },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (settings.organizationName !== "MediCare Clinic") {
      // Only save if not initial state
      localStorage.setItem("tenant-settings", JSON.stringify(settings));
      setHasUnsavedChanges(false);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
    setSaveStatus("idle");
  };

  const handleNestedSettingChange = (
    parentKey: string,
    childKey: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey as keyof typeof prev] as object),
        [childKey]: value,
      },
    }));
    setHasUnsavedChanges(true);
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Save to backend API
      await profileAPI.updateProfile({
        organizationName: settings.organizationName,
        organizationType: settings.organizationType,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        timezone: settings.timezone,
        language: settings.language,
        dateFormat: settings.dateFormat,
        currency: settings.currency,
      });

      // Simulate success
      setSaveStatus("success");
      setHasUnsavedChanges(false);

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);

      console.log("Settings saved successfully:", settings);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setError(error.message || "Failed to save settings");

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Settings },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tenant Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your organization settings and preferences
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* Status indicator */}
            {saveStatus === "success" && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Saved successfully!</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Save failed. Please try again.
                </span>
              </div>
            )}
            {hasUnsavedChanges && saveStatus === "idle" && (
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={
                isSaving || (!hasUnsavedChanges && saveStatus === "idle")
              }
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
                isSaving
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : hasUnsavedChanges || saveStatus !== "idle"
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === "general" && (
          <div className="p-4 sm:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              General Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) =>
                    handleSettingChange("organizationName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Type
                </label>
                <select
                  value={settings.organizationType}
                  onChange={(e) =>
                    handleSettingChange("organizationType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Medical Clinic">Medical Clinic</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Diagnostic Center">Diagnostic Center</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) =>
                    handleSettingChange("address", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleSettingChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) =>
                    handleSettingChange("website", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  value={settings.licenseNumber}
                  onChange={(e) =>
                    handleSettingChange("licenseNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={settings.taxId}
                  onChange={(e) => handleSettingChange("taxId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="p-4 sm:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notification Settings
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.notificationSettings).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {key === "emailNotifications" &&
                          "Send notifications via email"}
                        {key === "smsNotifications" &&
                          "Send notifications via SMS"}
                        {key === "pushNotifications" &&
                          "Send push notifications to mobile devices"}
                        {key === "appointmentReminders" &&
                          "Send appointment reminders to patients"}
                        {key === "testResultAlerts" &&
                          "Send alerts when test results are ready"}
                        {key === "systemUpdates" &&
                          "Send notifications about system updates"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) =>
                          handleNestedSettingChange(
                            "notificationSettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="p-4 sm:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Settings
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.securitySettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <p className="text-sm text-gray-500">
                      {key === "twoFactorAuth" &&
                        "Require two-factor authentication for all users"}
                      {key === "passwordExpiry" &&
                        "Password expires after specified days"}
                      {key === "sessionTimeout" && "Session timeout in minutes"}
                      {key === "ipWhitelist" &&
                        "Restrict access to specific IP addresses"}
                      {key === "auditLogging" &&
                        "Log all user activities for security auditing"}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleNestedSettingChange(
                            "securitySettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  ) : (
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          "securitySettings",
                          key,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="p-4 sm:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Settings
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    handleSettingChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    handleSettingChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    handleSettingChange("dateFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) =>
                    handleSettingChange("timeFormat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="12-hour">12-hour (AM/PM)</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Users
                </label>
                <input
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) =>
                    handleSettingChange("maxUsers", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSettings;
