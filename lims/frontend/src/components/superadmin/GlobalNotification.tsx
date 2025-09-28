import {
    Bell,
    Calendar,
    Edit,
    Eye,
    Plus,
    Save,
    Send,
    Trash2,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { notificationAPI, superadminAPI } from "../../services/api";

const GlobalNotification: React.FC = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState("compose");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [userCounts, setUserCounts] = useState({
    total: 0,
    admins: 0,
    tenants: 0,
    doctors: 0,
    technicians: 0,
    patients: 0
  });

  // Modal states
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showViewTemplateModal, setShowViewTemplateModal] = useState(false);
  const [showViewHistoryModal, setShowViewHistoryModal] = useState(false);
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false);
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);

  // Form states
  const [composeNotification, setComposeNotification] = useState({
    subject: "",
    message: "",
    type: "general",
    recipients: "all",
    scheduledDate: "",
    scheduledTime: "",
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [editTemplate, setEditTemplate] = useState({
    name: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [editHistory, setEditHistory] = useState({
    subject: "",
    message: "",
    status: "sent",
  });

  // Filter states
  const [filterType, setFilterType] = useState("all");

  const [notificationStats, setNotificationStats] = useState({
    totalSent: 0,
    pending: 0,
    delivered: 0,
    failed: 0,
    openRate: 0,
    clickRate: 0,
  });

  const [notificationTemplates, setNotificationTemplates] = useState<any[]>([]);

  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user counts
  const fetchUserCounts = async () => {
    try {
      // This would typically come from your API
      // For now, we'll use mock data that matches the notification system
      const response = await superadminAPI.users.getAll();
      const users = response.data || [];
      
      const counts = {
        total: users.length,
        admins: users.filter((user: any) => user.role === 'superadmin' || user.role === 'tenantadmin').length,
        tenants: users.filter((user: any) => user.role === 'tenantadmin').length,
        doctors: users.filter((user: any) => user.role === 'doctor').length,
        technicians: users.filter((user: any) => user.role === 'technician').length,
        patients: users.filter((user: any) => user.role === 'patient').length
      };
      
      setUserCounts(counts);
    } catch (error) {
      console.error('Failed to fetch user counts:', error);
      // Fallback to reasonable defaults
      setUserCounts({
        total: 0,
        admins: 0,
        tenants: 0,
        doctors: 0,
        technicians: 0,
        patients: 0
      });
    }
  };

  // Load data from API on component mount
  useEffect(() => {
    loadNotifications();
    loadTemplates();
    loadStats();
    fetchUserCounts();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await superadminAPI.globalNotifications.getAll();
      const notifications = response.data;

      // Convert API notifications to the format expected by the component
      const formattedNotifications = notifications.map((notification: any) => ({
        id: notification.id,
        subject: notification.title,
        message: notification.message,
        type: notification.notification_type,
        recipients: notification.target_audience === 'all' ? "All Users" : "Specific Users",
        sentDate: notification.created_at,
        status: notification.sent_at ? "Sent" : "Draft",
        priority: notification.priority,
      }));

      setRecentNotifications(formattedNotifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
      // Keep the default data if API fails
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await superadminAPI.notificationTemplates.getAll();
      setNotificationTemplates(response.data);
    } catch (error) {
      console.error("Failed to load templates:", error);
    }
  };

  const loadStats = async () => {
    try {
      // Get real notification data from the API
      const response = await notificationAPI.getAll();
      const notifications = response.data || [];
      
      // Calculate real stats from notifications
      const totalSent = notifications.length;
      const pending = notifications.filter(n => !n.is_read).length;
      const delivered = notifications.filter(n => n.is_read).length;
      const failed = 0; // We don't track failed notifications currently
      
      // Calculate open rate (percentage of read notifications)
      const openRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
      
      // Mock click rate for now (would need to track clicks in the future)
      const clickRate = 12.3;
      
      setNotificationStats({
        totalSent,
        pending,
        delivered,
        failed,
        openRate: Math.round(openRate * 10) / 10, // Round to 1 decimal
        clickRate,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
      // Set default stats on error
      setNotificationStats({
        totalSent: 0,
        pending: 0,
        delivered: 0,
        failed: 0,
        openRate: 0,
        clickRate: 0,
      });
    }
  };

  // No need to save to localStorage anymore - data comes from API

  // Handler functions
  const handleComposeNotification = () => {
    setShowComposeModal(true);
  };

  const handleSendNotification = async () => {
    try {
      
      // Determine target audience based on selection
      let targetAudience = 'all';
      let targetRoles: string[] = [];
      
      if (composeNotification.recipients === 'admins') {
        targetAudience = 'roles';
        targetRoles = ['superadmin', 'tenantadmin'];
      } else if (composeNotification.recipients === 'tenants') {
        targetAudience = 'roles';
        targetRoles = ['tenantadmin'];
      } else if (composeNotification.recipients === 'doctors') {
        targetAudience = 'roles';
        targetRoles = ['doctor'];
      } else if (composeNotification.recipients === 'technicians') {
        targetAudience = 'roles';
        targetRoles = ['technician'];
      } else if (composeNotification.recipients === 'patients') {
        targetAudience = 'roles';
        targetRoles = ['patient'];
      }
      
      // Send the notification using our global notification system
      const response = await notificationAPI.sendGlobal({
        title: composeNotification.subject,
        message: composeNotification.message,
        notification_type: composeNotification.type,
        priority: 'medium',
        target_audience: targetAudience,
        target_roles: targetRoles.length > 0 ? targetRoles : undefined,
        expires_in_hours: 24
      });
      
      if (response.status === 201) {
        // Reset form
        setComposeNotification({
          subject: "",
          message: "",
          type: "general",
          recipients: "all",
          scheduledDate: "",
          scheduledTime: "",
        });
        
        // Reload stats and notifications
        await loadStats();
        await loadNotifications();
        
        setShowComposeModal(false);
        alert('Notification sent successfully!');
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      // Request completed
    }
  };

  const handleSaveNotification = () => {
    // Save as draft functionality
    console.log("Saving notification as draft:", composeNotification);
    setShowComposeModal(false);
    setComposeNotification({
      subject: "",
      message: "",
      type: "general",
      recipients: "all",
      scheduledDate: "",
      scheduledTime: "",
    });
  };


  const handleCreateTemplate = () => {
    setShowCreateTemplateModal(true);
  };

  const handleCreateTemplateSubmit = () => {
    const newTemplateData = {
      id: (notificationTemplates.length + 1).toString(),
      ...newTemplate,
      lastUsed: new Date().toISOString().split("T")[0],
      usageCount: 0,
    };

    setNotificationTemplates((prev: any) => [...prev, newTemplateData]);
    setShowCreateTemplateModal(false);
    setNewTemplate({ name: "", subject: "", message: "", type: "general" });
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setEditTemplate({
      name: template.name,
      subject: template.subject,
      message: template.message,
      type: template.type,
    });
    setShowEditTemplateModal(true);
  };

  const handleUpdateTemplate = () => {
    if (selectedTemplate) {
      setNotificationTemplates((prev: any) =>
        prev.map((template: any) =>
          template.id === selectedTemplate.id
            ? { ...template, ...editTemplate }
            : template
        )
      );
      setShowEditTemplateModal(false);
      setSelectedTemplate(null);
    }
  };

  const handleUseTemplate = (template: any) => {
    setComposeNotification({
      subject: template.subject,
      message: template.message,
      type: template.type,
      recipients: "all",
      scheduledDate: "",
      scheduledTime: "",
    });
    setShowComposeModal(true);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowViewTemplateModal(true);
  };

  const handleViewHistory = (notification: any) => {
    setSelectedHistory(notification);
    setShowViewHistoryModal(true);
  };

  const handleEditHistory = (notification: any) => {
    setSelectedHistory(notification);
    setEditHistory({
      subject: notification.subject,
      message: notification.message || "",
      status: notification.status,
    });
    setShowEditHistoryModal(true);
  };

  const handleUpdateHistory = () => {
    if (selectedHistory) {
      setRecentNotifications((prev: any) =>
        prev.map((notification: any) =>
          notification.id === selectedHistory.id
            ? { ...notification, ...editHistory }
            : notification
        )
      );
      setShowEditHistoryModal(false);
      setSelectedHistory(null);
    }
  };

  const handleDeleteHistory = (notification: any) => {
    setSelectedHistory(notification);
    setShowDeleteHistoryModal(true);
  };

  const handleDeleteHistoryConfirm = () => {
    if (selectedHistory) {
      setRecentNotifications((prev: any) =>
        prev.filter(
          (notification: any) => notification.id !== selectedHistory.id
        )
      );
      setShowDeleteHistoryModal(false);
      setSelectedHistory(null);
    }
  };

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
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
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
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('globalNotification.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t('globalNotification.description')}
            </p>
          </div>
          <button
            onClick={handleComposeNotification}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('globalNotification.composeNotification')}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Debug Info */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total Users:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{userCounts.total}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Admins:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{userCounts.admins}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Doctors:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{userCounts.doctors}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Patients:</span>
              <span className="ml-1 font-medium text-gray-900 dark:text-white">{userCounts.patients}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  Total Sent
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {notificationStats.totalSent.toLocaleString()}
                </p>
              </div>
              <Send className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  Pending
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {notificationStats.pending}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  Open Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {notificationStats.openRate}%
                </p>
              </div>
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  Click Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {notificationStats.clickRate}%
                </p>
              </div>
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8 px-4 sm:px-6">
              {[
                { id: "compose", name: "Compose" },
                { id: "templates", name: "Templates" },
                { id: "history", name: "History" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Compose Tab */}
        {activeTab === "compose" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Compose New Notification
              </h3>
              <form className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Notification Type
                    </label>
                    <select 
                      value={composeNotification.type}
                      onChange={(e) => setComposeNotification({...composeNotification, type: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">System Maintenance</option>
                      <option value="security">Security Alert</option>
                      <option value="feature">Feature Update</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Priority
                    </label>
                    <select 
                      value={composeNotification.priority || 'medium'}
                      onChange={(e) => setComposeNotification({...composeNotification, priority: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeNotification.subject}
                    onChange={(e) => setComposeNotification({...composeNotification, subject: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter notification subject"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={composeNotification.message}
                    onChange={(e) => setComposeNotification({...composeNotification, message: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter your notification message"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Recipients
                    </label>
                    <select 
                      value={composeNotification.recipients}
                      onChange={(e) => setComposeNotification({...composeNotification, recipients: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="all">All Users ({userCounts.total.toLocaleString()})</option>
                      <option value="admins">Admins Only ({userCounts.admins})</option>
                      <option value="tenants">Tenant Admins ({userCounts.tenants})</option>
                      <option value="doctors">Doctors ({userCounts.doctors})</option>
                      <option value="technicians">Technicians ({userCounts.technicians})</option>
                      <option value="patients">Patients ({userCounts.patients})</option>
                      <option value="custom">Custom Selection</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Send Schedule
                    </label>
                    <select className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent">
                      <option value="now">Send Now</option>
                      <option value="scheduled">Schedule for Later</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => {
                      setComposeNotification({
                        subject: "Test Notification",
                        message: "This is a test notification to verify the system is working correctly.",
                        type: "general",
                        recipients: "all",
                        scheduledDate: "",
                        scheduledTime: "",
                      });
                    }}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors"
                  >
                    Fill Test Data
                  </button>
                  <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors">
                    Save as Draft
                  </button>
                  <button 
                    onClick={handleSendNotification}
                    disabled={!composeNotification.subject || !composeNotification.message}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Notification Templates
              </h3>
              <button
                onClick={handleCreateTemplate}
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notificationTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {template.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {template.subject}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getTypeColor(
                        template.type
                      )}`}
                    >
                      {template.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span>Last Used:</span>
                      <span>{template.lastUsed}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span>Usage Count:</span>
                      <span>{template.usageCount}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
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
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Notification History
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      // Clear all notifications
                      if (window.confirm('Are you sure you want to delete all notifications?')) {
                        recentNotifications.forEach(notification => {
                          // Here you would call the delete API
                          console.log('Deleting notification:', notification.id);
                        });
                        setRecentNotifications([]);
                        loadStats(); // Refresh stats
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent w-full sm:w-auto"
                  >
                    <option value="all">All Types</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="feature">Feature</option>
                    <option value="billing">Billing</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Subject
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Type
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Recipients
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Sent At
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Open Rate
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentNotifications.map((notification) => (
                      <tr
                        key={notification.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                      >
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {notification.subject}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                              notification.type
                            )}`}
                          >
                            {notification.type}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              notification.status
                            )}`}
                          >
                            {notification.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {notification.recipients.toLocaleString()}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {notification.sentAt}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {notification.openRate}%
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleViewHistory(notification)}
                              className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400"
                              title="View Details"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => handleEditHistory(notification)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${notification.subject}"?`)) {
                                  setRecentNotifications(prev => prev.filter(n => n.id !== notification.id));
                                  loadStats(); // Refresh stats
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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

        {/* Compose Notification Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Compose Notification
                </h3>
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={composeNotification.subject}
                      onChange={(e) =>
                        setComposeNotification({
                          ...composeNotification,
                          subject: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      placeholder="Enter notification subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={composeNotification.type}
                      onChange={(e) =>
                        setComposeNotification({
                          ...composeNotification,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="feature">Feature</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recipients
                    </label>
                    <select
                      value={composeNotification.recipients}
                      onChange={(e) =>
                        setComposeNotification({
                          ...composeNotification,
                          recipients: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="admins">Admins Only</option>
                      <option value="tenants">Tenant Admins</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={composeNotification.scheduledDate}
                      onChange={(e) =>
                        setComposeNotification({
                          ...composeNotification,
                          scheduledDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={composeNotification.message}
                    onChange={(e) =>
                      setComposeNotification({
                        ...composeNotification,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter notification message"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotification}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handleSendNotification}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Template
                </h3>
                <button
                  onClick={() => setShowCreateTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      placeholder="Enter template name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newTemplate.type}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="feature">Feature</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter template subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={newTemplate.message}
                    onChange={(e) =>
                      setNewTemplate({
                        ...newTemplate,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter template message"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCreateTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplateSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Template Modal */}
        {showEditTemplateModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Template
                </h3>
                <button
                  onClick={() => setShowEditTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={editTemplate.name}
                      onChange={(e) =>
                        setEditTemplate({
                          ...editTemplate,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={editTemplate.type}
                      onChange={(e) =>
                        setEditTemplate({
                          ...editTemplate,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="feature">Feature</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editTemplate.subject}
                    onChange={(e) =>
                      setEditTemplate({
                        ...editTemplate,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={editTemplate.message}
                    onChange={(e) =>
                      setEditTemplate({
                        ...editTemplate,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowEditTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTemplate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Template
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Template Modal */}
        {showViewTemplateModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Template Details
                </h3>
                <button
                  onClick={() => setShowViewTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Template Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedTemplate.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        selectedTemplate.type
                      )}`}
                    >
                      {selectedTemplate.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Used
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedTemplate.lastUsed}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Usage Count
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedTemplate.usageCount}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTemplate.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedTemplate.message}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowViewTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View History Modal */}
        {showViewHistoryModal && selectedHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notification Details
                </h3>
                <button
                  onClick={() => setShowViewHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedHistory.subject}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        selectedHistory.type
                      )}`}
                    >
                      {selectedHistory.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedHistory.status
                      )}`}
                    >
                      {selectedHistory.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recipients
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedHistory.recipients.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sent At
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedHistory.sentAt}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Open Rate
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedHistory.openRate}%
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedHistory.message || "No message content available"}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowViewHistoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit History Modal */}
        {showEditHistoryModal && selectedHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Notification
                </h3>
                <button
                  onClick={() => setShowEditHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editHistory.subject}
                    onChange={(e) =>
                      setEditHistory({
                        ...editHistory,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editHistory.status}
                    onChange={(e) =>
                      setEditHistory({ ...editHistory, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  >
                    <option value="sent">Sent</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={editHistory.message}
                    onChange={(e) =>
                      setEditHistory({
                        ...editHistory,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowEditHistoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateHistory}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Notification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete History Modal */}
        {showDeleteHistoryModal && selectedHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Notification
                </h3>
                <button
                  onClick={() => setShowDeleteHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete the notification{" "}
                  <strong>"{selectedHistory.subject}"</strong>? This action
                  cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteHistoryModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteHistoryConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalNotification;
