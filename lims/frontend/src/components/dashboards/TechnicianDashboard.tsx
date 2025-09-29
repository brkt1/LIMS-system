import {
  CheckCircle,
  ClipboardCheck,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  TestTube,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  equipmentAPI,
  technicianEquipmentAPI,
  technicianSampleAPI,
  testReportAPI,
  testRequestAPI,
} from "../../services/api";
import BaseDashboard from "./BaseDashboard";

const TechnicianDashboard: React.FC = () => {
  const { t } = useLanguage();

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
    category: "Hematology",
  });

  // Test reports data
  const [testReports, setTestReports] = useState<any[]>([]);
  const [testReportsLoading, setTestReportsLoading] = useState(true);
  const [testReportsError, setTestReportsError] = useState<string | null>(null);

  // Samples data
  const [samples, setSamples] = useState<any[]>([]);
  const [samplesLoading, setSamplesLoading] = useState(true);
  const [samplesError, setSamplesError] = useState<string | null>(null);

  // Equipment data
  const [equipment, setEquipment] = useState<any[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [equipmentError, setEquipmentError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    fetchTestReports();
    fetchSamples();
    fetchEquipment();
  }, []);

  const fetchTestReports = async () => {
    try {
      setTestReportsLoading(true);
      setTestReportsError(null);
      const response = await testReportAPI.getAll();
      console.log("📊 Test Reports fetched:", response.data);

      // Handle different response structures
      if (Array.isArray(response.data)) {
        setTestReports(response.data);
      } else if (response.data && response.data.results) {
        // Handle paginated response
        setTestReports(response.data.results);
      } else {
        setTestReports([]);
      }
    } catch (err: any) {
      console.error("Error fetching test reports:", err);
      setTestReportsError(err.message || "Failed to fetch test reports");
      setTestReports([]); // Set empty array on error
    } finally {
      setTestReportsLoading(false);
    }
  };

  const fetchSamples = async () => {
    try {
      setSamplesLoading(true);
      setSamplesError(null);
      const response = await technicianSampleAPI.getAll();
      console.log("🧪 Samples fetched:", response.data);

      // Handle different response structures
      if (Array.isArray(response.data)) {
        setSamples(response.data);
      } else if (response.data && response.data.results) {
        // Handle paginated response
        setSamples(response.data.results);
      } else {
        setSamples([]);
      }
    } catch (err: any) {
      console.error("Error fetching samples:", err);
      setSamplesError(err.message || "Failed to fetch samples");
      setSamples([]); // Set empty array on error
    } finally {
      setSamplesLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      setEquipmentLoading(true);
      setEquipmentError(null);
      const response = await technicianEquipmentAPI.getAll();
      console.log("🔧 Equipment fetched:", response.data);

      // Handle different response structures
      if (Array.isArray(response.data)) {
        setEquipment(response.data);
      } else if (response.data && typeof response.data === "object") {
        // If it's an object with URLs, set empty array for now
        // TODO: Implement proper equipment fetching from the URLs
        setEquipment([]);
      } else {
        setEquipment([]);
      }
    } catch (err: any) {
      console.error("Error fetching equipment:", err);
      setEquipmentError(err.message || "Failed to fetch equipment");
      setEquipment([]); // Set empty array on error
    } finally {
      setEquipmentLoading(false);
    }
  };

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

  const handleCreateReport = async () => {
    try {
      // Map frontend priority to backend priority choices
      const priorityMap: { [key: string]: string } = {
        low: "Routine",
        normal: "Routine",
        high: "Urgent",
      };

      // Create a standalone test report without requiring a test_request
      const reportData = {
        // Don't include test_request to create a standalone report
        test_name: newReport.testType || "General Test",
        category: newReport.category, // Use selected category
        status: "Pending", // Valid status choice
        priority: priorityMap[newReport.priority] || "Routine", // Map to valid priority
        result: newReport.description || "Report being generated",
        technician: "Current Technician",
        notes: newReport.description || "New test report created",
        // Add required fields for standalone reports
        patient_name: newReport.patientName || "Unknown Patient",
        patient_id: "TECH-" + Date.now(), // Generate a unique patient ID
      };

      await testReportAPI.create(reportData);
      setNewReport({
        patientName: "",
        testType: "",
        description: "",
        priority: "normal",
        category: "Hematology",
      });
      setShowNewReportModal(false);
      fetchTestReports(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating test report:", err);
      console.error("Error details:", err.response?.data);
      alert(
        `Failed to create test report: ${
          err.response?.data?.detail || err.message
        }`
      );
    }
  };

  const handleUpdateReport = async () => {
    try {
      const updateData = {
        ...selectedReport,
        status: "completed",
        results: "Report completed successfully",
      };

      await testReportAPI.update(selectedReport.id, updateData);
      setShowEditReportModal(false);
      setSelectedReport(null);
      fetchTestReports(); // Refresh the list
    } catch (err: any) {
      console.error("Error updating test report:", err);
      alert("Failed to update test report. Please try again.");
    }
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
      title: t("technician.samplesProcessed"),
      value: samplesLoading ? "..." : samples.length.toString(),
      change: samplesLoading
        ? t("technician.loading")
        : `+${Math.floor(samples.length * 0.1)} ${t("technician.today")}`,
      color: "bg-blue-500",
      chartData: samplesLoading
        ? [0, 0, 0, 0, 0, 0, 0]
        : [
            samples.length * 0.7,
            samples.length * 0.8,
            samples.length * 0.85,
            samples.length * 0.9,
            samples.length * 0.95,
            samples.length * 0.98,
            samples.length,
          ],
    },
    {
      title: t("technician.equipmentActive"),
      value: equipmentLoading
        ? "..."
        : `${equipment.filter((eq) => eq.status === "operational").length}/${
            equipment.length
          }`,
      change: equipmentLoading
        ? t("technician.loading")
        : `${equipment.filter((eq) => eq.status === "maintenance").length} ${t(
            "technician.maintenanceDue"
          )}`,
      color: "bg-green-500",
      chartData: equipmentLoading
        ? [0, 0, 0, 0, 0, 0, 0]
        : [equipment.filter((eq) => eq.status === "operational").length],
    },
    {
      title: t("technician.testReportsCreated"),
      value: testReportsLoading ? "..." : testReports.length.toString(),
      change: testReportsLoading
        ? t("technician.loading")
        : `+${Math.floor(testReports.length * 0.15)} ${t(
            "technician.thisWeek"
          )}`,
      color: "bg-purple-500",
      chartData: testReportsLoading
        ? [0, 0, 0, 0, 0, 0, 0]
        : [
            testReports.length * 0.7,
            testReports.length * 0.8,
            testReports.length * 0.85,
            testReports.length * 0.9,
            testReports.length * 0.95,
            testReports.length * 0.98,
            testReports.length,
          ],
    },
    {
      title: t("technician.qualityScore"),
      value: "98.5%", // This would be calculated from test results
      change: `+0.3% ${t("technician.thisMonth")}`,
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
              {t("technician.sampleProcessingQueue")}
            </h3>
            <ClipboardCheck className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                id: "SP-001",
                type: t("technician.bloodPanel"),
                priority: t("technician.high"),
                status: t("technician.processing"),
                time: "2h 15m",
              },
              {
                id: "SP-002",
                type: t("technician.urineAnalysis"),
                priority: t("technician.medium"),
                status: t("technician.pending"),
                time: "1h 30m",
              },
              {
                id: "SP-003",
                type: t("technician.tissueBiopsy"),
                priority: t("technician.high"),
                status: t("technician.processing"),
                time: "3h 45m",
              },
              {
                id: "SP-004",
                type: t("technician.swabCulture"),
                priority: t("technician.low"),
                status: t("technician.completed"),
                time: "0h 20m",
              },
              {
                id: "SP-005",
                type: t("technician.bloodTyping"),
                priority: t("technician.medium"),
                status: t("technician.pending"),
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
                      {t("technician.estimatedTime")}: {sample.time}
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
              {t("technician.equipmentStatus")}
            </h3>
            <Wrench className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Microscope Alpha-1",
                status: t("technician.operational"),
                lastCalibration: "2025-01-15",
                nextMaintenance: "2025-02-15",
              },
              {
                name: "Centrifuge Beta-2",
                status: t("technician.maintenanceDue"),
                lastCalibration: "2025-01-10",
                nextMaintenance: "2025-01-25",
              },
              {
                name: "PCR Machine Gamma-3",
                status: t("technician.operational"),
                lastCalibration: "2025-01-18",
                nextMaintenance: "2025-02-18",
              },
              {
                name: "Incubator Delta-4",
                status: t("technician.calibrating"),
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
                      {t("technician.lastCalibration")}:{" "}
                      {equipment.lastCalibration}
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
            {t("technician.recentTestReports")}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewReport}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t("technician.newReport")}</span>
            </button>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.reportId")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.patient")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.testType")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.status")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.created")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  {t("technician.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {testReportsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("technician.loadingTestReports")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : testReportsError ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="text-center">
                      <span className="text-sm text-red-500 dark:text-red-400">
                        {testReportsError}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : testReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("technician.noTestReportsAvailable")}
                    </span>
                  </td>
                </tr>
              ) : (
                testReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {report.id}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {report.patient_name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {report.test_name || report.test_type}
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
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{t("technician.view")}</span>
                        </button>
                        {report.status !== "completed" && (
                          <button
                            onClick={() => handleEditReport(report)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>{t("technician.edit")}</span>
                          </button>
                        )}
                        {report.status === "processing" && (
                          <button
                            onClick={() => handleTrackReport(report)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>{t("technician.track")}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                {t("technician.createNewReport")}
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
                  {t("technician.patientName")}
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
                  placeholder={t("technician.enterPatientName")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("technician.testType")}
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
                  placeholder={t("technician.enterTestType")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("technician.category")}
                </label>
                <select
                  value={newReport.category}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Hematology">
                    {t("technician.hematology")}
                  </option>
                  <option value="Biochemistry">
                    {t("technician.biochemistry")}
                  </option>
                  <option value="Immunology">
                    {t("technician.immunology")}
                  </option>
                  <option value="Microbiology">
                    {t("technician.microbiology")}
                  </option>
                  <option value="Radiology">{t("technician.radiology")}</option>
                  <option value="Pathology">{t("technician.pathology")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("technician.priority")}
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
                  <option value="low">{t("technician.lowRoutine")}</option>
                  <option value="normal">
                    {t("technician.normalRoutine")}
                  </option>
                  <option value="high">{t("technician.highUrgent")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("technician.description")}
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
                  placeholder={t("technician.enterTestDescription")}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowNewReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("technician.cancel")}
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t("technician.createReport")}
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
                {t("technician.reportDetails")}
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
                    {t("technician.reportId")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.status")}
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
                    {t("technician.patientName")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.testType")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.testType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.technician")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.technician}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.createdDate")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.createdDate}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.description")}
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReport.description}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("technician.results")}
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
                {t("technician.close")}
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
                {t("technician.completeReport")}
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
                  {t("technician.completeReport")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {t("technician.markReportAsCompleted").replace(
                    "{patientName}",
                    selectedReport.patientName
                  )}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>{t("technician.testTypeLabel")}</strong>{" "}
                    {selectedReport.testType}
                    <br />
                    <strong>{t("technician.technicianLabel")}</strong>{" "}
                    {selectedReport.technician}
                    <br />
                    <strong>{t("technician.createdLabel")}</strong>{" "}
                    {selectedReport.createdDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t dark:border-gray-700">
              <button
                onClick={() => setShowEditReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("technician.cancel")}
              </button>
              <button
                onClick={handleUpdateReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t("technician.completeReportButton")}</span>
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
                {t("technician.trackReportProgress")}
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
                  {t("technician.reportInProgress")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {t("technician.trackingReportFor").replace(
                    "{patientName}",
                    selectedReport.patientName
                  )}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>{t("technician.testTypeLabel")}</strong>{" "}
                    {selectedReport.testType}
                    <br />
                    <strong>{t("technician.statusLabel")}</strong>{" "}
                    {getStatusText(selectedReport.status)}
                    <br />
                    <strong>{t("technician.technicianLabel")}</strong>{" "}
                    {selectedReport.technician}
                    <br />
                    <strong>{t("technician.startedLabel")}</strong>{" "}
                    {selectedReport.createdDate}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {t("technician.processingInProgress")}
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
                {t("technician.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseDashboard>
  );
};

export default TechnicianDashboard;
