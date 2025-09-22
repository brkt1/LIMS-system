import {
  Bell,
  Save,
  Settings as SettingsIcon,
  Shield,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    supportSettings: {
      autoAssignTickets: true,
      ticketEscalationTime: 24,
      maxTicketsPerAgent: 10,
      enableNotifications: true,
      notificationSound: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    systemSettings: {
      maintenanceMode: false,
      systemBackup: true,
      logRetentionDays: 90,
      debugMode: false,
      apiRateLimit: 1000,
      sessionTimeout: 30,
    },
    securitySettings: {
      twoFactorAuth: true,
      passwordExpiry: 90,
      ipWhitelist: false,
      auditLogging: true,
      dataEncryption: true,
      secureConnections: true,
    },
    notificationSettings: {
      ticketCreated: true,
      ticketUpdated: true,
      ticketResolved: true,
      systemAlerts: true,
      maintenanceAlerts: true,
      securityAlerts: true,
    },
  });

  const [activeTab, setActiveTab] = useState("support");

  const handleSettingChange = (
    parentKey: string,
    childKey: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof typeof prev],
        [childKey]: value,
      },
    }));
  };

  const handleSave = () => {
    // Here you would typically save the settings to the backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const tabs = [
    { id: "support", label: "Support", icon: Users },
    { id: "system", label: "System", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Configure support system settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {activeTab === "support" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Support Settings
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.supportSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <p className="text-sm text-gray-500">
                      {key === "autoAssignTickets" &&
                        "Automatically assign tickets to available agents"}
                      {key === "ticketEscalationTime" &&
                        "Hours before a ticket is escalated"}
                      {key === "maxTicketsPerAgent" &&
                        "Maximum number of tickets per agent"}
                      {key === "enableNotifications" &&
                        "Enable desktop notifications"}
                      {key === "notificationSound" &&
                        "Play sound for notifications"}
                      {key === "emailNotifications" &&
                        "Send email notifications"}
                      {key === "smsNotifications" && "Send SMS notifications"}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleSettingChange(
                            "supportSettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  ) : (
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        handleSettingChange(
                          "supportSettings",
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
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              System Settings
            </h3>
            <div className="space-y-4">
              {Object.entries(settings.systemSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-900">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                    <p className="text-sm text-gray-500">
                      {key === "maintenanceMode" &&
                        "Enable maintenance mode for system updates"}
                      {key === "systemBackup" &&
                        "Enable automatic system backups"}
                      {key === "logRetentionDays" &&
                        "Number of days to retain system logs"}
                      {key === "debugMode" &&
                        "Enable debug mode for troubleshooting"}
                      {key === "apiRateLimit" &&
                        "API requests per minute limit"}
                      {key === "sessionTimeout" && "Session timeout in minutes"}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleSettingChange(
                            "systemSettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  ) : (
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        handleSettingChange(
                          "systemSettings",
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

        {activeTab === "security" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
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
                        "Require two-factor authentication"}
                      {key === "passwordExpiry" && "Password expiry in days"}
                      {key === "ipWhitelist" &&
                        "Restrict access to specific IP addresses"}
                      {key === "auditLogging" &&
                        "Enable audit logging for security"}
                      {key === "dataEncryption" && "Encrypt sensitive data"}
                      {key === "secureConnections" &&
                        "Require secure connections (HTTPS)"}
                    </p>
                  </div>
                  {typeof value === "boolean" ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleSettingChange(
                            "securitySettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  ) : (
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) =>
                        handleSettingChange(
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

        {activeTab === "notifications" && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
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
                      <p className="text-sm text-gray-500">
                        {key === "ticketCreated" &&
                          "Notify when new tickets are created"}
                        {key === "ticketUpdated" &&
                          "Notify when tickets are updated"}
                        {key === "ticketResolved" &&
                          "Notify when tickets are resolved"}
                        {key === "systemAlerts" && "Notify about system alerts"}
                        {key === "maintenanceAlerts" &&
                          "Notify about maintenance activities"}
                        {key === "securityAlerts" &&
                          "Notify about security incidents"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) =>
                          handleSettingChange(
                            "notificationSettings",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
