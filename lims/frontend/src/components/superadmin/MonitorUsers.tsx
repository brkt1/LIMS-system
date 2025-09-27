import {
  Activity,
  Clock,
  Globe,
  MapPin,
  Monitor,
  RefreshCw,
  Search,
  User,
  Users,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { superadminAPI } from "../../services/api";

const MonitorUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form states
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "online",
  });

  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load online users from backend API
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        // For now, we'll use the users API to get all users and simulate online status
        const response = await superadminAPI.users.getAll();
        const users = response.data.map((user: any, index: number) => ({
          ...user,
          status:
            index % 3 === 0 ? "online" : index % 3 === 1 ? "idle" : "away",
          lastActivity: `${Math.floor(Math.random() * 60)} minutes ago`,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          location: [
            "New York, US",
            "Los Angeles, US",
            "Chicago, US",
            "Miami, US",
          ][Math.floor(Math.random() * 4)],
          device: [
            "Chrome on Windows",
            "Safari on Mac",
            "Firefox on Linux",
            "Edge on Windows",
          ][Math.floor(Math.random() * 4)],
          sessionDuration: `${Math.floor(Math.random() * 5)}h ${Math.floor(
            Math.random() * 60
          )}m`,
          actions: Math.floor(Math.random() * 200),
        }));
        setOnlineUsers(users);
      } catch (error: any) {
        console.error("Error fetching online users:", error);
        setError(error.message || "Failed to load online users");
        // Fallback to localStorage if API fails
        const savedUsers = localStorage.getItem("superadmin-online-users");
        if (savedUsers) {
          try {
            setOnlineUsers(JSON.parse(savedUsers));
          } catch (parseError) {
            console.error("Error parsing saved users:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();
  }, []);

  // Handler functions
  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add a new user entry to simulate refresh
    const newUser = {
      id: (onlineUsers.length + 1).toString(),
      name: "New User",
      email: "newuser@example.com",
      role: "User",
      tenant: "System",
      status: "online",
      lastActivity: "Just now",
      ipAddress: "127.0.0.1",
      location: "Unknown",
      device: "Unknown",
      sessionDuration: "0m",
      actions: 0,
    };

    setOnlineUsers((prev: any) => [newUser, ...prev]);
    setIsRefreshing(false);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      setOnlineUsers((prev: any) =>
        prev.map((user: any) =>
          user.id === selectedUser.id ? { ...user, ...editUser } : user
        )
      );
      setShowEditUserModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteUserModal(true);
  };

  const handleDeleteUserConfirm = () => {
    if (selectedUser) {
      setOnlineUsers((prev: any) =>
        prev.filter((user: any) => user.id !== selectedUser.id)
      );
      setShowDeleteUserModal(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = onlineUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tenant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesRole =
      filterRole === "all" ||
      user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesStatus && matchesRole;
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
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
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
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const totalOnline = onlineUsers.filter(
    (user) => user.status === "online"
  ).length;
  const totalIdle = onlineUsers.filter((user) => user.status === "idle").length;
  const totalAway = onlineUsers.filter((user) => user.status === "away").length;

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
            Loading online users...
          </span>
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Monitor Online Users
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Real-time monitoring of active user sessions and activities
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 disabled:opacity-50 transition-colors text-sm sm:text-base"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Online Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalOnline}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Active now
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Idle Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalIdle}
                </p>
                <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                  Inactive
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Away Users
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalAway}
                </p>
                <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                  Away
                </p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Sessions
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {onlineUsers.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  All statuses
                </p>
              </div>
              <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="idle">Idle</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-base"
            >
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Tenant
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Activity
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Device
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Session
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
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
                                : "bg-gray-50 dark:bg-gray-9000"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
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
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {user.tenant}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {user.lastActivity}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {user.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {user.device}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {user.sessionDuration}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user.actions} actions
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                          title="Edit User"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    John Smith logged in
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago • Research Institute
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Sarah Johnson created new test request
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    5 minutes ago • City Hospital Lab
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Mike Wilson went idle
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    15 minutes ago • MedLab Solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Emily Davis completed test report
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    18 minutes ago • Private Clinic Network
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Geographic Distribution
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    United States
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  4 users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Canada
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  1 user
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    United Kingdom
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  0 users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                    Australia
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  0 users
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View User Modal */}
        {showViewUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setShowViewUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tenant
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.tenant}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Activity
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.lastActivity}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IP Address
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.ipAddress}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.location}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Device
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.device}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Session Duration
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.sessionDuration}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Actions Count
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.actions}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowViewUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit User
                </h3>
                <button
                  onClick={() => setShowEditUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Tenant Admin">Tenant Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Technician">Technician</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editUser.status}
                      onChange={(e) =>
                        setEditUser({ ...editUser, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="online">Online</option>
                      <option value="idle">Idle</option>
                      <option value="away">Away</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete User
                </h3>
                <button
                  onClick={() => setShowDeleteUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete the user{" "}
                  <strong>"{selectedUser.name}"</strong>? This action cannot be
                  undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUserConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorUsers;
