import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Edit,
  Headphones,
  Package,
  RotateCcw,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { inventoryAPI, supportTicketAPI } from "../../services/api";
import BaseDashboard from "./BaseDashboard";

const SupportDashboard: React.FC = () => {
  const { t } = useLanguage();

  // State management for modals
  const [showManageInventoryModal, setShowManageInventoryModal] =
    useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showUrgentOrderModal, setShowUrgentOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [updateData, setUpdateData] = useState({
    stockLevel: "",
    notes: "",
  });

  const [reorderData, setReorderData] = useState({
    quantity: "",
    supplier: "",
    expectedDate: "",
    notes: "",
  });

  const [urgentOrderData, setUrgentOrderData] = useState({
    quantity: "",
    supplier: "",
    priority: "urgent",
    notes: "",
  });

  // Inventory data state
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  // Support Tickets data state
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // Load data from API on component mount
  useEffect(() => {
    fetchInventory();
    fetchSupportTickets();
  }, []);

  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      setInventoryError(null);
      const response = await inventoryAPI.getItems();
      console.log("📦 Inventory fetched:", response.data);
      // Ensure response.data is an array
      const items = Array.isArray(response.data) ? response.data : [];
      setInventoryItems(items);
    } catch (err: any) {
      console.error("Error fetching inventory:", err);
      setInventoryError(err.message || "Failed to fetch inventory");
      // Fallback to empty array if API fails
      setInventoryItems([]);
    } finally {
      setInventoryLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      setTicketsLoading(true);
      setTicketsError(null);
      const response = await supportTicketAPI.getTickets();
      console.log("🎫 Support tickets fetched:", response.data);
      setSupportTickets(response.data);
    } catch (err: any) {
      console.error("Error fetching support tickets:", err);
      setTicketsError(err.message || "Failed to fetch support tickets");
    } finally {
      setTicketsLoading(false);
    }
  };

  // Handler functions
  const handleManageInventory = () => {
    setShowManageInventoryModal(true);
  };

  const handleUpdate = (item: any) => {
    setSelectedItem(item);
    setUpdateData({
      stockLevel: item.quantity?.toString() || "0",
      notes: "",
    });
    setShowUpdateModal(true);
  };

  const handleReorder = (item: any) => {
    setSelectedItem(item);
    setReorderData({
      quantity: "",
      supplier: "",
      expectedDate: "",
      notes: "",
    });
    setShowReorderModal(true);
  };

  const handleUrgentOrder = (item: any) => {
    setSelectedItem(item);
    setUrgentOrderData({
      quantity: "",
      supplier: "",
      priority: "urgent",
      notes: "",
    });
    setShowUrgentOrderModal(true);
  };

  const handleUpdateStock = async () => {
    if (selectedItem && updateData.stockLevel) {
      try {
        // Calculate the quantity adjustment
        const currentQuantity = selectedItem.quantity || 0;
        const newQuantity = parseInt(updateData.stockLevel);
        const adjustment = newQuantity - currentQuantity;

        // Use the adjust_quantity endpoint to update the inventory
        await inventoryAPI.adjustQuantity(selectedItem.id, {
          quantity: adjustment,
          transaction_type: "adjustment",
          notes:
            updateData.notes ||
            `Stock level updated from ${currentQuantity} to ${newQuantity}`,
        });

        // Refresh the inventory data
        await fetchInventory();

        // Close modal and reset form
        setShowUpdateModal(false);
        setSelectedItem(null);
        setUpdateData({ stockLevel: "", notes: "" });

        // Show success message (you could add a toast notification here)
        console.log("Stock updated successfully");
      } catch (error) {
        console.error("Error updating stock:", error);
        // You could add error handling/notification here
      }
    }
  };

  const handleReorderSubmit = async () => {
    if (selectedItem && reorderData.quantity) {
      try {
        // Create a reorder request using the inventory API
        await inventoryAPI.createReorderRequest({
          item: selectedItem.id,
          requested_quantity: parseInt(reorderData.quantity),
          status: "pending",
          requested_by: "Support Staff", // You could get this from user context
          notes:
            reorderData.notes || `Reorder request for ${selectedItem.name}`,
          tenant: selectedItem.tenant || "default",
        });

        // Close modal and reset form
        setShowReorderModal(false);
        setSelectedItem(null);
        setReorderData({
          quantity: "",
          supplier: "",
          expectedDate: "",
          notes: "",
        });

        // Show success message
        console.log("Reorder request created successfully");
      } catch (error) {
        console.error("Error creating reorder request:", error);
        // You could add error handling/notification here
      }
    }
  };

  const handleUrgentOrderSubmit = async () => {
    if (selectedItem && urgentOrderData.quantity) {
      try {
        // Create an urgent reorder request using the inventory API
        await inventoryAPI.createReorderRequest({
          item: selectedItem.id,
          requested_quantity: parseInt(urgentOrderData.quantity),
          status: "pending",
          requested_by: "Support Staff", // You could get this from user context
          notes: `URGENT: ${
            urgentOrderData.notes ||
            `Urgent reorder request for ${selectedItem.name}`
          }`,
          tenant: selectedItem.tenant || "default",
        });

        // Close modal and reset form
        setShowUrgentOrderModal(false);
        setSelectedItem(null);
        setUrgentOrderData({
          quantity: "",
          supplier: "",
          priority: "urgent",
          notes: "",
        });

        // Show success message
        console.log("Urgent order request created successfully");
      } catch (error) {
        console.error("Error creating urgent order request:", error);
        // You could add error handling/notification here
      }
    }
  };

  const getStatusFromStock = (stock: number) => {
    if (stock === 0) return t("support.outOfStock");
    if (stock < 10) return t("support.lowStock");
    return t("support.inStock");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
      case t("support.inStock"):
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "low-stock":
      case t("support.lowStock"):
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "out-of-stock":
      case t("support.outOfStock"):
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const supportCards = [
    {
      title: t("support.openTickets"),
      value: "23",
      change: `+5 ${t("support.today")}`,
      color: "bg-orange-500",
      chartData: [18, 20, 22, 21, 23, 22, 23],
    },
    {
      title: t("support.resolvedToday"),
      value: "18",
      change: `+3 ${t("support.thisWeek")}`,
      color: "bg-green-500",
      chartData: [12, 14, 15, 16, 17, 18, 18],
    },
    {
      title: t("support.avgResponseTime"),
      value: "2.3h",
      change: `-0.5h ${t("support.thisWeek")}`,
      color: "bg-blue-500",
      chartData: [3.2, 3.0, 2.8, 2.6, 2.4, 2.3, 2.3],
    },
    {
      title: t("support.customerSatisfaction"),
      value: "4.7/5",
      change: `+0.2 ${t("support.thisMonth")}`,
      color: "bg-purple-500",
      chartData: [4.3, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7],
    },
  ];

  return (
    <BaseDashboard>
      {/* Support specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {supportCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Headphones className="w-4 h-4 text-white" />}
                {index === 1 && <CheckCircle className="w-4 h-4 text-white" />}
                {index === 2 && <Clock className="w-4 h-4 text-white" />}
                {index === 3 && <TrendingUp className="w-4 h-4 text-white" />}
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

      {/* Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("support.recentSupportTickets")}
            </h3>
            <Headphones className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {ticketsLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("support.loadingSupportTickets")}
                  </p>
                </div>
              </div>
            ) : ticketsError ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Headphones className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {ticketsError}
                  </p>
                </div>
              </div>
            ) : supportTickets.length === 0 ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Headphones className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("support.noSupportTicketsAvailable")}
                  </p>
                </div>
              </div>
            ) : (
              supportTickets.slice(0, 5).map((ticket, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        ticket.priority === "High"
                          ? "bg-red-100 dark:bg-red-900"
                          : ticket.priority === "Medium"
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-green-100 dark:bg-green-900"
                      }`}
                    >
                      <AlertCircle
                        className={`w-4 h-4 ${
                          ticket.priority === "High"
                            ? "text-red-600 dark:text-red-400"
                            : ticket.priority === "Medium"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.id || `#${ticket.ticket_number || index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ticket.created_by || ticket.user || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.title || ticket.issue || "No title"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        ticket.status === "Open"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : ticket.status === "In Progress"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {ticket.created_at
                        ? new Date(ticket.created_at).toLocaleDateString()
                        : ticket.time || "Unknown time"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Notifications
            </h3>
            <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                type: "System",
                message: "Scheduled maintenance tonight at 2 AM",
                priority: "High",
                time: "1h ago",
              },
              {
                type: "Equipment",
                message: "Centrifuge Beta-2 requires calibration",
                priority: "Medium",
                time: "3h ago",
              },
              {
                type: "User",
                message: "New user registration: Dr. Emily Brown",
                priority: "Low",
                time: "5h ago",
              },
              {
                type: "System",
                message: "Backup completed successfully",
                priority: "Low",
                time: "8h ago",
              },
              {
                type: "Alert",
                message: "High CPU usage detected on server-02",
                priority: "High",
                time: "12h ago",
              },
            ].map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.priority === "High"
                        ? "bg-red-100 dark:bg-red-900"
                        : notification.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <Bell
                      className={`w-4 h-4 ${
                        notification.priority === "High"
                          ? "text-red-600 dark:text-red-400"
                          : notification.priority === "Medium"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      notification.priority === "High"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : notification.priority === "Medium"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}
                  >
                    {notification.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Status
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManageInventory}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Manage Inventory
            </button>
            <Package className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Item
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Stock Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Last Updated
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventoryLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Loading inventory...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : inventoryError ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center">
                    <div className="text-center">
                      <Package className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {inventoryError}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : inventoryItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center">
                    <div className="text-center">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No inventory items available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventoryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {item.category_name || item.category}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {item.quantity} units
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {new Date(
                        item.updated_at || item.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdate(item)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                        {(item.status === "low-stock" ||
                          item.status === "Low Stock") && (
                          <button
                            onClick={() => handleReorder(item)}
                            className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reorder</span>
                          </button>
                        )}
                        {(item.status === "out-of-stock" ||
                          item.status === "Out of Stock") && (
                          <button
                            onClick={() => handleUrgentOrder(item)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>Urgent Order</span>
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

      {/* Manage Inventory Modal */}
      {showManageInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Manage Inventory
              </h2>
              <button
                onClick={() => setShowManageInventoryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Item
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Stock Level
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Last Updated
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {inventoryLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Loading inventory...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : inventoryError ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center">
                          <div className="text-center">
                            <Package className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-sm text-red-500 dark:text-red-400">
                              {inventoryError}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : inventoryItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center">
                          <div className="text-center">
                            <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No inventory items available
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      inventoryItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                            {item.category_name || item.category}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                            {item.quantity} units
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                            {new Date(
                              item.updated_at || item.created_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUpdate(item)}
                                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Update</span>
                              </button>
                              {(item.status === "low-stock" ||
                                item.status === "Low Stock") && (
                                <button
                                  onClick={() => handleReorder(item)}
                                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Reorder</span>
                                </button>
                              )}
                              {(item.status === "out-of-stock" ||
                                item.status === "Out of Stock") && (
                                <button
                                  onClick={() => handleUrgentOrder(item)}
                                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Urgent Order</span>
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
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowManageInventoryModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Update Stock Level
              </h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Item Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{selectedItem.name}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Category:{" "}
                  {selectedItem.category_name || selectedItem.category}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Stock: {selectedItem.quantity} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Stock Level
                </label>
                <input
                  type="number"
                  value={updateData.stockLevel}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, stockLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter new stock level"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any notes about this update"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showReorderModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Reorder Item
              </h2>
              <button
                onClick={() => setShowReorderModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Item Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{selectedItem.name}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Stock: {selectedItem.stockLevel} units (Low Stock)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity to Order
                </label>
                <input
                  type="number"
                  value={reorderData.quantity}
                  onChange={(e) =>
                    setReorderData({ ...reorderData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter quantity to order"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={reorderData.supplier}
                  onChange={(e) =>
                    setReorderData({ ...reorderData, supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={reorderData.expectedDate}
                  onChange={(e) =>
                    setReorderData({
                      ...reorderData,
                      expectedDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={reorderData.notes}
                  onChange={(e) =>
                    setReorderData({ ...reorderData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any notes about this reorder"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowReorderModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReorderSubmit}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Submit Reorder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Order Modal */}
      {showUrgentOrderModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Urgent Order
              </h2>
              <button
                onClick={() => setShowUrgentOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="font-medium text-red-900 dark:text-red-200 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Urgent Order Required
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>{selectedItem.name}</strong> is currently out of stock
                  and needs immediate attention.
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Current Stock: {selectedItem.stockLevel} units
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity to Order
                </label>
                <input
                  type="number"
                  value={urgentOrderData.quantity}
                  onChange={(e) =>
                    setUrgentOrderData({
                      ...urgentOrderData,
                      quantity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter quantity to order"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={urgentOrderData.supplier}
                  onChange={(e) =>
                    setUrgentOrderData({
                      ...urgentOrderData,
                      supplier: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={urgentOrderData.priority}
                  onChange={(e) =>
                    setUrgentOrderData({
                      ...urgentOrderData,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={urgentOrderData.notes}
                  onChange={(e) =>
                    setUrgentOrderData({
                      ...urgentOrderData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any notes about this urgent order"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowUrgentOrderModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUrgentOrderSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Submit Urgent Order
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseDashboard>
  );
};

export default SupportDashboard;
