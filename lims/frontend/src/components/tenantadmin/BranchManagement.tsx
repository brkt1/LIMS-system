import {
  Building2,
  Edit,
  Eye,
  MapPin,
  Phone,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { branchAPI } from "../../services/api";

const BranchManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");

  // Modal states
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [showViewBranchModal, setShowViewBranchModal] = useState(false);
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [showManageBranchModal, setShowManageBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  // Form states
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    zipCode: "",
    manager: "",
    establishedDate: "",
    totalStaff: "",
    totalPatients: "",
    services: "",
    operatingHours: "",
  });

  const [editBranch, setEditBranch] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    zipCode: "",
    manager: "",
    establishedDate: "",
    totalStaff: "",
    totalPatients: "",
    services: "",
    operatingHours: "",
  });

  const [manageData, setManageData] = useState({
    action: "",
    description: "",
    assignedTo: "",
    priority: "",
    dueDate: "",
    notes: "",
  });

  // Convert static data to state
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await branchAPI.getAll();
        // Transform the data to match frontend expectations
        const transformedBranches = (response.data || []).map(
          (branch: any) => ({
            ...branch,
            zipCode: branch.zip_code,
            establishedDate: branch.established_date,
            operatingHours:
              typeof branch.operating_hours === "object"
                ? JSON.stringify(branch.operating_hours)
                : branch.operating_hours || "",
            services: Array.isArray(branch.services)
              ? branch.services.join(", ")
              : branch.services || "",
          })
        );
        setBranches(transformedBranches);
      } catch (error: any) {
        console.error("Error fetching branches:", error);
        setError(error.message || "Failed to load branches");
        // Fallback to empty array if API fails
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || branch.status === filterStatus;
    const matchesCity = filterCity === "all" || branch.city === filterCity;
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Calculate statistics
  const totalBranches = branches.length;
  const activeBranches = branches.filter(
    (branch) => branch.status === "active"
  ).length;
  const totalStaff = branches.reduce(
    (sum, branch) => sum + branch.totalStaff,
    0
  );
  const totalPatients = branches.reduce(
    (sum, branch) => sum + branch.totalPatients,
    0
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddBranch = () => {
    setNewBranch({
      name: "",
      address: "",
      phone: "",
      email: "",
      city: "",
      state: "",
      zipCode: "",
      manager: "",
      establishedDate: "",
      totalStaff: "",
      totalPatients: "",
      services: "",
      operatingHours: "",
    });
    setShowAddBranchModal(true);
  };

  const handleViewBranch = (branch: any) => {
    setSelectedBranch(branch);
    setShowViewBranchModal(true);
  };

  const handleEditBranch = (branch: any) => {
    setSelectedBranch(branch);
    setEditBranch({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      city: branch.city,
      state: branch.state,
      zipCode: branch.zipCode,
      manager: branch.manager,
      establishedDate: branch.establishedDate,
      totalStaff: branch.totalStaff.toString(),
      totalPatients: branch.totalPatients.toString(),
      services: Array.isArray(branch.services)
        ? branch.services.join(", ")
        : branch.services,
      operatingHours: branch.operatingHours,
    });
    setShowEditBranchModal(true);
  };

  const handleManageBranch = (branch: any) => {
    setSelectedBranch(branch);
    setManageData({
      action: "",
      description: "",
      assignedTo: "",
      priority: "",
      dueDate: "",
      notes: "",
    });
    setShowManageBranchModal(true);
  };

  const handleCreateBranch = async () => {
    try {
      // Transform data for API
      const apiData = {
        name: newBranch.name,
        address: newBranch.address,
        phone: newBranch.phone,
        email: newBranch.email,
        city: newBranch.city,
        state: newBranch.state,
        zip_code: newBranch.zipCode,
        manager: newBranch.manager,
        established_date: newBranch.establishedDate,
        total_staff: parseInt(newBranch.totalStaff) || 0,
        total_patients: parseInt(newBranch.totalPatients) || 0,
        services: newBranch.services
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        operating_hours: newBranch.operatingHours,
        status: "active",
      };

      const response = await branchAPI.create(apiData);

      // Transform response data for frontend
      const transformedBranch = {
        ...response.data,
        zipCode: response.data.zip_code,
        establishedDate: response.data.established_date,
        operatingHours:
          typeof response.data.operating_hours === "object"
            ? JSON.stringify(response.data.operating_hours)
            : response.data.operating_hours || "",
        services: Array.isArray(response.data.services)
          ? response.data.services.join(", ")
          : response.data.services || "",
      };

      setBranches((prev: any) => [...prev, transformedBranch]);
      setShowAddBranchModal(false);
    } catch (error: any) {
      console.error("Error creating branch:", error);
      setError(error.message || "Failed to create branch");
    }
  };

  const handleUpdateBranch = async () => {
    try {
      // Transform data for API
      const apiData = {
        name: editBranch.name,
        address: editBranch.address,
        phone: editBranch.phone,
        email: editBranch.email,
        city: editBranch.city,
        state: editBranch.state,
        zip_code: editBranch.zipCode,
        manager: editBranch.manager,
        established_date: editBranch.establishedDate,
        total_staff: parseInt(editBranch.totalStaff) || 0,
        total_patients: parseInt(editBranch.totalPatients) || 0,
        services: editBranch.services
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        operating_hours: editBranch.operatingHours,
      };

      const response = await branchAPI.update(selectedBranch.id, apiData);

      // Transform response data for frontend
      const transformedBranch = {
        ...response.data,
        zipCode: response.data.zip_code,
        establishedDate: response.data.established_date,
        operatingHours:
          typeof response.data.operating_hours === "object"
            ? JSON.stringify(response.data.operating_hours)
            : response.data.operating_hours || "",
        services: Array.isArray(response.data.services)
          ? response.data.services.join(", ")
          : response.data.services || "",
      };

      setBranches((prev: any) =>
        prev.map((branch: any) =>
          branch.id === selectedBranch.id ? transformedBranch : branch
        )
      );
      setShowEditBranchModal(false);
    } catch (error: any) {
      console.error("Error updating branch:", error);
      setError(error.message || "Failed to update branch");
    }
  };

  const handleManageAction = () => {
    // Here you could implement specific management actions
    // For now, we'll just close the modal
    setShowManageBranchModal(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading branches...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading branches
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Branch Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage multiple clinic branches
          </p>
        </div>
        <button
          onClick={handleAddBranch}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by branch name, address, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Cities</option>
            <option value="Health City">Health City</option>
            <option value="Downtown">Downtown</option>
            <option value="Suburbia">Suburbia</option>
            <option value="Urgent City">Urgent City</option>
            <option value="Expert City">Expert City</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Branches
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
                {totalBranches}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Active Branches
              </p>
              <p className="text-2xl font-bold text-green-600">
                {activeBranches}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Staff
              </p>
              <p className="text-2xl font-bold text-blue-600">{totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPatients.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Staff/Patients
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Established
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBranches.map((branch) => (
                <tr
                  key={branch.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {branch.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          ID: {branch.id}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {branch.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {branch.city}, {branch.state}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {branch.zipCode}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {branch.phone}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {branch.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {branch.manager}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {branch.totalStaff} staff
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {branch.totalPatients.toLocaleString()} patients
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        branch.status
                      )}`}
                    >
                      {branch.status.charAt(0).toUpperCase() +
                        branch.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    {branch.establishedDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewBranch(branch)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEditBranch(branch)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleManageBranch(branch)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Manage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Add New Branch
              </h2>
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={newBranch.name}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter branch name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    value={newBranch.manager}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, manager: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter manager name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newBranch.address}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter full address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newBranch.city}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={newBranch.state}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={newBranch.zipCode}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, zipCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter zip code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newBranch.phone}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newBranch.email}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Established Date
                  </label>
                  <input
                    type="date"
                    value={newBranch.establishedDate}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        establishedDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={newBranch.operatingHours}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Mon-Fri 8AM-6PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Staff
                  </label>
                  <input
                    type="number"
                    value={newBranch.totalStaff}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, totalStaff: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter staff count"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Patients
                  </label>
                  <input
                    type="number"
                    value={newBranch.totalPatients}
                    onChange={(e) =>
                      setNewBranch({
                        ...newBranch,
                        totalPatients: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter patient count"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Services (comma-separated)
                </label>
                <textarea
                  value={newBranch.services}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, services: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter services offered (e.g., General Medicine, Laboratory, Radiology)"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Branch Modal */}
      {showViewBranchModal && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Branch Details
              </h2>
              <button
                onClick={() => setShowViewBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manager
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.manager}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedBranch.status
                    )}`}
                  >
                    {selectedBranch.status.charAt(0).toUpperCase() +
                      selectedBranch.status.slice(1)}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.address}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Established Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.establishedDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Operating Hours
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.operatingHours}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Staff
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.totalStaff}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Patients
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedBranch.totalPatients.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedBranch.services) ? (
                    selectedBranch.services.map(
                      (service: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {service}
                        </span>
                      )
                    )
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {selectedBranch.services}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowViewBranchModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditBranchModal && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Edit Branch
              </h2>
              <button
                onClick={() => setShowEditBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={editBranch.name}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    value={editBranch.manager}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, manager: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editBranch.address}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editBranch.city}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={editBranch.state}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, state: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={editBranch.zipCode}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, zipCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editBranch.phone}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editBranch.email}
                    onChange={(e) =>
                      setEditBranch({ ...editBranch, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Established Date
                  </label>
                  <input
                    type="date"
                    value={editBranch.establishedDate}
                    onChange={(e) =>
                      setEditBranch({
                        ...editBranch,
                        establishedDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={editBranch.operatingHours}
                    onChange={(e) =>
                      setEditBranch({
                        ...editBranch,
                        operatingHours: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Staff
                  </label>
                  <input
                    type="number"
                    value={editBranch.totalStaff}
                    onChange={(e) =>
                      setEditBranch({
                        ...editBranch,
                        totalStaff: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Patients
                  </label>
                  <input
                    type="number"
                    value={editBranch.totalPatients}
                    onChange={(e) =>
                      setEditBranch({
                        ...editBranch,
                        totalPatients: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Services (comma-separated)
                </label>
                <textarea
                  value={editBranch.services}
                  onChange={(e) =>
                    setEditBranch({ ...editBranch, services: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowEditBranchModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBranch}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Branch Modal */}
      {showManageBranchModal && selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Manage Branch
              </h2>
              <button
                onClick={() => setShowManageBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Branch Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{selectedBranch.name}</strong> - {selectedBranch.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Manager: {selectedBranch.manager}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Location: {selectedBranch.city}, {selectedBranch.state}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Management Action
                </label>
                <select
                  value={manageData.action}
                  onChange={(e) =>
                    setManageData({ ...manageData, action: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select action</option>
                  <option value="staff_assignment">Staff Assignment</option>
                  <option value="resource_allocation">
                    Resource Allocation
                  </option>
                  <option value="performance_review">Performance Review</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="expansion">Expansion Planning</option>
                  <option value="audit">Audit & Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={manageData.description}
                  onChange={(e) =>
                    setManageData({
                      ...manageData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter management action description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={manageData.assignedTo}
                  onChange={(e) =>
                    setManageData({ ...manageData, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter assigned person"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={manageData.priority}
                  onChange={(e) =>
                    setManageData({ ...manageData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={manageData.dueDate}
                  onChange={(e) =>
                    setManageData({ ...manageData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={manageData.notes}
                  onChange={(e) =>
                    setManageData({ ...manageData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter additional notes"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowManageBranchModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManageAction}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
