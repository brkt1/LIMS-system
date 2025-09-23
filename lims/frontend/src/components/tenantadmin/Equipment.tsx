import {
  Plus,
  Search,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";

const Equipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const equipment = [
    {
      id: "EQ001",
      name: "Centrifuge Model CF-2000",
      type: "Laboratory",
      category: "Centrifuge",
      serialNumber: "CF2000-001",
      manufacturer: "LabTech Industries",
      model: "CF-2000",
      status: "operational",
      location: "Lab Room 1",
      purchaseDate: "2023-01-15",
      warrantyExpiry: "2025-01-15",
      lastMaintenance: "2024-12-15",
      nextMaintenance: "2025-03-15",
      maintenanceInterval: "3 months",
      responsible: "Dr. Sarah Johnson",
      cost: 15000,
      condition: "Excellent",
    },
    {
      id: "EQ002",
      name: "Microscope Olympus BX51",
      type: "Laboratory",
      category: "Microscope",
      serialNumber: "OLY-BX51-002",
      manufacturer: "Olympus",
      model: "BX51",
      status: "maintenance",
      location: "Lab Room 2",
      purchaseDate: "2022-06-20",
      warrantyExpiry: "2024-06-20",
      lastMaintenance: "2024-11-20",
      nextMaintenance: "2025-02-20",
      maintenanceInterval: "3 months",
      responsible: "Dr. Mike Davis",
      cost: 8500,
      condition: "Good",
    },
    {
      id: "EQ003",
      name: "Blood Analyzer Sysmex XN-1000",
      type: "Laboratory",
      category: "Analyzer",
      serialNumber: "SYS-XN1000-003",
      manufacturer: "Sysmex",
      model: "XN-1000",
      status: "operational",
      location: "Lab Room 1",
      purchaseDate: "2023-03-10",
      warrantyExpiry: "2025-03-10",
      lastMaintenance: "2024-12-10",
      nextMaintenance: "2025-03-10",
      maintenanceInterval: "3 months",
      responsible: "Dr. Lisa Wilson",
      cost: 25000,
      condition: "Excellent",
    },
    {
      id: "EQ004",
      name: "X-Ray Machine GE Definium 8000",
      type: "Imaging",
      category: "X-Ray",
      serialNumber: "GE-DEF8000-004",
      manufacturer: "GE Healthcare",
      model: "Definium 8000",
      status: "out_of_service",
      location: "Radiology Room",
      purchaseDate: "2021-09-05",
      warrantyExpiry: "2023-09-05",
      lastMaintenance: "2024-10-05",
      nextMaintenance: "2025-01-05",
      maintenanceInterval: "3 months",
      responsible: "Dr. Robert Brown",
      cost: 120000,
      condition: "Needs Repair",
    },
    {
      id: "EQ005",
      name: "Autoclave Tuttnauer 3870EA",
      type: "Sterilization",
      category: "Autoclave",
      serialNumber: "TUT-3870EA-005",
      manufacturer: "Tuttnauer",
      model: "3870EA",
      status: "operational",
      location: "Sterilization Room",
      purchaseDate: "2023-08-12",
      warrantyExpiry: "2025-08-12",
      lastMaintenance: "2024-11-12",
      nextMaintenance: "2025-02-12",
      maintenanceInterval: "3 months",
      responsible: "Dr. Jennifer Smith",
      cost: 12000,
      condition: "Good",
    },
  ];

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

  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(
    (e) => e.status === "operational"
  ).length;
  const maintenanceDue = equipment.filter((e) => {
    const nextMaintenance = new Date(e.nextMaintenance);
    const today = new Date();
    const diffTime = nextMaintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;
  const totalValue = equipment.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">Equipment</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage laboratory equipment and maintenance
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
                {totalEquipment}
              </p>
            </div>
            <Wrench className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Operational</p>
              <p className="text-2xl font-bold text-green-600">
                {operationalEquipment}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Maintenance Due</p>
              <p className="text-2xl font-bold text-yellow-600">
                {maintenanceDue}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
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
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
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
                      <div className="text-sm text-gray-900 dark:text-white">{item.type}</div>
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
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left">
                        Maintain
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
