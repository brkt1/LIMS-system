import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Headphones,
  Package,
  TrendingUp,
} from "lucide-react";
import React from "react";
import BaseDashboard from "./BaseDashboard";

const SupportDashboard: React.FC = () => {
  const supportCards = [
    {
      title: "Open Tickets",
      value: "23",
      change: "+5 Today",
      color: "bg-orange-500",
      chartData: [18, 20, 22, 21, 23, 22, 23],
    },
    {
      title: "Resolved Today",
      value: "18",
      change: "+3 This Week",
      color: "bg-green-500",
      chartData: [12, 14, 15, 16, 17, 18, 18],
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      change: "-0.5h This Week",
      color: "bg-blue-500",
      chartData: [3.2, 3.0, 2.8, 2.6, 2.4, 2.3, 2.3],
    },
    {
      title: "Customer Satisfaction",
      value: "4.7/5",
      change: "+0.2 This Month",
      color: "bg-purple-500",
      chartData: [4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7],
    },
  ];

  return (
    <BaseDashboard>
      {/* Support specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {supportCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Headphones className="w-4 h-4 text-white" />}
                {index === 1 && <CheckCircle className="w-4 h-4 text-white" />}
                {index === 2 && <Clock className="w-4 h-4 text-white" />}
                {index === 3 && <TrendingUp className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <span className="text-sm font-medium">{card.change}</span>
              </div>
            </div>

            <div className="flex items-end space-x-1 h-8">
              {card.chartData.map((height, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-sm opacity-80`}
                  style={{
                    height: `${(height / Math.max(...card.chartData)) * 100}%`,
                    width: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Support Tickets
            </h3>
            <Headphones className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                id: "ST-001",
                user: "Dr. Sarah Johnson",
                issue: "Login Problem",
                priority: "High",
                status: "Open",
                time: "2h ago",
              },
              {
                id: "ST-002",
                user: "Mike Chen",
                issue: "Equipment Error",
                priority: "Medium",
                status: "In Progress",
                time: "4h ago",
              },
              {
                id: "ST-003",
                user: "Lisa Rodriguez",
                issue: "Report Generation",
                priority: "Low",
                status: "Resolved",
                time: "6h ago",
              },
              {
                id: "ST-004",
                user: "David Kim",
                issue: "Data Export",
                priority: "Medium",
                status: "Open",
                time: "8h ago",
              },
              {
                id: "ST-005",
                user: "Anna Wilson",
                issue: "System Slow",
                priority: "High",
                status: "In Progress",
                time: "1d ago",
              },
            ].map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ticket.priority === "High"
                        ? "bg-red-100 dark:bg-red-900"
                        : ticket.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <AlertCircle
                      className={`w-4 h-4 ${
                        ticket.priority === "High"
                          ? "text-red-600 dark:text-red-400"
                          : ticket.priority === "Medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {ticket.user}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ticket.issue}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      ticket.status === "Open"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : ticket.status === "In Progress"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {ticket.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Notifications
            </h3>
            <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                type: "System",
                message: "Scheduled maintenance tonight at 2 AM",
                priority: "High",
                time: "1h ago",
              },
              {
                type: "Equipment",
                message: "Centrifuge Beta-2 requires calibration",
                priority: "Medium",
                time: "3h ago",
              },
              {
                type: "User",
                message: "New user registration: Dr. Emily Brown",
                priority: "Low",
                time: "5h ago",
              },
              {
                type: "System",
                message: "Backup completed successfully",
                priority: "Low",
                time: "8h ago",
              },
              {
                type: "Alert",
                message: "High CPU usage detected on server-02",
                priority: "High",
                time: "12h ago",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.priority === "High"
                        ? "bg-red-100 dark:bg-red-900"
                        : notification.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <Bell
                      className={`w-4 h-4 ${
                        notification.priority === "High"
                          ? "text-red-600 dark:text-red-400"
                          : notification.priority === "Medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      notification.priority === "High"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : notification.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {notification.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Status
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Manage Inventory
            </button>
            <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Stock Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Last Updated
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Blood Collection Tubes
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  Supplies
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  45 units
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    In Stock
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-20 10:30
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                    Update
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Microscope Slides
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  Supplies
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  8 units
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    Low Stock
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-20 09:15
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                    Reorder
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Lab Coats
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  Equipment
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  0 units
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    Out of Stock
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-19 16:45
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                    Urgent Order
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default SupportDashboard;
