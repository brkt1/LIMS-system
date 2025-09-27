import {
  Download,
  FileText,
  Plus,
  Search,
  TrendingUp,
  Eye,
  Share,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { testReportAPI } from "../../services/api";

const TestReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Modal states
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showViewReportModal, setShowViewReportModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Form states
  const [newReport, setNewReport] = useState({
    patientName: "",
    patientId: "",
    testName: "",
    doctor: "",
    priority: "normal",
    notes: "",
  });

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load reports from backend API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testReportAPI.getAll();

        // Map backend data to frontend expected format
        const mappedReports = response.data.map((report: any) => ({
          id: report.id,
          patientName: report.patient_name || "Unknown Patient",
          patientId: report.patient_id || "Unknown ID",
          testName: report.test_name || "Unknown Test",
          doctor: report.doctor || "Unknown Doctor",
          status: report.status?.toLowerCase() || "pending",
          generatedDate:
            report.generated_date || new Date().toISOString().split("T")[0],
          generatedTime: report.generated_time || "Unknown",
          fileSize: report.file_size || "0 MB",
          format: report.format || "PDF",
          downloadCount: report.download_count || 0,
          priority: report.priority || "normal",
        }));

        setReports(mappedReports);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        setError(error.message || "Failed to load reports");
        // Fallback to mock data if API fails
        setReports([
          {
            id: "RPT001",
            patientName: "John Smith",
            patientId: "P001",
            testName: "Complete Blood Count",
            doctor: "Dr. Sarah Johnson",
            status: "completed",
            generatedDate: "2025-01-22",
            generatedTime: "10:30 AM",
            fileSize: "2.3 MB",
            format: "PDF",
            downloadCount: 3,
            priority: "normal",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Mock data is now handled in the useEffect fallback

  // Note: Data is now loaded from backend API in the useEffect above

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleGenerateReport = () => {
    setNewReport({
      patientName: "",
      patientId: "",
      testName: "",
      doctor: "",
      priority: "normal",
      notes: "",
    });
    setShowGenerateReportModal(true);
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowViewReportModal(true);
  };

  const handleDownloadReport = (report: any) => {
    setSelectedReport(report);
    setShowDownloadModal(true);
  };

  const handleShareReport = (report: any) => {
    setSelectedReport(report);
    setShowShareModal(true);
  };

  const handleCreateReport = () => {
    const newId = `RPT${String(reports.length + 1).padStart(3, "0")}`;
    const now = new Date();
    const report = {
      ...newReport,
      id: newId,
      status: "completed",
      generatedDate: now.toISOString().split("T")[0],
      generatedTime: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      fileSize: "2.5 MB",
      format: "PDF",
      downloadCount: 0,
    };
    setReports([...reports, report]);
    setShowGenerateReportModal(false);
  };

  const handleDownloadConfirm = () => {
    if (selectedReport) {
      // Simulate file download
      const blob = new Blob(["Test Report Content"], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReport.id}_${selectedReport.testName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Update download count
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, downloadCount: report.downloadCount + 1 }
            : report
        )
      );
      setShowDownloadModal(false);
    }
  };

  const handleShareConfirm = () => {
    if (selectedReport) {
      // Simulate sharing functionality
      const shareText = `Test Report: ${selectedReport.testName} for ${selectedReport.patientName}`;
      if (navigator.share) {
        navigator.share({
          title: "Test Report",
          text: shareText,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        alert("Report details copied to clipboard!");
      }
      setShowShareModal(false);
    }
  };

  const handleExportAll = () => {
    // Generate CSV content
    const csvContent = [
      [
        "Report ID",
        "Patient Name",
        "Patient ID",
        "Test Name",
        "Doctor",
        "Status",
        "Generated Date",
        "Generated Time",
        "File Size",
        "Format",
        "Download Count",
        "Priority",
      ],
      ...reports.map((report) => [
        report.id,
        report.patientName,
        report.patientId,
        report.testName,
        report.doctor,
        report.status,
        report.generatedDate,
        report.generatedTime,
        report.fileSize,
        report.format,
        report.downloadCount,
        report.priority,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test_reports_export.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
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
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Test Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and track laboratory test reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportAll}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading reports...
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, test name, or report ID..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Test
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Doctor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Generated
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {report.fileSize} • {report.format}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        {report.testName} • {report.doctor}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                        {report.downloadCount} downloads
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.patientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        ID: {report.patientId}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        {report.generatedDate} {report.generatedTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.testName}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {report.priority.charAt(0).toUpperCase() +
                          report.priority.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {report.doctor}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    <div>
                      <div>{report.generatedDate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {report.generatedTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleShareReport(report)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left flex items-center"
                      >
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generate Test Report
              </h3>
              <button
                onClick={() => setShowGenerateReportModal(false)}
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
                    value={newReport.patientName}
                    onChange={(e) =>
                      setNewReport({
                        ...newReport,
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
                    value={newReport.patientId}
                    onChange={(e) =>
                      setNewReport({ ...newReport, patientId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Name *
                  </label>
                  <select
                    value={newReport.testName}
                    onChange={(e) =>
                      setNewReport({ ...newReport, testName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select test type</option>
                    <option value="Complete Blood Count">
                      Complete Blood Count
                    </option>
                    <option value="X-Ray Chest">X-Ray Chest</option>
                    <option value="MRI Brain">MRI Brain</option>
                    <option value="Urine Analysis">Urine Analysis</option>
                    <option value="ECG">ECG</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor *
                  </label>
                  <input
                    type="text"
                    value={newReport.doctor}
                    onChange={(e) =>
                      setNewReport({ ...newReport, doctor: e.target.value })
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
                    value={newReport.priority}
                    onChange={(e) =>
                      setNewReport({ ...newReport, priority: e.target.value })
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
                    Notes
                  </label>
                  <textarea
                    value={newReport.notes}
                    onChange={(e) =>
                      setNewReport({ ...newReport, notes: e.target.value })
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
                onClick={() => setShowGenerateReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Report Details - {selectedReport.id}
              </h3>
              <button
                onClick={() => setShowViewReportModal(false)}
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
                    {selectedReport.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.testName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.doctor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status.charAt(0).toUpperCase() +
                      selectedReport.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedReport.priority
                    )}`}
                  >
                    {selectedReport.priority.charAt(0).toUpperCase() +
                      selectedReport.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Generated Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.generatedDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Generated Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.generatedTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    File Size
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.fileSize}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Format
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.format}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Download Count
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.downloadCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewReportModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Report Modal */}
      {showDownloadModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Download Report
              </h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Download the test report for{" "}
                <strong>{selectedReport.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Report ID:</strong> {selectedReport.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Test:</strong> {selectedReport.testName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>File Size:</strong> {selectedReport.fileSize}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Format:</strong> {selectedReport.format}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Report Modal */}
      {showShareModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Share Report
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Share the test report for{" "}
                <strong>{selectedReport.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Report ID:</strong> {selectedReport.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Test:</strong> {selectedReport.testName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Doctor:</strong> {selectedReport.doctor}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Generated:</strong> {selectedReport.generatedDate} at{" "}
                  {selectedReport.generatedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShareConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReports;
