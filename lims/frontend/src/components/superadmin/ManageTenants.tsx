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
  X,
  Eye,
  Settings,
  UserCheck,
  UserX,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const ManageTenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPlan, setFilterPlan] = useState("");

  // Modal states
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showEditTenantModal, setShowEditTenantModal] = useState(false);
  const [showDeleteTenantModal, setShowDeleteTenantModal] = useState(false);
  const [showViewTenantModal, setShowViewTenantModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  // Form states
  const [newTenant, setNewTenant] = useState({
    name: "",
    domain: "",
    status: "Active",
    users: 0,
    plan: "Basic",
    created: "",
    lastActive: "",
  });

  const [tenants, setTenants] = useState([
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
  ]);

  // Load tenants from localStorage on component mount
  useEffect(() => {
    const savedTenants = localStorage.getItem("superadmin-tenants");
    if (savedTenants) {
      try {
        setTenants(JSON.parse(savedTenants));
      } catch (error) {
        console.error("Error loading saved tenants:", error);
      }
    }
  }, []);

  // Save tenants to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("superadmin-tenants", JSON.stringify(tenants));
  }, [tenants]);

  // CRUD Functions
  const handleAddTenant = () => {
    setShowAddTenantModal(true);
  };

  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowEditTenantModal(true);
  };

  const handleDeleteTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowDeleteTenantModal(true);
  };

  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowViewTenantModal(true);
  };

  const handleMoreActions = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowMoreActionsModal(true);
  };

  const handleCreateTenant = () => {
    const newTenantData = {
      id: String(tenants.length + 1),
      ...newTenant,
      created: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    };

    setTenants((prev) => [...prev, newTenantData]);
    setNewTenant({
      name: "",
      domain: "",
      status: "Active",
      users: 0,
      plan: "Basic",
      created: "",
      lastActive: "",
    });
    setShowAddTenantModal(false);
  };

  const handleUpdateTenant = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              ...newTenant,
              lastActive: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );
    setShowEditTenantModal(false);
    setSelectedTenant(null);
  };

  const handleDeleteTenantConfirm = () => {
    setTenants((prev) => prev.filter((t) => t.id !== selectedTenant.id));
    setShowDeleteTenantModal(false);
    setSelectedTenant(null);
  };

  const handleSuspendTenant = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              status: "Suspended",
              lastActive: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );
    setShowMoreActionsModal(false);
    setSelectedTenant(null);
  };

  const handleActivateTenant = () => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant.id
          ? {
              ...t,
              status: "Active",
              lastActive: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );
    setShowMoreActionsModal(false);
    setSelectedTenant(null);
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || tenant.status === filterStatus;
    const matchesPlan = filterPlan === "" || tenant.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

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

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Manage Tenants
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Oversee and manage all tenant organizations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAddTenant}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">Add New Tenant</span>
            </button>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dashboard Overview
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  View Mode:
                </span>
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 text-sm ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 text-sm ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      Total Tenants
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.length}
                    </p>
                  </div>
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      Active Tenants
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.filter((t) => t.status === "Active").length}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      Total Users
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.reduce((sum, t) => sum + t.users, 0)}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      Suspended
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.filter((t) => t.status === "Suspended").length}
                    </p>
                  </div>
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
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
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Active
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
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
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {tenant.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
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
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
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
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                        {tenant.created}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                        {tenant.lastActive}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTenant(tenant)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                            title="Edit Tenant"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400 transition-colors"
                            title="Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoreActions(tenant)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
                            title="More Actions"
                          >
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {tenant.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
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
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Users
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {tenant.users}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
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
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Created
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {tenant.created}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                        title="Edit Tenant"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400 transition-colors"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoreActions(tenant)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last active: {tenant.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Tenant
              </h3>
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant Name
                </label>
                <input
                  type="text"
                  value={newTenant.name}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tenant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={newTenant.domain}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      domain: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter domain (e.g., tenant.lims.com)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newTenant.status}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </label>
                <select
                  value={newTenant.plan}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      plan: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Users
                </label>
                <input
                  type="number"
                  value={newTenant.users}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      users: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter number of users"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTenant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditTenantModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Tenant
              </h3>
              <button
                onClick={() => setShowEditTenantModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant Name
                </label>
                <input
                  type="text"
                  value={newTenant.name || selectedTenant.name}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  value={newTenant.domain || selectedTenant.domain}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      domain: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={newTenant.status || selectedTenant.status}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan
                </label>
                <select
                  value={newTenant.plan || selectedTenant.plan}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      plan: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Users
                </label>
                <input
                  type="number"
                  value={newTenant.users || selectedTenant.users}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      users: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowEditTenantModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTenant}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tenant Modal */}
      {showDeleteTenantModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Tenant
              </h3>
              <button
                onClick={() => setShowDeleteTenantModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Delete Tenant
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you sure you want to delete{" "}
                  <strong>{selectedTenant.name}</strong>? This action cannot be undone.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Domain:</strong> {selectedTenant.domain}
                    <br />
                    <strong>Users:</strong> {selectedTenant.users}
                    <br />
                    <strong>Plan:</strong> {selectedTenant.plan}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowDeleteTenantModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTenantConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Tenant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Tenant Modal */}
      {showViewTenantModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tenant Details
              </h3>
              <button
                onClick={() => setShowViewTenantModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tenant ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTenant.status)}`}>
                    {selectedTenant.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tenant Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Domain
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.domain}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedTenant.plan)}`}>
                    {selectedTenant.plan}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Users
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.users}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.created}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Active
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.lastActive}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowViewTenantModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Actions Modal */}
      {showMoreActionsModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                More Actions
              </h3>
              <button
                onClick={() => setShowMoreActionsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTenant.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedTenant.domain}
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleViewTenant}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={handleEditTenant}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5 text-green-600" />
                  <span>Edit Tenant</span>
                </button>
                <button
                  onClick={handleSuspendTenant}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <UserX className="w-5 h-5 text-yellow-600" />
                  <span>Suspend Tenant</span>
                </button>
                <button
                  onClick={handleActivateTenant}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <span>Activate Tenant</span>
                </button>
                <button
                  onClick={handleDeleteTenant}
                  className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span>Delete Tenant</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowMoreActionsModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTenants;
