import { Calendar, Clock, FileText, Plus, Search, User } from "lucide-react";
import React, { useState } from "react";

const TestRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const testRequests = [
    {
      id: "TR001",
      patient: "John Smith",
      patientId: "P001",
      testType: "Blood Panel Complete",
      priority: "High",
      status: "Pending",
      requestedDate: "2025-01-20",
      requestedBy: "Dr. Sarah Johnson",
      notes: "Patient showing signs of fatigue and weakness",
    },
    {
      id: "TR002",
      patient: "Sarah Johnson",
      patientId: "P002",
      testType: "X-Ray Chest",
      priority: "Medium",
      status: "Approved",
      requestedDate: "2025-01-19",
      requestedBy: "Dr. Mike Davis",
      notes: "Chest pain and shortness of breath",
    },
    {
      id: "TR003",
      patient: "Mike Davis",
      patientId: "P003",
      testType: "MRI Brain",
      priority: "Low",
      status: "In Progress",
      requestedDate: "2025-01-18",
      requestedBy: "Dr. Lisa Wilson",
      notes: "Headaches and dizziness",
    },
    {
      id: "TR004",
      patient: "Lisa Wilson",
      patientId: "P004",
      testType: "Urine Analysis",
      priority: "Medium",
      status: "Completed",
      requestedDate: "2025-01-17",
      requestedBy: "Dr. Robert Brown",
      notes: "Routine checkup",
    },
  ];

  const filteredRequests = testRequests.filter((request) => {
    const matchesSearch =
      request.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      request.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Test Requests
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and review test requests from patients
            </p>
          </div>
          <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, test type, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Requests
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {testRequests.length}
                </p>
              </div>
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {testRequests.filter((r) => r.status === "Pending").length}
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {
                    testRequests.filter((r) => r.status === "In Progress")
                      .length
                  }
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {testRequests.filter((r) => r.status === "Completed").length}
                </p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Test Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {request.patient}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          ID: {request.patientId}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {request.testType}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      {request.requestedDate}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-left">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-left">
                          Approve
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-left">
                          Reject
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
    </div>
  );
};

export default TestRequests;
