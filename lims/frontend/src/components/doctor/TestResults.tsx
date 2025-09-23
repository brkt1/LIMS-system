import {
  Calendar,
  Download,
  FileText,
  Search,
  User,
  Eye,
  Share2,
  FileDown,
} from "lucide-react";
import React, { useState } from "react";

const TestResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for modals and CRUD operations
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  // Test results data with state management
  const [testResults, setTestResults] = useState([
    {
      id: "TR001",
      patient: "John Smith",
      patientId: "P001",
      testType: "Blood Panel Complete",
      result: "Normal",
      priority: "Low",
      completedDate: "2025-01-20",
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      notes: "All values within normal range",
    },
    {
      id: "TR002",
      patient: "Sarah Johnson",
      patientId: "P002",
      testType: "X-Ray Chest",
      result: "Abnormal",
      priority: "High",
      completedDate: "2025-01-19",
      doctor: "Dr. Mike Davis",
      status: "Completed",
      notes: "Shows signs of pneumonia in left lung",
    },
    {
      id: "TR003",
      patient: "Mike Davis",
      patientId: "P003",
      testType: "MRI Brain",
      result: "Pending",
      priority: "Medium",
      completedDate: "2025-01-18",
      doctor: "Dr. Lisa Wilson",
      status: "In Progress",
      notes: "Scan completed, analysis in progress",
    },
    {
      id: "TR004",
      patient: "Lisa Wilson",
      patientId: "P004",
      testType: "Urine Analysis",
      result: "Normal",
      priority: "Low",
      completedDate: "2025-01-17",
      doctor: "Dr. Robert Brown",
      status: "Completed",
      notes: "No abnormalities detected",
    },
  ]);

  // CRUD operation functions
  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setShowViewModal(true);
  };

  const handleDownloadResult = (result: any) => {
    setSelectedResult(result);
    setShowDownloadModal(true);
  };

  const handleShareResult = (result: any) => {
    setSelectedResult(result);
    setShowShareModal(true);
  };

  const handleExportResults = () => {
    // Create CSV content
    const csvContent = [
      [
        "Patient ID",
        "Patient Name",
        "Test Type",
        "Result",
        "Priority",
        "Status",
        "Completed Date",
        "Doctor",
        "Notes",
      ],
      ...testResults.map((result) => [
        result.id,
        result.patient,
        result.testType,
        result.result,
        result.priority,
        result.status,
        result.completedDate,
        result.doctor,
        result.notes,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `test-results-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadFile = (result: any, format: string) => {
    // Simulate file download
    const content = `Test Result Report\n\nPatient: ${result.patient}\nTest Type: ${result.testType}\nResult: ${result.result}\nPriority: ${result.priority}\nStatus: ${result.status}\nCompleted Date: ${result.completedDate}\nDoctor: ${result.doctor}\nNotes: ${result.notes}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `test-result-${result.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setShowDownloadModal(false);
  };

  const handleShareResultAction = (result: any, method: string) => {
    if (method === "email") {
      const subject = `Test Result - ${result.patient}`;
      const body = `Please find the test result for ${result.patient}:\n\nTest Type: ${result.testType}\nResult: ${result.result}\nPriority: ${result.priority}\nCompleted Date: ${result.completedDate}\nDoctor: ${result.doctor}\nNotes: ${result.notes}`;
      window.open(
        `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      );
    } else if (method === "copy") {
      const text = `Test Result for ${result.patient}:\nTest Type: ${result.testType}\nResult: ${result.result}\nPriority: ${result.priority}\nCompleted Date: ${result.completedDate}\nDoctor: ${result.doctor}\nNotes: ${result.notes}`;
      navigator.clipboard.writeText(text);
      alert("Test result details copied to clipboard!");
    }
    setShowShareModal(false);
  };

  const filteredResults = testResults.filter((result) => {
    const matchesSearch =
      result.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      result.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case "normal":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "abnormal":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "in progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Test Results
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              View and manage patient test results
            </p>
          </div>
          <button
            onClick={handleExportResults}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, test type, or result ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Test Results Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Test Type
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Completed Date
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {result.patient}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          ID: {result.patientId}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {result.testType}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(
                          result.result
                        )}`}
                      >
                        {result.result}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          result.priority
                        )}`}
                      >
                        {result.priority}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          result.status
                        )}`}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                      {result.completedDate}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewResult(result)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadResult(result)}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left transition-colors"
                        >
                          <FileDown className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleShareResult(result)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left transition-colors"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
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

      {/* View Result Modal */}
      {showViewModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Result Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result ID:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedResult.id}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedResult.patient} (ID: {selectedResult.patientId})
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedResult.testType}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(
                    selectedResult.result
                  )}`}
                >
                  {selectedResult.result}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    selectedResult.priority
                  )}`}
                >
                  {selectedResult.priority}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedResult.status
                  )}`}
                >
                  {selectedResult.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Completed Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedResult.completedDate}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doctor:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedResult.doctor}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedResult.notes}
                </p>
              </div>
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

      {/* Download Result Modal */}
      {showDownloadModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Download Test Result
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose format to download the test result for{" "}
                <strong>{selectedResult.patient}</strong>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleDownloadFile(selectedResult, "pdf")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span>Download as PDF</span>
              </button>
              <button
                onClick={() => handleDownloadFile(selectedResult, "txt")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Download as Text</span>
              </button>
              <button
                onClick={() => handleDownloadFile(selectedResult, "csv")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download as CSV</span>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Result Modal */}
      {showShareModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Share Test Result
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share the test result for{" "}
                <strong>{selectedResult.patient}</strong>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleShareResultAction(selectedResult, "email")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Email</span>
              </button>
              <button
                onClick={() => handleShareResultAction(selectedResult, "copy")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Copy to Clipboard</span>
              </button>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
