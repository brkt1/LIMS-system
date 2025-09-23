import {
  Calculator,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

const TestPricing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const pricingItems = [
    {
      id: "PRC001",
      testName: "Complete Blood Count (CBC)",
      category: "Hematology",
      basePrice: 45.0,
      insurancePrice: 35.0,
      cashPrice: 40.0,
      status: "active",
      lastUpdated: "2025-01-20",
      updatedBy: "Dr. Sarah Johnson",
      description: "Measures different components of blood",
      turnaroundTime: "30 minutes",
      requirements: "Blood sample (2ml)",
      code: "CBC",
    },
    {
      id: "PRC002",
      testName: "Lipid Panel",
      category: "Chemistry",
      basePrice: 65.0,
      insurancePrice: 50.0,
      cashPrice: 55.0,
      status: "active",
      lastUpdated: "2025-01-18",
      updatedBy: "Dr. Mike Davis",
      description: "Measures cholesterol and triglyceride levels",
      turnaroundTime: "45 minutes",
      requirements: "Fasting blood sample (3ml)",
      code: "LIPID",
    },
    {
      id: "PRC003",
      testName: "COVID-19 PCR Test",
      category: "Microbiology",
      basePrice: 120.0,
      insurancePrice: 100.0,
      cashPrice: 110.0,
      status: "active",
      lastUpdated: "2025-01-15",
      updatedBy: "Dr. Lisa Wilson",
      description: "Detects SARS-CoV-2 virus genetic material",
      turnaroundTime: "2-4 hours",
      requirements: "Nasal swab",
      code: "COVID-PCR",
    },
    {
      id: "PRC004",
      testName: "Thyroid Function Test",
      category: "Endocrinology",
      basePrice: 85.0,
      insurancePrice: 70.0,
      cashPrice: 75.0,
      status: "inactive",
      lastUpdated: "2024-12-10",
      updatedBy: "Dr. Robert Brown",
      description: "Measures thyroid hormone levels",
      turnaroundTime: "1 hour",
      requirements: "Blood sample (2ml)",
      code: "TFT",
    },
    {
      id: "PRC005",
      testName: "Urinalysis Complete",
      category: "Urinalysis",
      basePrice: 25.0,
      insurancePrice: 20.0,
      cashPrice: 22.0,
      status: "active",
      lastUpdated: "2025-01-22",
      updatedBy: "Dr. Jennifer Smith",
      description: "Comprehensive analysis of urine sample",
      turnaroundTime: "20 minutes",
      requirements: "Midstream urine sample (50ml)",
      code: "UA",
    },
    {
      id: "PRC006",
      testName: "Blood Culture",
      category: "Microbiology",
      basePrice: 95.0,
      insurancePrice: 80.0,
      cashPrice: 85.0,
      status: "active",
      lastUpdated: "2025-01-19",
      updatedBy: "Dr. Sarah Johnson",
      description: "Detects bacterial or fungal infections in blood",
      turnaroundTime: "24-48 hours",
      requirements: "Blood sample (10ml)",
      code: "BC",
    },
  ];

  const filteredPricing = pricingItems.filter((item) => {
    const matchesSearch =
      item.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
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

  const totalTests = pricingItems.length;
  const activeTests = pricingItems.filter((t) => t.status === "active").length;
  const avgBasePrice =
    pricingItems.reduce((sum, t) => sum + t.basePrice, 0) / pricingItems.length;
  const totalRevenue = pricingItems.reduce(
    (sum, t) => sum + t.basePrice * 10,
    0
  ); // Assuming 10 tests per item

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Test & Cultures Pricing
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage pricing for tests and culture services
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>Add Pricing</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by test name, code, or pricing ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{totalTests}</p>
            </div>
            <Calculator className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Tests</p>
              <p className="text-2xl font-bold text-green-600">{activeTests}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Avg. Base Price</p>
              <p className="text-2xl font-bold text-blue-600">
                ${avgBasePrice.toFixed(0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Est. Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Base Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Insurance
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Cash
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Turnaround
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPricing.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.testName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{item.code}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        Base: ${item.basePrice}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {item.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.basePrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.insurancePrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.cashPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                    {item.turnaroundTime}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left">
                        Delete
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

export default TestPricing;
