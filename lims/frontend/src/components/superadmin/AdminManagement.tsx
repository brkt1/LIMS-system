import {
    Edit,
    Eye,
    MoreVertical,
    Plus,
    Search,
    Shield,
    Trash2,
    UserCheck,
    UserX,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";

const AdminManagement: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal states
  const [showViewAdminModal, setShowViewAdminModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [showMoreActionsModal, setShowMoreActionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Form states
  const [editAdmin, setEditAdmin] = useState({
    name: "",
    email: "",
    role: "System Admin",
    status: "Active",
    permissions: [] as string[],
  });

  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "system_admin",
    status: "active",
  });

  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admins from backend API
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await superadminAPI.users.getAll();
        setAdmins(response.data);
      } catch (error: any) {
        console.error("Error fetching admins:", error);
        setError(error.message || "Failed to load admins");
        // Set empty array when API fails
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // CRUD handler functions
  const handleViewAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setShowViewAdminModal(true);
  };

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setEditAdmin({
      name: admin.full_name || `${admin.first_name} ${admin.last_name}` || "",
      email: admin.email || "",
      role: admin.role || "",
      status: admin.status || "",
      permissions: admin.permissions || [],
    });
    setShowEditAdminModal(true);
  };

  const handleDeleteAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setShowDeleteAdminModal(true);
  };

  const handleMoreActions = (admin: any) => {
    setSelectedAdmin(admin);
    setShowMoreActionsModal(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await superadminAPI.users.create(newAdmin);
      
      // Refresh the admin list
      const response = await superadminAPI.users.getAll();
      setAdmins(response.data);
      
      // Reset form and close modal
      setNewAdmin({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "system_admin",
        status: "active",
      });
      setShowAddModal(false);
    } catch (error: any) {
      console.error("Error creating admin:", error);
      setError(error.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdmin = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        const [firstName, ...lastNameParts] = editAdmin.name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        const updateData = {
          first_name: firstName,
          last_name: lastName,
          email: editAdmin.email,
          role: editAdmin.role,
          status: editAdmin.status,
        };

        await superadminAPI.users.update(selectedAdmin.id, updateData);
        
        // Refresh the admin list
        const response = await superadminAPI.users.getAll();
        setAdmins(response.data);
        
        setShowEditAdminModal(false);
        setSelectedAdmin(null);
      } catch (error: any) {
        console.error("Error updating admin:", error);
        setError(error.message || "Failed to update admin");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAdminConfirm = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        await superadminAPI.users.delete(selectedAdmin.id);
        
        // Refresh the admin list
        const response = await superadminAPI.users.getAll();
        setAdmins(response.data);
        
        setShowDeleteAdminModal(false);
        setSelectedAdmin(null);
      } catch (error: any) {
        console.error("Error deleting admin:", error);
        setError(error.message || "Failed to delete admin");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuspendAdmin = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        await superadminAPI.users.suspend(selectedAdmin.id);
        
        // Refresh the admin list
        const response = await superadminAPI.users.getAll();
        setAdmins(response.data);
        
        setShowMoreActionsModal(false);
        setSelectedAdmin(null);
      } catch (error: any) {
        console.error("Error suspending admin:", error);
        setError(error.message || "Failed to suspend admin");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleActivateAdmin = async () => {
    if (selectedAdmin) {
      try {
        setLoading(true);
        await superadminAPI.users.activate(selectedAdmin.id);
        
        // Refresh the admin list
        const response = await superadminAPI.users.getAll();
        setAdmins(response.data);
        
        setShowMoreActionsModal(false);
        setSelectedAdmin(null);
      } catch (error: any) {
        console.error("Error activating admin:", error);
        setError(error.message || "Failed to activate admin");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const fullName = admin.full_name || `${admin.first_name} ${admin.last_name}` || "";
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      (admin.role || "").toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "bg-purple-100 text-purple-800";
      case "system_admin":
        return "bg-blue-100 text-blue-800";
      case "support_admin":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(
    (admin) => (admin.status || "").toLowerCase() === "active"
  ).length;
  const superAdmins = admins.filter(
    (admin) => (admin.role || "").toLowerCase() === "super_admin"
  ).length;

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
              {t('adminManagement.dismiss')}
            </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {t('adminManagement.loadingAdmins')}
            </span>
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('adminManagement.title')}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t('adminManagement.description')}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t('adminManagement.addAdmin')}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {t('adminManagement.totalAdmins')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalAdmins}
                </p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {t('adminManagement.activeAdmins')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {activeAdmins}
                </p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {t('adminManagement.superAdmins')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {superAdmins}
                </p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                  {t('adminManagement.inactive')}
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalAdmins - activeAdmins}
                </p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('adminManagement.searchAdmins')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">{t('adminManagement.allRoles')}</option>
                <option value="super">{t('adminManagement.superAdmin')}</option>
                <option value="system">{t('adminManagement.systemAdmin')}</option>
                <option value="support">{t('adminManagement.supportAdmin')}</option>
                <option value="billing">{t('adminManagement.billingAdmin')}</option>
              </select>
              <select className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent">
                <option value="all">{t('adminManagement.allStatus')}</option>
                <option value="active">{t('adminManagement.active')}</option>
                <option value="inactive">{t('adminManagement.inactive')}</option>
                <option value="pending">{t('adminManagement.pending')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Admin
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Permissions
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Login
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created
                  </th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins && filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                            {admin.avatar}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {admin.full_name || `${admin.first_name} ${admin.last_name}` || "Unknown"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {admin.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                          admin.role || "Unknown"
                        )}`}
                      >
                        {admin.role === 'super_admin' ? 'Super Admin' : 
                         admin.role === 'system_admin' ? 'System Admin' : 
                         admin.role === 'support_admin' ? 'Support Admin' : 
                         admin.role || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          admin.status || "Unknown"
                        )}`}
                      >
                        {admin.status === 'active' ? 'Active' : 
                         admin.status === 'inactive' ? 'Inactive' : 
                         admin.status === 'suspended' ? 'Suspended' : 
                         admin.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex flex-wrap gap-1">
                        {(admin.permissions || [])
                          .slice(0, 2)
                          .map((permission, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {permission}
                            </span>
                          ))}
                        {(admin.permissions || []).length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            +{(admin.permissions || []).length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {admin.lastLogin}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {admin.created}
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => handleViewAdmin(admin)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:text-blue-400"
                          title="View Admin"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="p-1 text-gray-400 hover:text-green-600 dark:text-green-400"
                          title="Edit Admin"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:text-red-400"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleMoreActions(admin)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                          title="More Actions"
                        >
                          <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      {loading ? "Loading admins..." : "No admins found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Admin
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.first_name}
                    onChange={(e) => setNewAdmin({...newAdmin, first_name: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.last_name}
                    onChange={(e) => setNewAdmin({...newAdmin, last_name: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                    Role
                  </label>
                  <select 
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="system_admin">System Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="support_admin">Support Admin</option>
                  </select>
                </div>


                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors"
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

        {/* View Admin Modal */}
        {showViewAdminModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Details
                </h3>
                <button
                  onClick={() => setShowViewAdminModal(false)}
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
                      {selectedAdmin.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAdmin.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        selectedAdmin.role
                      )}`}
                    >
                      {selectedAdmin.role}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedAdmin.status
                      )}`}
                    >
                      {selectedAdmin.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Login
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAdmin.lastLogin}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedAdmin.created}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAdmin.permissions || []).map(
                      (permission: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {permission}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowViewAdminModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditAdminModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Admin
                </h3>
                <button
                  onClick={() => setShowEditAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editAdmin.name.split(' ')[0] || ''}
                      onChange={(e) => {
                        const lastName = editAdmin.name.split(' ').slice(1).join(' ');
                        setEditAdmin({ ...editAdmin, name: `${e.target.value} ${lastName}`.trim() })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editAdmin.name.split(' ').slice(1).join(' ') || ''}
                      onChange={(e) => {
                        const firstName = editAdmin.name.split(' ')[0];
                        setEditAdmin({ ...editAdmin, name: `${firstName} ${e.target.value}`.trim() })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editAdmin.email}
                      onChange={(e) =>
                        setEditAdmin({ ...editAdmin, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={editAdmin.role}
                      onChange={(e) =>
                        setEditAdmin({ ...editAdmin, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="system_admin">System Admin</option>
                      <option value="support_admin">Support Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={editAdmin.status}
                      onChange={(e) =>
                        setEditAdmin({ ...editAdmin, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowEditAdminModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAdmin}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Admin Modal */}
        {showDeleteAdminModal && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Admin
                </h3>
                <button
                  onClick={() => setShowDeleteAdminModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete{" "}
                  <strong>{selectedAdmin.name}</strong>? This action cannot be
                  undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteAdminModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdminConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* More Actions Modal */}
        {showMoreActionsModal && selectedAdmin && (
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
                  Additional actions for <strong>{selectedAdmin.name}</strong>
                </p>
                <div className="space-y-3">
                  {selectedAdmin.status === "Active" ? (
                    <button
                      onClick={handleSuspendAdmin}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <span>Suspend Admin</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleActivateAdmin}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <span>Activate Admin</span>
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
    </div>
  );
};

export default AdminManagement;
