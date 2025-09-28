import {
    BarChart3,
    Calendar,
    Download,
    Filter,
    TrendingUp,
    Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";

const UsageAnalysis: React.FC = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  const [usageData, setUsageData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTenants: 0,
    activeTenants: 0,
    totalTests: 0,
    totalReports: 0,
    systemUptime: 99.9,
    avgResponseTime: 245,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tenantUsage, setTenantUsage] = useState<any[]>([]);
  const [featureUsage, setFeatureUsage] = useState<any[]>([]);

  // Load usage data from backend
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate days based on time range
        const getDaysFromRange = (range: string) => {
          switch (range) {
            case "7d": return 7;
            case "30d": return 30;
            case "90d": return 90;
            case "1y": return 365;
            default: return 30;
          }
        };

        const days = getDaysFromRange(timeRange);

        const [analysisResponse, tenantUsageResponse, featureUsageResponse] =
          await Promise.all([
            superadminAPI.usage.getAnalysis({ days }),
            superadminAPI.usage.getTenantUsage(),
            superadminAPI.usage.getFeatureUsage(),
          ]);

        // Map backend data to frontend format
        const backendData = analysisResponse.data;
        setUsageData({
          totalUsers: backendData.total_users || 0,
          activeUsers: backendData.active_users || 0,
          totalTenants: backendData.total_tenants || 0,
          activeTenants: backendData.active_tenants || 0,
          totalTests: backendData.total_tests || 0,
          totalReports: backendData.total_reports || 0,
          systemUptime: backendData.system_uptime || 99.9,
          avgResponseTime: backendData.avg_response_time || 245,
        });

        setTenantUsage(tenantUsageResponse.data || []);
        setFeatureUsage(featureUsageResponse.data || []);
      } catch (error: any) {
        console.error("Error fetching usage data:", error);
        setError(error.message || "Failed to load usage data");
        
        // Set fallback values when API fails
        setUsageData({
          totalUsers: 0,
          activeUsers: 0,
          totalTenants: 0,
          activeTenants: 0,
          totalTests: 0,
          totalReports: 0,
          systemUptime: 99.9,
          avgResponseTime: 245,
        });
        setTenantUsage([]);
        setFeatureUsage([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [timeRange]);

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return t('usageAnalysis.last7Days');
      case "30d":
        return t('usageAnalysis.last30Days');
      case "90d":
        return t('usageAnalysis.last90Days');
      case "1y":
        return t('usageAnalysis.lastYear');
      default:
        return t('usageAnalysis.last30Days');
    }
  };

  // Export functionality
  const handleExportReport = () => {
    const csvContent = generateUsageReportCSV();
    downloadCSV(csvContent, `usage-analysis-report-${timeRange}.csv`);
  };

  const generateUsageReportCSV = () => {
    const headers = [
      t('usageAnalysis.exportHeaders.metric'),
      t('usageAnalysis.exportHeaders.value'),
      t('usageAnalysis.exportHeaders.timeRange'),
      t('usageAnalysis.exportHeaders.generatedDate')
    ];

    const currentDate = new Date().toISOString().split("T")[0];
    const timeRangeLabel = getTimeRangeLabel(timeRange);

    const rows = [
      [
        t('usageAnalysis.exportHeaders.totalUsers'),
        usageData.totalUsers.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.activeUsers'),
        usageData.activeUsers.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.totalTenants'),
        usageData.totalTenants.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.activeTenants'),
        usageData.activeTenants.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.totalTests'),
        usageData.totalTests.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.totalReports'),
        usageData.totalReports.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.systemUptime'),
        usageData.systemUptime.toString(),
        timeRangeLabel,
        currentDate,
      ],
      [
        t('usageAnalysis.exportHeaders.avgResponseTime'),
        usageData.avgResponseTime.toString(),
        timeRangeLabel,
        currentDate,
      ],
      ["", "", "", ""], // Empty row
      [
        t('usageAnalysis.exportHeaders.tenantName'),
        t('usageAnalysis.exportHeaders.users'),
        t('usageAnalysis.exportHeaders.tests'),
        t('usageAnalysis.exportHeaders.reports'),
        t('usageAnalysis.exportHeaders.growth'),
        t('usageAnalysis.exportHeaders.timeRange'),
        t('usageAnalysis.exportHeaders.generatedDate'),
      ],
    ];

    // Add tenant usage data
    tenantUsage.forEach((tenant) => {
      rows.push([
        tenant.tenant_name || 'N/A',
        (tenant.users || 0).toString(),
        (tenant.tests || 0).toString(),
        (tenant.reports || 0).toString(),
        (tenant.growth || 0).toString(),
        timeRangeLabel,
        currentDate,
      ]);
    });

    const csvContent = rows
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

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('usageAnalysis.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t('usageAnalysis.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleExportReport}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>{t('usageAnalysis.exportReport')}</span>
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base w-full sm:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">{t('usageAnalysis.last7Days')}</option>
              <option value="30d">{t('usageAnalysis.last30Days')}</option>
              <option value="90d">{t('usageAnalysis.last90Days')}</option>
              <option value="1y">{t('usageAnalysis.lastYear')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 dark:text-red-400 text-xs underline"
            >
              {t('usageAnalysis.dismiss')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {t('usageAnalysis.loadingUsageData')}
            </span>
          </div>
        )}
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {t('usageAnalysis.totalUsers')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {(usageData.totalUsers || 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% {t('usageAnalysis.fromLastMonth')}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {t('usageAnalysis.activeUsers')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {(usageData.activeUsers || 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(
                    (usageData.activeUsers / (usageData.totalUsers || 1)) * 100
                  )}
                  % {t('usageAnalysis.ofTotal')}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {t('usageAnalysis.totalTests')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {(usageData.totalTests || 0).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% {t('usageAnalysis.fromLastMonth')}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {t('usageAnalysis.systemUptime')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {usageData.systemUptime}%
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  {t('usageAnalysis.excellent')}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Usage Trends */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {t('usageAnalysis.usageTrends')}
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                >
                  <option value="users">{t('usageAnalysis.users')}</option>
                  <option value="tests">{t('usageAnalysis.tests')}</option>
                  <option value="reports">{t('usageAnalysis.reports')}</option>
                  <option value="revenue">{t('usageAnalysis.revenue')}</option>
                </select>
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                <p className="text-sm sm:text-base">
                  {t('usageAnalysis.usageTrendsChart').replace('{metric}', selectedMetric)}
                </p>
                <p className="text-xs sm:text-sm">
                  {t('usageAnalysis.data').replace('{timeRange}', getTimeRangeLabel(timeRange))}
                </p>
              </div>
            </div>
          </div>

          {/* Tenant Usage Distribution */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t('usageAnalysis.tenantUsageDistribution')}
              </h3>
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-3 sm:space-y-4">
              {tenantUsage.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {tenant.tenant_name || 'N/A'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tenant.users || 0} {t('usageAnalysis.usersLabel')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tenant.tests || 0} {t('usageAnalysis.testsLabel')}
                      </span>
                      <span
                        className={`text-xs ${
                          (tenant.growth || 0) > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {(tenant.growth || 0) > 0 ? "+" : ""}
                        {tenant.growth || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2 ml-2 flex-shrink-0">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(((tenant.users || 0) / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {t('usageAnalysis.featureUsageStatistics')}
            </h3>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('usageAnalysis.feature')}
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('usageAnalysis.usageRate')}
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('usageAnalysis.activeUsers')}
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('usageAnalysis.trend')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {featureUsage.map((feature, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      {feature.feature}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${feature.usage}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {feature.usage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {(feature.users || 0).toLocaleString()}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.2%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('usageAnalysis.responseTime')}
            </h3>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {usageData.avgResponseTime}ms
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.averageResponseTime')}
              </p>
              <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.excellentPerformance')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('usageAnalysis.systemHealth')}
            </h3>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {usageData.systemUptime}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.uptimeThisMonth')}
              </p>
              <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: "99.9%" }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.outstandingReliability')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('usageAnalysis.userSatisfaction')}
            </h3>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                4.8/5
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.averageRating')}
              </p>
              <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "96%" }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('usageAnalysis.basedOnResponses').replace('{count}', '1,247')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageAnalysis;
