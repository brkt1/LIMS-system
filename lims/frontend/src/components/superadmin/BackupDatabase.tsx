import {
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  X,
  XCircle
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { superadminAPI } from "../../services/api";

const BackupDatabase: React.FC = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showCreateBackupModal, setShowCreateBackupModal] = useState(false);
  const [showManualBackupModal, setShowManualBackupModal] = useState(false);
  const [showScheduleBackupModal, setShowScheduleBackupModal] = useState(false);
  const [showConfigureSettingsModal, setShowConfigureSettingsModal] =
    useState(false);
  const [showDeleteBackupModal, setShowDeleteBackupModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);

  // Form states
  const [createBackup, setCreateBackup] = useState({
    name: "",
    type: "full",
    description: "",
  });

  const [manualBackup, setManualBackup] = useState({
    name: "",
    type: "full",
    description: "",
    includeLogs: true,
    compression: "gzip",
  });

  const [scheduleBackup, setScheduleBackup] = useState({
    name: "",
    type: "full",
    frequency: "daily",
    time: "02:00",
    retention: "30",
    enabled: true,
  });

  const [backupSettings, setBackupSettings] = useState({
    storagePath: "/backups",
    maxBackups: "10",
    compressionLevel: "6",
    encryption: false,
    emailNotifications: true,
    autoCleanup: true,
  });

  // Filter states
  const [filterType, setFilterType] = useState("all");

  const [backupStats, setBackupStats] = useState({
    totalBackups: 0,
    lastBackup: "",
    nextBackup: "",
    totalSize: "0 GB",
    availableSpace: "0 GB",
    successRate: 0,
  });

  const [backupHistory, setBackupHistory] = useState<any[]>([]);

  // Load data from backend API
  useEffect(() => {
    const fetchBackupData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superadminAPI.backups.getAll();
        setBackupHistory(response.data);
        loadBackupStats(response.data);
      } catch (error: any) {
        console.error("Error fetching backup history:", error);
        setError(error.message || "Failed to load backup history");
        setBackupHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBackupData();
  }, []);

  const loadBackupStats = (backups: any[]) => {
    const totalBackups = backups.length;
    const completedBackups = backups.filter(b => b.status === 'completed');
    const lastBackup = completedBackups.length > 0 ? completedBackups[0].created_at : '';
    const nextBackup = backups.find(b => b.is_scheduled && b.status === 'pending')?.scheduled_at || '';
    const totalSize = completedBackups.reduce((sum, b) => sum + (b.file_size || 0), 0);
    const successRate = totalBackups > 0 ? (completedBackups.length / totalBackups) * 100 : 0;

    setBackupStats({
      totalBackups,
      lastBackup,
      nextBackup,
      totalSize: `${(totalSize / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      availableSpace: "47.7 GB", // This would come from system info
      successRate: Math.round(successRate * 10) / 10,
    });
  };

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      "superadmin-backup-history",
      JSON.stringify(backupHistory)
    );
  }, [backupHistory]);

  // Handler functions
  const handleCreateBackup = () => {
    setShowCreateBackupModal(true);
  };

  const handleCreateBackupSubmit = () => {
    const newBackup = {
      id: (backupHistory.length + 1).toString(),
      name:
        createBackup.name ||
        `backup_${new Date().toISOString().split("T")[0]}_${Date.now()}.tar.gz`,
      size: "2.3 GB",
      status: "completed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      duration: "15 minutes",
      type: createBackup.type === "full" ? "Full Backup" : "Incremental Backup",
      retention: "30 days",
    };

    setBackupHistory((prev: any) => [newBackup, ...prev]);
    setShowCreateBackupModal(false);
    setCreateBackup({ name: "", type: "full", description: "" });
  };

  const handleManualBackup = () => {
    setShowManualBackupModal(true);
  };

  const handleManualBackupSubmit = () => {
    const newBackup = {
      id: (backupHistory.length + 1).toString(),
      name:
        manualBackup.name ||
        `manual_backup_${
          new Date().toISOString().split("T")[0]
        }_${Date.now()}.tar.gz`,
      size: "2.3 GB",
      status: "completed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      duration: "15 minutes",
      type: manualBackup.type === "full" ? "Full Backup" : "Incremental Backup",
      retention: "30 days",
    };

    setBackupHistory((prev: any) => [newBackup, ...prev]);
    setShowManualBackupModal(false);
    setManualBackup({
      name: "",
      type: "full",
      description: "",
      includeLogs: true,
      compression: "gzip",
    });
  };

  const handleScheduleBackup = () => {
    setShowScheduleBackupModal(true);
  };

  const handleScheduleBackupSubmit = () => {
    console.log("Scheduling backup:", scheduleBackup);
    setShowScheduleBackupModal(false);
    setScheduleBackup({
      name: "",
      type: "full",
      frequency: "daily",
      time: "02:00",
      retention: "30",
      enabled: true,
    });
  };

  const handleConfigureSettings = () => {
    setShowConfigureSettingsModal(true);
  };

  const handleConfigureSettingsSubmit = () => {
    console.log("Saving backup settings:", backupSettings);
    setShowConfigureSettingsModal(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add a new backup entry to simulate refresh
    const newBackup = {
      id: (backupHistory.length + 1).toString(),
      name: `refresh_backup_${
        new Date().toISOString().split("T")[0]
      }_${Date.now()}.tar.gz`,
      size: "2.3 GB",
      status: "completed",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      duration: "15 minutes",
      type: "Full Backup",
      retention: "30 days",
    };

    setBackupHistory((prev: any) => [newBackup, ...prev]);
    setIsRefreshing(false);
  };

  const handleDownloadBackup = (backup: any) => {
    // Simulate download functionality
    console.log("Downloading backup:", backup.name);

    // Create a simulated download
    const element = document.createElement("a");
    const content = `Backup: ${backup.name}\nSize: ${backup.size}\nType: ${backup.type}\nCreated: ${backup.createdAt}\nDuration: ${backup.duration}\nRetention: ${backup.retention}`;
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${backup.name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show success message
    alert(`Download started for ${backup.name}`);
  };

  const handleDeleteBackup = (backup: any) => {
    setSelectedBackup(backup);
    setShowDeleteBackupModal(true);
  };

  const handleDeleteBackupConfirm = () => {
    if (selectedBackup) {
      setBackupHistory((prev: any) =>
        prev.filter((backup: any) => backup.id !== selectedBackup.id)
      );
      setShowDeleteBackupModal(false);
      setSelectedBackup(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "in_progress":
        return (
          <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
        );
      case "scheduled":
        return (
          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      default:
        return (
          <Database className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Backup Database
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage database backups, schedules, and recovery options
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              {isCreatingBackup ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isCreatingBackup ? "Creating..." : "Create Backup"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Backups
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {backupStats.totalBackups}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  +2 this week
                </p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Last Backup
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Today
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  2:00 AM
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Size
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {backupStats.totalSize}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Compressed
                </p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Success Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {backupStats.successRate}%
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  Excellent
                </p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Backup Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Backup Status
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Last Backup
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {backupStats.lastBackup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Next Scheduled
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {backupStats.nextBackup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Available Space
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  {backupStats.availableSpace}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "95%" }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                95% of storage used
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleManualBackup}
                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Create Manual Backup</span>
              </button>
              <button
                onClick={handleScheduleBackup}
                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Backup</span>
              </button>
              <button
                onClick={handleConfigureSettings}
                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base"
              >
                <Settings className="w-4 h-4" />
                <span>Configure Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Backup History
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="all">All Backups</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Backup Name
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Size
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Duration
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Retention
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backupHistory.map((backup) => (
                  <tr
                    key={backup.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(backup.status)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            backup.status
                          )}`}
                        >
                          {backup.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {backup.name}
                      </div>
                      {backup.error && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {backup.error}
                        </div>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {backup.type}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {backup.size}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {backup.createdAt}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {backup.duration}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {backup.retention}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {backup.status === "completed" && (
                          <button
                            onClick={() => handleDownloadBackup(backup)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400"
                            title="Download Backup"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBackup(backup)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400"
                          title="Delete Backup"
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

        {/* Create Backup Modal */}
        {showCreateBackupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Backup
                </h3>
                <button
                  onClick={() => setShowCreateBackupModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Backup Name
                    </label>
                    <input
                      type="text"
                      value={createBackup.name}
                      onChange={(e) =>
                        setCreateBackup({
                          ...createBackup,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      placeholder="Enter backup name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Backup Type
                    </label>
                    <select
                      value={createBackup.type}
                      onChange={(e) =>
                        setCreateBackup({
                          ...createBackup,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="full">Full Backup</option>
                      <option value="incremental">Incremental Backup</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createBackup.description}
                    onChange={(e) =>
                      setCreateBackup({
                        ...createBackup,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter backup description (optional)"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCreateBackupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBackupSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Backup Modal */}
        {showManualBackupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create Manual Backup
                </h3>
                <button
                  onClick={() => setShowManualBackupModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Backup Name
                    </label>
                    <input
                      type="text"
                      value={manualBackup.name}
                      onChange={(e) =>
                        setManualBackup({
                          ...manualBackup,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      placeholder="Enter backup name (optional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Backup Type
                    </label>
                    <select
                      value={manualBackup.type}
                      onChange={(e) =>
                        setManualBackup({
                          ...manualBackup,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="full">Full Backup</option>
                      <option value="incremental">Incremental Backup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Compression
                    </label>
                    <select
                      value={manualBackup.compression}
                      onChange={(e) =>
                        setManualBackup({
                          ...manualBackup,
                          compression: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="gzip">Gzip</option>
                      <option value="bzip2">Bzip2</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={manualBackup.description}
                    onChange={(e) =>
                      setManualBackup({
                        ...manualBackup,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    placeholder="Enter backup description (optional)"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeLogs"
                    checked={manualBackup.includeLogs}
                    onChange={(e) =>
                      setManualBackup({
                        ...manualBackup,
                        includeLogs: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="includeLogs"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Include transaction logs
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowManualBackupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualBackupSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Manual Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Backup Modal */}
        {showScheduleBackupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Schedule Backup
                </h3>
                <button
                  onClick={() => setShowScheduleBackupModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Schedule Name
                    </label>
                    <input
                      type="text"
                      value={scheduleBackup.name}
                      onChange={(e) =>
                        setScheduleBackup({
                          ...scheduleBackup,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      placeholder="Enter schedule name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Backup Type
                    </label>
                    <select
                      value={scheduleBackup.type}
                      onChange={(e) =>
                        setScheduleBackup({
                          ...scheduleBackup,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="full">Full Backup</option>
                      <option value="incremental">Incremental Backup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency
                    </label>
                    <select
                      value={scheduleBackup.frequency}
                      onChange={(e) =>
                        setScheduleBackup({
                          ...scheduleBackup,
                          frequency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleBackup.time}
                      onChange={(e) =>
                        setScheduleBackup({
                          ...scheduleBackup,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Retention (days)
                    </label>
                    <input
                      type="number"
                      value={scheduleBackup.retention}
                      onChange={(e) =>
                        setScheduleBackup({
                          ...scheduleBackup,
                          retention: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      min="1"
                      max="365"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={scheduleBackup.enabled}
                    onChange={(e) =>
                      setScheduleBackup({
                        ...scheduleBackup,
                        enabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="enabled"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Enable this schedule
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowScheduleBackupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleBackupSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Configure Settings Modal */}
        {showConfigureSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Configure Backup Settings
                </h3>
                <button
                  onClick={() => setShowConfigureSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage Path
                    </label>
                    <input
                      type="text"
                      value={backupSettings.storagePath}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          storagePath: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Backups
                    </label>
                    <input
                      type="number"
                      value={backupSettings.maxBackups}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          maxBackups: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Compression Level
                    </label>
                    <select
                      value={backupSettings.compressionLevel}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          compressionLevel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="1">1 (Fastest)</option>
                      <option value="3">3</option>
                      <option value="6">6 (Default)</option>
                      <option value="9">9 (Best Compression)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="encryption"
                      checked={backupSettings.encryption}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          encryption: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="encryption"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Enable encryption
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={backupSettings.emailNotifications}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="emailNotifications"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoCleanup"
                      checked={backupSettings.autoCleanup}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          autoCleanup: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="autoCleanup"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Auto cleanup old backups
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowConfigureSettingsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfigureSettingsSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Backup Modal */}
        {showDeleteBackupModal && selectedBackup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Backup
                </h3>
                <button
                  onClick={() => setShowDeleteBackupModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete the backup{" "}
                  <strong>"{selectedBackup.name}"</strong>? This action cannot
                  be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteBackupModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBackupConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Backup Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    defaultValue="02:00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Retention Period
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base">
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compression Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base">
                    <option value="fast">Fast (Less compression)</option>
                    <option value="balanced">Balanced</option>
                    <option value="high">High (More compression)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupDatabase;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setError(arg0: null) {
  throw new Error("Function not implemented.");
}

