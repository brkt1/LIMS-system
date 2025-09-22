import {
  AlertTriangle,
  Box,
  Edit,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const inventoryItems = [
    {
      id: "INV001",
      name: "Blood Collection Tubes",
      category: "Consumables",
      description: "Sterile blood collection tubes for laboratory testing",
      quantity: 150,
      minQuantity: 50,
      maxQuantity: 500,
      unit: "pieces",
      supplier: "MedSupply Inc.",
      cost: 2.5,
      status: "in_stock",
      location: "Storage Room A",
      lastUpdated: "2025-01-22",
      expiryDate: "2026-12-31",
    },
    {
      id: "INV002",
      name: "Microscope Slides",
      category: "Equipment",
      description: "Glass slides for microscopic examination",
      quantity: 25,
      minQuantity: 20,
      maxQuantity: 100,
      unit: "boxes",
      supplier: "LabTech Solutions",
      cost: 15.0,
      status: "low_stock",
      location: "Lab Room 1",
      lastUpdated: "2025-01-20",
      expiryDate: "N/A",
    },
    {
      id: "INV003",
      name: "Chemical Reagents",
      category: "Chemicals",
      description: "Various chemical reagents for testing procedures",
      quantity: 0,
      minQuantity: 10,
      maxQuantity: 50,
      unit: "bottles",
      supplier: "ChemCorp",
      cost: 45.0,
      status: "out_of_stock",
      location: "Chemical Storage",
      lastUpdated: "2025-01-18",
      expiryDate: "2025-06-30",
    },
    {
      id: "INV004",
      name: "Disposable Gloves",
      category: "Safety",
      description: "Nitrile gloves for laboratory safety",
      quantity: 200,
      minQuantity: 100,
      maxQuantity: 1000,
      unit: "boxes",
      supplier: "SafetyFirst",
      cost: 8.5,
      status: "in_stock",
      location: "Storage Room B",
      lastUpdated: "2025-01-21",
      expiryDate: "2027-03-15",
    },
    {
      id: "INV005",
      name: "Test Strips",
      category: "Consumables",
      description: "Diagnostic test strips for various tests",
      quantity: 75,
      minQuantity: 30,
      maxQuantity: 200,
      unit: "packs",
      supplier: "DiagnosticPro",
      cost: 12.0,
      status: "in_stock",
      location: "Lab Room 2",
      lastUpdated: "2025-01-19",
      expiryDate: "2025-09-30",
    },
    {
      id: "INV006",
      name: "Centrifuge Machine",
      category: "Equipment",
      description: "Laboratory centrifuge for sample processing",
      quantity: 2,
      minQuantity: 1,
      maxQuantity: 5,
      unit: "units",
      supplier: "LabEquipment Co.",
      cost: 2500.0,
      status: "in_stock",
      location: "Lab Room 1",
      lastUpdated: "2025-01-15",
      expiryDate: "N/A",
    },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      default:
        return status;
    }
  };

  const getQuantityStatus = (item: any) => {
    if (item.quantity === 0) return "out_of_stock";
    if (item.quantity <= item.minQuantity) return "low_stock";
    return "in_stock";
  };

  const categories = [
    "all",
    ...Array.from(new Set(inventoryItems.map((item) => item.category))),
  ];

  const statuses = [
    "all",
    ...Array.from(new Set(inventoryItems.map((item) => item.status))),
  ];

  const totalItems = inventoryItems.length;
  const inStockItems = inventoryItems.filter(
    (item) => item.status === "in_stock"
  ).length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.status === "low_stock"
  ).length;
  const outOfStockItems = inventoryItems.filter(
    (item) => item.status === "out_of_stock"
  ).length;
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.quantity * item.cost,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage laboratory inventory and supplies
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Package className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
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
              placeholder="Search by name, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : getStatusText(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <Box className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {inStockItems}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockItems}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <Box className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {item.minQuantity} | Max: {item.maxQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        getQuantityStatus(item)
                      )}`}
                    >
                      {getStatusText(getQuantityStatus(item))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No inventory items found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
