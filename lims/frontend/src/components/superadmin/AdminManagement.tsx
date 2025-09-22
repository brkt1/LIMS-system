import {
  Edit,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import React, { useState } from "react";

const AdminManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const admins = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@lims.com",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2025-01-20 14:30",
      permissions: ["All Permissions"],
      created: "2024-01-15",
      avatar: "JS",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@lims.com",
      role: "System Admin",
      status: "Active",
      lastLogin: "2025-01-20 12:15",
      permissions: ["User Management", "System Settings", "Analytics"],
      created: "2024-02-20",
      avatar: "SJ",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@lims.com",
      role: "Support Admin",
      status: "Inactive",
      lastLogin: "2025-01-18 09:45",
      permissions: ["Support Management", "User Support"],
      created: "2024-03-10",
      avatar: "MW",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@lims.com",
      role: "Billing Admin",
      status: "Active",
      lastLogin: "2025-01-20 16:20",
      permissions: ["Billing Management", "Financial Reports"],
      created: "2024-04-12",
      avatar: "ED",
    },
  ];

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      admin.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800";
      case "System Admin":
        return "bg-blue-100 text-blue-800";
      case "Support Admin":
        return "bg-green-100 text-green-800";
      case "Billing Admin":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active"
  ).length;
  const superAdmins = admins.filter(
    (admin) => admin.role === "Super Admin"
  ).length;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Admin Management
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Manage system administrators and their permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total Admins
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalAdmins}
                </p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Active Admins
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {activeAdmins}
                </p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Super Admins
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {superAdmins}
                </p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Inactive
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalAdmins - activeAdmins}
                </p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search admins by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="super">Super Admin</option>
                <option value="system">System Admin</option>
                <option value="support">Support Admin</option>
                <option value="billing">Billing Admin</option>
              </select>
              <select className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Admin
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Permissions
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Last Login
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Created
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-blue-600">
                            {admin.avatar}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {admin.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          admin.role
                        )}`}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          admin.status
                        )}`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex flex-wrap gap-1">
                        {admin.permissions
                          .slice(0, 2)
                          .map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {permission}
                            </span>
                          ))}
                        {admin.permissions.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{admin.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {admin.lastLogin}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {admin.created}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Add New Admin
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Role
                  </label>
                  <select className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select role</option>
                    <option value="super">Super Admin</option>
                    <option value="system">System Admin</option>
                    <option value="support">Support Admin</option>
                    <option value="billing">Billing Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {[
                      "User Management",
                      "System Settings",
                      "Analytics",
                      "Billing Management",
                      "Support Management",
                    ].map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs sm:text-sm text-gray-700">
                          {permission}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
