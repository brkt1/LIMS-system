import {
  Edit,
  Eye,
  Plus,
  Receipt,
  Search,
  Trash2,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { accountingAPI } from "../../services/api";
import { getCurrentTenantId, getCurrentUserId } from "../../utils/helpers";

const Accounting: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Modal states
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showViewEntryModal, setShowViewEntryModal] = useState(false);
  const [showEditEntryModal, setShowEditEntryModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Form states
  const [newEntry, setNewEntry] = useState({
    description: "",
    type: "",
    category: "",
    amount: "",
    paymentMethod: "",
    reference: "",
    account: "",
  });

  const [editEntry, setEditEntry] = useState({
    description: "",
    type: "",
    category: "",
    amount: "",
    paymentMethod: "",
    reference: "",
    account: "",
  });

  // Accounting transactions state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financialSummary, setFinancialSummary] = useState<any>(null);


  // Load transactions from backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters based on filters
        const params: any = {};
        if (filterType !== "all") {
          params.entry_type = filterType;
        }
        if (filterPeriod !== "all") {
          const now = new Date();
          switch (filterPeriod) {
            case "today":
              params.date = now.toISOString().split('T')[0];
              break;
            case "week":
              const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
              params.date__gte = weekStart.toISOString().split('T')[0];
              break;
            case "month":
              const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
              params.date__gte = monthStart.toISOString().split('T')[0];
              break;
            case "quarter":
              const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
              params.date__gte = quarterStart.toISOString().split('T')[0];
              break;
          }
        }
        if (searchTerm) {
          params.search = searchTerm;
        }

        const response = await accountingAPI.getAll(params);

        // Map backend data to frontend expected format
        const mappedTransactions = response.data.results ? response.data.results.map((item: any) => ({
          id: item.id,
          date: item.date,
          description: item.description,
          type: item.entry_type,
          category: item.category,
          amount: parseFloat(item.amount),
          paymentMethod: item.payment_method,
          reference: item.reference_number || "",
          status: "completed", // Default status
          account: item.account,
          notes: item.notes || "",
          created_at: item.created_at,
          updated_at: item.updated_at,
        })) : [];

        setTransactions(mappedTransactions);
      } catch (error: any) {
        console.error("Error fetching accounting transactions:", error);
        setError(error.response?.data?.detail || error.message || "Failed to load accounting transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filterType, filterPeriod, searchTerm]);

  // Load financial summary
  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const response = await accountingAPI.getFinancialSummary();
        setFinancialSummary(response.data);
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      }
    };

    fetchFinancialSummary();
  }, [transactions]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return "bg-green-100 text-green-800";
      case "expense":
        return "bg-red-100 text-red-800";
      case "transfer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddEntry = () => {
    setNewEntry({
      description: "",
      type: "",
      category: "",
      amount: "",
      paymentMethod: "",
      reference: "",
      account: "",
    });
    setShowAddEntryModal(true);
  };

  const handleViewEntry = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowViewEntryModal(true);
  };

  const handleEditEntry = (transaction: any) => {
    setSelectedTransaction(transaction);
    setEditEntry({
      description: transaction.description,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      paymentMethod: transaction.paymentMethod,
      reference: transaction.reference,
      account: transaction.account,
    });
    setShowEditEntryModal(true);
  };

  const handleReceipt = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const handleDeleteEntry = async (transactionId: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await accountingAPI.delete(transactionId);
      
      // Remove the transaction from the list
      setTransactions((prev: any) => prev.filter((t: any) => t.id !== transactionId));
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      setError(error.response?.data?.detail || error.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    // Validate form data
    if (!newEntry.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!newEntry.type) {
      setError("Type is required");
      return;
    }
    if (!newEntry.category.trim()) {
      setError("Category is required");
      return;
    }
    if (!newEntry.amount || parseFloat(newEntry.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!newEntry.paymentMethod) {
      setError("Payment method is required");
      return;
    }
    if (!newEntry.account.trim()) {
      setError("Account is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for backend
      const transactionData = {
        description: newEntry.description.trim(),
        entry_type: newEntry.type,
        category: newEntry.category.trim(),
        amount: parseFloat(newEntry.amount),
        payment_method: newEntry.paymentMethod,
        reference_number: newEntry.reference.trim(),
        account: newEntry.account.trim(),
        date: new Date().toISOString().split("T")[0],
        notes: "",
        tenant: getCurrentTenantId(), // Dynamic tenant
        created_by: getCurrentUserId(), // Dynamic user
      };

      const response = await accountingAPI.create(transactionData);
      
      // Add the new transaction to the list
      const newTransaction = {
        id: response.data.id,
        date: response.data.date,
        description: response.data.description,
        type: response.data.entry_type,
        category: response.data.category,
        amount: parseFloat(response.data.amount),
        paymentMethod: response.data.payment_method,
        reference: response.data.reference_number || "",
        status: "completed",
        account: response.data.account,
        notes: response.data.notes || "",
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };
      
      setTransactions((prev: any) => [newTransaction, ...prev]);
      setShowAddEntryModal(false);
      
      // Reset form
      setNewEntry({
        description: "",
        type: "",
        category: "",
        amount: "",
        paymentMethod: "",
        reference: "",
        account: "",
      });
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      setError(error.response?.data?.detail || error.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEntry = async () => {
    // Validate form data
    if (!editEntry.description.trim()) {
      setError("Description is required");
      return;
    }
    if (!editEntry.type) {
      setError("Type is required");
      return;
    }
    if (!editEntry.category.trim()) {
      setError("Category is required");
      return;
    }
    if (!editEntry.amount || parseFloat(editEntry.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!editEntry.paymentMethod) {
      setError("Payment method is required");
      return;
    }
    if (!editEntry.account.trim()) {
      setError("Account is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for backend
      const updateData = {
        description: editEntry.description.trim(),
        entry_type: editEntry.type,
        category: editEntry.category.trim(),
        amount: parseFloat(editEntry.amount),
        payment_method: editEntry.paymentMethod,
        reference_number: editEntry.reference.trim(),
        account: editEntry.account.trim(),
        notes: "",
      };

      const response = await accountingAPI.update(selectedTransaction.id, updateData);
      
      // Update the transaction in the list
      const updatedTransaction = {
        id: response.data.id,
        date: response.data.date,
        description: response.data.description,
        type: response.data.entry_type,
        category: response.data.category,
        amount: parseFloat(response.data.amount),
        paymentMethod: response.data.payment_method,
        reference: response.data.reference_number || "",
        status: "completed",
        account: response.data.account,
        notes: response.data.notes || "",
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
      };
      
      setTransactions((prev: any) =>
        prev.map((transaction: any) =>
          transaction.id === selectedTransaction.id ? updatedTransaction : transaction
        )
      );
      setShowEditEntryModal(false);
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      setError(error.response?.data?.detail || error.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReceipt = () => {
    // Generate receipt content
    const receiptContent = `
RECEIPT
====================
Transaction ID: ${selectedTransaction.id}
Date: ${selectedTransaction.date}
Description: ${selectedTransaction.description}
Type: ${selectedTransaction.type.toUpperCase()}
Category: ${selectedTransaction.category}
Amount: $${selectedTransaction.amount.toFixed(2)}
Payment Method: ${selectedTransaction.paymentMethod}
Reference: ${selectedTransaction.reference}
Account: ${selectedTransaction.account}
Status: ${selectedTransaction.status.toUpperCase()}
====================
Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download receipt file
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${selectedTransaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setShowReceiptModal(false);
  };

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
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading accounting data...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Accounting
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage financial records and accounting
          </p>
        </div>
        <button
          onClick={handleAddEntry}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Financial Summary */}
      {financialSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">+</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  ${financialSummary.total_income?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-sm font-medium">-</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  ${financialSummary.total_expenses?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (financialSummary.net_profit || 0) >= 0 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  <span className={`text-sm font-medium ${
                    (financialSummary.net_profit || 0) >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(financialSummary.net_profit || 0) >= 0 ? '+' : ''}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
                <p className={`text-2xl font-semibold ${
                  (financialSummary.net_profit || 0) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${financialSummary.net_profit?.toFixed(2) || '0.00'}
                </p>
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
              placeholder="Search by description, ID, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="equity">Equity</option>
          </select>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Periods</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Payment Method
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {transaction.reference}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 sm:hidden">
                      {transaction.category}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm text-gray-900 dark:text-white">
                    {transaction.category}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    {transaction.date}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewEntry(transaction)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEditEntry(transaction)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleReceipt(transaction)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Receipt</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(transaction.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Entry
              </h2>
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newEntry.description}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter transaction description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={newEntry.type}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newEntry.category}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <optgroup label="Income Categories">
                      <option value="patient_fees">Patient Fees</option>
                      <option value="insurance_payments">Insurance Payments</option>
                      <option value="consultation_fees">Consultation Fees</option>
                      <option value="test_fees">Test Fees</option>
                      <option value="other_income">Other Income</option>
                    </optgroup>
                    <optgroup label="Expense Categories">
                      <option value="salaries">Salaries</option>
                      <option value="rent">Rent</option>
                      <option value="utilities">Utilities</option>
                      <option value="medical_supplies">Medical Supplies</option>
                      <option value="equipment">Equipment</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="marketing">Marketing</option>
                      <option value="insurance">Insurance</option>
                      <option value="other_expenses">Other Expenses</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEntry.amount}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={newEntry.paymentMethod}
                    onChange={(e) =>
                      setNewEntry({
                        ...newEntry,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select payment method</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={newEntry.reference}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, reference: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account
                </label>
                <input
                  type="text"
                  value={newEntry.account}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, account: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter account name"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEntry}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Entry Modal */}
      {showViewEntryModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transaction Details
              </h2>
              <button
                onClick={() => setShowViewEntryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.date}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.description}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                      selectedTransaction.type
                    )}`}
                  >
                    {selectedTransaction.type.charAt(0).toUpperCase() +
                      selectedTransaction.type.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <p
                    className={`text-sm font-medium ${
                      selectedTransaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "income" ? "+" : "-"}$
                    {selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.paymentMethod}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.reference}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTransaction.account}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedTransaction.status
                    )}`}
                  >
                    {selectedTransaction.status.charAt(0).toUpperCase() +
                      selectedTransaction.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewEntryModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {showEditEntryModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Entry
              </h2>
              <button
                onClick={() => setShowEditEntryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editEntry.description}
                    onChange={(e) =>
                      setEditEntry({
                        ...editEntry,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={editEntry.type}
                    onChange={(e) =>
                      setEditEntry({ ...editEntry, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editEntry.category}
                    onChange={(e) =>
                      setEditEntry({ ...editEntry, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <optgroup label="Income Categories">
                      <option value="patient_fees">Patient Fees</option>
                      <option value="insurance_payments">Insurance Payments</option>
                      <option value="consultation_fees">Consultation Fees</option>
                      <option value="test_fees">Test Fees</option>
                      <option value="other_income">Other Income</option>
                    </optgroup>
                    <optgroup label="Expense Categories">
                      <option value="salaries">Salaries</option>
                      <option value="rent">Rent</option>
                      <option value="utilities">Utilities</option>
                      <option value="medical_supplies">Medical Supplies</option>
                      <option value="equipment">Equipment</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="marketing">Marketing</option>
                      <option value="insurance">Insurance</option>
                      <option value="other_expenses">Other Expenses</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editEntry.amount}
                    onChange={(e) =>
                      setEditEntry({ ...editEntry, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editEntry.paymentMethod}
                    onChange={(e) =>
                      setEditEntry({
                        ...editEntry,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={editEntry.reference}
                    onChange={(e) =>
                      setEditEntry({ ...editEntry, reference: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account
                </label>
                <input
                  type="text"
                  value={editEntry.account}
                  onChange={(e) =>
                    setEditEntry({ ...editEntry, account: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditEntryModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEntry}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generate Receipt
              </h2>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Transaction Summary
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>ID:</strong> {selectedTransaction.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Date:</strong> {selectedTransaction.date}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Description:</strong>{" "}
                  {selectedTransaction.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Amount:</strong> $
                  {selectedTransaction.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Type:</strong>{" "}
                  {selectedTransaction.type.toUpperCase()}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Click "Generate Receipt" to download a receipt file for this
                transaction.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReceipt}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
