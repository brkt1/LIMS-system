import {
  Plus,
  Search,
  Trash2,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { testPricingAPI } from "../../services/api";

const TestPricing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showAddPricingModal, setShowAddPricingModal] = useState(false);
  const [showViewPricingModal, setShowViewPricingModal] = useState(false);
  const [showEditPricingModal, setShowEditPricingModal] = useState(false);
  const [showDeletePricingModal, setShowDeletePricingModal] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<any>(null);

  // Form states
  const [newPricing, setNewPricing] = useState({
    testName: "",
    category: "",
    basePrice: 0,
    insurancePrice: 0,
    cashPrice: 0,
    description: "",
    turnaroundTime: "",
    requirements: "",
    code: "",
  });

  const [editPricing, setEditPricing] = useState({
    testName: "",
    category: "",
    basePrice: 0,
    insurancePrice: 0,
    cashPrice: 0,
    description: "",
    turnaroundTime: "",
    requirements: "",
    code: "",
  });

  // Test pricing state
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [testCategories, setTestCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Load pricing items from backend API
  useEffect(() => {
    const fetchPricingItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testPricingAPI.getAll();

        // Map backend data to frontend expected format
        const mappedPricingItems = response.data.map((item: any) => ({
          id: item.id,
          testName: item.test_name,
          category: item.category,
          basePrice: parseFloat(item.base_price),
          insurancePrice: parseFloat(item.base_price) * 0.8, // 20% discount for insurance
          cashPrice: parseFloat(item.base_price) * 0.9, // 10% discount for cash
          status: item.is_active ? "active" : "inactive",
          lastUpdated: item.updated_at ? item.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
          updatedBy: item.created_by || "System",
          turnaroundTime: item.turnaround_time || "24-48 hours",
          requirements: item.preparation_instructions || "",
          code: item.test_code,
        }));

        setPricingItems(mappedPricingItems);
      } catch (error: any) {
        console.error("Error fetching test pricing:", error);
        setError(error.message || "Failed to load test pricing");
        setPricingItems([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchTestCategories = async () => {
      try {
        const categoriesResponse = await testPricingAPI.getCategories();
        if (categoriesResponse.data.success) {
          setTestCategories(categoriesResponse.data.data);
        } else {
          throw new Error('Failed to load test categories');
        }
      } catch (error: any) {
        console.error("Error fetching test categories:", error);
        // Fallback to empty array if API fails
        setTestCategories([]);
      }
    };

    fetchPricingItems();
    fetchTestCategories();
  }, []);

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

  // Handler functions
  const handleAddPricing = () => {
    setNewPricing({
      testName: "",
      category: "",
      basePrice: 0,
      insurancePrice: 0,
      cashPrice: 0,
      description: "",
      turnaroundTime: "",
      requirements: "",
      code: "",
    });
    setShowAddPricingModal(true);
  };

  const handleViewPricing = (pricing: any) => {
    setSelectedPricing(pricing);
    setShowViewPricingModal(true);
  };

  const handleEditPricing = (pricing: any) => {
    setSelectedPricing(pricing);
    setEditPricing({
      testName: pricing.testName,
      category: pricing.category,
      basePrice: pricing.basePrice,
      insurancePrice: pricing.insurancePrice,
      cashPrice: pricing.cashPrice,
      description: pricing.description,
      turnaroundTime: pricing.turnaroundTime,
      requirements: pricing.requirements,
      code: pricing.code,
    });
    setShowEditPricingModal(true);
  };

  const handleDeletePricing = (pricing: any) => {
    setSelectedPricing(pricing);
    setShowDeletePricingModal(true);
  };

  const handleCreatePricing = () => {
    if (newPricing.testName && newPricing.category && newPricing.code) {
      const pricing = {
        id: `PRC${String(pricingItems.length + 1).padStart(3, "0")}`,
        ...newPricing,
        status: "active",
        lastUpdated: new Date().toISOString().split("T")[0],
        updatedBy: "Current User",
      };
      setPricingItems((prev: any) => [pricing, ...prev]);
      setShowAddPricingModal(false);
      setNewPricing({
        testName: "",
        category: "",
        basePrice: 0,
        insurancePrice: 0,
        cashPrice: 0,
        description: "",
        turnaroundTime: "",
        requirements: "",
        code: "",
      });
    }
  };

  const handleUpdatePricing = () => {
    if (
      selectedPricing &&
      editPricing.testName &&
      editPricing.category &&
      editPricing.code
    ) {
      setPricingItems((prev: any) =>
        prev.map((item: any) =>
          item.id === selectedPricing.id
            ? {
                ...item,
                ...editPricing,
                lastUpdated: new Date().toISOString().split("T")[0],
                updatedBy: "Current User",
              }
            : item
        )
      );
      setShowEditPricingModal(false);
      setSelectedPricing(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedPricing) {
      setPricingItems((prev: any) =>
        prev.filter((item: any) => item.id !== selectedPricing.id)
      );
      setShowDeletePricingModal(false);
      setSelectedPricing(null);
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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 dark:text-red-400 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading test pricing...</span>
        </div>
      )}

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
        <button
          onClick={handleAddPricing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
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
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.testName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {item.code}
                      </div>
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
                      <button
                        onClick={() => handleViewPricing(item)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditPricing(item)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePricing(item)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left"
                      >
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

      {/* Add Pricing Modal */}
      {showAddPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Pricing
              </h3>
              <button
                onClick={() => setShowAddPricingModal(false)}
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
                    value={newPricing.testName}
                    onChange={(e) =>
                      setNewPricing({ ...newPricing, testName: e.target.value })
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
                    value={newPricing.category}
                    onChange={(e) =>
                      setNewPricing({ ...newPricing, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {testCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    value={newPricing.code}
                    onChange={(e) =>
                      setNewPricing({ ...newPricing, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter test code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={newPricing.turnaroundTime}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        turnaroundTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 30 minutes, 2-4 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPricing.basePrice}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Insurance Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPricing.insurancePrice}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        insurancePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cash Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPricing.cashPrice}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        cashPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements
                  </label>
                  <input
                    type="text"
                    value={newPricing.requirements}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        requirements: e.target.value,
                      })
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
                    value={newPricing.description}
                    onChange={(e) =>
                      setNewPricing({
                        ...newPricing,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter test description"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddPricingModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePricing}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Pricing Modal */}
      {showViewPricingModal && selectedPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pricing Details
              </h3>
              <button
                onClick={() => setShowViewPricingModal(false)}
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
                    {selectedPricing.testName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Code
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.code}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pricing ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Base Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedPricing.basePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Insurance Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedPricing.insurancePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cash Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedPricing.cashPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedPricing.status
                    )}`}
                  >
                    {selectedPricing.status.charAt(0).toUpperCase() +
                      selectedPricing.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Turnaround Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.turnaroundTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requirements
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.requirements}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.lastUpdated}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Updated By
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.updatedBy}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedPricing.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewPricingModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pricing Modal */}
      {showEditPricingModal && selectedPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Pricing
              </h3>
              <button
                onClick={() => setShowEditPricingModal(false)}
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
                    value={editPricing.testName}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        testName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={editPricing.category}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Urinalysis">Urinalysis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Test Code *
                  </label>
                  <input
                    type="text"
                    value={editPricing.code}
                    onChange={(e) =>
                      setEditPricing({ ...editPricing, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={editPricing.turnaroundTime}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        turnaroundTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPricing.basePrice}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Insurance Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPricing.insurancePrice}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        insurancePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cash Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPricing.cashPrice}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        cashPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requirements
                  </label>
                  <input
                    type="text"
                    value={editPricing.requirements}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        requirements: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editPricing.description}
                    onChange={(e) =>
                      setEditPricing({
                        ...editPricing,
                        description: e.target.value,
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
                onClick={() => setShowEditPricingModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePricing}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Pricing Modal */}
      {showDeletePricingModal && selectedPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Pricing
              </h3>
              <button
                onClick={() => setShowDeletePricingModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete the pricing for{" "}
                <strong>"{selectedPricing.testName}"</strong>? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDeletePricingModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPricing;
