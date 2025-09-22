import { AlertTriangle, Plus, Search, Settings, Wrench } from "lucide-react";
import React, { useState } from "react";

const Equipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const equipment = [
    {
      id: "EQP001",
      name: "Centrifuge Model CF-2000",
      type: "Centrifuge",
      manufacturer: "LabTech Industries",
      model: "CF-2000",
      serialNumber: "CF2000-001234",
      status: "operational",
      location: "Lab Room A",
      lastMaintenance: "2025-01-15",
      nextMaintenance: "2025-02-15",
      technician: "Mike Davis",
      notes: "Routine maintenance completed",
    },
    {
      id: "EQP002",
      name: "Microscope Olympus BX51",
      type: "Microscope",
      manufacturer: "Olympus",
      model: "BX51",
      serialNumber: "OLY-BX51-567890",
      status: "maintenance",
      location: "Lab Room B",
      lastMaintenance: "2025-01-10",
      nextMaintenance: "2025-01-25",
      technician: "Lisa Wilson",
      notes: "Lens cleaning required",
    },
    {
      id: "EQP003",
      name: "Blood Analyzer Sysmex XN-1000",
      type: "Analyzer",
      manufacturer: "Sysmex",
      model: "XN-1000",
      serialNumber: "SYS-XN1000-789012",
      status: "operational",
      location: "Lab Room A",
      lastMaintenance: "2025-01-20",
      nextMaintenance: "2025-03-20",
      technician: "Robert Brown",
      notes: "Calibrated and working perfectly",
    },
    {
      id: "EQP004",
      name: "Incubator Thermo Scientific",
      type: "Incubator",
      manufacturer: "Thermo Scientific",
      model: "Heratherm IGS180",
      serialNumber: "TS-HER180-345678",
      status: "out_of_service",
      location: "Lab Room C",
      lastMaintenance: "2024-12-01",
      nextMaintenance: "2025-01-30",
      technician: "Mike Davis",
      notes: "Temperature sensor malfunction",
    },
    {
      id: "EQP005",
      name: "PCR Machine Applied Biosystems",
      type: "PCR Machine",
      manufacturer: "Applied Biosystems",
      model: "7500 Fast",
      serialNumber: "AB-7500-901234",
      status: "operational",
      location: "Lab Room B",
      lastMaintenance: "2025-01-18",
      nextMaintenance: "2025-04-18",
      technician: "Lisa Wilson",
      notes: "Regular calibration completed",
    },
  ];

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
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_service":
        return "bg-red-100 text-red-800";
      case "calibration":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600">
            Manage laboratory equipment and maintenance
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by equipment name, type, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment}
              </p>
            </div>
            <Settings className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">
                {operationalEquipment}
              </p>
            </div>
            <Settings className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {maintenanceEquipment}
              </p>
            </div>
            <Wrench className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Service</p>
              <p className="text-2xl font-bold text-red-600">
                {outOfServiceEquipment}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SN: {item.serialNumber}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{item.manufacturer}</div>
                      <div className="text-xs text-gray-500">{item.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.replace("_", " ").charAt(0).toUpperCase() +
                        item.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.lastMaintenance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.nextMaintenance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Maintain
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        Calibrate
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
