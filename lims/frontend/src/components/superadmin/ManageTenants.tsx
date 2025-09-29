import {
  Building2,
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";
import { generateSecurePassword } from "../../utils/helpers";

const ManageTenants: React.FC = () => {
  const { t } = useLanguage();
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
    email: "",
    status: "Active",
    users: 10,
    plan: "Basic",
    created: "",
    lastActive: "",
  });

  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load tenants from backend API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superadminAPI.tenants.getAll();

        // Validate and sanitize the response data
        const tenantsData = Array.isArray(response.data) ? response.data : [];
        const validTenants = tenantsData.filter(
          (tenant) =>
            tenant &&
            typeof tenant === "object" &&
            (tenant.company_name || tenant.domain)
        );

        setTenants(validTenants);
      } catch (error: any) {
        console.error("Error fetching tenants:", error);
        setError(error.message || "Failed to load tenants");
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // CRUD Functions
  const handleAddTenant = () => {
    setError(null);
    setShowAddTenantModal(true);
  };

  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    // Populate the form with tenant data
    setNewTenant({
      name: tenant.company_name || "",
      domain: tenant.domain || "",
      email: tenant.email || "",
      status: tenant.status || "Active",
      users: tenant.max_users || 10,
      plan: tenant.plan_name || tenant.billing_period || "Basic",
      created: tenant.created_at || "",
      lastActive: tenant.last_active || "",
    });
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

  const handleCreateTenant = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Validate required fields
      if (!newTenant.name.trim()) {
        setError("Tenant name is required");
        setIsCreating(false);
        return;
      }
      if (!newTenant.domain.trim()) {
        setError("Domain is required");
        setIsCreating(false);
        return;
      }
      if (!newTenant.email.trim()) {
        setError("Email is required");
        setIsCreating(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newTenant.email)) {
        setError("Please enter a valid email address");
        setIsCreating(false);
        return;
      }

      // Basic domain validation (alphanumeric and hyphens only)
      const domainRegex = /^[a-zA-Z0-9-]+$/;
      if (!domainRegex.test(newTenant.domain)) {
        setError("Domain can only contain letters, numbers, and hyphens");
        setIsCreating(false);
        return;
      }

      const tenantData = {
        company_name: newTenant.name.trim(),
        domain: newTenant.domain.trim().toLowerCase(),
        email: newTenant.email.trim().toLowerCase(),
        password: generateSecurePassword(), // Generate secure password
        status: newTenant.status.toLowerCase(),
        billing_period: "monthly",
        max_users: newTenant.users,
        created_by: "SuperAdmin", // You might want to get this from auth context
      };

      console.log("Creating tenant with data:", tenantData);
      const response = await superadminAPI.tenants.create(tenantData);

      // Handle different response formats
      const createdTenant = response.data.tenant || response.data;
      setTenants((prev) => [createdTenant, ...prev]);

      // Reset form
      setNewTenant({
        name: "",
        domain: "",
        email: "",
        status: "Active",
        users: 10,
        plan: "Basic",
        created: "",
        lastActive: "",
      });
      setShowAddTenantModal(false);
      setError(null);
    } catch (error: any) {
      console.error("Error creating tenant:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create tenant";
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTenant = async () => {
    try {
      setError(null);

      // Validate required fields
      if (!newTenant.name?.trim()) {
        setError("Tenant name is required");
        return;
      }
      if (!newTenant.domain?.trim()) {
        setError("Domain is required");
        return;
      }

      // Basic domain validation (alphanumeric and hyphens only)
      const domainRegex = /^[a-zA-Z0-9-]+$/;
      if (!domainRegex.test(newTenant.domain)) {
        setError("Domain can only contain letters, numbers, and hyphens");
        return;
      }

      // Only include fields that have actually changed
      const updateData: any = {};

      if (newTenant.name.trim() !== selectedTenant.company_name) {
        updateData.company_name = newTenant.name.trim();
      }

      if (newTenant.domain.trim().toLowerCase() !== selectedTenant.domain) {
        updateData.domain = newTenant.domain.trim().toLowerCase();
      }

      // Map frontend status values to backend values
      const statusMapping: { [key: string]: string } = {
        Active: "active",
        Suspended: "suspended",
        Pending: "pending",
        Inactive: "inactive",
      };

      const backendStatus =
        statusMapping[newTenant.status] || newTenant.status.toLowerCase();

      if (backendStatus !== selectedTenant.status) {
        updateData.status = backendStatus;
      }

      if (parseInt(newTenant.users) !== selectedTenant.max_users) {
        updateData.max_users = parseInt(newTenant.users) || 10;
      }

      // Check if there are any changes to update
      if (Object.keys(updateData).length === 0) {
        setError("No changes detected to update");
        return;
      }

      console.log("Updating tenant with data:", updateData);
      console.log("Selected tenant ID:", selectedTenant.id);
      console.log("Selected tenant data:", selectedTenant);

      const response = await superadminAPI.tenants.update(
        selectedTenant.id,
        updateData
      );

      // Handle different response formats
      const updatedTenant = response.data.tenant || response.data;
      setTenants((prev) =>
        prev.map((t) => (t.id === selectedTenant.id ? updatedTenant : t))
      );
      setShowEditTenantModal(false);
      setSelectedTenant(null);
      setError(null);
    } catch (error: any) {
      console.error("Error updating tenant:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      // Log individual field errors
      if (error.response?.data) {
        Object.keys(error.response.data).forEach((field) => {
          console.error(
            `Field error for ${field}:`,
            error.response.data[field]
          );
        });
      }

      // Handle field-specific errors
      let errorMessage = "Failed to update tenant";

      if (error.response?.data) {
        const fieldErrors = [];

        // Check for field-specific errors
        Object.keys(error.response.data).forEach((field) => {
          const fieldError = error.response.data[field];
          if (Array.isArray(fieldError)) {
            fieldErrors.push(`${field}: ${fieldError.join(", ")}`);
          } else if (typeof fieldError === "string") {
            fieldErrors.push(`${field}: ${fieldError}`);
          }
        });

        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join("; ");
        } else {
          // Fallback to general error messages
          errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.response?.data?.non_field_errors ||
            (Array.isArray(error.response?.data)
              ? error.response.data.join(", ")
              : null) ||
            error.message ||
            "Failed to update tenant";
        }
      }

      setError(errorMessage);
    }
  };

  const handleDeleteTenantConfirm = async () => {
    try {
      await superadminAPI.tenants.delete(selectedTenant.id);
      setTenants((prev) => prev.filter((t) => t.id !== selectedTenant.id));
      setShowDeleteTenantModal(false);
      setSelectedTenant(null);
    } catch (error: any) {
      console.error("Error deleting tenant:", error);
      setError(error.message || "Failed to delete tenant");
    }
  };

  const handleSuspendTenant = async () => {
    try {
      await superadminAPI.tenants.suspend(selectedTenant.id);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === selectedTenant.id ? { ...t, status: "suspended" } : t
        )
      );
      setShowMoreActionsModal(false);
      setSelectedTenant(null);
    } catch (error: any) {
      console.error("Error suspending tenant:", error);
      setError(error.message || "Failed to suspend tenant");
    }
  };

  const handleActivateTenant = async () => {
    try {
      await superadminAPI.tenants.activate(selectedTenant.id);
      setTenants((prev) =>
        prev.map((t) =>
          t.id === selectedTenant.id ? { ...t, status: "active" } : t
        )
      );
      setShowMoreActionsModal(false);
      setSelectedTenant(null);
    } catch (error: any) {
      console.error("Error activating tenant:", error);
      setError(error.message || "Failed to activate tenant");
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    if (!tenant) return false;

    const matchesSearch =
      (tenant.company_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (tenant.domain || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || tenant.status === filterStatus;
    const matchesPlan =
      filterPlan === "" ||
      (tenant.plan_name || tenant.billing_period) === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
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
              {t("manageTenants.title")}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t("manageTenants.description")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAddTenant}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm sm:text-base">
                {t("manageTenants.addNewTenant")}
              </span>
            </button>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto"
            >
              {showDashboard ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm sm:text-base">
                    {t("manageTenants.hideDashboard")}
                  </span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm sm:text-base">
                    {t("manageTenants.showDashboard")}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 dark:text-red-400 text-xs underline"
            >
              {t("manageTenants.dismiss")}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {t("manageTenants.loadingTenants")}
            </span>
          </div>
        )}
        {/* Collapsible Dashboard */}
        {showDashboard && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("manageTenants.dashboardOverview")}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t("manageTenants.viewMode")}
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
                    {t("manageTenants.grid")}
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 text-sm ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                    }`}
                  >
                    {t("manageTenants.list")}
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
                      {t("manageTenants.totalTenants")}
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
                      {t("manageTenants.activeTenants")}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.filter((t) => t.status === "active").length}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      {t("manageTenants.totalUsers")}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.reduce(
                        (sum, t) => sum + (t.current_users || 0),
                        0
                      )}
                    </p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                      {t("manageTenants.suspended")}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {tenants.filter((t) => t.status === "suspended").length}
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
                placeholder={t("manageTenants.searchTenants")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="">{t("manageTenants.allStatus")}</option>
                <option value="Active">{t("manageTenants.active")}</option>
                <option value="Suspended">
                  {t("manageTenants.suspended")}
                </option>
                <option value="Pending">{t("manageTenants.pending")}</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
              >
                <option value="">{t("manageTenants.allPlans")}</option>
                <option value="Basic">{t("manageTenants.basic")}</option>
                <option value="Professional">
                  {t("manageTenants.professional")}
                </option>
                <option value="Enterprise">
                  {t("manageTenants.enterprise")}
                </option>
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
                      {t("manageTenants.tenant")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.status")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.users")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.plan")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.created")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.lastActive")}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t("manageTenants.actions")}
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
                            {tenant.company_name ||
                              t("manageTenants.notAvailable")}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tenant.domain || t("manageTenants.notAvailable")}
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
                        {tenant.current_users || 0}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                            tenant.plan_name || tenant.billing_period
                          )}`}
                        >
                          {tenant.plan_name ||
                            tenant.billing_period ||
                            t("manageTenants.notAvailable")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                        {tenant.created_at
                          ? new Date(tenant.created_at).toLocaleDateString()
                          : t("manageTenants.notAvailable")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                        {tenant.last_active
                          ? new Date(tenant.last_active).toLocaleDateString()
                          : t("manageTenants.notAvailable")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTenant(tenant)}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                            title={t("manageTenants.editTenant")}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTenant(tenant)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400 transition-colors"
                            title={t("manageTenants.deleteTenant")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoreActions(tenant)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 transition-colors"
                            title={t("manageTenants.moreActions")}
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
                      {tenant.company_name || t("manageTenants.notAvailable")}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {tenant.domain || t("manageTenants.notAvailable")}
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
                      {t("manageTenants.users")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {tenant.current_users || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t("manageTenants.plan")}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                        tenant.plan_name || tenant.billing_period
                      )}`}
                    >
                      {tenant.plan_name ||
                        tenant.billing_period ||
                        t("manageTenants.notAvailable")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      {t("manageTenants.created")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {tenant.created_at
                        ? new Date(tenant.created_at).toLocaleDateString()
                        : t("manageTenants.notAvailable")}
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
                      Last active:{" "}
                      {tenant.last_active
                        ? new Date(tenant.last_active).toLocaleDateString()
                        : "N/A"}
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
                onClick={() => {
                  setShowAddTenantModal(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tenant Name *
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newTenant.domain}
                    onChange={(e) =>
                      setNewTenant((prev) => ({
                        ...prev,
                        domain: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tenant"
                    required
                  />
                  <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-500 dark:text-gray-300 text-sm">
                    .lims.com
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  value={newTenant.email}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@tenant.com"
                  required
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
                  Max Users
                </label>
                <input
                  type="number"
                  value={newTenant.users}
                  onChange={(e) =>
                    setNewTenant((prev) => ({
                      ...prev,
                      users: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter maximum number of users"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setShowAddTenantModal(false);
                  setError(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTenant}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Tenant</span>
                )}
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
                onClick={() => {
                  setShowEditTenantModal(false);
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </p>
                </div>
              )}
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
                  Max Users
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
                  min="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setShowEditTenantModal(false);
                  setError(null);
                }}
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
                  <strong>{selectedTenant.name}</strong>? This action cannot be
                  undone.
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
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedTenant.status
                    )}`}
                  >
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
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                      selectedTenant.plan
                    )}`}
                  >
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
