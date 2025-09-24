import {
  CheckCircle,
  ClipboardCheck,
  FileText,
  TestTube,
  Wrench,
  Plus,
  Eye,
  Edit,
  X,
  Download,
  Share,
  Clock,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import BaseDashboard from "./BaseDashboard";

const TechnicianDashboard: React.FC = () => {
  // Modal states
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showViewReportModal, setShowViewReportModal] = useState(false);
  const [showEditReportModal, setShowEditReportModal] = useState(false);
  const [showTrackReportModal, setShowTrackReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Form states
  const [newReport, setNewReport] = useState({
    patientName: "",
    testType: "",
    description: "",
    priority: "normal",
  });

  // Test reports data
  const [testReports, setTestReports] = useState([
    {
      id: "TR-2025-001",
      patientName: "John Smith",
      testType: "Blood Panel Complete",
      status: "completed",
      createdDate: "2025-01-20 14:30",
      description: "Complete blood count with differential",
      priority: "normal",
      technician: "Current Technician",
      results: "All values within normal range",
    },
    {
      id: "TR-2025-002",
      patientName: "Sarah Johnson",
      testType: "X-Ray Chest",
      status: "in_review",
      createdDate: "2025-01-20 13:15",
      description: "Chest X-ray for routine examination",
      priority: "normal",
      technician: "Current Technician",
      results: "Clear lung fields, no abnormalities detected",
    },
    {
      id: "TR-2025-003",
      patientName: "Mike Davis",
      testType: "MRI Brain",
      status: "processing",
      createdDate: "2025-01-20 12:45",
      description: "Brain MRI with contrast",
      priority: "high",
      technician: "Current Technician",
      results: "Scan in progress",
    },
  ]);

  // Load test reports from localStorage on component mount
  useEffect(() => {
    const savedReports = localStorage.getItem("technician-dashboard-reports");
    if (savedReports) {
      try {
        setTestReports(JSON.parse(savedReports));
      } catch (error) {
        console.error("Error loading saved test reports:", error);
      }
    }
  }, []);

  // Save test reports to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      "technician-dashboard-reports",
      JSON.stringify(testReports)
    );
  }, [testReports]);

  // CRUD Functions
  const handleNewReport = () => {
    setShowNewReportModal(true);
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowViewReportModal(true);
  };

  const handleEditReport = (report: any) => {
    setSelectedReport(report);
    setShowEditReportModal(true);
  };

  const handleTrackReport = (report: any) => {
    setSelectedReport(report);
    setShowTrackReportModal(true);
  };

  const handleCreateReport = () => {
    const newReportData = {
      id: `TR-2025-${String(testReports.length + 1).padStart(3, "0")}`,
      ...newReport,
      status: "processing",
      createdDate: new Date().toLocaleString(),
      technician: "Current Technician",
      results: "Report being generated",
    };

    setTestReports((prev) => [...prev, newReportData]);
    setNewReport({
      patientName: "",
      testType: "",
      description: "",
      priority: "normal",
    });
    setShowNewReportModal(false);
  };

  const handleUpdateReport = () => {
    setTestReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? {
              ...r,
              status: "completed",
              results: "Report completed successfully",
            }
          : r
      )
    );
    setShowEditReportModal(false);
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "in_review":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "in_review":
        return "In Review";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  const technicianCards = [
    {
      title: "Samples Processed",
      value: "156",
      change: "+23 Today",
      color: "bg-blue-500",
      chartData: [120, 130, 140, 145, 150, 152, 156],
    },
    {
      title: "Equipment Active",
      value: "8/10",
      change: "2 Maintenance Due",
      color: "bg-green-500",
      chartData: [6, 7, 8, 8, 8, 8, 8],
    },
    {
      title: "Test Reports Created",
      value: "89",
      change: "+12 This Week",
      color: "bg-purple-500",
      chartData: [70, 75, 80, 82, 85, 87, 89],
    },
    {
      title: "Quality Score",
      value: "98.5%",
      change: "+0.3% This Month",
      color: "bg-emerald-500",
      chartData: [97, 97.5, 98, 98.2, 98.3, 98.4, 98.5],
    },
  ];

  return (
    <BaseDashboard>
      {/* Technician specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {technicianCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <TestTube className="w-4 h-4 text-white" />}
                {index === 1 && <Wrench className="w-4 h-4 text-white" />}
                {index === 2 && <FileText className="w-4 h-4 text-white" />}
                {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
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

      {/* Sample Processing Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sample Processing Queue
            </h3>
            <ClipboardCheck className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                id: "SP-001",
                type: "Blood Panel",
                priority: "High",
                status: "Processing",
                time: "2h 15m",
              },
              {
                id: "SP-002",
                type: "Urine Analysis",
                priority: "Medium",
                status: "Pending",
                time: "1h 30m",
              },
              {
                id: "SP-003",
                type: "Tissue Biopsy",
                priority: "High",
                status: "Processing",
                time: "3h 45m",
              },
              {
                id: "SP-004",
                type: "Swab Culture",
                priority: "Low",
                status: "Completed",
                time: "0h 20m",
              },
              {
                id: "SP-005",
                type: "Blood Typing",
                priority: "Medium",
                status: "Pending",
                time: "45m",
              },
            ].map((sample, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      sample.priority === "High"
                        ? "bg-red-100 dark:bg-red-900"
                        : sample.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <TestTube
                      className={`w-4 h-4 ${
                        sample.priority === "High"
                          ? "text-red-600 dark:text-red-400"
                          : sample.priority === "Medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {sample.id}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {sample.type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Est. time: {sample.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      sample.status === "Processing"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        : sample.status === "Pending"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {sample.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Equipment Status
            </h3>
            <Wrench className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Microscope Alpha-1",
                status: "Operational",
                lastCalibration: "2025-01-15",
                nextMaintenance: "2025-02-15",
              },
              {
                name: "Centrifuge Beta-2",
                status: "Maintenance Due",
                lastCalibration: "2025-01-10",
                nextMaintenance: "2025-01-25",
              },
              {
                name: "PCR Machine Gamma-3",
                status: "Operational",
                lastCalibration: "2025-01-18",
                nextMaintenance: "2025-02-18",
              },
              {
                name: "Incubator Delta-4",
                status: "Calibrating",
                lastCalibration: "2025-01-20",
                nextMaintenance: "2025-02-20",
              },
            ].map((equipment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      equipment.status === "Operational"
                        ? "bg-green-100 dark:bg-green-900"
                        : equipment.status === "Maintenance Due"
                        ? "bg-red-100 dark:bg-red-900"
                        : "bg-yellow-100 dark:bg-yellow-900"
                    }`}
                  >
                    <Wrench
                      className={`w-4 h-4 ${
                        equipment.status === "Operational"
                          ? "text-green-600 dark:text-green-400"
                          : equipment.status === "Maintenance Due"
                          ? "text-red-600 dark:text-red-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {equipment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last cal: {equipment.lastCalibration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      equipment.status === "Operational"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : equipment.status === "Maintenance Due"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {equipment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Test Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Test Reports
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewReport}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>New Report</span>
            </button>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Report ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Patient
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Test Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {testReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {report.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {report.patientName}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {report.testType}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {report.createdDate}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {report.status !== "completed" && (
                        <button
                          onClick={() => handleEditReport(report)}
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      )}
                      {report.status === "processing" && (
                        <button
                          onClick={() => handleTrackReport(report)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Clock className="w-3 h-3" />
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

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Report
              </h3>
              <button
                onClick={() => setShowNewReportModal(false)}
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
                  value={newReport.patientName}
                  onChange={(e) =>
                    setNewReport((prev) => ({
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
                  Test Type
                </label>
                <input
                  type="text"
                  value={newReport.testType}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      testType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter test type"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newReport.priority}
                  onChange={(e) =>
                    setNewReport((prev) => ({
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
                  Description
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter test description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Report Details
              </h3>
              <button
                onClick={() => setShowViewReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Report ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.testType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Technician
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.createdDate}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.description}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Results
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.results}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
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

      {/* Edit Report Modal */}
      {showEditReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complete Report
              </h3>
              <button
                onClick={() => setShowEditReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Complete Report
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Mark report for <strong>{selectedReport.patientName}</strong>{" "}
                  as completed?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Test Type:</strong> {selectedReport.testType}
                    <br />
                    <strong>Technician:</strong> {selectedReport.technician}
                    <br />
                    <strong>Created:</strong> {selectedReport.createdDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowEditReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Report Modal */}
      {showTrackReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Track Report Progress
              </h3>
              <button
                onClick={() => setShowTrackReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Report in Progress
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Tracking report for{" "}
                  <strong>{selectedReport.patientName}</strong>
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Test Type:</strong> {selectedReport.testType}
                    <br />
                    <strong>Status:</strong>{" "}
                    {getStatusText(selectedReport.status)}
                    <br />
                    <strong>Technician:</strong> {selectedReport.technician}
                    <br />
                    <strong>Started:</strong> {selectedReport.createdDate}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Processing in progress...
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowTrackReportModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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

export default TechnicianDashboard;
