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
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "high":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "normal":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Samples
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
            Manage and track laboratory samples
          </p>
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base">
            <Plus className="w-4 h-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, test type, or sample ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority Filter
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                Total Samples
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {totalSamples}
              </p>
            </div>
            <TestTube className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                Completed
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {completedSamples}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                Processing
              </p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {processingSamples}
              </p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
                Pending
              </p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {pendingSamples}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Samples Table - Desktop View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sample
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Test Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sample Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Collection Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <TestTube className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No samples found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ||
                      filterStatus !== "all" ||
                      filterPriority !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "No samples have been added yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <tr
                    key={sample.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            {getStatusIcon(sample.status)}
                          </div>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {sample.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            Tech: {sample.technician}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sample.patientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {sample.patientId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sample.testType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sample.sampleType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          sample.priority
                        )}`}
                      >
                        {sample.priority.charAt(0).toUpperCase() +
                          sample.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          sample.status
                        )}`}
                      >
                        {sample.status.charAt(0).toUpperCase() +
                          sample.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{sample.collectionDate}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {sample.collectionTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          Process
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Samples Cards - Mobile/Tablet View */}
      <div className="lg:hidden space-y-4">
        {filteredSamples.length === 0 ? (
          <div className="text-center py-8">
            <TestTube className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No samples found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No samples have been added yet."}
            </p>
          </div>
        ) : (
          filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      {getStatusIcon(sample.status)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {sample.id}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      Tech: {sample.technician}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      sample.priority
                    )}`}
                  >
                    {sample.priority.charAt(0).toUpperCase() +
                      sample.priority.slice(1)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      sample.status
                    )}`}
                  >
                    {sample.status.charAt(0).toUpperCase() +
                      sample.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {sample.patientName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {sample.patientId}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Test Type:
                    </span>
                    <div className="text-gray-900 dark:text-white truncate">
                      {sample.testType}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Sample Type:
                    </span>
                    <div className="text-gray-900 dark:text-white">
                      {sample.sampleType}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Collection:
                    </span>
                    <div className="text-gray-900 dark:text-white">
                      {sample.collectionDate} at {sample.collectionTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="flex-1 px-3 py-2 text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-700 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 text-sm text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-700 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  Process Sample
                </button>
                <button className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Update Status
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Samples;
