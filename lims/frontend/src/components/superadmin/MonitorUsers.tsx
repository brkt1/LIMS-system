import {
  Activity,
  Clock,
  Globe,
  MapPin,
  Monitor,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const MonitorUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onlineUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@research.com",
      role: "Super Admin",
      tenant: "Research Institute",
      status: "online",
      lastActivity: "2 minutes ago",
      ipAddress: "192.168.1.100",
      location: "New York, US",
      device: "Chrome on Windows",
      sessionDuration: "2h 15m",
      actions: 47,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@cityhospital.com",
      role: "Tenant Admin",
      tenant: "City Hospital Lab",
      status: "online",
      lastActivity: "5 minutes ago",
      ipAddress: "203.0.113.45",
      location: "Los Angeles, US",
      device: "Safari on macOS",
      sessionDuration: "1h 30m",
      actions: 23,
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@medlab.com",
      role: "Doctor",
      tenant: "MedLab Solutions",
      status: "idle",
      lastActivity: "15 minutes ago",
      ipAddress: "198.51.100.42",
      location: "Chicago, US",
      device: "Firefox on Windows",
      sessionDuration: "3h 45m",
      actions: 89,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@clinic.com",
      role: "Technician",
      tenant: "Private Clinic Network",
      status: "online",
      lastActivity: "1 minute ago",
      ipAddress: "192.168.1.200",
      location: "Miami, US",
      device: "Chrome on Android",
      sessionDuration: "45m",
      actions: 12,
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@medicalgroup.com",
      role: "Support",
      tenant: "Medical Group",
      status: "away",
      lastActivity: "30 minutes ago",
      ipAddress: "203.0.113.100",
      location: "Seattle, US",
      device: "Edge on Windows",
      sessionDuration: "4h 20m",
      actions: 156,
    },
  ];

  const filteredUsers = onlineUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "idle":
        return "bg-yellow-100 text-yellow-800";
      case "away":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800";
      case "Tenant Admin":
        return "bg-blue-100 text-blue-800";
      case "Doctor":
        return "bg-green-100 text-green-800";
      case "Technician":
        return "bg-orange-100 text-orange-800";
      case "Support":
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

  const totalOnline = onlineUsers.filter(
    (user) => user.status === "online"
  ).length;
  const totalIdle = onlineUsers.filter((user) => user.status === "idle").length;
  const totalAway = onlineUsers.filter((user) => user.status === "away").length;

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Monitor Online Users
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Real-time monitoring of active user sessions and activities
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Online Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalOnline}
                </p>
                <p className="text-xs sm:text-sm text-green-600 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Active now
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Idle Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalIdle}
                </p>
                <p className="text-xs sm:text-sm text-yellow-600">Inactive</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Away Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalAway}
                </p>
                <p className="text-xs sm:text-sm text-orange-600">Away</p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {onlineUsers.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">All statuses</p>
              </div>
              <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="idle">Idle</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
            <select className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
              <option value="all">All Roles</option>
              <option value="super">Super Admin</option>
              <option value="tenant">Tenant Admin</option>
              <option value="doctor">Doctor</option>
              <option value="technician">Technician</option>
              <option value="support">Support</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Last Activity
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Location
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Device
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Session
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-blue-600">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
                              user.status === "online"
                                ? "bg-green-500"
                                : user.status === "idle"
                                ? "bg-yellow-500"
                                : user.status === "away"
                                ? "bg-orange-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {user.tenant}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {user.lastActivity}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-900">
                          {user.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {user.device}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="text-xs sm:text-sm text-gray-900">
                        {user.sessionDuration}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.actions} actions
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="End Session"
                        >
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">
                    John Smith logged in
                  </p>
                  <p className="text-xs text-gray-500">
                    2 minutes ago • Research Institute
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">
                    Sarah Johnson created new test request
                  </p>
                  <p className="text-xs text-gray-500">
                    5 minutes ago • City Hospital Lab
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">
                    Mike Wilson went idle
                  </p>
                  <p className="text-xs text-gray-500">
                    15 minutes ago • MedLab Solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">
                    Emily Davis completed test report
                  </p>
                  <p className="text-xs text-gray-500">
                    18 minutes ago • Private Clinic Network
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Geographic Distribution
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900">
                    United States
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  4 users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900">
                    Canada
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  1 user
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900">
                    United Kingdom
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  0 users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900">
                    Australia
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  0 users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorUsers;
