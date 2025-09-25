import {
  AlertTriangle,
  Plus,
  Search,
  Settings,
  Wrench,
  Eye,
  Edit,
  X,
  Check,
  Play,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { equipmentAPI } from "../../services/api";

const Equipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showViewEquipmentModal, setShowViewEquipmentModal] = useState(false);
  const [showMaintainEquipmentModal, setShowMaintainEquipmentModal] =
    useState(false);
  const [showCalibrateEquipmentModal, setShowCalibrateEquipmentModal] =
    useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  // Form states
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    location: "",
    notes: "",
  });

  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch equipment from API on component mount
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching equipment data...");
        const response = await equipmentAPI.getAll();
        console.log("Equipment API response:", response.data);

        // Transform backend data to match frontend format
        const transformedEquipment = response.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          type: item.department || "Unknown",
          manufacturer: item.supplier || "Unknown",
          model: item.model,
          serialNumber: item.serial_number,
          status: item.status,
          location: item.location || "Unknown",
          lastMaintenance: item.last_maintenance?.maintenance_date || "N/A",
          nextMaintenance: item.last_maintenance?.next_maintenance_due || "N/A",
          technician: "System",
          notes: item.notes || "",
        }));

        setEquipment(transformedEquipment);
      } catch (error: any) {
        console.error("Error fetching equipment:", error);
        console.error("Error details:", error.response?.data || error.message);
        setError(
          `Failed to load equipment data: ${
            error.response?.data?.detail || error.message || "Unknown error"
          }`
        );
        // Fallback to empty array
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // CRUD Functions
  const handleAddEquipment = () => {
    setShowAddEquipmentModal(true);
  };

  const handleViewEquipment = (item: any) => {
    setSelectedEquipment(item);
    setShowViewEquipmentModal(true);
  };

  const handleMaintainEquipment = (item: any) => {
    setSelectedEquipment(item);
    setShowMaintainEquipmentModal(true);
  };

  const handleCalibrateEquipment = (item: any) => {
    setSelectedEquipment(item);
    setShowCalibrateEquipmentModal(true);
  };

  const handleCreateEquipment = () => {
    const now = new Date();
    const newEquipmentData = {
      id: `EQP${String(equipment.length + 1).padStart(3, "0")}`,
      ...newEquipment,
      status: "operational",
      lastMaintenance: now.toISOString().split("T")[0],
      nextMaintenance: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      technician: "Current Technician",
    };

    setEquipment((prev) => [...prev, newEquipmentData]);
    setNewEquipment({
      name: "",
      type: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      location: "",
      notes: "",
    });
    setShowAddEquipmentModal(false);
  };

  const handleMaintainEquipmentAction = async () => {
    try {
      const now = new Date();
      const maintenanceData = {
        maintenance_date: now.toISOString().split("T")[0],
        maintenance_type: "Preventive",
        performed_by: "Current User", // You can get this from auth context
        description: "Routine maintenance performed",
        parts_replaced: "",
        cost: 0,
        next_maintenance_due: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      // Send maintenance record to backend
      await equipmentAPI.maintain(
        parseInt(selectedEquipment.id),
        maintenanceData
      );

      // Update equipment status to maintenance
      await equipmentAPI.updateStatus(
        parseInt(selectedEquipment.id),
        "maintenance"
      );

      // Refresh equipment list from backend
      const response = await equipmentAPI.getAll();
      const transformedEquipment = response.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        type: item.department || "Unknown",
        manufacturer: item.supplier || "Unknown",
        model: item.model,
        serialNumber: item.serial_number,
        status: item.status,
        location: item.location || "Unknown",
        lastMaintenance: item.last_maintenance?.maintenance_date || "N/A",
        nextMaintenance: item.last_maintenance?.next_maintenance_due || "N/A",
        technician: "System",
        notes: item.notes || "",
      }));
      setEquipment(transformedEquipment);

      console.log("Maintenance recorded successfully!");
      setShowMaintainEquipmentModal(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error("Error recording maintenance:", error);
      alert("Failed to record maintenance. Please try again.");
    }
  };

  const handleCalibrateEquipmentAction = async () => {
    try {
      const now = new Date();
      const calibrationData = {
        calibration_date: now.toISOString().split("T")[0],
        next_calibration_date: new Date(
          now.getTime() + 90 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        calibrated_by: "Current User", // You can get this from auth context
        notes: "Equipment calibrated successfully",
        certificate_number: `CAL-${Date.now()}`,
      };

      // Send calibration record to backend
      await equipmentAPI.calibrate(
        parseInt(selectedEquipment.id),
        calibrationData
      );

      // Update equipment status to operational
      await equipmentAPI.updateStatus(
        parseInt(selectedEquipment.id),
        "operational"
      );

      // Refresh equipment list from backend
      const response = await equipmentAPI.getAll();
      const transformedEquipment = response.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        type: item.department || "Unknown",
        manufacturer: item.supplier || "Unknown",
        model: item.model,
        serialNumber: item.serial_number,
        status: item.status,
        location: item.location || "Unknown",
        lastMaintenance: item.last_maintenance?.maintenance_date || "N/A",
        nextMaintenance: item.last_maintenance?.next_maintenance_due || "N/A",
        technician: "System",
        notes: item.notes || "",
      }));
      setEquipment(transformedEquipment);

      console.log("Calibration recorded successfully!");
      setShowCalibrateEquipmentModal(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error("Error recording calibration:", error);
      alert("Failed to record calibration. Please try again.");
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "maintenance":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "out_of_service":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "calibration":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return <Settings className="w-4 h-4 text-green-600" />;
      case "maintenance":
        return <Wrench className="w-4 h-4 text-yellow-600" />;
      case "out_of_service":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(
    (e) => e.status === "operational"
  ).length;
  const maintenanceEquipment = equipment.filter(
    (e) => e.status === "maintenance"
  ).length;
  const outOfServiceEquipment = equipment.filter(
    (e) => e.status === "out_of_service"
  ).length;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Loading equipment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
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
            Equipment
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage laboratory equipment and maintenance
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleAddEquipment}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
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
              placeholder="Search by equipment name, type, or ID..."
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
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
            <option value="calibration">Calibration</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Centrifuge">Centrifuge</option>
            <option value="Microscope">Microscope</option>
            <option value="Analyzer">Analyzer</option>
            <option value="Incubator">Incubator</option>
            <option value="PCR Machine">PCR Machine</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
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
                  Manufacturer
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Last Maintenance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Next Maintenance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEquipment.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          SN: {item.serialNumber}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {item.type} • {item.location}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block md:hidden">
                          {item.manufacturer} • {item.model}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden md:block lg:hidden">
                          Last: {item.lastMaintenance}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden lg:block">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {item.type}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    <div>
                      <div>{item.manufacturer}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.model}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {item.location}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.replace("_", " ").charAt(0).toUpperCase() +
                        item.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {item.lastMaintenance}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {item.nextMaintenance}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewEquipment(item)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleMaintainEquipment(item)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center space-x-1"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Maintain</span>
                      </button>
                      <button
                        onClick={() => handleCalibrateEquipment(item)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left flex items-center space-x-1"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Calibrate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showAddEquipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Equipment
              </h3>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
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
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter equipment name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newEquipment.type}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select equipment type</option>
                  <option value="Centrifuge">Centrifuge</option>
                  <option value="Microscope">Microscope</option>
                  <option value="Analyzer">Analyzer</option>
                  <option value="Incubator">Incubator</option>
                  <option value="PCR Machine">PCR Machine</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={newEquipment.manufacturer}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      manufacturer: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter manufacturer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={newEquipment.model}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      model: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter model"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={newEquipment.serialNumber}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      serialNumber: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter serial number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newEquipment.location}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newEquipment.notes}
                  onChange={(e) =>
                    setNewEquipment((prev) => ({
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
                onClick={() => setShowAddEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEquipment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Equipment Modal */}
      {showViewEquipmentModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Equipment Details
              </h3>
              <button
                onClick={() => setShowViewEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedEquipment.status
                    )}`}
                  >
                    {selectedEquipment.status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedEquipment.status.replace("_", " ").slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Manufacturer
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.manufacturer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.model}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Serial Number
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Maintenance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.lastMaintenance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Next Maintenance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.nextMaintenance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowViewEquipmentModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintain Equipment Modal */}
      {showMaintainEquipmentModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Maintain Equipment
              </h3>
              <button
                onClick={() => setShowMaintainEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                  <Wrench className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start Maintenance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you ready to start maintenance for{" "}
                  <strong>{selectedEquipment.name}</strong>?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Type:</strong> {selectedEquipment.type}
                    <br />
                    <strong>Location:</strong> {selectedEquipment.location}
                    <br />
                    <strong>Serial Number:</strong>{" "}
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowMaintainEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMaintainEquipmentAction}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Start Maintenance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calibrate Equipment Modal */}
      {showCalibrateEquipmentModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calibrate Equipment
              </h3>
              <button
                onClick={() => setShowCalibrateEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start Calibration
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you ready to start calibration for{" "}
                  <strong>{selectedEquipment.name}</strong>?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Type:</strong> {selectedEquipment.type}
                    <br />
                    <strong>Location:</strong> {selectedEquipment.location}
                    <br />
                    <strong>Serial Number:</strong>{" "}
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowCalibrateEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCalibrateEquipmentAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Start Calibration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
