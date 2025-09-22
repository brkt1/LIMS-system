import {
  Bell,
  Calendar,
  Check,
  Edit,
  Eye,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const GlobalNotification: React.FC = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [showComposeModal, setShowComposeModal] = useState(false);

  const notificationStats = {
    totalSent: 1247,
    pending: 23,
    delivered: 1200,
    failed: 24,
    openRate: 78.5,
    clickRate: 12.3,
  };

  const notificationTemplates = [
    {
      id: "1",
      name: "System Maintenance",
      subject: "Scheduled System Maintenance",
      type: "maintenance",
      lastUsed: "2025-01-15",
      usageCount: 5,
    },
    {
      id: "2",
      name: "Security Alert",
      subject: "Security Notice: Password Reset Required",
      type: "security",
      lastUsed: "2025-01-18",
      usageCount: 12,
    },
    {
      id: "3",
      name: "Feature Update",
      subject: "New Features Available in Your Dashboard",
      type: "feature",
      lastUsed: "2025-01-10",
      usageCount: 3,
    },
    {
      id: "4",
      name: "Billing Reminder",
      subject: "Payment Due: Subscription Renewal",
      type: "billing",
      lastUsed: "2025-01-20",
      usageCount: 8,
    },
  ];

  const recentNotifications = [
    {
      id: "1",
      subject: "Scheduled System Maintenance",
      type: "maintenance",
      status: "sent",
      recipients: 1247,
      sentAt: "2025-01-20 14:30",
      openRate: 85.2,
      clickRate: 15.7,
    },
    {
      id: "2",
      subject: "New Security Features Available",
      type: "security",
      status: "pending",
      recipients: 1247,
      sentAt: "2025-01-20 16:00",
      openRate: 0,
      clickRate: 0,
    },
    {
      id: "3",
      subject: "Payment Due: Subscription Renewal",
      type: "billing",
      status: "sent",
      recipients: 24,
      sentAt: "2025-01-19 09:00",
      openRate: 92.1,
      clickRate: 8.3,
    },
    {
      id: "4",
      subject: "API Rate Limit Warning",
      type: "warning",
      status: "failed",
      recipients: 8,
      sentAt: "2025-01-18 11:30",
      openRate: 0,
      clickRate: 0,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      case "security":
        return "bg-red-100 text-red-800";
      case "feature":
        return "bg-green-100 text-green-800";
      case "billing":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Global Notifications
          </h2>
          <p className="text-gray-600">
            Send notifications to all users and manage notification templates
          </p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Notification</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.totalSent.toLocaleString()}
              </p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.pending}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.openRate}%
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.clickRate}%
              </p>
            </div>
            <Bell className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "compose", name: "Compose" },
            { id: "templates", name: "Templates" },
            { id: "history", name: "History" },
            { id: "settings", name: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Compose Tab */}
      {activeTab === "compose" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Compose New Notification
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select type</option>
                    <option value="maintenance">System Maintenance</option>
                    <option value="security">Security Alert</option>
                    <option value="feature">Feature Update</option>
                    <option value="billing">Billing</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your notification message"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Users (1,247)</option>
                    <option value="admins">Admins Only (24)</option>
                    <option value="tenants">Tenant Admins (24)</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Schedule
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="now">Send Now</option>
                    <option value="scheduled">Schedule for Later</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Save as Draft
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Notification Templates
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notificationTemplates.map((template) => (
              <div
                key={template.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.subject}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                      template.type
                    )}`}
                  >
                    {template.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Last Used:</span>
                    <span>{template.lastUsed}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Usage Count:</span>
                    <span>{template.usageCount}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Notification History
              </h3>
              <div className="flex items-center space-x-3">
                <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Types</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="feature">Feature</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Subject
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Recipients
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Sent At
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Open Rate
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {notification.subject}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          {notification.type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            notification.status
                          )}`}
                        >
                          {notification.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {notification.recipients.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {notification.sentAt}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {notification.openRate}%
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Notification Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Send notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    In-App Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Show notifications in the application
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    SMS Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Send critical notifications via SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNotification;
