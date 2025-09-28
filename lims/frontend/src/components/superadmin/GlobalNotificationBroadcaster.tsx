import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  Send,
  Shield,
  Wrench,
  X
} from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNotifications } from "../../contexts/NotificationContext";

interface NotificationFormData {
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target_audience: 'all' | 'roles' | 'tenants';
  target_roles: string[];
  target_tenants: string[];
  action_url: string;
  expires_in_hours: number;
}

const GlobalNotificationBroadcaster: React.FC = () => {
  const { 
    sendGlobalNotification, 
    sendToRoles, 
    sendToTenants, 
    sendMaintenanceAlert, 
    sendSecurityAlert,
    error,
    clearError 
  } = useNotifications();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'general' | 'maintenance' | 'security'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    notification_type: 'info',
    priority: 'medium',
    target_audience: 'all',
    target_roles: [],
    target_tenants: [],
    action_url: '',
    expires_in_hours: 24
  });

  const [maintenanceData, setMaintenanceData] = useState({
    title: '',
    message: '',
    maintenance_type: 'scheduled' as 'scheduled' | 'emergency' | 'planned',
    priority: 'high' as 'low' | 'medium' | 'high' | 'critical',
    affected_services: [] as string[]
  });

  const [securityData, setSecurityData] = useState({
    title: '',
    message: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    action_required: false
  });

  const availableRoles = [
    'superadmin',
    'tenantadmin', 
    'doctor',
    'technician',
    'patient',
    'support'
  ];

  const availableTenants = [
    'tenant1',
    'tenant2', 
    'tenant3'
  ];

  const availableServices = [
    'Database',
    'API Services',
    'File Storage',
    'Email Service',
    'Authentication',
    'Backup System'
  ];

  const handleInputChange = (field: keyof NotificationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaintenanceChange = (field: keyof typeof maintenanceData, value: any) => {
    setMaintenanceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field: keyof typeof securityData, value: any) => {
    setSecurityData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  const handleTenantToggle = (tenant: string) => {
    setFormData(prev => ({
      ...prev,
      target_tenants: prev.target_tenants.includes(tenant)
        ? prev.target_tenants.filter(t => t !== tenant)
        : [...prev.target_tenants, tenant]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setMaintenanceData(prev => ({
      ...prev,
      affected_services: prev.affected_services.includes(service)
        ? prev.affected_services.filter(s => s !== service)
        : [...prev.affected_services, service]
    }));
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleSendGeneral = async () => {
    if (!formData.title || !formData.message) {
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      
      if (formData.target_audience === 'roles' && formData.target_roles.length > 0) {
        success = await sendToRoles({
          title: formData.title,
          message: formData.message,
          roles: formData.target_roles,
          notification_type: formData.notification_type,
          priority: formData.priority,
          action_url: formData.action_url || undefined,
          expires_in_hours: formData.expires_in_hours
        });
      } else if (formData.target_audience === 'tenants' && formData.target_tenants.length > 0) {
        success = await sendToTenants({
          title: formData.title,
          message: formData.message,
          tenants: formData.target_tenants,
          notification_type: formData.notification_type,
          priority: formData.priority,
          action_url: formData.action_url || undefined,
          expires_in_hours: formData.expires_in_hours
        });
      } else {
        success = await sendGlobalNotification({
          title: formData.title,
          message: formData.message,
          notification_type: formData.notification_type,
          priority: formData.priority,
          target_audience: formData.target_audience,
          target_roles: formData.target_roles.length > 0 ? formData.target_roles : undefined,
          target_tenants: formData.target_tenants.length > 0 ? formData.target_tenants : undefined,
          action_url: formData.action_url || undefined,
          expires_in_hours: formData.expires_in_hours
        });
      }

      if (success) {
        showSuccessMessage('Notification sent successfully!');
        // Reset form
        setFormData({
          title: '',
          message: '',
          notification_type: 'info',
          priority: 'medium',
          target_audience: 'all',
          target_roles: [],
          target_tenants: [],
          action_url: '',
          expires_in_hours: 24
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMaintenance = async () => {
    if (!maintenanceData.title || !maintenanceData.message) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendMaintenanceAlert(maintenanceData);
      if (success) {
        showSuccessMessage('Maintenance alert sent successfully!');
        setMaintenanceData({
          title: '',
          message: '',
          maintenance_type: 'scheduled',
          priority: 'high',
          affected_services: []
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSecurity = async () => {
    if (!securityData.title || !securityData.message) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendSecurityAlert(securityData);
      if (success) {
        showSuccessMessage('Security alert sent successfully!');
        setSecurityData({
          title: '',
          message: '',
          severity: 'medium',
          action_required: false
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Global Notification Broadcaster
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Send notifications to all users or specific audiences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-primary-600" />
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 dark:text-green-200">{successMessage}</span>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>General Notification</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maintenance'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>Maintenance Alert</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security Alert</span>
            </div>
          </button>
        </nav>
      </div>

      {/* General Notification Form */}
      {activeTab === 'general' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.notification_type}
                  onChange={(e) => handleInputChange('notification_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter notification message"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expires In (Hours)
                </label>
                <input
                  type="number"
                  value={formData.expires_in_hours}
                  onChange={(e) => handleInputChange('expires_in_hours', parseInt(e.target.value))}
                  min="1"
                  max="168"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Audience
              </label>
              <select
                value={formData.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Users</option>
                <option value="roles">Specific Roles</option>
                <option value="tenants">Specific Tenants</option>
              </select>
            </div>

            {/* Role Selection */}
            {formData.target_audience === 'roles' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Roles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableRoles.map((role) => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.target_roles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {role.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tenant Selection */}
            {formData.target_audience === 'tenants' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Tenants
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTenants.map((tenant) => (
                    <label key={tenant} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.target_tenants.includes(tenant)}
                        onChange={() => handleTenantToggle(tenant)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {tenant}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Action URL (Optional)
              </label>
              <input
                type="url"
                value={formData.action_url}
                onChange={(e) => handleInputChange('action_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/action"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendGeneral}
                disabled={isLoading || !formData.title || !formData.message}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'Sending...' : 'Send Notification'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Alert Form */}
      {activeTab === 'maintenance' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={maintenanceData.title}
                  onChange={(e) => handleMaintenanceChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Scheduled Database Maintenance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maintenance Type
                </label>
                <select
                  value={maintenanceData.maintenance_type}
                  onChange={(e) => handleMaintenanceChange('maintenance_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="emergency">Emergency</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={maintenanceData.message}
                onChange={(e) => handleMaintenanceChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the maintenance details, duration, and impact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={maintenanceData.priority}
                onChange={(e) => handleMaintenanceChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Affected Services (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={maintenanceData.affected_services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendMaintenance}
                disabled={isLoading || !maintenanceData.title || !maintenanceData.message}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Wrench className="w-4 h-4" />
                <span>{isLoading ? 'Sending...' : 'Send Maintenance Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Alert Form */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={securityData.title}
                  onChange={(e) => handleSecurityChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Security Incident Detected"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severity
                </label>
                <select
                  value={securityData.severity}
                  onChange={(e) => handleSecurityChange('severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                value={securityData.message}
                onChange={(e) => handleSecurityChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the security incident and any required actions"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securityData.action_required}
                  onChange={(e) => handleSecurityChange('action_required', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Immediate Action Required
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendSecurity}
                disabled={isLoading || !securityData.title || !securityData.message}
                className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>{isLoading ? 'Sending...' : 'Send Security Alert'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalNotificationBroadcaster;
