import {
  Plus,
  Settings,
  Eye,
  Edit,
  X,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const Calibrations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showNewCalibrationModal, setShowNewCalibrationModal] = useState(false);
  const [showViewCalibrationModal, setShowViewCalibrationModal] =
    useState(false);
  const [showEditCalibrationModal, setShowEditCalibrationModal] =
    useState(false);
  const [selectedCalibration, setSelectedCalibration] = useState<any>(null);

  // Form states
  const [newCalibration, setNewCalibration] = useState({
    equipmentName: "",
    equipmentId: "",
    calibrationType: "",
    technician: "",
    scheduledDate: "",
    notes: "",
    standardUsed: "",
    tolerance: "",
  });

  const [calibrations, setCalibrations] = useState([
    {
      id: "CAL001",
      equipmentName: "Centrifuge Model CF-2000",
      equipmentId: "EQP001",
      calibrationType: "Routine",
      status: "completed",
      technician: "Mike Davis",
      scheduledDate: "2025-01-15",
      completedDate: "2025-01-15",
      nextCalibration: "2025-04-15",
      standardUsed: "ISO 15189",
      tolerance: "±0.1%",
      notes: "All parameters within acceptable range",
      results: "Passed",
    },
    {
      id: "CAL002",
      equipmentName: "Microscope Olympus BX51",
      equipmentId: "EQP002",
      calibrationType: "Annual",
      status: "scheduled",
      technician: "Lisa Wilson",
      scheduledDate: "2025-01-25",
      completedDate: "",
      nextCalibration: "2026-01-25",
      standardUsed: "ISO 15189",
      tolerance: "±0.05%",
      notes: "Annual calibration due",
      results: "",
    },
    {
      id: "CAL003",
      equipmentName: "Blood Analyzer Sysmex XN-1000",
      equipmentId: "EQP003",
      calibrationType: "Routine",
      status: "in_progress",
      technician: "Robert Brown",
      scheduledDate: "2025-01-20",
      completedDate: "",
      nextCalibration: "2025-04-20",
      standardUsed: "ISO 15189",
      tolerance: "±0.2%",
      notes: "Calibration in progress",
      results: "",
    },
    {
      id: "CAL004",
      equipmentName: "PCR Machine Applied Biosystems",
      equipmentId: "EQP005",
      calibrationType: "Quarterly",
      status: "overdue",
      technician: "Mike Davis",
      scheduledDate: "2025-01-10",
      completedDate: "",
      nextCalibration: "2025-04-10",
      standardUsed: "ISO 15189",
      tolerance: "±0.1°C",
      notes: "Overdue calibration - urgent",
      results: "",
    },
  ]);

  // Load calibrations from localStorage on component mount
  useEffect(() => {
    const savedCalibrations = localStorage.getItem("technician-calibrations");
    if (savedCalibrations) {
      try {
        setCalibrations(JSON.parse(savedCalibrations));
      } catch (error) {
        console.error("Error loading saved calibrations:", error);
      }
    }
  }, []);

  // Save calibrations to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      "technician-calibrations",
      JSON.stringify(calibrations)
    );
  }, [calibrations]);

  // CRUD Functions
  const handleNewCalibration = () => {
    setShowNewCalibrationModal(true);
  };

  const handleViewCalibration = (calibration: any) => {
    setSelectedCalibration(calibration);
    setShowViewCalibrationModal(true);
  };

  const handleEditCalibration = (calibration: any) => {
    setSelectedCalibration(calibration);
    setShowEditCalibrationModal(true);
  };

  const handleCreateCalibration = () => {
    const now = new Date();
    const newCalibrationData = {
      id: `CAL${String(calibrations.length + 1).padStart(3, "0")}`,
      ...newCalibration,
      status: "scheduled",
      nextCalibration: new Date(
        new Date(newCalibration.scheduledDate).getTime() +
          90 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0], // 90 days from scheduled date
    };

    setCalibrations((prev) => [...prev, newCalibrationData]);
    setNewCalibration({
      equipmentName: "",
      equipmentId: "",
      calibrationType: "",
      technician: "",
      scheduledDate: "",
      notes: "",
      standardUsed: "",
      tolerance: "",
    });
    setShowNewCalibrationModal(false);
  };

  const handleUpdateCalibration = () => {
    setCalibrations((prev) =>
      prev.map((c) =>
        c.id === selectedCalibration.id
          ? {
              ...c,
              ...newCalibration,
              status: "completed",
              completedDate: new Date().toISOString().split("T")[0],
              results: "Passed",
            }
          : c
      )
    );
    setShowEditCalibrationModal(false);
    setSelectedCalibration(null);
  };

  const filteredCalibrations = calibrations.filter((calibration) => {
    const matchesSearch =
      calibration.equipmentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      calibration.equipmentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      calibration.calibrationType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      calibration.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || calibration.status === filterStatus;
    const matchesType =
      filterType === "all" || calibration.calibrationType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calibrations
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage equipment calibrations
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleNewCalibration}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Calibration</span>
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
              placeholder="Search by equipment name, ID, type, or calibration ID..."
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
            <option value="Routine">Routine</option>
            <option value="Annual">Annual</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Calibrations Table */}
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
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Scheduled Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Next Calibration
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCalibrations.map((calibration) => (
                <tr
                  key={calibration.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {getStatusIcon(calibration.status)}
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {calibration.equipmentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          ID: {calibration.equipmentId}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {calibration.calibrationType} •{" "}
                          {calibration.technician}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block md:hidden">
                          {calibration.scheduledDate}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden md:block lg:hidden">
                          Next: {calibration.nextCalibration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {calibration.calibrationType}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {calibration.technician}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        calibration.status
                      )}`}
                    >
                      {calibration.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        calibration.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {calibration.scheduledDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {calibration.nextCalibration}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewCalibration(calibration)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {calibration.status !== "completed" && (
                        <button
                          onClick={() => handleEditCalibration(calibration)}
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

      {/* New Calibration Modal */}
      {showNewCalibrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Calibration
              </h3>
              <button
                onClick={() => setShowNewCalibrationModal(false)}
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
                  value={newCalibration.equipmentName}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
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
                  value={newCalibration.equipmentId}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
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
                  Calibration Type
                </label>
                <select
                  value={newCalibration.calibrationType}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
                      ...prev,
                      calibrationType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select calibration type</option>
                  <option value="Routine">Routine</option>
                  <option value="Annual">Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technician
                </label>
                <input
                  type="text"
                  value={newCalibration.technician}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
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
                  value={newCalibration.scheduledDate}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Standard Used
                </label>
                <input
                  type="text"
                  value={newCalibration.standardUsed}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
                      ...prev,
                      standardUsed: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., ISO 15189"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tolerance
                </label>
                <input
                  type="text"
                  value={newCalibration.tolerance}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
                      ...prev,
                      tolerance: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., ±0.1%"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCalibration.notes}
                  onChange={(e) =>
                    setNewCalibration((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowNewCalibrationModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCalibration}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Schedule Calibration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Calibration Modal */}
      {showViewCalibrationModal && selectedCalibration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calibration Details
              </h3>
              <button
                onClick={() => setShowViewCalibrationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calibration ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedCalibration.status
                    )}`}
                  >
                    {selectedCalibration.status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedCalibration.status.replace("_", " ").slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.equipmentName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.equipmentId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Calibration Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.calibrationType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scheduled Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.scheduledDate}
                  </p>
                </div>
                {selectedCalibration.completedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Completed Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedCalibration.completedDate}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Next Calibration
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.nextCalibration}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Standard Used
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.standardUsed}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tolerance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.tolerance}
                  </p>
                </div>
                {selectedCalibration.results && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Results
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedCalibration.results}
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedCalibration.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowViewCalibrationModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Calibration Modal */}
      {showEditCalibrationModal && selectedCalibration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complete Calibration
              </h3>
              <button
                onClick={() => setShowEditCalibrationModal(false)}
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
                  Complete Calibration
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Mark calibration for{" "}
                  <strong>{selectedCalibration.equipmentName}</strong> as
                  completed?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Type:</strong> {selectedCalibration.calibrationType}
                    <br />
                    <strong>Technician:</strong>{" "}
                    {selectedCalibration.technician}
                    <br />
                    <strong>Scheduled:</strong>{" "}
                    {selectedCalibration.scheduledDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowEditCalibrationModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCalibration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Calibration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calibrations;
