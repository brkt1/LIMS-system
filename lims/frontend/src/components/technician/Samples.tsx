import {
  AlertTriangle,
  Clock,
  Plus,
  Search,
  TestTube,
  TrendingUp,
  Eye,
  Edit,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { testRequestAPI, technicianSampleAPI } from "../../services/api";

const Samples: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Modal states
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [showViewSampleModal, setShowViewSampleModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);

  // Form states
  const [newSample, setNewSample] = useState({
    patient_id: "",
    test_request_id: "",
    sample_type: "",
    priority: "routine",
    volume: "",
    container_type: "",
    storage_conditions: "",
    collection_notes: "",
  });

  // API Integration - Fetch samples from backend
  const [samples, setSamples] = useState<any[]>([]);
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [samplesError, setSamplesError] = useState<string | null>(null);

  // Fetch samples from backend
  const fetchSamples = async () => {
    setSamplesLoading(true);
    setSamplesError(null);
    try {
      const response = await technicianSampleAPI.getAll();
      const samplesData = response.data || response;

      // Transform backend samples to frontend format
      const transformedSamples = samplesData.map((sample: any) => ({
        id: sample.id,
        patientName: sample.patient_id, // Using patient_id as patient name for now
        patientId: sample.patient_id,
        testType: sample.test_type || "Unknown Test",
        sampleType: sample.sample_type_display || sample.sample_type,
        collectionDate: new Date(sample.collection_date).toLocaleDateString(),
        collectionTime: new Date(sample.collection_date).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        ),
        status: mapBackendStatus(sample.status),
        priority: mapBackendPriority(sample.priority),
        technician: sample.technician_name || "Unassigned",
        expectedCompletion: getExpectedCompletion(
          sample.collection_date,
          sample.priority
        ),
        notes: sample.collection_notes || "No additional notes",
        volume: sample.volume,
        containerType: sample.container_type,
        storageConditions: sample.storage_conditions,
        originalSample: sample, // Keep reference to original sample
      }));

      setSamples(transformedSamples);
    } catch (error) {
      console.error("Error fetching samples:", error);
      setSamplesError("Failed to load samples");
    } finally {
      setSamplesLoading(false);
    }
  };

  // Helper functions
  const getSampleType = (testType: string) => {
    if (testType.toLowerCase().includes("blood")) return "Blood";
    if (testType.toLowerCase().includes("urine")) return "Urine";
    if (
      testType.toLowerCase().includes("x-ray") ||
      testType.toLowerCase().includes("mri") ||
      testType.toLowerCase().includes("ct")
    )
      return "Imaging";
    if (
      testType.toLowerCase().includes("pcr") ||
      testType.toLowerCase().includes("covid")
    )
      return "Nasal Swab";
    return "Other";
  };

  const mapBackendStatus = (status: string) => {
    switch (status) {
      case "collected":
        return "pending";
      case "received":
        return "pending";
      case "processing":
        return "processing";
      case "analyzed":
        return "processing";
      case "completed":
        return "completed";
      case "rejected":
        return "cancelled";
      case "expired":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const mapBackendPriority = (priority: string) => {
    switch (priority) {
      case "routine":
        return "normal";
      case "urgent":
        return "urgent";
      case "stat":
        return "urgent";
      case "emergency":
        return "urgent";
      default:
        return "normal";
    }
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case "Approved":
        return "pending";
      case "In Progress":
        return "processing";
      case "Completed":
        return "completed";
      default:
        return "pending";
    }
  };

  const getExpectedCompletion = (dateRequested: string, priority: string) => {
    const date = new Date(dateRequested);
    const hours =
      priority.toLowerCase() === "urgent"
        ? 2
        : priority.toLowerCase() === "critical"
        ? 1
        : 4;
    date.setHours(date.getHours() + hours);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Load samples on component mount
  useEffect(() => {
    fetchSamples();
  }, []);

  // CRUD Functions
  const handleAddSample = () => {
    setShowAddSampleModal(true);
  };

  const handleViewSample = (sample: any) => {
    setSelectedSample(sample);
    setShowViewSampleModal(true);
  };

  const handleUpdateStatus = (sample: any) => {
    setSelectedSample(sample);
    setShowUpdateStatusModal(true);
  };

  // Update test request status in backend
  const handleUpdateTestRequestStatus = async (
    sample: any,
    newStatus: string
  ) => {
    try {
      if (sample.originalRequest) {
        const updatedRequest = {
          ...sample.originalRequest,
          status:
            newStatus === "processing"
              ? "In Progress"
              : newStatus === "completed"
              ? "Completed"
              : "Approved",
        };

        await testRequestAPI.update(sample.originalRequest.id, updatedRequest);

        // Refresh the samples list
        await fetchTestRequests();

        console.log(`Test request ${sample.id} status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating test request status:", error);
      setSamplesError("Failed to update test request status");
    }
  };

  const handleCreateSample = async () => {
    try {
      // Generate a unique sample ID
      const sampleId = `SMP${Date.now()}`;
      const now = new Date();

      // Prepare data for backend API
      const sampleData = {
        id: sampleId,
        patient_id: newSample.patient_id,
        test_request_id: newSample.test_request_id || null,
        sample_type: newSample.sample_type,
        collection_date: now.toISOString(),
        priority: newSample.priority,
        volume: newSample.volume ? parseFloat(newSample.volume) : null,
        container_type: newSample.container_type || null,
        storage_conditions: newSample.storage_conditions || null,
        collection_notes: newSample.collection_notes || null,
        status: "collected",
        tenant_id: "default_tenant", // You might want to get this from context
      };

      // Create sample in backend
      const response = await technicianSampleAPI.create(sampleData);

      if (response.data) {
        // Refresh the samples list to show the new sample
        await fetchSamples();

        // Reset form
        setNewSample({
          patient_id: "",
          test_request_id: "",
          sample_type: "",
          priority: "routine",
          volume: "",
          container_type: "",
          storage_conditions: "",
          collection_notes: "",
        });

        setShowAddSampleModal(false);
        console.log("Sample created successfully:", response.data);
      }
    } catch (error) {
      console.error("Error creating sample:", error);
      setSamplesError("Failed to create sample. Please try again.");
    }
  };

  const handleUpdateSampleStatus = async (updatedData: any) => {
    try {
      if (selectedSample && selectedSample.originalSample) {
        // Map frontend status to backend status
        const backendStatus = mapFrontendToBackendStatus(updatedData.status);

        // Update the sample status in the backend
        await technicianSampleAPI.updateStatus(selectedSample.id, {
          status: backendStatus,
          processing_notes:
            updatedData.notes || selectedSample.originalSample.processing_notes,
        });

        // Refresh the samples list
        await fetchSamples();

        // Close the modal
        setShowUpdateStatusModal(false);
        setSelectedSample(null);

        console.log(
          `Sample ${selectedSample.id} status updated to ${backendStatus}`
        );
      }
    } catch (error) {
      console.error("Error updating sample status:", error);
      setSamplesError("Failed to update sample status");
    }
  };

  // Helper function to map frontend status to backend status
  const mapFrontendToBackendStatus = (frontendStatus: string) => {
    switch (frontendStatus) {
      case "pending":
        return "collected";
      case "processing":
        return "processing";
      case "completed":
        return "completed";
      case "cancelled":
        return "rejected";
      default:
        return "collected";
    }
  };

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
          <button
            onClick={handleAddSample}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
          >
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
              {samplesLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        Loading test requests...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : samplesError ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Error loading test requests
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {samplesError}
                    </p>
                    <button
                      onClick={fetchTestRequests}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <TestTube className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No test requests found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ||
                      filterStatus !== "all" ||
                      filterPriority !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "No approved test requests are available for processing."}
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
                        <button
                          onClick={() => handleViewSample(sample)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sample)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Update</span>
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
                <button
                  onClick={() => handleViewSample(sample)}
                  className="flex-1 px-3 py-2 text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 border border-primary-200 dark:border-primary-700 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(sample)}
                  className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Sample Modal */}
      {showAddSampleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Sample
              </h3>
              <button
                onClick={() => setShowAddSampleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient ID *
                </label>
                <input
                  type="text"
                  value={newSample.patient_id}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      patient_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter patient ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Request ID
                </label>
                <input
                  type="text"
                  value={newSample.test_request_id}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      test_request_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter test request ID (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sample Type *
                </label>
                <select
                  value={newSample.sample_type}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      sample_type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select sample type</option>
                  <option value="blood">Blood</option>
                  <option value="urine">Urine</option>
                  <option value="tissue">Tissue</option>
                  <option value="swab">Swab</option>
                  <option value="fluid">Body Fluid</option>
                  <option value="stool">Stool</option>
                  <option value="sputum">Sputum</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority *
                </label>
                <select
                  value={newSample.priority}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newSample.volume}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      volume: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter sample volume"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Container Type
                </label>
                <input
                  type="text"
                  value={newSample.container_type}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      container_type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Vacutainer, Urine cup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  value={newSample.storage_conditions}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      storage_conditions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Room temperature, Refrigerated"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collection Notes
                </label>
                <textarea
                  value={newSample.collection_notes}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      collection_notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter any additional notes about sample collection"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowAddSampleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSample}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Sample Modal */}
      {showViewSampleModal && selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sample Details
              </h3>
              <button
                onClick={() => setShowViewSampleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sample ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedSample.status
                    )}`}
                  >
                    {selectedSample.status.charAt(0).toUpperCase() +
                      selectedSample.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.testType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sample Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.sampleType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedSample.priority
                    )}`}
                  >
                    {selectedSample.priority.charAt(0).toUpperCase() +
                      selectedSample.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Collection Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.collectionDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Collection Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.collectionTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expected Completion
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.expectedCompletion}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowViewSampleModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Sample Status
              </h3>
              <button
                onClick={() => setShowUpdateStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={selectedSample.status}
                  onChange={(e) =>
                    setSelectedSample((prev: any) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={selectedSample.priority}
                  onChange={(e) =>
                    setSelectedSample((prev: any) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowUpdateStatusModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateSampleStatus(selectedSample)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Samples;
