import {
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  Play,
  RefreshCw,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

const BackupDatabase: React.FC = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const backupStats = {
    totalBackups: 24,
    lastBackup: "2025-01-20 02:00:00",
    nextBackup: "2025-01-21 02:00:00",
    totalSize: "2.3 GB",
    availableSpace: "47.7 GB",
    successRate: 98.5,
  };

  const backupHistory = [
    {
      id: "1",
      name: "backup_2025-01-20_02-00-00.tar.gz",
      size: "2.3 GB",
      status: "completed",
      createdAt: "2025-01-20 02:00:00",
      duration: "15 minutes",
      type: "Full Backup",
      retention: "30 days",
    },
    {
      id: "2",
      name: "backup_2025-01-19_02-00-00.tar.gz",
      size: "2.2 GB",
      status: "completed",
      createdAt: "2025-01-19 02:00:00",
      duration: "14 minutes",
      type: "Full Backup",
      retention: "30 days",
    },
    {
      id: "3",
      name: "backup_2025-01-18_02-00-00.tar.gz",
      size: "2.1 GB",
      status: "completed",
      createdAt: "2025-01-18 02:00:00",
      duration: "13 minutes",
      type: "Full Backup",
      retention: "30 days",
    },
    {
      id: "4",
      name: "backup_2025-01-17_02-00-00.tar.gz",
      size: "2.0 GB",
      status: "failed",
      createdAt: "2025-01-17 02:00:00",
      duration: "5 minutes",
      type: "Full Backup",
      retention: "30 days",
      error: "Insufficient disk space",
    },
    {
      id: "5",
      name: "backup_2025-01-16_02-00-00.tar.gz",
      size: "1.9 GB",
      status: "completed",
      createdAt: "2025-01-16 02:00:00",
      duration: "12 minutes",
      type: "Incremental Backup",
      retention: "30 days",
    },
  ];

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
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "in_progress":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCreatingBackup(false);
  };

  const handleDownloadBackup = (backupId: string) => {
    console.log(`Downloading backup ${backupId}`);
    // Implement download logic
  };

  const handleDeleteBackup = (backupId: string) => {
    console.log(`Deleting backup ${backupId}`);
    // Implement delete logic
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Backup Database
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage database backups, schedules, and recovery options
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
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
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Backups
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {backupStats.totalBackups}
                </p>
                <p className="text-xs sm:text-sm text-green-600">
                  +2 this week
                </p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Last Backup
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  Today
                </p>
                <p className="text-xs sm:text-sm text-gray-500">2:00 AM</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Size
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {backupStats.totalSize}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Compressed</p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {backupStats.successRate}%
                </p>
                <p className="text-xs sm:text-sm text-green-600">Excellent</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Backup Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Backup Status
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">
                  Last Backup
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {backupStats.lastBackup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">
                  Next Scheduled
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {backupStats.nextBackup}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">
                  Available Space
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {backupStats.availableSpace}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "95%" }}
                />
              </div>
              <p className="text-xs text-gray-500">95% of storage used</p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
              >
                {isCreatingBackup ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>
                  {isCreatingBackup
                    ? "Creating Backup..."
                    : "Create Manual Backup"}
                </span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Calendar className="w-4 h-4" />
                <span>Schedule Backup</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Settings className="w-4 h-4" />
                <span>Configure Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Backup History */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Backup History
            </h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Backups</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Backup Name
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Size
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Created
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Duration
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Retention
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backupHistory.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
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
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {backup.name}
                      </div>
                      {backup.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {backup.error}
                        </div>
                      )}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {backup.type}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {backup.size}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {backup.createdAt}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {backup.duration}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {backup.retention}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {backup.status === "completed" && (
                          <button
                            onClick={() => handleDownloadBackup(backup.id)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Download Backup"
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
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

        {/* Backup Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Backup Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    defaultValue="02:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retention Period
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compression Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                    <option value="fast">Fast (Less compression)</option>
                    <option value="balanced">Balanced</option>
                    <option value="high">High (More compression)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
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
