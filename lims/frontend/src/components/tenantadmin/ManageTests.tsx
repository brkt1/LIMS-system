import { Plus, Power, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { testPricingAPI } from "../../services/api";
import { getCurrentTenantId } from "../../utils/helpers";

const ManageTests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showViewTestModal, setShowViewTestModal] = useState(false);
  const [showEditTestModal, setShowEditTestModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  // Form states
  const [newTest, setNewTest] = useState({
    test_name: "",
    category: "",
    test_code: "",
    description: "",
    base_price: 0,
    turnaround_time: "",
    sample_type: "",
    preparation_instructions: "",
  });

  const [editTest, setEditTest] = useState({
    test_name: "",
    category: "",
    test_code: "",
    description: "",
    base_price: 0,
    turnaround_time: "",
    sample_type: "",
    preparation_instructions: "",
  });

  // Tests state
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load tests from backend API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testPricingAPI.getAll();

        // Map backend data to frontend expected format
        const mappedTests = response.data.map((test: any) => ({
          id: test.id,
          name: test.test_name,
          code: test.test_code,
          category: test.category,
          description: test.description || "No description available",
          price: parseFloat(test.base_price) || 0,
          duration: test.turnaround_time || "Not specified",
          status: test.is_active ? "active" : "inactive",
          sampleType: test.sample_type,
          preparationInstructions: test.preparation_instructions,
          effectiveDate: test.effective_date,
          expiryDate: test.expiry_date,
          createdAt: test.created_at,
          updatedAt: test.updated_at,
          totalOrders: 0, // This would need to be calculated from actual orders
        }));

        setTests(mappedTests);
      } catch (error: any) {
        console.error("Error fetching tests:", error);
        setError(error.message || "Failed to load tests");
        // Set empty array when API fails
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      (test.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (test.code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (test.id?.toString() || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || test.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || test.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddTest = () => {
    setNewTest({
      test_name: "",
      category: "",
      test_code: "",
      description: "",
      base_price: 0,
      turnaround_time: "",
      sample_type: "",
      preparation_instructions: "",
    });
    setShowAddTestModal(true);
  };

  const handleViewTest = (test: any) => {
    setSelectedTest(test);
    setShowViewTestModal(true);
  };

  const handleEditTest = (test: any) => {
    setSelectedTest(test);
    setEditTest({
      test_name: test.name,
      category: test.category,
      test_code: test.code,
      description: test.description,
      base_price: test.price,
      turnaround_time: test.duration,
      sample_type: test.sampleType,
      preparation_instructions: test.preparationInstructions,
    });
    setShowEditTestModal(true);
  };

  const handleDeactivateTest = (test: any) => {
    setSelectedTest(test);
    setShowDeactivateModal(true);
  };

  const handleCreateTest = async () => {
    if (
      newTest.test_name &&
      newTest.category &&
      newTest.test_code &&
      newTest.base_price >= 0
    ) {
      try {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const tenantId = getCurrentTenantId();

        const testData = {
          ...newTest,
          base_price: parseFloat(newTest.base_price) || 0, // Ensure base_price is a number
          tenant: parseInt(tenantId), // Convert to integer for BigAutoField
          effective_date: new Date().toISOString().split("T")[0],
          is_active: true,
          currency: "USD",
          pricing_type: "standard",
        };

        const response = await testPricingAPI.create(testData);

        // Add the new test to the list
        const newTestItem = {
          id: response.data.test_pricing.id,
          name: response.data.test_pricing.test_name,
          code: response.data.test_pricing.test_code,
          category: response.data.test_pricing.category,
          description:
            response.data.test_pricing.description ||
            "No description available",
          price: parseFloat(response.data.test_pricing.base_price) || 0,
          duration:
            response.data.test_pricing.turnaround_time || "Not specified",
          status: response.data.test_pricing.is_active ? "active" : "inactive",
          sampleType: response.data.test_pricing.sample_type,
          preparationInstructions:
            response.data.test_pricing.preparation_instructions,
          effectiveDate: response.data.test_pricing.effective_date,
          expiryDate: response.data.test_pricing.expiry_date,
          createdAt: response.data.test_pricing.created_at,
          updatedAt: response.data.test_pricing.updated_at,
          totalOrders: 0,
        };

        setTests((prev: any) => [newTestItem, ...prev]);
        setShowAddTestModal(false);
        setSuccessMessage("Test created successfully!");
        setNewTest({
          test_name: "",
          category: "",
          test_code: "",
          description: "",
          base_price: 0,
          turnaround_time: "",
          sample_type: "",
          preparation_instructions: "",
        });
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error: any) {
        console.error("Error creating test:", error);

        let errorMessage = "Failed to create test";

        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateTest = async () => {
    if (
      selectedTest &&
      editTest.test_name &&
      editTest.category &&
      editTest.test_code &&
      editTest.base_price >= 0
    ) {
      try {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!selectedTest.id) {
          setError("Test ID is missing. Cannot update test.");
          return;
        }

        const updateData = {
          ...editTest,
          base_price: parseFloat(editTest.base_price) || 0, // Ensure base_price is a number
          tenant: parseInt(getCurrentTenantId()), // Convert to integer for BigAutoField
        };

        const response = await testPricingAPI.update(
          selectedTest.id,
          updateData
        );

        // Update the test in the list
        const updatedTest = {
          id: response.data.test_pricing.id,
          name: response.data.test_pricing.test_name,
          code: response.data.test_pricing.test_code,
          category: response.data.test_pricing.category,
          description:
            response.data.test_pricing.description ||
            "No description available",
          price: parseFloat(response.data.test_pricing.base_price) || 0,
          duration:
            response.data.test_pricing.turnaround_time || "Not specified",
          status: response.data.test_pricing.is_active ? "active" : "inactive",
          sampleType: response.data.test_pricing.sample_type,
          preparationInstructions:
            response.data.test_pricing.preparation_instructions,
          effectiveDate: response.data.test_pricing.effective_date,
          expiryDate: response.data.test_pricing.expiry_date,
          createdAt: response.data.test_pricing.created_at,
          updatedAt: response.data.test_pricing.updated_at,
          totalOrders: selectedTest.totalOrders,
        };

        setTests((prev: any) =>
          prev.map((test: any) =>
            test.id === selectedTest.id ? updatedTest : test
          )
        );
        setShowEditTestModal(false);
        setSelectedTest(null);
        setSuccessMessage("Test updated successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error: any) {
        console.error("Error updating test:", error);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to update test"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeactivateConfirm = async () => {
    if (selectedTest) {
      try {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const newStatus = selectedTest.status === "active" ? false : true;
        const updateData = {
          is_active: newStatus,
          tenant: parseInt(getCurrentTenantId()), // Convert to integer for BigAutoField
        };

        const response = await testPricingAPI.update(
          selectedTest.id,
          updateData
        );

        // Update the test status in the list
        setTests((prev: any) =>
          prev.map((test: any) =>
            test.id === selectedTest.id
              ? {
                  ...test,
                  status: newStatus ? "active" : "inactive",
                  updatedAt: response.data.test_pricing.updated_at,
                }
              : test
          )
        );
        setShowDeactivateModal(false);
        setSelectedTest(null);
        setSuccessMessage(
          `Test ${newStatus ? "activated" : "deactivated"} successfully!`
        );
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error: any) {
        console.error("Error updating test status:", error);
        setError(
          error.response?.data?.error ||
            error.message ||
            "Failed to update test status"
        );
      } finally {
        setLoading(false);
      }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Manage Tests
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Configure and manage available laboratory tests
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleAddTest}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
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

      {/* Success Display */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-green-400">✓</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Success
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                {successMessage}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by test name, code, or ID..."
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
            <option value="blood_tests">Blood Tests</option>
            <option value="urine_tests">Urine Tests</option>
            <option value="imaging">Imaging</option>
            <option value="microbiology">Microbiology</option>
            <option value="pathology">Pathology</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pulmonology">Pulmonology</option>
            <option value="endocrinology">Endocrinology</option>
            <option value="immunology">Immunology</option>
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

      {/* Tests Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Loading tests...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Duration
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Orders
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTests.map((test) => (
                  <tr
                    key={test.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {test.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          Code: {test.code}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {test.category} • {test.duration} • {test.totalOrders}{" "}
                          orders
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                          ID: {test.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                      {test.category}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${test.price.toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                      {test.duration}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          test.status
                        )}`}
                      >
                        {test.status
                          ? test.status.charAt(0).toUpperCase() +
                            test.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                      {test.totalOrders}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewTest(test)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditTest(test)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeactivateTest(test)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                        >
                          {test.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Test
              </h3>
              <button
                onClick={() => setShowAddTestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={newTest.test_name}
                    onChange={(e) =>
                      setNewTest({ ...newTest, test_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter test name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={newTest.category}
                    onChange={(e) =>
                      setNewTest({ ...newTest, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="blood_tests">Blood Tests</option>
                    <option value="urine_tests">Urine Tests</option>
                    <option value="imaging">Imaging</option>
                    <option value="microbiology">Microbiology</option>
                    <option value="pathology">Pathology</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pulmonology">Pulmonology</option>
                    <option value="endocrinology">Endocrinology</option>
                    <option value="immunology">Immunology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    value={newTest.test_code}
                    onChange={(e) =>
                      setNewTest({ ...newTest, test_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter test code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTest.base_price || ""}
                    onChange={(e) =>
                      setNewTest({
                        ...newTest,
                        base_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={newTest.turnaround_time}
                    onChange={(e) =>
                      setNewTest({
                        ...newTest,
                        turnaround_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 30 minutes, 2-4 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sample Type
                  </label>
                  <input
                    type="text"
                    value={newTest.sample_type}
                    onChange={(e) =>
                      setNewTest({ ...newTest, sample_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Blood sample (2ml)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTest.description}
                    onChange={(e) =>
                      setNewTest({ ...newTest, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter test description"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preparation Instructions
                  </label>
                  <textarea
                    value={newTest.preparation_instructions}
                    onChange={(e) =>
                      setNewTest({
                        ...newTest,
                        preparation_instructions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="e.g., Patient should fast for 12 hours before the test"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddTestModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTest}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Test Modal */}
      {showViewTestModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Test Details
              </h3>
              <button
                onClick={() => setShowViewTestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Code
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.code}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedTest.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.duration}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedTest.status
                    )}`}
                  >
                    {selectedTest.status
                      ? selectedTest.status.charAt(0).toUpperCase() +
                        selectedTest.status.slice(1)
                      : "Unknown"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Orders
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.totalOrders}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sample Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.sampleType || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preparation Instructions
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.preparationInstructions || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.updatedAt
                      ? new Date(selectedTest.updatedAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewTestModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {showEditTestModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Test
              </h3>
              <button
                onClick={() => setShowEditTestModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={editTest.test_name}
                    onChange={(e) =>
                      setEditTest({ ...editTest, test_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={editTest.category}
                    onChange={(e) =>
                      setEditTest({ ...editTest, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="blood_tests">Blood Tests</option>
                    <option value="urine_tests">Urine Tests</option>
                    <option value="imaging">Imaging</option>
                    <option value="microbiology">Microbiology</option>
                    <option value="pathology">Pathology</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pulmonology">Pulmonology</option>
                    <option value="endocrinology">Endocrinology</option>
                    <option value="immunology">Immunology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    value={editTest.test_code}
                    onChange={(e) =>
                      setEditTest({ ...editTest, test_code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editTest.base_price || ""}
                    onChange={(e) =>
                      setEditTest({
                        ...editTest,
                        base_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={editTest.turnaround_time}
                    onChange={(e) =>
                      setEditTest({
                        ...editTest,
                        turnaround_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sample Type
                  </label>
                  <input
                    type="text"
                    value={editTest.sample_type}
                    onChange={(e) =>
                      setEditTest({ ...editTest, sample_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editTest.description}
                    onChange={(e) =>
                      setEditTest({ ...editTest, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preparation Instructions
                  </label>
                  <textarea
                    value={editTest.preparation_instructions}
                    onChange={(e) =>
                      setEditTest({
                        ...editTest,
                        preparation_instructions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditTestModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTest}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate/Activate Modal */}
      {showDeactivateModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedTest.status === "active"
                  ? "Deactivate Test"
                  : "Activate Test"}
              </h3>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to{" "}
                {selectedTest.status === "active" ? "deactivate" : "activate"}{" "}
                the test <strong>"{selectedTest.name}"</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateConfirm}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedTest.status === "active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Power className="w-4 h-4 inline mr-2" />
                {loading
                  ? "Updating..."
                  : selectedTest.status === "active"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTests;
