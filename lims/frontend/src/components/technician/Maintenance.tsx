import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Plus,
    Search,
    Wrench,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { technicianEquipmentAPI } from "../../services/api";

const Maintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showScheduleMaintenanceModal, setShowScheduleMaintenanceModal] =
    useState(false);
  const [showViewMaintenanceModal, setShowViewMaintenanceModal] =
    useState(false);
  const [showEditMaintenanceModal, setShowEditMaintenanceModal] =
    useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);

  // Form states
  const [newMaintenance, setNewMaintenance] = useState({
    equipmentName: "",
    equipmentId: "",
    maintenanceType: "",
    technician: "",
    scheduledDate: "",
    priority: "normal",
    description: "",
    estimatedDuration: "",
  });

  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load maintenance records from API
  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await technicianEquipmentAPI.getAll();
        // Transform equipment data to maintenance format
        const equipmentData = response.data || [];
        const maintenanceData = equipmentData.map((equipment: any, index: number) => ({
          id: `MNT${String(index + 1).padStart(3, "0")}`,
          equipmentName: equipment.name || equipment.equipment_name || `Equipment ${index + 1}`,
          equipmentId: equipment.id || equipment.equipment_id || `EQ${index + 1}`,
          maintenanceType: "Preventive",
          technician: "Current Technician",
          scheduledDate: new Date().toISOString().split("T")[0],
          priority: "normal",
          description: "Regular maintenance scheduled",
          estimatedDuration: "2 hours",
          status: "scheduled",
          actualDuration: "",
          notes: "",
        }));
        setMaintenanceRecords(maintenanceData);
      } catch (error: any) {
        console.error("Error fetching maintenance records:", error);
        setError(error.message || "Failed to load maintenance records");
        // Fallback to empty array if API fails
        setMaintenanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRecords();
  }, []);

  // CRUD Functions
  const handleScheduleMaintenance = () => {
    setShowScheduleMaintenanceModal(true);
  };

  const handleViewMaintenance = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setShowViewMaintenanceModal(true);
  };

  const handleEditMaintenance = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setShowEditMaintenanceModal(true);
  };

  const handleCreateMaintenance = () => {
    const newMaintenanceData = {
      id: `MNT${String(maintenanceRecords.length + 1).padStart(3, "0")}`,
      ...newMaintenance,
      status: "scheduled",
      actualDuration: "",
      notes: "",
    };

    setMaintenanceRecords((prev) => [...prev, newMaintenanceData]);
    setNewMaintenance({
      equipmentName: "",
      equipmentId: "",
      maintenanceType: "",
      technician: "",
      scheduledDate: "",
      priority: "normal",
      description: "",
      estimatedDuration: "",
    });
    setShowScheduleMaintenanceModal(false);
  };

  const handleUpdateMaintenance = () => {
    setMaintenanceRecords((prev) =>
      prev.map((m) =>
        m.id === selectedMaintenance.id
          ? {
              ...m,
              status: "completed",
              completedDate: new Date().toISOString().split("T")[0],
              actualDuration: "2 hours", // Mock actual duration
            }
          : m
      )
    );
    setShowEditMaintenanceModal(false);
    setSelectedMaintenance(null);
  };

  const filteredMaintenance = maintenanceRecords.filter((maintenance) => {
    const matchesSearch =
      (maintenance.equipmentName?.toLowerCase() || '')
        .includes(searchTerm.toLowerCase()) ||
      (maintenance.equipmentId?.toLowerCase() || '')
        .includes(searchTerm.toLowerCase()) ||
      (maintenance.maintenanceType?.toLowerCase() || '')
        .includes(searchTerm.toLowerCase()) ||
      (maintenance.id?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || maintenance.status === filterStatus;
    const matchesType =
      filterType === "all" || maintenance.maintenanceType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase() || '') {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "scheduled":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "in_progress":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "normal":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "scheduled":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Wrench className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading maintenance records...</p>
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
                Error loading maintenance records
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
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Maintenance
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Schedule and track equipment maintenance
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleScheduleMaintenance}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by equipment name, ID, type, or maintenance ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Emergency">Emergency</option>
            <option value="Predictive">Predictive</option>
          </select>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Technician
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Scheduled Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMaintenance.map((maintenance) => (
                <tr
                  key={maintenance.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {getStatusIcon(maintenance.status)}
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {maintenance.equipmentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          ID: {maintenance.equipmentId}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {maintenance.maintenanceType} •{" "}
                          {maintenance.technician}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block md:hidden">
                          {maintenance.scheduledDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {maintenance.maintenanceType}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {maintenance.technician}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        maintenance.priority
                      )}`}
                    >
                      {maintenance.priority.charAt(0).toUpperCase() +
                        maintenance.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        maintenance.status
                      )}`}
                    >
                      {maintenance.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        maintenance.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {maintenance.scheduledDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewMaintenance(maintenance)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {maintenance.status !== "completed" && (
                        <button
                          onClick={() => handleEditMaintenance(maintenance)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Maintenance Modal */}
      {showScheduleMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Maintenance
              </h3>
              <button
                onClick={() => setShowScheduleMaintenanceModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Equipment Name
                </label>
                <input
                  type="text"
                  value={newMaintenance.equipmentName}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      equipmentName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter equipment name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Equipment ID
                </label>
                <input
                  type="text"
                  value={newMaintenance.equipmentId}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      equipmentId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter equipment ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maintenance Type
                </label>
                <select
                  value={newMaintenance.maintenanceType}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      maintenanceType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select maintenance type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Predictive">Predictive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technician
                </label>
                <input
                  type="text"
                  value={newMaintenance.technician}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      technician: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter technician name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={newMaintenance.scheduledDate}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newMaintenance.priority}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Duration
                </label>
                <input
                  type="text"
                  value={newMaintenance.estimatedDuration}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      estimatedDuration: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newMaintenance.description}
                  onChange={(e) =>
                    setNewMaintenance((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter maintenance description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowScheduleMaintenanceModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMaintenance}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Maintenance Modal */}
      {showViewMaintenanceModal && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Maintenance Details
              </h3>
              <button
                onClick={() => setShowViewMaintenanceModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedMaintenance.status
                    )}`}
                  >
                    {selectedMaintenance.status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedMaintenance.status.replace("_", " ").slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.equipmentName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.equipmentId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.maintenanceType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedMaintenance.priority
                    )}`}
                  >
                    {selectedMaintenance.priority.charAt(0).toUpperCase() +
                      selectedMaintenance.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scheduled Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.scheduledDate}
                  </p>
                </div>
                {selectedMaintenance.completedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Completed Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMaintenance.completedDate}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estimated Duration
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.estimatedDuration}
                  </p>
                </div>
                {selectedMaintenance.actualDuration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actual Duration
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMaintenance.actualDuration}
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMaintenance.description}
                  </p>
                </div>
                {selectedMaintenance.notes && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedMaintenance.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowViewMaintenanceModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Maintenance Modal */}
      {showEditMaintenanceModal && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complete Maintenance
              </h3>
              <button
                onClick={() => setShowEditMaintenanceModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Complete Maintenance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Mark maintenance for{" "}
                  <strong>{selectedMaintenance.equipmentName}</strong> as
                  completed?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Type:</strong> {selectedMaintenance.maintenanceType}
                    <br />
                    <strong>Technician:</strong>{" "}
                    {selectedMaintenance.technician}
                    <br />
                    <strong>Scheduled:</strong>{" "}
                    {selectedMaintenance.scheduledDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowEditMaintenanceModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMaintenance}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Maintenance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
