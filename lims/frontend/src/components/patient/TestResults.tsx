import {
  Download,
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const TestResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Test results data state
  const [testResults, setTestResults] = useState([
    {
      id: "TR001",
      testName: "Complete Blood Count (CBC)",
      testDate: "2025-01-20",
      doctor: "Dr. Sarah Johnson",
      status: "completed",
      results: [
        {
          parameter: "Hemoglobin",
          value: "14.2",
          unit: "g/dL",
          normal: "12-16",
          status: "normal",
        },
        {
          parameter: "White Blood Cells",
          value: "7.5",
          unit: "K/μL",
          normal: "4.5-11.0",
          status: "normal",
        },
        {
          parameter: "Platelets",
          value: "320",
          unit: "K/μL",
          normal: "150-450",
          status: "normal",
        },
        {
          parameter: "Hematocrit",
          value: "42.5",
          unit: "%",
          normal: "36-46",
          status: "normal",
        },
      ],
      notes: "All values within normal range. No immediate concerns.",
      reportUrl: "#",
    },
    {
      id: "TR002",
      testName: "Lipid Panel",
      testDate: "2025-01-18",
      doctor: "Dr. Michael Chen",
      status: "completed",
      results: [
        {
          parameter: "Total Cholesterol",
          value: "220",
          unit: "mg/dL",
          normal: "<200",
          status: "high",
        },
        {
          parameter: "HDL Cholesterol",
          value: "45",
          unit: "mg/dL",
          normal: ">40",
          status: "normal",
        },
        {
          parameter: "LDL Cholesterol",
          value: "155",
          unit: "mg/dL",
          normal: "<100",
          status: "high",
        },
        {
          parameter: "Triglycerides",
          value: "180",
          unit: "mg/dL",
          normal: "<150",
          status: "high",
        },
      ],
      notes:
        "Elevated cholesterol levels detected. Recommend dietary changes and follow-up in 3 months.",
      reportUrl: "#",
    },
    {
      id: "TR003",
      testName: "Thyroid Function Test",
      testDate: "2025-01-15",
      doctor: "Dr. Emily Rodriguez",
      status: "completed",
      results: [
        {
          parameter: "TSH",
          value: "2.5",
          unit: "mIU/L",
          normal: "0.4-4.0",
          status: "normal",
        },
        {
          parameter: "Free T4",
          value: "1.2",
          unit: "ng/dL",
          normal: "0.8-1.8",
          status: "normal",
        },
        {
          parameter: "Free T3",
          value: "3.1",
          unit: "pg/mL",
          normal: "2.3-4.2",
          status: "normal",
        },
      ],
      notes:
        "Thyroid function appears normal. Continue current medication as prescribed.",
      reportUrl: "#",
    },
    {
      id: "TR004",
      testName: "Blood Glucose Test",
      testDate: "2025-01-12",
      doctor: "Dr. David Wilson",
      status: "completed",
      results: [
        {
          parameter: "Fasting Glucose",
          value: "95",
          unit: "mg/dL",
          normal: "70-100",
          status: "normal",
        },
        {
          parameter: "HbA1c",
          value: "5.4",
          unit: "%",
          normal: "<5.7",
          status: "normal",
        },
      ],
      notes:
        "Blood glucose levels are within normal range. No signs of diabetes.",
      reportUrl: "#",
    },
    {
      id: "TR005",
      testName: "Liver Function Test",
      testDate: "2025-01-10",
      doctor: "Dr. Lisa Anderson",
      status: "pending",
      results: [],
      notes:
        "Test results are being processed. You will be notified when available.",
      reportUrl: "#",
    },
  ]);

  // Load test results from localStorage on component mount
  useEffect(() => {
    const savedTestResults = localStorage.getItem("patientTestResults");
    if (savedTestResults) {
      setTestResults(JSON.parse(savedTestResults));
    }
  }, []);

  // Save test results to localStorage whenever testResults change
  useEffect(() => {
    localStorage.setItem("patientTestResults", JSON.stringify(testResults));
  }, [testResults]);

  // Handler functions
  const handleDownloadResult = (result: any) => {
    // Create a simple text report
    const reportContent = `
Test Result Report
==================

Test Name: ${result.testName}
Test Date: ${result.testDate}
Doctor: ${result.doctor}
Test ID: ${result.id}
Status: ${result.status}

Test Results:
${result.results
  .map(
    (r: any) =>
      `${r.parameter}: ${r.value} ${r.unit} (Normal: ${
        r.normal
      }) - ${r.status.toUpperCase()}`
  )
  .join("\n")}

Notes: ${result.notes}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download file
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.testName.replace(/[^a-zA-Z0-9]/g, "_")}_${
      result.id
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const completedResults = testResults.filter(
      (result) => result.status === "completed"
    );

    if (completedResults.length === 0) {
      alert("No completed test results available for download.");
      return;
    }

    // Create a comprehensive report
    const allReportsContent = completedResults
      .map(
        (result) => `
Test Result Report
==================

Test Name: ${result.testName}
Test Date: ${result.testDate}
Doctor: ${result.doctor}
Test ID: ${result.id}
Status: ${result.status}

Test Results:
${result.results
  .map(
    (r: any) =>
      `${r.parameter}: ${r.value} ${r.unit} (Normal: ${
        r.normal
      }) - ${r.status.toUpperCase()}`
  )
  .join("\n")}

Notes: ${result.notes}

${"=".repeat(50)}
    `
      )
      .join("\n\n");

    const finalContent = `
COMPREHENSIVE TEST RESULTS REPORT
=================================

Patient: [Patient Name]
Generated on: ${new Date().toLocaleDateString()}
Total Tests: ${completedResults.length}

${allReportsContent}
    `.trim();

    // Create and download file
    const blob = new Blob([finalContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Test_Results_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const filteredResults = testResults.filter((result) => {
    const matchesSearch =
      result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getResultStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "high":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "low":
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case "normal":
        return <div className="w-4 h-4 rounded-full bg-green-500"></div>;
      default:
        return null;
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "low":
        return "text-blue-600 dark:text-blue-400";
      case "normal":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const totalTests = testResults.length;
  const completedTests = testResults.filter(
    (test) => test.status === "completed"
  ).length;
  const pendingTests = testResults.filter(
    (test) => test.status === "pending"
  ).length;
  const abnormalResults = testResults.filter(
    (test) =>
      test.status === "completed" &&
      test.results.some((result) => result.status !== "normal")
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Test Results
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and download your medical test results
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleDownloadAll}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Download All</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by test name, doctor, or test ID..."
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Test Results List */}
      <div className="space-y-6">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {result.testName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span>Test Date: {result.testDate}</span>
                    <span>Doctor: {result.doctor}</span>
                    <span>ID: {result.id}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      result.status
                    )}`}
                  >
                    {getStatusText(result.status)}
                  </span>
                  {result.status === "completed" && (
                    <button
                      onClick={() => handleDownloadResult(result)}
                      className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>

              {result.status === "completed" && result.results.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Test Results:
                  </h4>
                  <div className="space-y-2">
                    {result.results.map((testResult, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {testResult.parameter}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-sm font-semibold ${getResultStatusColor(
                              testResult.status
                            )}`}
                          >
                            {testResult.value} {testResult.unit}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Normal: {testResult.normal}
                          </span>
                          {getResultStatusIcon(testResult.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.notes && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Notes:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {result.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No test results found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestResults;
