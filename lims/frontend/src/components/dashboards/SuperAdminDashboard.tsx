import { Activity, BarChart3, Building2, Settings, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";
import BaseDashboard from "./BaseDashboard";

const SuperAdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState({
    totalTenants: 0,
    systemUsers: 0,
    activeSessions: 0,
    systemHealth: 99.9,
    loading: true,
    error: null as string | null,
  });

  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch all data in parallel
        const [tenantsResponse, systemLogsResponse, dashboardStatsResponse] =
          await Promise.all([
            superadminAPI.tenants.getCount(),
            superadminAPI.logs.getRecentActivity(),
            superadminAPI.tenants.getDashboardStats(),
          ]);

        // Use dashboard stats from backend
        const stats = dashboardStatsResponse.data;

        setDashboardData({
          totalTenants: stats.total_tenants,
          systemUsers: stats.total_users,
          activeSessions: stats.total_users, // Use total users as active sessions for now
          systemHealth: stats.system_health,
          loading: false,
          error: null,
        });

        // Set recent system logs
        setSystemLogs(systemLogsResponse.data.slice(0, 5)); // Show last 5 logs
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to load dashboard data",
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const superAdminCards = [
    {
      title: t('superadmin.totalTenants'),
      value: dashboardData.loading
        ? "..."
        : dashboardData.totalTenants.toString(),
      change: `+3 ${t('superadmin.thisMonth')}`,
      color: "bg-blue-500",
      chartData: [10, 15, 12, 18, 20, 22, dashboardData.totalTenants],
    },
    {
      title: t('superadmin.systemUsers'),
      value: dashboardData.loading
        ? "..."
        : dashboardData.systemUsers.toLocaleString(),
      change: `+12% ${t('superadmin.thisMonth')}`,
      color: "bg-green-500",
      chartData: [800, 900, 950, 1000, 1100, 1200, dashboardData.systemUsers],
    },
    {
      title: t('superadmin.activeSessions'),
      value: dashboardData.loading
        ? "..."
        : dashboardData.activeSessions.toString(),
      change: `+5% ${t('superadmin.today')}`,
      color: "bg-purple-500",
      chartData: [60, 70, 65, 75, 80, 85, dashboardData.activeSessions],
    },
    {
      title: t('superadmin.systemHealth'),
      value: dashboardData.loading ? "..." : `${dashboardData.systemHealth}%`,
      change: t('superadmin.stable'),
      color: "bg-emerald-500",
      chartData: [98, 99, 99.5, 99.8, 99.9, 99.9, dashboardData.systemHealth],
    },
  ];

  return (
    <BaseDashboard>
      {/* Super Admin specific cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {superAdminCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && (
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
                {index === 1 && (
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
                {index === 2 && (
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
                {index === 3 && (
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <span className="text-xs sm:text-sm font-medium">
                  {card.change}
                </span>
              </div>
            </div>

            <div className="flex items-end space-x-1 h-6 sm:h-8">
              {card.chartData.map((height, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-sm opacity-80`}
                  style={{
                    height: `${(height / Math.max(...card.chartData)) * 100}%`,
                    width: "6px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('superadmin.tenantGrowth')}
            </h3>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-xs sm:text-sm">
                {t('superadmin.tenantGrowthChart')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('superadmin.systemPerformance')}
            </h3>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Activity className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-xs sm:text-sm">
                {t('superadmin.systemPerformanceMetrics')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6 p-4 sm:p-6 pb-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {t('superadmin.recentSystemActivity')}
          </h3>
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('superadmin.timestamp')}
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('superadmin.user')}
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('superadmin.action')}
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('superadmin.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dashboardData.loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t('superadmin.loadingSystemLogs')}
                  </td>
                </tr>
              ) : dashboardData.error ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-red-500">
                    {t('superadmin.errorLoadingLogs')} {dashboardData.error}
                  </td>
                </tr>
              ) : systemLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t('superadmin.noRecentActivity')}
                  </td>
                </tr>
              ) : (
                systemLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {log.user || t('superadmin.system')}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {log.action || t('superadmin.systemActivity')}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.level === "error"
                            ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                            : log.level === "warning"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                            : log.level === "info"
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                            : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                        }`}
                      >
                        {log.level === "error" 
                          ? t('superadmin.error')
                          : log.level === "warning"
                          ? t('superadmin.warning')
                          : log.level === "info"
                          ? t('superadmin.info')
                          : t('superadmin.success')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default SuperAdminDashboard;
