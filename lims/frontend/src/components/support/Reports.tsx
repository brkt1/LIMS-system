import {
  BarChart3,
  Download,
  FileText,
  Plus,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const Reports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  const reports = [
    {
      id: "RPT001",
      title: "Support Ticket Analysis",
      description:
        "Comprehensive analysis of support tickets, resolution times, and customer satisfaction",
      type: "Analytics",
      category: "Support",
      generatedDate: "2025-01-22",
      generatedBy: "Support Team",
      fileSize: "2.3 MB",
      format: "PDF",
      downloadCount: 15,
      status: "completed",
    },
    {
      id: "RPT002",
      title: "System Performance Report",
      description:
        "Monthly system performance metrics including uptime, response times, and error rates",
      type: "Performance",
      category: "System",
      generatedDate: "2025-01-21",
      generatedBy: "Technical Team",
      fileSize: "1.8 MB",
      format: "Excel",
      downloadCount: 8,
      status: "completed",
    },
    {
      id: "RPT003",
      title: "User Activity Summary",
      description:
        "Weekly summary of user activities, login patterns, and feature usage statistics",
      type: "Usage",
      category: "Users",
      generatedDate: "2025-01-20",
      generatedBy: "Analytics Team",
      fileSize: "3.1 MB",
      format: "PDF",
      downloadCount: 12,
      status: "completed",
    },
    {
      id: "RPT004",
      title: "Error Log Analysis",
      description:
        "Analysis of system errors, their frequency, and resolution patterns",
      type: "Error Analysis",
      category: "System",
      generatedDate: "2025-01-19",
      generatedBy: "Technical Team",
      fileSize: "4.2 MB",
      format: "CSV",
      downloadCount: 5,
      status: "completed",
    },
    {
      id: "RPT005",
      title: "Customer Satisfaction Survey",
      description:
        "Results from the quarterly customer satisfaction survey and feedback analysis",
      type: "Survey",
      category: "Customer",
      generatedDate: "2025-01-18",
      generatedBy: "Support Team",
      fileSize: "1.5 MB",
      format: "PDF",
      downloadCount: 22,
      status: "completed",
    },
    {
      id: "RPT006",
      title: "Security Audit Report",
      description:
        "Monthly security audit findings and recommendations for system improvements",
      type: "Security",
      category: "Security",
      generatedDate: "2025-01-17",
      generatedBy: "Security Team",
      fileSize: "5.7 MB",
      format: "PDF",
      downloadCount: 3,
      status: "completed",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "analytics":
        return "bg-blue-100 text-blue-800";
      case "performance":
        return "bg-green-100 text-green-800";
      case "usage":
        return "bg-purple-100 text-purple-800";
      case "error analysis":
        return "bg-red-100 text-red-800";
      case "survey":
        return "bg-yellow-100 text-yellow-800";
      case "security":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "support":
        return "bg-blue-100 text-blue-800";
      case "system":
        return "bg-green-100 text-green-800";
      case "users":
        return "bg-purple-100 text-purple-800";
      case "customer":
        return "bg-yellow-100 text-yellow-800";
      case "security":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalReports = reports.length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloadCount, 0);
  const avgFileSize =
    reports.reduce((sum, r) => sum + parseFloat(r.fileSize), 0) /
    reports.length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and manage support reports and analytics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
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
              placeholder="Search by title, description, or report ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Analytics">Analytics</option>
            <option value="Performance">Performance</option>
            <option value="Usage">Usage</option>
            <option value="Error Analysis">Error Analysis</option>
            <option value="Survey">Survey</option>
            <option value="Security">Security</option>
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-green-600">
                {totalDownloads}
              </p>
            </div>
            <Download className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. File Size</p>
              <p className="text-2xl font-bold text-blue-600">
                {avgFileSize.toFixed(1)} MB
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-purple-600">
                {
                  reports.filter((r) => r.generatedDate.includes("2025-01"))
                    .length
                }
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {report.description}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-gray-400 flex-shrink-0 ml-2" />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                    report.type
                  )}`}
                >
                  {report.type}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                    report.category
                  )}`}
                >
                  {report.category}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By {report.generatedBy}</span>
                <span>{report.generatedDate}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>
                  {report.fileSize} • {report.format}
                </span>
                <span>{report.downloadCount} downloads</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No reports found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
