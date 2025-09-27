import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { superadminAPI } from "../../services/api";

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

  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load logs from backend API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superadminAPI.logs.getAll();
        setSystemLogs(response.data);
      } catch (error: any) {
        console.error("Error fetching system logs:", error);
        setError(error.message || "Failed to load system logs");
        // Fallback to localStorage if API fails
        const savedLogs = localStorage.getItem("superadmin-system-logs");
        if (savedLogs) {
          try {
            setSystemLogs(JSON.parse(savedLogs));
          } catch (parseError) {
            console.error("Error parsing saved logs:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Export functionality
  const handleExportLogs = () => {
    const csvContent = generateLogsCSV();
    downloadCSV(csvContent, "system-logs-report.csv");
  };

  const generateLogsCSV = () => {
    const headers = [
      "Timestamp",
      "Level",
      "Category",
      "Message",
      "User",
      "IP Address",
      "Tenant",
      "Details",
    ];

    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.level,
      log.category,
      log.message,
      log.user,
      log.ip,
      log.tenant,
      JSON.stringify(log.details),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add a new log entry to simulate refresh
    const newLog = {
      id: (systemLogs.length + 1).toString(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      level: "info",
      category: "system",
      message: "System logs refreshed successfully",
      user: "system",
      ip: "127.0.0.1",
      tenant: "System",
      details: {
        refreshTime: new Date().toISOString(),
        totalLogs: systemLogs.length + 1,
      },
    };

    setSystemLogs((prev: any) => [newLog, ...prev]);
    setIsRefreshing(false);
  };

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
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return (
          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
      case "debug":
        return (
          <Activity className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        );
      default:
        return (
          <Activity className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        );
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
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "authentication":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "database":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400";
      case "api":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "system":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white";
      case "security":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 dark:text-red-400 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading system logs...
          </span>
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              System Logs
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Monitor system activity, errors, and security events
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 disabled:opacity-50 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportLogs}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs by message, user, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
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
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Level
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Message
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
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
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white font-mono">
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
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white max-w-xs sm:max-w-md">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {log.tenant}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white font-mono">
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
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Click on any log entry to view detailed information
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
