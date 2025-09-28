import {
  BarChart3,
  Building2,
  Download,
  Edit,
  Eye,
  MoreVertical,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";

const AllTenants: React.FC = () => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showViewTenantModal, setShowViewTenantModal] = useState(false);
  const [showEditTenantModal, setShowEditTenantModal] = useState(false);
  const [showDeleteTenantModal, setShowDeleteTenantModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  // Form states
  const [editTenant, setEditTenant] = useState({
    name: "",
    domain: "",
    status: "Active",
    users: 0,
    plan: "Basic",
    revenue: 0,
    growth: 0,
  });

  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planOptions, setPlanOptions] = useState<string[]>([]);

  // Load data from backend API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superadminAPI.tenants.getAll();
        setTenants(response.data);
      } catch (error: any) {
        console.error("Error fetching tenants:", error);
        setError(error.message || "Failed to load tenants");
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlanOptions = async () => {
      try {
        const response = await superadminAPI.plans.getAll();
        const plans = response.data.map((plan: any) => plan.name || plan.plan_name);
        setPlanOptions(plans);
      } catch (error: any) {
        console.error("Error fetching plan options:", error);
        // Fallback to default options
        setPlanOptions(["Basic", "Professional", "Enterprise"]);
      }
    };

    fetchTenants();
    fetchPlanOptions();
  }, []);


  // Export functionality
  const handleExportAll = () => {
    const csvContent = generateCSV(tenants);
    downloadCSV(csvContent, "all-tenants-export.csv");
  };

  const generateCSV = (data: any[]) => {
    const headers = [
      t('allTenants.exportHeaders.id'),
      t('allTenants.exportHeaders.name'),
      t('allTenants.exportHeaders.domain'),
      t('allTenants.exportHeaders.status'),
      t('allTenants.exportHeaders.users'),
      t('allTenants.exportHeaders.plan'),
      t('allTenants.exportHeaders.created'),
      t('allTenants.exportHeaders.lastActive'),
      t('allTenants.exportHeaders.revenue'),
      t('allTenants.exportHeaders.growth'),
    ];

    const rows = data.map((tenant) => [
      tenant.id,
      tenant.company_name || tenant.name || 'N/A',
      tenant.domain || 'N/A',
      tenant.status || 'N/A',
      tenant.current_users || tenant.users || 0,
      tenant.plan_name || tenant.plan || 'N/A',
      tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : tenant.created || 'N/A',
      tenant.last_active ? new Date(tenant.last_active).toLocaleDateString() : tenant.lastActive || 'N/A',
      tenant.revenue || 0,
      tenant.growth || 0,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CRUD handler functions
  const handleViewTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowViewTenantModal(true);
  };

  const handleEditTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setEditTenant({
      name: tenant.company_name || tenant.name || '',
      domain: tenant.domain || '',
      status: tenant.status || '',
      users: tenant.current_users || tenant.users || 0,
      plan: tenant.plan_name || tenant.plan || '',
      revenue: tenant.revenue || 0,
      growth: tenant.growth || 0,
    });
    setShowEditTenantModal(true);
  };

  const handleDeleteTenant = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowDeleteTenantModal(true);
  };

  const handleMoreActions = (tenant: any) => {
    setSelectedTenant(tenant);
    setShowMoreActionsModal(true);
  };

  const handleUpdateTenant = async () => {
    if (selectedTenant) {
      try {
        const response = await superadminAPI.tenants.update(selectedTenant.id, editTenant);
        setTenants((prev: any) =>
          prev.map((tenant: any) =>
            tenant.id === selectedTenant.id
              ? { ...tenant, ...response.data }
              : tenant
          )
        );
        setShowEditTenantModal(false);
        setSelectedTenant(null);
      } catch (error: any) {
        console.error("Error updating tenant:", error);
        setError(error.message || "Failed to update tenant");
      }
    }
  };

  const handleDeleteTenantConfirm = async () => {
    if (selectedTenant) {
      try {
        await superadminAPI.tenants.delete(selectedTenant.id);
        setTenants((prev: any) =>
          prev.filter((tenant: any) => tenant.id !== selectedTenant.id)
        );
        setShowDeleteTenantModal(false);
        setSelectedTenant(null);
      } catch (error: any) {
        console.error("Error deleting tenant:", error);
        setError(error.message || "Failed to delete tenant");
      }
    }
  };

  const handleSuspendTenant = async () => {
    if (selectedTenant) {
      try {
        await superadminAPI.tenants.suspend(selectedTenant.id);
        setTenants((prev: any) =>
          prev.map((tenant: any) =>
            tenant.id === selectedTenant.id
              ? { ...tenant, status: "Suspended" }
              : tenant
          )
        );
        setShowMoreActionsModal(false);
        setSelectedTenant(null);
      } catch (error: any) {
        console.error("Error suspending tenant:", error);
        setError(error.message || "Failed to suspend tenant");
      }
    }
  };

  const handleActivateTenant = async () => {
    if (selectedTenant) {
      try {
        await superadminAPI.tenants.activate(selectedTenant.id);
        setTenants((prev: any) =>
          prev.map((tenant: any) =>
            tenant.id === selectedTenant.id
              ? { ...tenant, status: "Active" }
              : tenant
          )
        );
        setShowMoreActionsModal(false);
        setSelectedTenant(null);
      } catch (error: any) {
        console.error("Error activating tenant:", error);
        setError(error.message || "Failed to activate tenant");
      }
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    if (!tenant) return false;
    
    const matchesStatus =
      filterStatus === "all" || tenant.status === filterStatus;
    const matchesSearch =
      (tenant.company_name || tenant.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.domain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tenant.plan_name || tenant.plan || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600";
  };

  const totalRevenue = tenants.reduce((sum, tenant) => sum + (tenant.revenue || 0), 0);
  const totalUsers = tenants.reduce((sum, tenant) => sum + (tenant.current_users || tenant.users || 0), 0);
  const activeTenants = tenants.filter((t) => t.status === "Active" || t.status === "active").length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('allTenants.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {t('allTenants.description')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>{t('allTenants.exportAll')}</span>
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
              {t('allTenants.grid')}
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-3 py-2 text-sm ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
              }`}
            >
              {t('allTenants.list')}
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
                {t('allTenants.totalTenants')}
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
                {t('allTenants.activeTenants')}
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
                {t('allTenants.totalUsers')}
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
                {t('allTenants.totalRevenue')}
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
              placeholder={t('allTenants.searchTenants')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            >
              <option value="all">{t('allTenants.allStatus')}</option>
              <option value="Active">{t('allTenants.active')}</option>
              <option value="Suspended">{t('allTenants.suspended')}</option>
              <option value="Pending">{t('allTenants.pending')}</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
            >
              <option value="name">{t('allTenants.sortByName')}</option>
              <option value="created">{t('allTenants.sortByCreated')}</option>
              <option value="users">{t('allTenants.sortByUsers')}</option>
              <option value="revenue">{t('allTenants.sortByRevenue')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTenants && filteredTenants.length > 0 ? filteredTenants.map((tenant) => (
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
                      {tenant.company_name || tenant.name || t('allTenants.notAvailable')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {tenant.domain || t('allTenants.notAvailable')}
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
                    {t('allTenants.users')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    {tenant.current_users || tenant.users || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('allTenants.plan')}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                      tenant.plan_name || tenant.plan
                    )}`}
                  >
                    {tenant.plan_name || tenant.plan || t('allTenants.notAvailable')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('allTenants.revenue')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    ${(tenant.revenue || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('allTenants.growth')}
                  </span>
                  <span
                    className={`font-medium text-sm sm:text-base ${getGrowthColor(
                      tenant.growth || 0
                    )}`}
                  >
                    {(tenant.growth || 0) > 0 ? "+" : ""}
                    {tenant.growth || 0}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0 mb-3">
                  <span>{t('allTenants.created')}: {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : tenant.created || t('allTenants.notAvailable')}</span>
                  <span>{t('allTenants.lastActive')}: {tenant.last_active ? new Date(tenant.last_active).toLocaleDateString() : tenant.lastActive || t('allTenants.notAvailable')}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleViewTenant(tenant)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{t('allTenants.view')}</span>
                  </button>
                  <button
                    onClick={() => handleEditTenant(tenant)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    <span>{t('allTenants.edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTenant(tenant)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t('allTenants.delete')}</span>
                  </button>
                  <button
                    onClick={() => handleMoreActions(tenant)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MoreVertical className="w-3 h-3" />
                    <span>{t('allTenants.more')}</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                {loading ? t('allTenants.loadingTenants') : t('allTenants.noTenantsFound')}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.tenant')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.status')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.users')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.plan')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.revenue')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.growth')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.created')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t('allTenants.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTenants && filteredTenants.length > 0 ? filteredTenants.map((tenant) => (
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
                            {tenant.company_name || tenant.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tenant.domain || 'N/A'}
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
                      {tenant.current_users || tenant.users || 0}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                          tenant.plan_name || tenant.plan
                        )}`}
                      >
                        {tenant.plan_name || tenant.plan || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${(tenant.revenue || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-sm font-medium ${getGrowthColor(
                          tenant.growth || 0
                        )}`}
                      >
                        {(tenant.growth || 0) > 0 ? "+" : ""}
                        {tenant.growth || 0}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : tenant.created || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewTenant(tenant)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View Tenant"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTenant(tenant)}
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Edit Tenant"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTenant(tenant)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete Tenant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoreActions(tenant)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                          title="More Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500 dark:text-gray-400">
                      {loading ? "Loading tenants..." : "No tenants found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Tenant Modal */}
      {showViewTenantModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.domain}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Users
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.users}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Revenue
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedTenant.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Growth
                  </label>
                  <p
                    className={`text-sm font-medium ${getGrowthColor(
                      selectedTenant.growth
                    )}`}
                  >
                    {selectedTenant.growth > 0 ? "+" : ""}
                    {selectedTenant.growth}%
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.created}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Active
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTenant.lastActive}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewTenantModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditTenantModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editTenant.name}
                    onChange={(e) =>
                      setEditTenant({ ...editTenant, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={editTenant.domain}
                    onChange={(e) =>
                      setEditTenant({ ...editTenant, domain: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editTenant.status}
                    onChange={(e) =>
                      setEditTenant({ ...editTenant, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
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
                    value={editTenant.plan}
                    onChange={(e) =>
                      setEditTenant({ ...editTenant, plan: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  >
                    {planOptions.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Users
                  </label>
                  <input
                    type="number"
                    value={editTenant.users}
                    onChange={(e) =>
                      setEditTenant({
                        ...editTenant,
                        users: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Revenue
                  </label>
                  <input
                    type="number"
                    value={editTenant.revenue}
                    onChange={(e) =>
                      setEditTenant({
                        ...editTenant,
                        revenue: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Growth (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editTenant.growth}
                    onChange={(e) =>
                      setEditTenant({
                        ...editTenant,
                        growth: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditTenantModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTenant}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedTenant.name}</strong>? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDeleteTenantModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTenantConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Tenant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Actions Modal */}
      {showMoreActionsModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Additional actions for <strong>{selectedTenant.name}</strong>
              </p>
              <div className="space-y-3">
                {selectedTenant.status === "Active" ? (
                  <button
                    onClick={handleSuspendTenant}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    <span>Suspend Tenant</span>
                  </button>
                ) : (
                  <button
                    onClick={handleActivateTenant}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <span>Activate Tenant</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowMoreActionsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

export default AllTenants;

