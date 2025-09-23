import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Stethoscope,
  Users,
  Plus,
  Eye,
  Search,
  Edit,
} from "lucide-react";
import React, { useState } from "react";
import BaseDashboard from "./BaseDashboard";

const DoctorDashboard: React.FC = () => {
  // State for modals and CRUD operations
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Test requests data with state management
  const [testRequests, setTestRequests] = useState([
    {
      id: 1,
      patient: "John Smith",
      testType: "Blood Panel Complete",
      priority: "High",
      requestedDate: "2025-01-20",
      status: "Pending",
      patientId: "P001",
      doctorNotes: "",
      results: null,
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      testType: "X-Ray Chest",
      priority: "Medium",
      requestedDate: "2025-01-19",
      status: "Approved",
      patientId: "P002",
      doctorNotes: "Chest pain and shortness of breath",
      results: "Clear lungs, no abnormalities detected",
    },
    {
      id: 3,
      patient: "Mike Davis",
      testType: "MRI Brain",
      priority: "Low",
      requestedDate: "2025-01-18",
      status: "In Progress",
      patientId: "P003",
      doctorNotes: "Headaches and dizziness",
      results: null,
    },
  ]);

  // CRUD operation functions
  const handleNewRequest = () => {
    setShowNewRequestModal(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleReviewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const handleTrackRequest = (request: any) => {
    setSelectedRequest(request);
    setShowTrackModal(true);
  };

  const handleCreateRequest = (newRequest: any) => {
    const request = {
      id: testRequests.length + 1,
      ...newRequest,
      status: "Pending",
      results: null,
    };
    setTestRequests([...testRequests, request]);
    setShowNewRequestModal(false);
  };

  const handleUpdateRequest = (updatedRequest: any) => {
    setTestRequests(
      testRequests.map((req) =>
        req.id === updatedRequest.id ? updatedRequest : req
      )
    );
    setShowReviewModal(false);
    setShowViewModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Approved":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Completed":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const doctorCards = [
    {
      title: "Today's Appointments",
      value: "8",
      change: "+2 This Week",
      color: "bg-blue-500",
      chartData: [5, 6, 7, 8, 6, 7, 8],
    },
    {
      title: "Pending Test Requests",
      value: "15",
      change: "-3 Today",
      color: "bg-orange-500",
      chartData: [18, 20, 17, 15, 16, 18, 15],
    },
    {
      title: "Completed Tests",
      value: "42",
      change: "+12 This Week",
      color: "bg-green-500",
      chartData: [30, 32, 35, 38, 40, 41, 42],
    },
    {
      title: "Active Patients",
      value: "127",
      change: "+5 This Month",
      color: "bg-purple-500",
      chartData: [110, 115, 120, 122, 125, 126, 127],
    },
  ];

  return (
    <BaseDashboard>
      {/* Doctor specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {doctorCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Calendar className="w-4 h-4 text-white" />}
                {index === 1 && <FileText className="w-4 h-4 text-white" />}
                {index === 2 && <CheckCircle className="w-4 h-4 text-white" />}
                {index === 3 && <Users className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div className="flex items-center space-x-1 text-green-600">
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

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Schedule
            </h3>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                time: "09:00 AM",
                patient: "John Smith",
                type: "Follow-up",
                status: "Confirmed",
              },
              {
                time: "10:30 AM",
                patient: "Sarah Johnson",
                type: "New Patient",
                status: "Confirmed",
              },
              {
                time: "02:00 PM",
                patient: "Mike Davis",
                type: "Consultation",
                status: "Pending",
              },
              {
                time: "03:30 PM",
                patient: "Lisa Wilson",
                type: "Test Review",
                status: "Confirmed",
              },
              {
                time: "04:45 PM",
                patient: "Robert Brown",
                type: "Follow-up",
                status: "Confirmed",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.patient}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {appointment.type}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Test Results
            </h3>
            <ClipboardList className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                patient: "John Smith",
                test: "Blood Panel",
                result: "Normal",
                priority: "Low",
              },
              {
                patient: "Sarah Johnson",
                test: "X-Ray Chest",
                result: "Abnormal",
                priority: "High",
              },
              {
                patient: "Mike Davis",
                test: "Urine Analysis",
                result: "Normal",
                priority: "Low",
              },
              {
                patient: "Lisa Wilson",
                test: "MRI Brain",
                result: "Pending",
                priority: "Medium",
              },
            ].map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      test.priority === "High"
                        ? "bg-red-100 dark:bg-red-900"
                        : test.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <Stethoscope
                      className={`w-4 h-4 ${
                        test.priority === "High"
                          ? "text-red-600 dark:text-red-400"
                          : test.priority === "Medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.patient}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {test.test}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      test.result === "Normal"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : test.result === "Abnormal"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {test.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Requests Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Requests Queue
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewRequest}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Patient
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Test Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Requested Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {testRequests.map((request) => (
                <tr key={request.id}>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {request.patient}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {request.testType}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      {request.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {request.requestedDate}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {request.status === "Pending" && (
                        <button
                          onClick={() => handleReviewRequest(request)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Review</span>
                        </button>
                      )}
                      {request.status === "Approved" && (
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      )}
                      {request.status === "In Progress" && (
                        <button
                          onClick={() => handleTrackRequest(request)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          <span>Track</span>
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

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Test Request
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleCreateRequest({
                  patient: formData.get("patient"),
                  testType: formData.get("testType"),
                  priority: formData.get("priority"),
                  requestedDate: formData.get("requestedDate"),
                  patientId: formData.get("patientId"),
                  doctorNotes: formData.get("doctorNotes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patient"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Type
                  </label>
                  <select
                    name="testType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Test Type</option>
                    <option value="Blood Panel Complete">
                      Blood Panel Complete
                    </option>
                    <option value="X-Ray Chest">X-Ray Chest</option>
                    <option value="MRI Brain">MRI Brain</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    name="patientId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    name="requestedDate"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor Notes
                  </label>
                  <textarea
                    name="doctorNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Request Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.patient}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.testType}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    selectedRequest.priority
                  )}`}
                >
                  {selectedRequest.priority}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requested Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.requestedDate}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doctor Notes:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.doctorNotes}
                </p>
              </div>
              {selectedRequest.results && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Results:
                  </span>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.results}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Request Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review Test Request
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateRequest({
                  ...selectedRequest,
                  status: formData.get("status"),
                  doctorNotes: formData.get("doctorNotes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.patient}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Type:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.testType}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={selectedRequest.status}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor Notes
                  </label>
                  <textarea
                    name="doctorNotes"
                    defaultValue={selectedRequest.doctorNotes}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Track Request Modal */}
      {showTrackModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Track Test Progress
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.patient}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.testType}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Request Submitted
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.requestedDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedRequest.status !== "Pending"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Request Approved
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.status !== "Pending"
                        ? "2025-01-21"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedRequest.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Test In Progress
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.status === "In Progress"
                        ? "2025-01-22"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Results Available
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTrackModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseDashboard>
  );
};

export default DoctorDashboard;
