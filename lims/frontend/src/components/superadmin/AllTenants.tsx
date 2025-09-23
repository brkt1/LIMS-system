import { BarChart3, Building2, Download, Search, Users } from "lucide-react";
import React, { useState } from "react";

const AllTenants: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");

  const tenants = [
    {
      id: "1",
      name: "MedLab Solutions",
      domain: "medlab.lims.com",
      status: "Active",
      users: 45,
      plan: "Professional",
      created: "2024-01-15",
      lastActive: "2025-01-20",
      revenue: 2400,
      growth: 12.5,
      logo: "ML",
    },
    {
      id: "2",
      name: "City Hospital Lab",
      domain: "cityhospital.lims.com",
      status: "Active",
      users: 78,
      plan: "Enterprise",
      created: "2024-02-20",
      lastActive: "2025-01-20",
      revenue: 5200,
      growth: 8.3,
      logo: "CH",
    },
    {
      id: "3",
      name: "Private Clinic Network",
      domain: "pcn.lims.com",
      status: "Suspended",
      users: 23,
      plan: "Basic",
      created: "2024-03-10",
      lastActive: "2025-01-18",
      revenue: 800,
      growth: -2.1,
      logo: "PC",
    },
    {
      id: "4",
      name: "Research Institute",
      domain: "research.lims.com",
      status: "Active",
      users: 156,
      plan: "Enterprise",
      created: "2024-01-05",
      lastActive: "2025-01-20",
      revenue: 8900,
      growth: 15.7,
      logo: "RI",
    },
    {
      id: "5",
      name: "Diagnostic Center",
      domain: "diagnostic.lims.com",
      status: "Pending",
      users: 12,
      plan: "Basic",
      created: "2025-01-19",
      lastActive: "2025-01-19",
      revenue: 0,
      growth: 0,
      logo: "DC",
    },
    {
      id: "6",
      name: "Medical Group",
      domain: "medicalgroup.lims.com",
      status: "Active",
      users: 67,
      plan: "Professional",
      created: "2024-04-12",
      lastActive: "2025-01-20",
      revenue: 3200,
      growth: 6.8,
      logo: "MG",
    },
  ];

  const filteredTenants = tenants.filter(
    (tenant) =>
      filterStatus === "all" ||
      tenant.status.toLowerCase() === filterStatus.toLowerCase()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      case "Professional":
        return "bg-blue-100 text-blue-800";
      case "Basic":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600";
  };

  const totalRevenue = tenants.reduce((sum, tenant) => sum + tenant.revenue, 0);
  const totalUsers = tenants.reduce((sum, tenant) => sum + tenant.users, 0);
  const activeTenants = tenants.filter((t) => t.status === "Active").length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            All Tenants
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Complete overview of all tenant organizations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 sm:flex-none px-3 py-2 text-sm ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Total Tenants
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {tenants.length}
              </p>
            </div>
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Active Tenants
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {activeTenants}
              </p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Total Users
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Total Revenue
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created Date</option>
              <option value="users">Sort by Users</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      {tenant.logo}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {tenant.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {tenant.domain}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusColor(
                    tenant.status
                  )}`}
                >
                  {tenant.status}
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Users
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {tenant.users}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Plan
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                      tenant.plan
                    )}`}
                  >
                    {tenant.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Revenue
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    ${tenant.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Growth
                  </span>
                  <span
                    className={`font-medium text-sm sm:text-base ${getGrowthColor(
                      tenant.growth
                    )}`}
                  >
                    {tenant.growth > 0 ? "+" : ""}
                    {tenant.growth}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                  <span>Created: {tenant.created}</span>
                  <span>Last active: {tenant.lastActive}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Users
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Growth
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {tenant.logo}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {tenant.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tenant.domain}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          tenant.status
                        )}`}
                      >
                        {tenant.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {tenant.users}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                          tenant.plan
                        )}`}
                      >
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${tenant.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${getGrowthColor(
                          tenant.growth
                        )}`}
                      >
                        {tenant.growth > 0 ? "+" : ""}
                        {tenant.growth}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {tenant.created}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTenants;
