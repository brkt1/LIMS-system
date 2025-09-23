import {
  AlertTriangle,
  Clock,
  Plus,
  Search,
  TestTube,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const Samples: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const samples = [
    {
      id: "SMP001",
      patientName: "John Smith",
      patientId: "P001",
      testType: "Complete Blood Count",
      sampleType: "Blood",
      collectionDate: "2025-01-22",
      collectionTime: "09:30 AM",
      status: "processing",
      priority: "normal",
      technician: "Mike Davis",
      expectedCompletion: "2025-01-22 2:00 PM",
      notes: "Routine checkup sample",
    },
    {
      id: "SMP002",
      patientName: "Sarah Johnson",
      patientId: "P002",
      testType: "X-Ray Chest",
      sampleType: "Imaging",
      collectionDate: "2025-01-22",
      collectionTime: "10:15 AM",
      status: "completed",
      priority: "high",
      technician: "Lisa Wilson",
      expectedCompletion: "2025-01-22 12:00 PM",
      notes: "Chest pain evaluation",
    },
    {
      id: "SMP003",
      patientName: "Mike Davis",
      patientId: "P003",
      testType: "MRI Brain",
      sampleType: "Imaging",
      collectionDate: "2025-01-21",
      collectionTime: "2:30 PM",
      status: "pending",
      priority: "urgent",
      technician: "Robert Brown",
      expectedCompletion: "2025-01-22 4:00 PM",
      notes: "Headache and dizziness symptoms",
    },
    {
      id: "SMP004",
      patientName: "Lisa Wilson",
      patientId: "P004",
      testType: "Urine Analysis",
      sampleType: "Urine",
      collectionDate: "2025-01-22",
      collectionTime: "11:45 AM",
      status: "processing",
      priority: "normal",
      technician: "Mike Davis",
      expectedCompletion: "2025-01-22 1:30 PM",
      notes: "Routine checkup",
    },
    {
      id: "SMP005",
      patientName: "Robert Brown",
      patientId: "P005",
      testType: "COVID-19 PCR Test",
      sampleType: "Nasal Swab",
      collectionDate: "2025-01-22",
      collectionTime: "08:20 AM",
      status: "completed",
      priority: "high",
      technician: "Lisa Wilson",
      expectedCompletion: "2025-01-22 10:00 AM",
      notes: "Travel requirement",
    },
  ];

  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || sample.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || sample.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <TestTube className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalSamples = samples.length;
  const completedSamples = samples.filter(
    (s) => s.status === "completed"
  ).length;
  const processingSamples = samples.filter(
    (s) => s.status === "processing"
  ).length;
  const pendingSamples = samples.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Samples</h1>
          <p className="text-gray-600 mt-1">
            Manage and track laboratory samples
          </p>
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, test type, or sample ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Samples</p>
              <p className="text-2xl font-bold text-gray-900">{totalSamples}</p>
            </div>
            <TestTube className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedSamples}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">
                {processingSamples}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingSamples}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Samples Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Test Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Sample Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Collection Time
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {getStatusIcon(sample.status)}
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {sample.id}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          Tech: {sample.technician}
                        </div>
                        <div className="text-xs text-gray-400 sm:hidden">
                          {sample.testType} • {sample.sampleType}
                        </div>
                        <div className="text-xs text-gray-400 hidden sm:block lg:hidden">
                          {sample.collectionDate} {sample.collectionTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sample.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {sample.patientId}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {sample.testType}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {sample.sampleType}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        sample.priority
                      )}`}
                    >
                      {sample.priority.charAt(0).toUpperCase() +
                        sample.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        sample.status
                      )}`}
                    >
                      {sample.status.charAt(0).toUpperCase() +
                        sample.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div>
                      <div>{sample.collectionDate}</div>
                      <div className="text-xs text-gray-500">
                        {sample.collectionTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-left">
                        Process
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 text-left">
                        Update
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

export default Samples;
