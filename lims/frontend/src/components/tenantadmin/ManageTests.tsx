import { Calculator, Plus, Search, TestTube, TrendingUp } from "lucide-react";
import React, { useState } from "react";

const ManageTests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const tests = [
    {
      id: "TEST001",
      name: "Complete Blood Count (CBC)",
      category: "Hematology",
      code: "CBC",
      description:
        "Measures different components of blood including red and white blood cells",
      price: 45.0,
      duration: "30 minutes",
      status: "active",
      requirements: "Blood sample (2ml)",
      normalRange: "Varies by component",
      lastUpdated: "2025-01-20",
      totalOrders: 156,
    },
    {
      id: "TEST002",
      name: "Lipid Panel",
      category: "Chemistry",
      code: "LIPID",
      description: "Measures cholesterol and triglyceride levels",
      price: 65.0,
      duration: "45 minutes",
      status: "active",
      requirements: "Fasting blood sample (3ml)",
      normalRange: "Total cholesterol < 200 mg/dL",
      lastUpdated: "2025-01-18",
      totalOrders: 89,
    },
    {
      id: "TEST003",
      name: "COVID-19 PCR Test",
      category: "Microbiology",
      code: "COVID-PCR",
      description: "Detects SARS-CoV-2 virus genetic material",
      price: 120.0,
      duration: "2-4 hours",
      status: "active",
      requirements: "Nasal swab",
      normalRange: "Negative",
      lastUpdated: "2025-01-15",
      totalOrders: 234,
    },
    {
      id: "TEST004",
      name: "Thyroid Function Test",
      category: "Endocrinology",
      code: "TFT",
      description: "Measures thyroid hormone levels",
      price: 85.0,
      duration: "1 hour",
      status: "inactive",
      requirements: "Blood sample (2ml)",
      normalRange: "TSH: 0.4-4.0 mIU/L",
      lastUpdated: "2024-12-10",
      totalOrders: 67,
    },
    {
      id: "TEST005",
      name: "Urinalysis Complete",
      category: "Urinalysis",
      code: "UA",
      description: "Comprehensive analysis of urine sample",
      price: 25.0,
      duration: "20 minutes",
      status: "active",
      requirements: "Midstream urine sample (50ml)",
      normalRange: "No abnormalities",
      lastUpdated: "2025-01-22",
      totalOrders: 198,
    },
  ];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || test.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || test.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = tests.reduce(
    (sum, test) => sum + test.price * test.totalOrders,
    0
  );
  const activeTests = tests.filter((test) => test.status === "active").length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Manage Tests</h1>
          <p className="text-gray-600 mt-1">
            Configure and manage available laboratory tests
          </p>
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
            <Plus className="w-4 h-4" />
            <span>Add Test</span>
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
              placeholder="Search by test name, code, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Hematology">Hematology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Urinalysis">Urinalysis</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
            <TestTube className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tests</p>
              <p className="text-2xl font-bold text-green-600">{activeTests}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-purple-600">
                $
                {(
                  tests.reduce((sum, test) => sum + test.price, 0) /
                  tests.length
                ).toFixed(0)}
              </p>
            </div>
            <TestTube className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Duration
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Orders
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {test.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Code: {test.code}
                      </div>
                      <div className="text-xs text-gray-400 sm:hidden">
                        {test.category} • {test.duration} • {test.totalOrders}{" "}
                        orders
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        ID: {test.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {test.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${test.price.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {test.duration}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        test.status
                      )}`}
                    >
                      {test.status.charAt(0).toUpperCase() +
                        test.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {test.totalOrders}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-left">
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 text-left">
                        {test.status === "active" ? "Deactivate" : "Activate"}
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

export default ManageTests;
