import {
  AlertTriangle,
  Box,
  Edit,
  Eye,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State management for modals
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showViewItemModal, setShowViewItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    minQuantity: "",
    maxQuantity: "",
    unit: "",
    supplier: "",
    cost: "",
    location: "",
    expiryDate: "",
  });

  const [editItem, setEditItem] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    minQuantity: "",
    maxQuantity: "",
    unit: "",
    supplier: "",
    cost: "",
    location: "",
    expiryDate: "",
  });

  // Inventory data state
  const [inventoryItems, setInventoryItems] = useState([
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
  ]);

  // Load inventory from localStorage on component mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("supportInventoryItems");
    if (savedInventory) {
      setInventoryItems(JSON.parse(savedInventory));
    }
  }, []);

  // Save inventory to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem(
      "supportInventoryItems",
      JSON.stringify(inventoryItems)
    );
  }, [inventoryItems]);

  // Handler functions
  const handleAddItem = () => {
    setNewItem({
      name: "",
      category: "",
      description: "",
      quantity: "",
      minQuantity: "",
      maxQuantity: "",
      unit: "",
      supplier: "",
      cost: "",
      location: "",
      expiryDate: "",
    });
    setShowAddItemModal(true);
  };

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setShowViewItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setEditItem({
      name: item.name,
      category: item.category,
      description: item.description,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      maxQuantity: item.maxQuantity.toString(),
      unit: item.unit,
      supplier: item.supplier,
      cost: item.cost.toString(),
      location: item.location,
      expiryDate: item.expiryDate,
    });
    setShowEditItemModal(true);
  };

  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setShowDeleteItemModal(true);
  };

  const handleCreateItem = () => {
    const newItemData = {
      id: `INV${String(inventoryItems.length + 1).padStart(3, "0")}`,
      name: newItem.name,
      category: newItem.category,
      description: newItem.description,
      quantity: parseInt(newItem.quantity) || 0,
      minQuantity: parseInt(newItem.minQuantity) || 0,
      maxQuantity: parseInt(newItem.maxQuantity) || 0,
      unit: newItem.unit,
      supplier: newItem.supplier,
      cost: parseFloat(newItem.cost) || 0,
      status: getQuantityStatus({
        quantity: parseInt(newItem.quantity) || 0,
        minQuantity: parseInt(newItem.minQuantity) || 0,
      }),
      location: newItem.location,
      lastUpdated: new Date().toLocaleDateString(),
      expiryDate: newItem.expiryDate,
    };
    setInventoryItems([newItemData, ...inventoryItems]);
    setShowAddItemModal(false);
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      const updatedItems = inventoryItems.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: editItem.name,
              category: editItem.category,
              description: editItem.description,
              quantity: parseInt(editItem.quantity) || 0,
              minQuantity: parseInt(editItem.minQuantity) || 0,
              maxQuantity: parseInt(editItem.maxQuantity) || 0,
              unit: editItem.unit,
              supplier: editItem.supplier,
              cost: parseFloat(editItem.cost) || 0,
              status: getQuantityStatus({
                quantity: parseInt(editItem.quantity) || 0,
                minQuantity: parseInt(editItem.minQuantity) || 0,
              }),
              location: editItem.location,
              lastUpdated: new Date().toLocaleDateString(),
              expiryDate: editItem.expiryDate,
            }
          : item
      );
      setInventoryItems(updatedItems);
      setShowEditItemModal(false);
      setSelectedItem(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      const updatedItems = inventoryItems.filter(
        (item) => item.id !== selectedItem.id
      );
      setInventoryItems(updatedItems);
      setShowDeleteItemModal(false);
      setSelectedItem(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Category",
        "Description",
        "Quantity",
        "Unit",
        "Status",
        "Location",
        "Supplier",
        "Cost",
        "Last Updated",
        "Expiry Date",
      ],
      ...inventoryItems.map((item) => [
        item.id,
        item.name,
        item.category,
        item.description,
        item.quantity,
        item.unit,
        getStatusText(getQuantityStatus(item)),
        item.location,
        item.supplier,
        item.cost,
        item.lastUpdated,
        item.expiryDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "low_stock":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "out_of_stock":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
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
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.quantity * item.cost,
    0
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor and manage laboratory inventory and supplies
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center"
          >
            <Package className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, description, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                Total Items
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {totalItems}
              </p>
            </div>
            <Box className="w-6 h-6 text-primary-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                In Stock
              </p>
              <p className="text-lg font-bold text-green-600">{inStockItems}</p>
            </div>
            <Package className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                Low Stock
              </p>
              <p className="text-lg font-bold text-yellow-600">
                {lowStockItems}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                Total Value
              </p>
              <p className="text-lg font-bold text-blue-600">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <Box className="w-6 h-6 text-blue-600 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Supplier
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Cost
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
                          {item.id}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                          {item.category} • {item.location}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block lg:hidden">
                          {item.supplier} • ${item.cost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.quantity} {item.unit}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      Min: {item.minQuantity} | Max: {item.maxQuantity}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        getQuantityStatus(item)
                      )}`}
                    >
                      {getStatusText(getQuantityStatus(item))}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    {item.location}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {item.supplier}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewItem(item)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
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
          <Package className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No inventory items found matching your search criteria.
          </p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Add New Item
              </h2>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Safety">Safety</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={newItem.minQuantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, minQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={newItem.maxQuantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, maxQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., pieces, boxes, bottles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.cost}
                    onChange={(e) =>
                      setNewItem({ ...newItem, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={newItem.supplier}
                    onChange={(e) =>
                      setNewItem({ ...newItem, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter storage location"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) =>
                    setNewItem({ ...newItem, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Item Details - {selectedItem.id}
              </h2>
              <button
                onClick={() => setShowViewItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedItem.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {selectedItem.category}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      getQuantityStatus(selectedItem)
                    )}`}
                  >
                    {getStatusText(getQuantityStatus(selectedItem))}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Quantity
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Quantity
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.minQuantity} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Quantity
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.maxQuantity} {selectedItem.unit}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.supplier}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedItem.cost.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.lastUpdated}
                  </p>
                </div>
              </div>
              {selectedItem.expiryDate && selectedItem.expiryDate !== "N/A" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.expiryDate}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowViewItemModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Edit Item - {selectedItem.id}
              </h2>
              <button
                onClick={() => setShowEditItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={editItem.category}
                    onChange={(e) =>
                      setEditItem({ ...editItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Safety">Safety</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter item description"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={editItem.quantity}
                    onChange={(e) =>
                      setEditItem({ ...editItem, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    value={editItem.minQuantity}
                    onChange={(e) =>
                      setEditItem({ ...editItem, minQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Quantity
                  </label>
                  <input
                    type="number"
                    value={editItem.maxQuantity}
                    onChange={(e) =>
                      setEditItem({ ...editItem, maxQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={editItem.unit}
                    onChange={(e) =>
                      setEditItem({ ...editItem, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., pieces, boxes, bottles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.cost}
                    onChange={(e) =>
                      setEditItem({ ...editItem, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={editItem.supplier}
                    onChange={(e) =>
                      setEditItem({ ...editItem, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editItem.location}
                    onChange={(e) =>
                      setEditItem({ ...editItem, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter storage location"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={editItem.expiryDate}
                  onChange={(e) =>
                    setEditItem({ ...editItem, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowEditItemModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Modal */}
      {showDeleteItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Delete Item
              </h2>
              <button
                onClick={() => setShowDeleteItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                <h3 className="font-medium text-red-900 dark:text-red-200 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Confirm Deletion
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Are you sure you want to delete{" "}
                  <strong>{selectedItem.name}</strong>? This action cannot be
                  undone.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Item Details:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>ID:</strong> {selectedItem.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Category:</strong> {selectedItem.category}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Quantity:</strong> {selectedItem.quantity}{" "}
                  {selectedItem.unit}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Location:</strong> {selectedItem.location}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDeleteItemModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
