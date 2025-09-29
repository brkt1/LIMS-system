import {
  Activity,
  Clock,
  Edit,
  Eye,
  Globe,
  MapPin,
  Monitor,
  RefreshCw,
  Search,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { superadminAPI } from "../../services/api";
import { getClientIP } from "../../utils/helpers";

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
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Load online users from backend API
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching online users from API...");

        // Use the sessions API to get user sessions
        const response = await superadminAPI.sessions.getAll();
        console.log("API response received:", response);

        if (!response || !response.data) {
          throw new Error("Invalid response format from API");
        }

        const users = response.data.map((session: any) => ({
          id: session.user_id,
          name: session.user_name,
          email: session.user_email,
          role: session.user_role,
          tenant: session.tenant_name || "System",
          status: session.status,
          lastActivity: session.last_activity_ago,
          ipAddress: session.ip_address,
          location: session.location || "Unknown",
          device: session.device_info || "Unknown",
          sessionDuration: session.session_duration,
          actions: session.actions_count,
        }));

        console.log("Processed users:", users);
        setOnlineUsers(users);
      } catch (error: any) {
        console.error("Error fetching online users:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
        });

        // Provide more detailed error messages
        let errorMessage = "Failed to load online users";

        if (error.name === "TimeoutError" || error.code === "ECONNABORTED") {
          errorMessage =
            "Request Timeout: The server took too long to respond. Please check your connection and try again.";
        } else if (
          error.name === "NetworkError" ||
          error.code === "NETWORK_ERROR" ||
          error.message.includes("Network Error")
        ) {
          errorMessage =
            "Network Error: Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.response?.status === 401) {
          errorMessage = "Authentication Error: Please log in again.";
        } else if (error.response?.status === 403) {
          errorMessage =
            "Access Denied: You don't have permission to view user sessions.";
        } else if (error.response?.status === 404) {
          errorMessage =
            "API Endpoint Not Found: The sessions endpoint is not available.";
        } else if (error.response?.status >= 500) {
          errorMessage =
            "Server Error: The server is experiencing issues. Please try again later.";
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`;
        }

        setError(errorMessage);
        setOnlineUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineUsers();
  }, []);

  // Fetch recent activity from backend
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        console.log("Fetching recent activity from API...");
        const response = await superadminAPI.sessions.getRecentActivity();
        console.log("Recent activity response:", response);

        if (!response || !response.data) {
          console.warn("Invalid response format for recent activity");
          setRecentActivity([]);
          return;
        }

        const activities = response.data.slice(0, 4).map((activity: any) => {
          // Map activity status to colors
          const getActivityColor = (status: string, activityType: string) => {
            if (
              activityType.includes("logged in") ||
              activityType.includes("came back online")
            )
              return "green";
            if (
              activityType.includes("created") ||
              activityType.includes("completed")
            )
              return "blue";
            if (activityType.includes("went idle")) return "yellow";
            if (activityType.includes("went away")) return "orange";
            return "purple";
          };

          return {
            id: activity.id,
            user: activity.user_name,
            action: activity.activity_type,
            time: activity.last_activity_ago,
            tenant: activity.tenant_name,
            color: getActivityColor(activity.status, activity.activity_type),
          };
        });

        console.log("Processed activities:", activities);
        setRecentActivity(activities);
      } catch (error: any) {
        console.error("Error fetching recent activity:", error);
        console.error("Recent activity error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        // Fallback to empty array if API fails
        setRecentActivity([]);
      }
    };

    fetchRecentActivity();
  }, []);

  // Handler functions
  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      console.log("Refreshing data...");

      // Fetch fresh data from backend
      const [sessionsResponse, activityResponse] = await Promise.all([
        superadminAPI.sessions.getAll(),
        superadminAPI.sessions.getRecentActivity(),
      ]);

      console.log("Refresh responses:", { sessionsResponse, activityResponse });

      // Update users data
      if (sessionsResponse && sessionsResponse.data) {
        const users = sessionsResponse.data.map((session: any) => ({
          id: session.user_id,
          name: session.user_name,
          email: session.user_email,
          role: session.user_role,
          tenant: session.tenant_name || "System",
          status: session.status,
          lastActivity: session.last_activity_ago,
          ipAddress: session.ip_address,
          location: session.location || "Unknown",
          device: session.device_info || "Unknown",
          sessionDuration: session.session_duration,
          actions: session.actions_count,
        }));
        setOnlineUsers(users);
      }

      // Update recent activity data
      if (activityResponse && activityResponse.data) {
        const activities = activityResponse.data
          .slice(0, 4)
          .map((activity: any) => {
            const getActivityColor = (status: string, activityType: string) => {
              if (
                activityType.includes("logged in") ||
                activityType.includes("came back online")
              )
                return "green";
              if (
                activityType.includes("created") ||
                activityType.includes("completed")
              )
                return "blue";
              if (activityType.includes("went idle")) return "yellow";
              if (activityType.includes("went away")) return "orange";
              return "purple";
            };

            return {
              id: activity.id,
              user: activity.user_name,
              action: activity.activity_type,
              time: activity.last_activity_ago,
              tenant: activity.tenant_name,
              color: getActivityColor(activity.status, activity.activity_type),
            };
          });
        setRecentActivity(activities);
      }

      setError(null);
      console.log("Data refreshed successfully");
    } catch (error: any) {
      console.error("Error refreshing data:", error);
      console.error("Refresh error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      // Provide more detailed error messages
      let errorMessage = "Failed to refresh data";

      if (error.name === "TimeoutError" || error.code === "ECONNABORTED") {
        errorMessage =
          "Request Timeout: The server took too long to respond. Please check your connection and try again.";
      } else if (
        error.name === "NetworkError" ||
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        errorMessage =
          "Network Error: Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication Error: Please log in again.";
      } else if (error.response?.status === 403) {
        errorMessage =
          "Access Denied: You don't have permission to view user sessions.";
      } else if (error.response?.status === 404) {
        errorMessage =
          "API Endpoint Not Found: The sessions endpoint is not available.";
      } else if (error.response?.status >= 500) {
        errorMessage =
          "Server Error: The server is experiencing issues. Please try again later.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-2">
                Network Error in Monitor Online Users
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => {
                  setError(null);
                  // Retry the API calls
                  window.location.reload();
                }}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
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
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent text-sm sm:text-base"
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
                                .map((n: any[]) => n[0])
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <div
                      className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {activity.user} {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.time} • {activity.tenant}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Geographic Distribution
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {(() => {
                // Group users by location
                const locationCounts = onlineUsers.reduce((acc, user) => {
                  const location =
                    user.location.split(",")[1]?.trim() || "Unknown";
                  acc[location] = (acc[location] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const locations = Object.entries(locationCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 4);

                return locations.length > 0 ? (
                  locations.map(([location, count]) => (
                    <div
                      key={location}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {location}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {count} user{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      No location data available
                    </p>
                  </div>
                );
              })()}
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
