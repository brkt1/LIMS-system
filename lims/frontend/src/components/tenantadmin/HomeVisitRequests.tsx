import {
  Plus,
  Search,
  Stethoscope,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Eye,
  Check,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const HomeVisitRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Modal states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showViewRequestModal, setShowViewRequestModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Form states
  const [newRequest, setNewRequest] = useState({
    patientName: "",
    patientId: "",
    address: "",
    phone: "",
    requestedDate: "",
    requestedTime: "",
    serviceType: "",
    doctor: "",
    notes: "",
    priority: "normal",
    estimatedDuration: "",
  });

  const [requests, setRequests] = useState([
    {
      id: "HVR001",
      patientName: "John Smith",
      patientId: "P001",
      address: "123 Main St, City, State 12345",
      phone: "+1 (555) 123-4567",
      requestedDate: "2025-01-25",
      requestedTime: "10:00 AM",
      status: "pending",
      priority: "normal",
      serviceType: "Blood Collection",
      doctor: "Dr. Sarah Johnson",
      notes: "Patient has mobility issues",
      createdDate: "2025-01-22",
      estimatedDuration: "30 minutes",
    },
    {
      id: "HVR002",
      patientName: "Sarah Johnson",
      patientId: "P002",
      address: "456 Oak Ave, City, State 12345",
      phone: "+1 (555) 234-5678",
      requestedDate: "2025-01-24",
      requestedTime: "2:00 PM",
      status: "approved",
      priority: "high",
      serviceType: "Vaccination",
      doctor: "Dr. Mike Davis",
      notes: "Elderly patient, needs assistance",
      createdDate: "2025-01-21",
      estimatedDuration: "45 minutes",
    },
    {
      id: "HVR003",
      patientName: "Mike Davis",
      patientId: "P003",
      address: "789 Pine Rd, City, State 12345",
      phone: "+1 (555) 345-6789",
      requestedDate: "2025-01-23",
      requestedTime: "9:00 AM",
      status: "completed",
      priority: "urgent",
      serviceType: "COVID-19 Test",
      doctor: "Dr. Lisa Wilson",
      notes: "Patient is symptomatic",
      createdDate: "2025-01-20",
      estimatedDuration: "20 minutes",
    },
    {
      id: "HVR004",
      patientName: "Lisa Wilson",
      patientId: "P004",
      address: "321 Elm St, City, State 12345",
      phone: "+1 (555) 456-7890",
      requestedDate: "2025-01-26",
      requestedTime: "11:00 AM",
      status: "cancelled",
      priority: "normal",
      serviceType: "Consultation",
      doctor: "Dr. Robert Brown",
      notes: "Patient cancelled due to scheduling conflict",
      createdDate: "2025-01-19",
      estimatedDuration: "60 minutes",
    },
    {
      id: "HVR005",
      patientName: "Robert Brown",
      patientId: "P005",
      address: "654 Maple Dr, City, State 12345",
      phone: "+1 (555) 567-8901",
      requestedDate: "2025-01-27",
      requestedTime: "3:00 PM",
      status: "pending",
      priority: "normal",
      serviceType: "Physical Examination",
      doctor: "Dr. Sarah Johnson",
      notes: "Routine check-up",
      createdDate: "2025-01-22",
      estimatedDuration: "40 minutes",
    },
  ]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRequests = localStorage.getItem("homeVisitRequests");
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Save data to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem("homeVisitRequests", JSON.stringify(requests));
  }, [requests]);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handler functions
  const handleNewRequest = () => {
    setNewRequest({
      patientName: "",
      patientId: "",
      address: "",
      phone: "",
      requestedDate: "",
      requestedTime: "",
      serviceType: "",
      doctor: "",
      notes: "",
      priority: "normal",
      estimatedDuration: "",
    });
    setShowNewRequestModal(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowViewRequestModal(true);
  };

  const handleApproveRequest = (request: any) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleScheduleRequest = (request: any) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const handleCreateRequest = () => {
    const newId = `HVR${String(requests.length + 1).padStart(3, "0")}`;
    const request = {
      ...newRequest,
      id: newId,
      status: "pending",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setRequests([...requests, request]);
    setShowNewRequestModal(false);
  };

  const handleApproveConfirm = () => {
    if (selectedRequest) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "approved" } : req
        )
      );
      setShowApproveModal(false);
    }
  };

  const handleScheduleConfirm = () => {
    if (selectedRequest) {
      setRequests(
        requests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "scheduled" } : req
        )
      );
      setShowScheduleModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Home Visit Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage home visit service requests
          </p>
        </div>
        <button
          onClick={handleNewRequest}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or address..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Doctor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Requested
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {request.estimatedDuration}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.patientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        ID: {request.patientId}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {request.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {request.address}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.serviceType}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                    {request.doctor}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority.charAt(0).toUpperCase() +
                        request.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>{request.requestedDate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {request.requestedTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleApproveRequest(request)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleScheduleRequest(request)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left flex items-center"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Home Visit Request
              </h3>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newRequest.patientName}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={newRequest.patientId}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newRequest.phone}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={newRequest.serviceType}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        serviceType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select service type</option>
                    <option value="Blood Collection">Blood Collection</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="COVID-19 Test">COVID-19 Test</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Physical Examination">
                      Physical Examination
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requested Date *
                  </label>
                  <input
                    type="date"
                    value={newRequest.requestedDate}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        requestedDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requested Time *
                  </label>
                  <input
                    type="time"
                    value={newRequest.requestedTime}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        requestedTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor *
                  </label>
                  <input
                    type="text"
                    value={newRequest.doctor}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, doctor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={newRequest.address}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newRequest.notes}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request Details - {selectedRequest.id}
              </h3>
              <button
                onClick={() => setShowViewRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.serviceType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.doctor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedRequest.priority
                    )}`}
                  >
                    {selectedRequest.priority.charAt(0).toUpperCase() +
                      selectedRequest.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status.charAt(0).toUpperCase() +
                      selectedRequest.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.requestedDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.requestedTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Duration
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.estimatedDuration}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.address}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedRequest.notes || "No notes provided"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewRequestModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Request Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Approve Request
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to approve the home visit request for{" "}
                <strong>{selectedRequest.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Service:</strong> {selectedRequest.serviceType}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Date:</strong> {selectedRequest.requestedDate} at{" "}
                  {selectedRequest.requestedTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Doctor:</strong> {selectedRequest.doctor}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Request Modal */}
      {showScheduleModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Visit
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Schedule the home visit for{" "}
                <strong>{selectedRequest.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Service:</strong> {selectedRequest.serviceType}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Requested Date:</strong>{" "}
                  {selectedRequest.requestedDate} at{" "}
                  {selectedRequest.requestedTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Doctor:</strong> {selectedRequest.doctor}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Address:</strong> {selectedRequest.address}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeVisitRequests;
