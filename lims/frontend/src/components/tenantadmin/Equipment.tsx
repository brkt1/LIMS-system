import {
  Calendar,
  Edit,
  Eye,
  Plus,
  Search,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { equipmentAPI } from "../../services/api";
import { getCurrentTenantId } from "../../utils/helpers";

const Equipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showViewEquipmentModal, setShowViewEquipmentModal] = useState(false);
  const [showMaintainEquipmentModal, setShowMaintainEquipmentModal] =
    useState(false);
  const [showEditEquipmentModal, setShowEditEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  // Form states
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    category: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    location: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceInterval: "",
    responsible: "",
    cost: "",
    condition: "",
  });

  const [editEquipment, setEditEquipment] = useState({
    name: "",
    type: "",
    category: "",
    serialNumber: "",
    manufacturer: "",
    model: "",
    location: "",
    purchaseDate: "",
    warrantyExpiry: "",
    maintenanceInterval: "",
    responsible: "",
    cost: "",
    condition: "",
  });

  const [maintenanceData, setMaintenanceData] = useState({
    maintenanceType: "",
    description: "",
    technician: "",
    scheduledDate: "",
    estimatedDuration: "",
    notes: "",
  });

  // Equipment state
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load equipment from backend API
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await equipmentAPI.getAll();

        // Map backend data to frontend expected format
        const mappedEquipment = response.data.results
          ? response.data.results.map((item: any) => ({
              id: item.id,
              name: item.name,
              type: item.equipment_type,
              category: item.category,
              serialNumber: item.serial_number,
              manufacturer: item.manufacturer,
              model: item.model,
              status: item.status,
              location: item.location,
              purchaseDate: item.purchase_date,
              warrantyExpiry: item.warranty_expiry,
              lastMaintenance: item.last_maintenance,
              nextMaintenance: item.next_maintenance,
              maintenanceInterval: item.maintenance_interval,
              responsible: item.responsible_person,
              cost: parseFloat(item.cost),
              condition: item.condition,
            }))
          : [];

        setEquipment(mappedEquipment);
      } catch (error: any) {
        console.error("Error fetching equipment:", error);
        setError(error.message || "Failed to load equipment");
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_service":
        return "bg-red-100 text-red-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "needs repair":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddEquipment = () => {
    setNewEquipment({
      name: "",
      type: "",
      category: "",
      serialNumber: "",
      manufacturer: "",
      model: "",
      location: "",
      purchaseDate: "",
      warrantyExpiry: "",
      maintenanceInterval: "",
      responsible: "",
      cost: "",
      condition: "",
    });
    setShowAddEquipmentModal(true);
  };

  const handleViewEquipment = (item: any) => {
    setSelectedEquipment(item);
    setShowViewEquipmentModal(true);
  };

  const handleMaintainEquipment = (item: any) => {
    setSelectedEquipment(item);
    setMaintenanceData({
      maintenanceType: "",
      description: "",
      technician: "",
      scheduledDate: "",
      estimatedDuration: "",
      notes: "",
    });
    setShowMaintainEquipmentModal(true);
  };

  const handleEditEquipment = (item: any) => {
    setSelectedEquipment(item);
    setEditEquipment({
      name: item.name,
      type: item.type,
      category: item.category,
      serialNumber: item.serialNumber,
      manufacturer: item.manufacturer,
      model: item.model,
      location: item.location,
      purchaseDate: item.purchaseDate,
      warrantyExpiry: item.warrantyExpiry,
      maintenanceInterval: item.maintenanceInterval,
      responsible: item.responsible,
      cost: item.cost.toString(),
      condition: item.condition,
    });
    setShowEditEquipmentModal(true);
  };

  const handleCreateEquipment = async () => {
    try {
      const equipmentData = {
        name: newEquipment.name,
        type: newEquipment.type,
        category: newEquipment.category,
        serial_number: newEquipment.serialNumber,
        manufacturer: newEquipment.manufacturer,
        model: newEquipment.model,
        location: newEquipment.location,
        purchase_date: newEquipment.purchaseDate,
        warranty_expiry: newEquipment.warrantyExpiry || null,
        last_maintenance: newEquipment.lastMaintenance || null,
        next_maintenance: newEquipment.nextMaintenance || null,
        maintenance_interval: newEquipment.maintenanceInterval || null,
        responsible: newEquipment.responsible || null,
        cost: newEquipment.cost ? parseFloat(newEquipment.cost) : null,
        condition: newEquipment.condition || "good",
        tenant: getCurrentTenantId(), // Dynamic tenant
      };

      const response = await equipmentAPI.create(equipmentData);
      const createdEquipment = response.data.equipment || response.data;

      // Map backend response to frontend format
      const mappedEquipment = {
        id: createdEquipment.id,
        name: createdEquipment.name,
        type: createdEquipment.type,
        category: createdEquipment.category,
        serialNumber: createdEquipment.serial_number,
        manufacturer: createdEquipment.manufacturer,
        model: createdEquipment.model,
        status: createdEquipment.status,
        location: createdEquipment.location,
        purchaseDate: createdEquipment.purchase_date,
        warrantyExpiry: createdEquipment.warranty_expiry,
        lastMaintenance: createdEquipment.last_maintenance,
        nextMaintenance: createdEquipment.next_maintenance,
        maintenanceInterval: createdEquipment.maintenance_interval,
        responsible: createdEquipment.responsible,
        cost: createdEquipment.cost,
        condition: createdEquipment.condition,
      };

      setEquipment((prev: any) => [...prev, mappedEquipment]);
      setShowAddEquipmentModal(false);
    } catch (error: any) {
      console.error("Error creating equipment:", error);
      setError(error.message || "Failed to create equipment");
    }
  };

  const handleUpdateEquipment = () => {
    setEquipment((prev: any) =>
      prev.map((item: any) =>
        item.id === selectedEquipment.id
          ? {
              ...item,
              ...editEquipment,
              cost: parseFloat(editEquipment.cost),
            }
          : item
      )
    );
    setShowEditEquipmentModal(false);
  };

  const handleScheduleMaintenance = () => {
    setEquipment((prev: any) =>
      prev.map((item: any) =>
        item.id === selectedEquipment.id
          ? {
              ...item,
              status: "maintenance",
              lastMaintenance: maintenanceData.scheduledDate,
              nextMaintenance: new Date(
                new Date(maintenanceData.scheduledDate).getTime() +
                  90 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            }
          : item
      )
    );
    setShowMaintainEquipmentModal(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading equipment...
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Equipment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage laboratory equipment and maintenance
          </p>
        </div>
        <button
          onClick={handleAddEquipment}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, serial number, or equipment ID..."
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
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
            <option value="retired">Retired</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Imaging">Imaging</option>
            <option value="Sterilization">Sterilization</option>
            <option value="Diagnostic">Diagnostic</option>
          </select>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Condition
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Next Maintenance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Responsible
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEquipment.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {item.serialNumber}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.type}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {item.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm text-gray-900 dark:text-white">
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                        item.condition
                      )}`}
                    >
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.nextMaintenance}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    {item.responsible}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewEquipment(item)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleMaintainEquipment(item)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Maintain</span>
                      </button>
                      <button
                        onClick={() => handleEditEquipment(item)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Equipment
              </h2>
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      setNewEquipment({ ...newEquipment, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Sterilization">Sterilization</option>
                    <option value="Diagnostic">Diagnostic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newEquipment.category}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter category"
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
                      setNewEquipment({
                        ...newEquipment,
                        serialNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter serial number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={newEquipment.manufacturer}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        manufacturer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      setNewEquipment({
                        ...newEquipment,
                        model: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter model"
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
                      setNewEquipment({
                        ...newEquipment,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={newEquipment.purchaseDate}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        purchaseDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={newEquipment.warrantyExpiry}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        warrantyExpiry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maintenance Interval
                  </label>
                  <select
                    value={newEquipment.maintenanceInterval}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        maintenanceInterval: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select interval</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsible Person
                  </label>
                  <input
                    type="text"
                    value={newEquipment.responsible}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        responsible: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter responsible person"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEquipment.cost}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter cost"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={newEquipment.condition}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        condition: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Equipment Details
              </h2>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equipment ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serial Number
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manufacturer
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.manufacturer}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.model}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                      selectedEquipment.condition
                    )}`}
                  >
                    {selectedEquipment.condition}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.purchaseDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Expiry
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.warrantyExpiry}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Maintenance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.lastMaintenance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Next Maintenance
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.nextMaintenance}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maintenance Interval
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.maintenanceInterval}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsible Person
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedEquipment.responsible}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedEquipment.cost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Schedule Maintenance
              </h2>
              <button
                onClick={() => setShowMaintainEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Equipment Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{selectedEquipment.name}</strong> -{" "}
                  {selectedEquipment.serialNumber}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Location: {selectedEquipment.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Last Maintenance: {selectedEquipment.lastMaintenance}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maintenance Type
                </label>
                <select
                  value={maintenanceData.maintenanceType}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      maintenanceType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select maintenance type</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Calibration">Calibration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={maintenanceData.description}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter maintenance description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Technician
                </label>
                <input
                  type="text"
                  value={maintenanceData.technician}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      technician: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter technician name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={maintenanceData.scheduledDate}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      scheduledDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  value={maintenanceData.estimatedDuration}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      estimatedDuration: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter estimated duration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={maintenanceData.notes}
                  onChange={(e) =>
                    setMaintenanceData({
                      ...maintenanceData,
                      notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter additional notes"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowMaintainEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleMaintenance}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditEquipmentModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Equipment
              </h2>
              <button
                onClick={() => setShowEditEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    value={editEquipment.name}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={editEquipment.type}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Laboratory">Laboratory</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Sterilization">Sterilization</option>
                    <option value="Diagnostic">Diagnostic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editEquipment.category}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={editEquipment.serialNumber}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        serialNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={editEquipment.manufacturer}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        manufacturer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={editEquipment.model}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        model: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editEquipment.location}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={editEquipment.purchaseDate}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        purchaseDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={editEquipment.warrantyExpiry}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        warrantyExpiry: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maintenance Interval
                  </label>
                  <select
                    value={editEquipment.maintenanceInterval}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        maintenanceInterval: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Responsible Person
                  </label>
                  <input
                    type="text"
                    value={editEquipment.responsible}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        responsible: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editEquipment.cost}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        cost: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Condition
                  </label>
                  <select
                    value={editEquipment.condition}
                    onChange={(e) =>
                      setEditEquipment({
                        ...editEquipment,
                        condition: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditEquipmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEquipment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Equipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
