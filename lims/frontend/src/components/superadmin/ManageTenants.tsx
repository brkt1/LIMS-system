import {
  Building2,
  ChevronDown,
  ChevronUp,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const ManageTenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
    },
  ];

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
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
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-800";
      case "Professional":
        return "bg-blue-100 text-blue-800";
      case "Basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Manage Tenants
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Oversee and manage all tenant organizations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Add New Tenant</span>
            </button>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              {showDashboard ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Hide Dashboard</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Show Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Collapsible Dashboard */}
        {showDashboard && (
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Dashboard Overview
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">View Mode:</span>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 text-sm ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 text-sm ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Tenants
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {tenants.length}
                    </p>
                  </div>
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Active Tenants
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {tenants.filter((t) => t.status === "Active").length}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Users
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {tenants.reduce((sum, t) => sum + t.users, 0)}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Suspended
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {tenants.filter((t) => t.status === "Suspended").length}
                    </p>
                  </div>
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
              <select className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">All Plans</option>
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tenants Content */}
        {viewMode === "list" ? (
          /* List View - Table */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Tenant
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Users
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Last Active
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tenant.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tenant.domain}
                          </p>
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
                        {tenant.created}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {tenant.lastActive}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View - Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {tenant.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {tenant.domain}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusColor(
                      tenant.status
                    )}`}
                  >
                    {tenant.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Users
                    </span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {tenant.users}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
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
                    <span className="text-xs sm:text-sm text-gray-600">
                      Created
                    </span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      {tenant.created}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Last active: {tenant.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTenants;
