import {
  CheckCircle,
  Plus,
  Eye,
  Edit,
  X,
  Search,
  Clock,
  AlertTriangle,
  TestTube,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const AcceptSamples: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Modal states
  const [showAcceptSampleModal, setShowAcceptSampleModal] = useState(false);
  const [showViewSampleModal, setShowViewSampleModal] = useState(false);
  const [showRejectSampleModal, setShowRejectSampleModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);

  // Form states
  const [newSample, setNewSample] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    sampleType: "",
    priority: "normal",
    notes: "",
    receivedDate: "",
    receivedBy: "",
  });

  const [acceptedSamples, setAcceptedSamples] = useState([
    {
      id: "AS001",
      patientName: "John Smith",
      patientId: "P001",
      testType: "Blood Test",
      sampleType: "Blood",
      priority: "high",
      status: "accepted",
      receivedDate: "2025-01-20",
      receivedBy: "Mike Davis",
      notes: "Urgent blood work required",
      acceptedDate: "2025-01-20",
      acceptedBy: "Current Technician",
    },
    {
      id: "AS002",
      patientName: "Sarah Johnson",
      patientId: "P002",
      testType: "Urine Analysis",
      sampleType: "Urine",
      priority: "normal",
      status: "pending",
      receivedDate: "2025-01-20",
      receivedBy: "Lisa Wilson",
      notes: "Routine checkup",
      acceptedDate: "",
      acceptedBy: "",
    },
    {
      id: "AS003",
      patientName: "Robert Brown",
      patientId: "P003",
      testType: "Tissue Biopsy",
      sampleType: "Tissue",
      priority: "high",
      status: "rejected",
      receivedDate: "2025-01-19",
      receivedBy: "Mike Davis",
      notes: "Insufficient sample quality",
      acceptedDate: "",
      acceptedBy: "",
      rejectedDate: "2025-01-19",
      rejectedBy: "Current Technician",
      rejectionReason: "Sample contamination detected",
    },
  ]);

  // Load accepted samples from localStorage on component mount
  useEffect(() => {
    const savedSamples = localStorage.getItem("technician-accepted-samples");
    if (savedSamples) {
      try {
        setAcceptedSamples(JSON.parse(savedSamples));
      } catch (error) {
        console.error("Error loading saved accepted samples:", error);
      }
    }
  }, []);

  // Save accepted samples to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      "technician-accepted-samples",
      JSON.stringify(acceptedSamples)
    );
  }, [acceptedSamples]);

  // CRUD Functions
  const handleAcceptSample = () => {
    setShowAcceptSampleModal(true);
  };

  const handleViewSample = (sample: any) => {
    setSelectedSample(sample);
    setShowViewSampleModal(true);
  };

  const handleRejectSample = (sample: any) => {
    setSelectedSample(sample);
    setShowRejectSampleModal(true);
  };

  const handleCreateAcceptedSample = () => {
    const now = new Date();
    const newSampleData = {
      id: `AS${String(acceptedSamples.length + 1).padStart(3, "0")}`,
      ...newSample,
      status: "accepted",
      acceptedDate: now.toISOString().split("T")[0],
      acceptedBy: "Current Technician",
    };

    setAcceptedSamples((prev) => [...prev, newSampleData]);
    setNewSample({
      patientName: "",
      patientId: "",
      testType: "",
      sampleType: "",
      priority: "normal",
      notes: "",
      receivedDate: "",
      receivedBy: "",
    });
    setShowAcceptSampleModal(false);
  };

  const handleRejectSampleAction = (rejectionReason: string) => {
    const now = new Date();
    setAcceptedSamples((prev) =>
      prev.map((s) =>
        s.id === selectedSample.id
          ? {
              ...s,
              status: "rejected",
              rejectedDate: now.toISOString().split("T")[0],
              rejectedBy: "Current Technician",
              rejectionReason: rejectionReason,
            }
          : s
      )
    );
    setShowRejectSampleModal(false);
    setSelectedSample(null);
  };

  const filteredSamples = acceptedSamples.filter((sample) => {
    const matchesSearch =
      sample.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sample.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case "accepted":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "normal":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Accept Samples
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Accept and process incoming samples
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleAcceptSample}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Accept Sample</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, ID, test type, or sample ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Accepted Samples Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sample
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Test Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Received Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSamples.map((sample) => (
                <tr
                  key={sample.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <TestTube className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {sample.sampleType}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          ID: {sample.id}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {sample.patientName} • {sample.testType}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block md:hidden">
                          {sample.patientId} • {sample.receivedDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    <div>
                      <div>{sample.patientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {sample.patientId}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {sample.testType}
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
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {sample.receivedDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewSample(sample)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {sample.status === "pending" && (
                        <button
                          onClick={() => handleRejectSample(sample)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left flex items-center space-x-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
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

      {/* Accept Sample Modal */}
      {showAcceptSampleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Accept New Sample
              </h3>
              <button
                onClick={() => setShowAcceptSampleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={newSample.patientName}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      patientName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={newSample.patientId}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      patientId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Type
                </label>
                <select
                  value={newSample.testType}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      testType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select test type</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Urine Analysis">Urine Analysis</option>
                  <option value="Tissue Biopsy">Tissue Biopsy</option>
                  <option value="Culture Test">Culture Test</option>
                  <option value="PCR Test">PCR Test</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sample Type
                </label>
                <select
                  value={newSample.sampleType}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      sampleType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select sample type</option>
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="Tissue">Tissue</option>
                  <option value="Swab">Swab</option>
                  <option value="Stool">Stool</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
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
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Received Date
                </label>
                <input
                  type="date"
                  value={newSample.receivedDate}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      receivedDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Received By
                </label>
                <input
                  type="text"
                  value={newSample.receivedBy}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      receivedBy: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter receiver name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newSample.notes}
                  onChange={(e) =>
                    setNewSample((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowAcceptSampleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAcceptedSample}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Accept Sample
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
                    Received Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.receivedDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Received By
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedSample.receivedBy}
                  </p>
                </div>
                {selectedSample.acceptedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accepted Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedSample.acceptedDate}
                    </p>
                  </div>
                )}
                {selectedSample.acceptedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accepted By
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedSample.acceptedBy}
                    </p>
                  </div>
                )}
                {selectedSample.rejectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rejected Date
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedSample.rejectedDate}
                    </p>
                  </div>
                )}
                {selectedSample.rejectedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rejected By
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedSample.rejectedBy}
                    </p>
                  </div>
                )}
                {selectedSample.rejectionReason && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rejection Reason
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedSample.rejectionReason}
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
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

      {/* Reject Sample Modal */}
      {showRejectSampleModal && selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reject Sample
              </h3>
              <button
                onClick={() => setShowRejectSampleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Reject Sample
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Are you sure you want to reject sample{" "}
                  <strong>{selectedSample.id}</strong>?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Patient:</strong> {selectedSample.patientName}
                    <br />
                    <strong>Test Type:</strong> {selectedSample.testType}
                    <br />
                    <strong>Sample Type:</strong> {selectedSample.sampleType}
                  </p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter reason for rejection"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowRejectSampleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason =
                    (
                      document.getElementById(
                        "rejectionReason"
                      ) as HTMLTextAreaElement
                    )?.value || "No reason provided";
                  handleRejectSampleAction(reason);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject Sample</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptSamples;
