import {
  BarChart3,
  Package,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Eye,
  Calendar,
  Wrench,
  TestTube,
  ClipboardList,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import BaseDashboard from "./BaseDashboard";
import { testRequestAPI } from "../../services/api";

const TenantAdminDashboard: React.FC = () => {
  // State management
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showManageEquipmentModal, setShowManageEquipmentModal] =
    useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  // Test Request Management States
  const [showTestRequestsModal, setShowTestRequestsModal] = useState(false);
  const [testRequests, setTestRequests] = useState<any[]>([]);
  const [testRequestsLoading, setTestRequestsLoading] = useState(false);
  const [testRequestsError, setTestRequestsError] = useState<string | null>(
    null
  );

  // Form states
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  const [scheduleData, setScheduleData] = useState({
    equipmentName: "",
    maintenanceType: "",
    scheduledDate: "",
    technician: "",
    notes: "",
  });

  // Dynamic data states
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Doctor",
      status: "Active",
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Technician",
      status: "Active",
      avatar: "MC",
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      role: "Support",
      status: "Pending",
      avatar: "LR",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Doctor",
      status: "Active",
      avatar: "DK",
    },
  ]);

  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: "Microscope Alpha-1",
      status: "Operational",
      lastCalibration: "2025-01-15",
      nextMaintenance: "2025-02-15",
    },
    {
      id: 2,
      name: "Centrifuge Beta-2",
      status: "Maintenance Due",
      lastCalibration: "2025-01-10",
      nextMaintenance: "2025-01-25",
    },
    {
      id: 3,
      name: "PCR Machine Gamma-3",
      status: "Operational",
      lastCalibration: "2025-01-18",
      nextMaintenance: "2025-02-18",
    },
  ]);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("tenantadmin-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("tenantadmin-equipment", JSON.stringify(equipment));
  }, [equipment]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("tenantadmin-users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedEquipment = localStorage.getItem("tenantadmin-equipment");
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    }

    // Load test requests on component mount
    fetchAllTestRequests();
  }, []);

  // Test Request Management Functions
  const fetchAllTestRequests = async () => {
    setTestRequestsLoading(true);
    setTestRequestsError(null);
    try {
      const response = await testRequestAPI.getAll();
      setTestRequests(response.data);
    } catch (error) {
      console.error("Error fetching test requests:", error);
      setTestRequestsError("Failed to load test requests");
    } finally {
      setTestRequestsLoading(false);
    }
  };

  const handleManageTestRequests = () => {
    setShowTestRequestsModal(true);
    fetchAllTestRequests();
  };

  const handleUpdateTestRequestStatus = async (
    requestId: number,
    newStatus: string
  ) => {
    try {
      const request = testRequests.find((r) => r.id === requestId);
      if (request) {
        const updatedRequest = { ...request, status: newStatus };
        await testRequestAPI.update(requestId, updatedRequest);
        await fetchAllTestRequests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating test request:", error);
      setTestRequestsError("Failed to update test request");
    }
  };

  // Handler functions
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user = {
        id: users.length + 1,
        name: newUser.name,
        role: newUser.role,
        status: "Active",
        avatar: newUser.name
          .split(" ")
          .map((n) => n[0])
          .join(""),
      };
      setUsers((prev: any) => [user, ...prev]);
      setNewUser({ name: "", email: "", role: "", department: "" });
      setShowAddUserModal(false);
    }
  };

  const handleManageEquipment = (equipmentItem: any) => {
    setSelectedEquipment(equipmentItem);
    setShowManageEquipmentModal(true);
  };

  const handleScheduleMaintenance = (equipmentItem: any) => {
    setSelectedEquipment(equipmentItem);
    setScheduleData({
      equipmentName: equipmentItem.name,
      maintenanceType: "",
      scheduledDate: "",
      technician: "",
      notes: "",
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = () => {
    if (scheduleData.maintenanceType && scheduleData.scheduledDate) {
      // Update equipment with new maintenance schedule
      setEquipment((prev: any) =>
        prev.map((item: any) =>
          item.id === selectedEquipment.id
            ? { ...item, nextMaintenance: scheduleData.scheduledDate }
            : item
        )
      );
      setShowScheduleModal(false);
      setScheduleData({
        equipmentName: "",
        maintenanceType: "",
        scheduledDate: "",
        technician: "",
        notes: "",
      });
    }
  };

  const tenantAdminCards = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+5 This Month",
      color: "bg-blue-500",
      chartData: [30, 35, 38, 42, 45, 46, users.length],
    },
    {
      title: "Active Equipment",
      value: equipment.length.toString(),
      change: "+2 This Month",
      color: "bg-green-500",
      chartData: [18, 19, 20, 21, 22, 22, equipment.length],
    },
    {
      title: "Test Requests",
      value: testRequests.length.toString(),
      change: `${
        testRequests.filter((r) => r.status === "Pending").length
      } Pending`,
      color: "bg-orange-500",
      chartData: [15, 18, 16, 14, 12, 13, testRequests.length],
      onClick: handleManageTestRequests,
    },
    {
      title: "Monthly Revenue",
      value: "$24.5K",
      change: "+8.2% This Month",
      color: "bg-purple-500",
      chartData: [18, 20, 22, 21, 23, 24, 24.5],
    },
  ];

  return (
    <BaseDashboard>
      {/* Tenant Admin specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tenantAdminCards.map((card, index) => (
          <div
            key={index}
            className={`card ${
              card.onClick
                ? "cursor-pointer hover:shadow-lg transition-shadow"
                : ""
            }`}
            onClick={card.onClick}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Users className="w-4 h-4 text-white" />}
                {index === 1 && <Package className="w-4 h-4 text-white" />}
                {index === 2 && <TestTube className="w-4 h-4 text-white" />}
                {index === 3 && <TrendingUp className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div
                className={`flex items-center space-x-1 ${
                  card.change.startsWith("+")
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                <span className="text-sm font-medium">{card.change}</span>
              </div>
            </div>

            <div className="flex items-end space-x-1 h-8">
              {card.chartData.map((height, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-sm opacity-80`}
                  style={{
                    height: `${(height / Math.max(...card.chartData)) * 100}%`,
                    width: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Users
            </h3>
            <button
              onClick={handleAddUser}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Add User</span>
            </button>
          </div>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tenant Analytics
            </h3>
            <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Tenant performance metrics</p>
              <p className="text-sm">
                User activity, test volume, revenue trends
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Equipment Status
          </h3>
          <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Equipment
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Calibration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Next Maintenance
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Operational"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {item.lastCalibration}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {item.nextMaintenance}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleManageEquipment(item)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => handleScheduleMaintenance(item)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                      >
                        Schedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New User
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="">Select role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Technician">Technician</option>
                    <option value="Support">Support</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newUser.department}
                    onChange={(e) =>
                      setNewUser({ ...newUser, department: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter department"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Equipment Modal */}
        {showManageEquipmentModal && selectedEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manage Equipment
                </h3>
                <button
                  onClick={() => setShowManageEquipmentModal(false)}
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
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEquipment.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedEquipment.status === "Operational"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {selectedEquipment.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Calibration
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedEquipment.lastCalibration}
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
                </div>
                <div className="mt-6 space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Wrench className="w-4 h-4" />
                    <span>Update Status</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Maintenance</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowManageEquipmentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Maintenance Modal */}
        {showScheduleModal && selectedEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Schedule Maintenance
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equipment
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {scheduleData.equipmentName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maintenance Type
                  </label>
                  <select
                    value={scheduleData.maintenanceType}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        maintenanceType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="Preventive">Preventive Maintenance</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Repair">Repair</option>
                    <option value="Inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={scheduleData.scheduledDate}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assigned Technician
                  </label>
                  <input
                    type="text"
                    value={scheduleData.technician}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        technician: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter technician name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={scheduleData.notes}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Enter maintenance notes"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Test Requests Management Modal */}
        {showTestRequestsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Test Requests Management
                </h3>
                <button
                  onClick={() => setShowTestRequestsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {testRequestsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading test requests...
                    </p>
                  </div>
                ) : testRequestsError ? (
                  <div className="text-center py-12">
                    <TestTube className="w-12 h-12 mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Error loading test requests
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {testRequestsError}
                    </p>
                    <button
                      onClick={fetchAllTestRequests}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : testRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <TestTube className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No test requests found.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Test Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date Requested
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {testRequests.map((request) => (
                          <tr
                            key={request.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {request.patient_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {request.test_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  request.priority === "Critical"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : request.priority === "Urgent"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                }`}
                              >
                                {request.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={request.status}
                                onChange={(e) =>
                                  handleUpdateTestRequestStatus(
                                    request.id,
                                    e.target.value
                                  )
                                }
                                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(
                                request.date_requested
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  // You could add a view details modal here
                                  console.log("View request details:", request);
                                }}
                                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseDashboard>
  );
};

export default TenantAdminDashboard;
