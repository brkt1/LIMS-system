import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logLevels = [
    { id: "all", name: "All Levels", count: 1247 },
    { id: "error", name: "Error", count: 23 },
    { id: "warning", name: "Warning", count: 45 },
    { id: "info", name: "Info", count: 1156 },
    { id: "debug", name: "Debug", count: 23 },
  ];

  const logCategories = [
    { id: "all", name: "All Categories" },
    { id: "authentication", name: "Authentication" },
    { id: "database", name: "Database" },
    { id: "api", name: "API" },
    { id: "system", name: "System" },
    { id: "security", name: "Security" },
  ];

  const systemLogs = [
    {
      id: "1",
      timestamp: "2025-01-20 14:30:25",
      level: "info",
      category: "authentication",
      message: "User john.smith@lims.com logged in successfully",
      user: "john.smith@lims.com",
      ip: "192.168.1.100",
      tenant: "Research Institute",
      details: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        sessionId: "sess_abc123",
        duration: "2.3s",
      },
    },
    {
      id: "2",
      timestamp: "2025-01-20 14:28:15",
      level: "warning",
      category: "database",
      message: "Database connection pool near capacity (85% usage)",
      user: "system",
      ip: "127.0.0.1",
      tenant: "System",
      details: {
        connectionCount: 85,
        maxConnections: 100,
        recommendation: "Consider increasing pool size",
      },
    },
    {
      id: "3",
      timestamp: "2025-01-20 14:25:42",
      level: "error",
      category: "api",
      message: "API rate limit exceeded for tenant medlab.lims.com",
      user: "api_user",
      ip: "203.0.113.45",
      tenant: "MedLab Solutions",
      details: {
        endpoint: "/api/v1/test-results",
        rateLimit: "1000/hour",
        currentUsage: "1000",
        resetTime: "2025-01-20 15:00:00",
      },
    },
    {
      id: "4",
      timestamp: "2025-01-20 14:20:18",
      level: "info",
      category: "system",
      message: "Scheduled backup completed successfully",
      user: "system",
      ip: "127.0.0.1",
      tenant: "System",
      details: {
        backupSize: "2.3 GB",
        duration: "15 minutes",
        location: "/backups/2025-01-20-14-20-18.tar.gz",
      },
    },
    {
      id: "5",
      timestamp: "2025-01-20 14:15:33",
      level: "error",
      category: "security",
      message: "Failed login attempt for user admin@lims.com",
      user: "admin@lims.com",
      ip: "198.51.100.42",
      tenant: "System",
      details: {
        reason: "Invalid password",
        attemptCount: 3,
        blocked: true,
        blockDuration: "15 minutes",
      },
    },
    {
      id: "6",
      timestamp: "2025-01-20 14:10:07",
      level: "info",
      category: "api",
      message: "New tenant created: Private Clinic Network",
      user: "sarah.johnson@lims.com",
      ip: "192.168.1.50",
      tenant: "System",
      details: {
        tenantId: "tenant_pcn_001",
        plan: "Basic",
        adminEmail: "admin@pcn.com",
      },
    },
  ];

  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    const matchesCategory =
      filterCategory === "all" || log.category === filterCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "debug":
        return <Activity className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "authentication":
        return "bg-green-100 text-green-800";
      case "database":
        return "bg-purple-100 text-purple-800";
      case "api":
        return "bg-blue-100 text-blue-800";
      case "system":
        return "bg-gray-100 text-gray-800";
      case "security":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              System Logs
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor system activity, errors, and security events
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto">
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Log Level Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {logLevels.map((level) => (
            <div
              key={level.id}
              className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm border cursor-pointer transition-all ${
                filterLevel === level.id
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-md"
              }`}
              onClick={() => setFilterLevel(level.id)}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {level.name}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {level.count}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {getLevelIcon(level.id)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs by message, user, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {logLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name} ({level.count})
                  </option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {logCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Level
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Category
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Message
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="flex-shrink-0">
                          {getLevelIcon(log.level)}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                            log.level
                          )}`}
                        >
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 font-mono">
                      {log.timestamp}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                          log.category
                        )}`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 max-w-xs sm:max-w-md">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {log.user}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {log.tenant}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 font-mono">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Details Modal (would be implemented) */}
        <div className="text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-gray-500">
            Click on any log entry to view detailed information
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
