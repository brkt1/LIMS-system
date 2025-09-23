import { Activity, BarChart3, Building2, Settings, Users } from "lucide-react";
import React from "react";
import BaseDashboard from "./BaseDashboard";

const SuperAdminDashboard: React.FC = () => {
  const superAdminCards = [
    {
      title: "Total Tenants",
      value: "24",
      change: "+3 This Month",
      color: "bg-blue-500",
      chartData: [10, 15, 12, 18, 20, 22, 24],
    },
    {
      title: "System Users",
      value: "1,247",
      change: "+12% This Month",
      color: "bg-green-500",
      chartData: [800, 900, 950, 1000, 1100, 1200, 1247],
    },
    {
      title: "Active Sessions",
      value: "89",
      change: "+5% Today",
      color: "bg-purple-500",
      chartData: [60, 70, 65, 75, 80, 85, 89],
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Stable",
      color: "bg-emerald-500",
      chartData: [98, 99, 99.5, 99.8, 99.9, 99.9, 99.9],
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
              Tenant Growth
            </h3>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-xs sm:text-sm">
                Tenant growth chart would go here
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              System Performance
            </h3>
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Activity className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="text-xs sm:text-sm">
                System performance metrics would go here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 sm:mb-6 p-4 sm:p-6 pb-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Recent System Activity
          </h3>
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Timestamp
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  User
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Action
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  2025-01-20 14:30:25
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  admin@lims.com
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  Created new tenant
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  2025-01-20 14:25:10
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  system@lims.com
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                  System backup completed
                </td>
                <td className="py-3 sm:py-4 px-2 sm:px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                    Info
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default SuperAdminDashboard;
