import {
    AlertTriangle,
    Package,
    Package2,
    Plus,
    Search,
    TrendingDown,
    TrendingUp,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { inventoryAPI } from "../../services/api";

const InventoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showViewItemModal, setShowViewItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    sku: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    unitPrice: 0,
    supplier: "",
    expiryDate: "",
  });

  const [editItem, setEditItem] = useState({
    name: "",
    category: "",
    sku: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    unitPrice: 0,
    supplier: "",
    expiryDate: "",
  });

  const [restockData, setRestockData] = useState({
    quantity: 0,
    supplier: "",
    cost: 0,
    notes: "",
  });

  // Dynamic inventory state
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load inventory from backend API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [itemsResponse, categoriesResponse, suppliersResponse] =
          await Promise.all([
            inventoryAPI.getItems(),
            inventoryAPI.getCategories(),
            inventoryAPI.getSuppliers(),
          ]);

        // Set categories and suppliers
        setCategories(categoriesResponse.data);
        setSuppliers(suppliersResponse.data);

        // Map backend data to frontend expected format
        const mappedItems = itemsResponse.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category_name || "Uncategorized",
          sku: `SKU-${item.id}`, // Generate SKU from ID since backend doesn't have it
          currentStock: item.quantity || 0,
          minStock: item.threshold || 0,
          maxStock: (item.threshold || 0) * 3, // Estimate max stock
          unit: "pieces", // Default unit
          unitPrice: 0, // Default price since backend doesn't have it
          supplier: item.supplier_name || "Unknown Supplier",
          lastRestocked: item.created_at
            ? new Date(item.created_at).toISOString().split("T")[0]
            : "Unknown",
          expiryDate: "N/A", // Backend doesn't have expiry date
          status: item.status || "unknown",
        }));

        setInventoryItems(mappedItems);
      } catch (error: any) {
        console.error("Error fetching inventory:", error);
        setError(error.message || "Failed to load inventory");
        // Set empty array when API fails
        setInventoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return "Out of Stock";
    if (current <= min) return "Low Stock";
    return "In Stock";
  };

  const getStockIcon = (current: number, min: number) => {
    if (current === 0)
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    if (current <= min)
      return <TrendingDown className="w-4 h-4 text-yellow-600" />;
    return <TrendingUp className="w-4 h-4 text-green-600" />;
  };

  // Handler functions
  const handleAddItem = () => {
    setNewItem({
      name: "",
      category: "",
      sku: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "",
      unitPrice: 0,
      supplier: "",
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
      sku: item.sku,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      unit: item.unit,
      unitPrice: item.unitPrice,
      supplier: item.supplier,
      expiryDate: item.expiryDate,
    });
    setShowEditItemModal(true);
  };

  const handleRestockItem = (item: any) => {
    setSelectedItem(item);
    setRestockData({
      quantity: 0,
      supplier: item.supplier,
      cost: 0,
      notes: "",
    });
    setShowRestockModal(true);
  };

  const handleCreateItem = async () => {
    if (newItem.name && newItem.category) {
      try {
        // Find category and supplier IDs
        const selectedCategory = categories.find(
          (cat) => cat.name === newItem.category
        );
        const selectedSupplier = suppliers.find(
          (sup) => sup.name === newItem.supplier
        );

        const itemData = {
          name: newItem.name,
          category: selectedCategory?.id || 1, // Default to first category if not found
          quantity: newItem.currentStock || 0,
          threshold: newItem.minStock || 0,
          status: newItem.currentStock === 0 ? "out-of-stock" : "in-stock",
          supplier: selectedSupplier?.id || 1, // Default to first supplier if not found
          location: "Main Storage", // Default location
        };

        const response = await inventoryAPI.createItem(itemData);
        const createdItem = response.data;

        // Map backend response to frontend format
        const mappedItem = {
          id: createdItem.id,
          name: createdItem.name,
          category: createdItem.category_name || createdItem.category,
          sku: `SKU-${createdItem.id}`,
          currentStock: createdItem.quantity || 0,
          minStock: createdItem.threshold || 0,
          maxStock: (createdItem.threshold || 0) * 3,
          unit: "pieces",
          unitPrice: 0,
          supplier: createdItem.supplier_name || "Unknown Supplier",
          lastRestocked: new Date().toISOString().split("T")[0],
          expiryDate: "N/A",
          status: createdItem.status || "in-stock",
        };

        setInventoryItems((prev: any) => [mappedItem, ...prev]);
        setShowAddItemModal(false);
        setNewItem({
          name: "",
          category: "",
          sku: "",
          currentStock: 0,
          minStock: 0,
          maxStock: 0,
          unit: "",
          unitPrice: 0,
          supplier: "",
          expiryDate: "",
        });
      } catch (error: any) {
        console.error("Error creating item:", error);
        setError(error.message || "Failed to create item");
      }
    }
  };

  const handleUpdateItem = async () => {
    if (selectedItem && editItem.name && editItem.category) {
      try {
        const itemData = {
          name: editItem.name,
          category_name: editItem.category,
          quantity: editItem.currentStock || 0,
          threshold: editItem.minStock || 0,
          status: editItem.currentStock === 0 ? "out-of-stock" : "in-stock",
          supplier_name: editItem.supplier || "Unknown Supplier",
          location: "Main Storage",
        };

        const response = await inventoryAPI.updateItem(
          selectedItem.id,
          itemData
        );
        const updatedItem = response.data;

        // Map backend response to frontend format
        const mappedItem = {
          id: updatedItem.id,
          name: updatedItem.name,
          category: updatedItem.category_name || updatedItem.category,
          sku: `SKU-${updatedItem.id}`,
          currentStock: updatedItem.quantity || 0,
          minStock: updatedItem.threshold || 0,
          maxStock: (updatedItem.threshold || 0) * 3,
          unit: "pieces",
          unitPrice: 0,
          supplier: updatedItem.supplier_name || "Unknown Supplier",
          lastRestocked: selectedItem.lastRestocked,
          expiryDate: "N/A",
          status: updatedItem.status || "in-stock",
        };

        setInventoryItems((prev: any) =>
          prev.map((item: any) =>
            item.id === selectedItem.id ? mappedItem : item
          )
        );
        setShowEditItemModal(false);
        setSelectedItem(null);
      } catch (error: any) {
        console.error("Error updating item:", error);
        setError(error.message || "Failed to update item");
      }
    }
  };

  const handleRestockConfirm = async () => {
    if (selectedItem && restockData.quantity > 0) {
      try {
        const newStock = selectedItem.currentStock + restockData.quantity;
        const itemData = {
          name: selectedItem.name,
          category_name: selectedItem.category,
          quantity: newStock,
          threshold: selectedItem.minStock,
          status: newStock === 0 ? "out-of-stock" : "in-stock",
          supplier_name: restockData.supplier || selectedItem.supplier,
          location: "Main Storage",
        };

        const response = await inventoryAPI.updateItem(
          selectedItem.id,
          itemData
        );
        const updatedItem = response.data;

        // Map backend response to frontend format
        const mappedItem = {
          id: updatedItem.id,
          name: updatedItem.name,
          category: updatedItem.category_name || updatedItem.category,
          sku: `SKU-${updatedItem.id}`,
          currentStock: updatedItem.quantity || 0,
          minStock: updatedItem.threshold || 0,
          maxStock: (updatedItem.threshold || 0) * 3,
          unit: "pieces",
          unitPrice: 0,
          supplier: updatedItem.supplier_name || "Unknown Supplier",
          lastRestocked: new Date().toISOString().split("T")[0],
          expiryDate: "N/A",
          status: updatedItem.status || "in-stock",
        };

        setInventoryItems((prev: any) =>
          prev.map((item: any) =>
            item.id === selectedItem.id ? mappedItem : item
          )
        );
        setShowRestockModal(false);
        setSelectedItem(null);
        setRestockData({
          quantity: 0,
          supplier: "",
          cost: 0,
          notes: "",
        });
      } catch (error: any) {
        console.error("Error restocking item:", error);
        setError(error.message || "Failed to restock item");
      }
    }
  };

  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + (item.currentStock || 0) * (item.unitPrice || 0),
    0
  );
  const lowStockItems = inventoryItems.filter(
    (item) => item.currentStock <= item.minStock && item.currentStock > 0
  ).length;
  const outOfStockItems = inventoryItems.filter(
    (item) => item.currentStock === 0
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your laboratory supplies, equipment, and test kits
          </p>
        </div>
        <div className="flex-shrink-0">
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
              placeholder="Search by name, SKU, or item ID..."
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
            <option value="all">All Categories</option>
            <option value="Supplies">Supplies</option>
            <option value="Test Kits">Test Kits</option>
            <option value="Imaging">Imaging</option>
            <option value="Equipment">Equipment</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventoryItems.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Value
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {lowStockItems}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-red-600">
                {outOfStockItems}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Unit Price
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Supplier
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Expiry Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {item.sku}
                      </div>
                      <div className="text-xs text-gray-400 sm:hidden">
                        {item.category} • ${(item.unitPrice || 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        ID: {item.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                    {item.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStockIcon(item.currentStock, item.minStock)}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          Min: {item.minStock}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        getStockStatus(item.currentStock, item.minStock)
                          .toLowerCase()
                          .replace(" ", "-")
                      )}`}
                    >
                      {getStockStatus(item.currentStock, item.minStock)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden md:table-cell">
                    ${(item.unitPrice || 0).toFixed(2)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {item.supplier}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden lg:table-cell">
                    {item.expiryDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewItem(item)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRestockItem(item)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Item
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) =>
                      setNewItem({ ...newItem, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter SKU"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., pieces, boxes, kits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={newItem.currentStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        currentStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    value={newItem.minStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        minStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Stock
                  </label>
                  <input
                    type="number"
                    value={newItem.maxStock}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        maxStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.unitPrice}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supplier
                  </label>
                  <select
                    value={newItem.supplier}
                    onChange={(e) =>
                      setNewItem({ ...newItem, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) =>
                      setNewItem({ ...newItem, expiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Item Details
              </h3>
              <button
                onClick={() => setShowViewItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SKU
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.sku}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Item ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.currentStock} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedItem.status
                    )}`}
                  >
                    {getStockStatus(
                      selectedItem.currentStock,
                      selectedItem.minStock
                    )}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.minStock} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Stock
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.maxStock} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit Price
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${(selectedItem.unitPrice || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Value
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    $
                    {(
                      (selectedItem.currentStock || 0) *
                      (selectedItem.unitPrice || 0)
                    ).toFixed(2)}
                  </p>
                </div>
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
                    Last Restocked
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.lastRestocked}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedItem.expiryDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Item
              </h3>
              <button
                onClick={() => setShowEditItemModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={editItem.category}
                    onChange={(e) =>
                      setEditItem({ ...editItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Supplies">Supplies</option>
                    <option value="Test Kits">Test Kits</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={editItem.sku}
                    onChange={(e) =>
                      setEditItem({ ...editItem, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={editItem.unit}
                    onChange={(e) =>
                      setEditItem({ ...editItem, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={editItem.currentStock}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        currentStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    value={editItem.minStock}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        minStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Stock
                  </label>
                  <input
                    type="number"
                    value={editItem.maxStock}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        maxStock: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editItem.unitPrice}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={editItem.supplier}
                    onChange={(e) =>
                      setEditItem({ ...editItem, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editItem.expiryDate}
                    onChange={(e) =>
                      setEditItem({ ...editItem, expiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditItemModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Restock Item
              </h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedItem.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Stock: {selectedItem.currentStock} {selectedItem.unit}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  SKU: {selectedItem.sku}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  value={restockData.quantity}
                  onChange={(e) =>
                    setRestockData({
                      ...restockData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={restockData.supplier}
                  onChange={(e) =>
                    setRestockData({ ...restockData, supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={restockData.cost}
                  onChange={(e) =>
                    setRestockData({
                      ...restockData,
                      cost: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  placeholder="Enter cost"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={restockData.notes}
                  onChange={(e) =>
                    setRestockData({ ...restockData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter any notes about this restock"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRestockModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Package2 className="w-4 h-4 inline mr-2" />
                Restock Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
