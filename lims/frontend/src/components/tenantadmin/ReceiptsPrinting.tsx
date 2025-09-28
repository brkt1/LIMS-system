import {
    Download,
    Eye,
    Plus,
    Printer,
    Search,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { receiptsAPI } from "../../services/api";
import { getCurrentTenantId, getCurrentUserId } from "../../utils/helpers";

const ReceiptsPrinting: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Modal states
  const [showPrintReceiptModal, setShowPrintReceiptModal] = useState(false);
  const [showViewReceiptModal, setShowViewReceiptModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  // Form states
  const [newReceipt, setNewReceipt] = useState({
    patientName: "",
    patientId: "",
    amount: "",
    services: "",
    doctor: "",
    paymentMethod: "Cash",
  });

  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Load receipts from backend API
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await receiptsAPI.getAll();

        // Map backend data to frontend expected format
        const mappedReceipts = response.data.map((receipt: any) => ({
          id: receipt.id,
          patientName: receipt.patient_name,
          patientId: receipt.patient_id,
          amount: parseFloat(receipt.amount),
          status: receipt.status,
          generatedDate: receipt.generated_date,
          generatedTime: receipt.generated_time,
          services: receipt.services || [],
          doctor: receipt.doctor,
          paymentMethod: receipt.payment_method,
          printCount: receipt.print_count || 0,
        }));

        setReceipts(mappedReceipts);
      } catch (error: any) {
        console.error("Error fetching receipts:", error);
        setError(error.message || "Failed to load receipts");
        // Set empty array when API fails
        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || receipt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handlePrintReceipt = () => {
    setNewReceipt({
      patientName: "",
      patientId: "",
      amount: "",
      services: "",
      doctor: "",
      paymentMethod: "Cash",
    });
    setShowPrintReceiptModal(true);
  };

  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowViewReceiptModal(true);
  };

  const handlePrint = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowPrintModal(true);
  };

  const handleDownload = (receipt: any) => {
    setSelectedReceipt(receipt);
    setShowDownloadModal(true);
  };

  const handleCreateReceipt = async () => {
    if (newReceipt.patientName && newReceipt.patientId && newReceipt.amount) {
      try {
        const receiptData = {
          patient_name: newReceipt.patientName,
          patient_id: newReceipt.patientId,
          amount: parseFloat(newReceipt.amount),
          services: newReceipt.services.split(",").map((s) => s.trim()),
          doctor: newReceipt.doctor,
          payment_method: newReceipt.paymentMethod.toLowerCase(),
          status: "draft",
          tenant: getCurrentTenantId(), // Dynamic tenant ID
          created_by: getCurrentUserId(), // Dynamic user ID
        };

        const response = await receiptsAPI.create(receiptData);
        const createdReceipt = response.data;

        // Map backend response to frontend format
        const mappedReceipt = {
          id: createdReceipt.id,
          patientName: createdReceipt.patient_name,
          patientId: createdReceipt.patient_id,
          amount: parseFloat(createdReceipt.amount),
          status: createdReceipt.status,
          generatedDate: createdReceipt.generated_date,
          generatedTime: createdReceipt.generated_time,
          services: createdReceipt.services || [],
          doctor: createdReceipt.doctor,
          paymentMethod: createdReceipt.payment_method,
          printCount: createdReceipt.print_count || 0,
        };

        setReceipts((prev: any) => [mappedReceipt, ...prev]);
        setNewReceipt({
          patientName: "",
          patientId: "",
          amount: "",
          services: "",
          doctor: "",
          paymentMethod: "Cash",
        });
        setShowPrintReceiptModal(false);
      } catch (error: any) {
        console.error("Error creating receipt:", error);
        setError(error.message || "Failed to create receipt");
      }
    }
  };

  const handlePrintConfirm = async () => {
    if (selectedReceipt) {
      try {
        // Call backend API to print receipt
        await receiptsAPI.printReceipt(selectedReceipt.id);

        // Simulate printing
        window.print();

        // Update local state
        setReceipts(
          receipts.map((receipt) =>
            receipt.id === selectedReceipt.id
              ? {
                  ...receipt,
                  printCount: receipt.printCount + 1,
                  status: "printed",
                }
              : receipt
          )
        );
        setShowPrintModal(false);
      } catch (error: any) {
        console.error("Error printing receipt:", error);
        setError(error.message || "Failed to print receipt");
      }
    }
  };

  const handleDownloadConfirm = () => {
    if (selectedReceipt) {
      // Simulate file download
      const blob = new Blob(["Receipt Content"], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReceipt.id}_receipt.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowDownloadModal(false);
    }
  };

  const handleExportAll = () => {
    // Generate CSV content
    const csvContent = [
      [
        "Receipt ID",
        "Patient Name",
        "Patient ID",
        "Amount",
        "Status",
        "Generated Date",
        "Generated Time",
        "Services",
        "Doctor",
        "Payment Method",
        "Print Count",
      ],
      ...receipts.map((receipt) => [
        receipt.id,
        receipt.patientName,
        receipt.patientId,
        receipt.amount,
        receipt.status,
        receipt.generatedDate,
        receipt.generatedTime,
        receipt.services.join("; "),
        receipt.doctor,
        receipt.paymentMethod,
        receipt.printCount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipts_export.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "printed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Receipts Printing
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and print receipts for services
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportAll}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button
            onClick={handlePrintReceipt}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Print Receipt</span>
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
              placeholder="Search by patient name or receipt ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="printed">Printed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading receipts...
          </span>
        </div>
      )}

      {/* Receipts Table */}
      {!loading && (
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Services
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Payment
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Generated
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReceipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {receipt.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {receipt.printCount} prints
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {receipt.patientName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          ID: {receipt.patientId}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {receipt.services.join(", ")}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${receipt.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                      {receipt.paymentMethod}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          receipt.status
                        )}`}
                      >
                        {receipt.status.charAt(0).toUpperCase() +
                          receipt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{receipt.generatedDate}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {receipt.generatedTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewReceipt(receipt)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handlePrint(receipt)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center"
                        >
                          <Printer className="w-4 h-4 mr-1" />
                          Print
                        </button>
                        <button
                          onClick={() => handleDownload(receipt)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print Receipt Modal */}
      {showPrintReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Print Receipt
              </h3>
              <button
                onClick={() => setShowPrintReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={newReceipt.patientName}
                    onChange={(e) =>
                      setNewReceipt({
                        ...newReceipt,
                        patientName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={newReceipt.patientId}
                    onChange={(e) =>
                      setNewReceipt({
                        ...newReceipt,
                        patientId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newReceipt.amount}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={newReceipt.paymentMethod}
                    onChange={(e) =>
                      setNewReceipt({
                        ...newReceipt,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor *
                  </label>
                  <input
                    type="text"
                    value={newReceipt.doctor}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, doctor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Services *
                  </label>
                  <textarea
                    value={newReceipt.services}
                    onChange={(e) =>
                      setNewReceipt({ ...newReceipt, services: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter services (comma-separated)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPrintReceiptModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReceipt}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {showViewReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receipt Details - {selectedReceipt.id}
              </h3>
              <button
                onClick={() => setShowViewReceiptModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedReceipt.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedReceipt.status
                    )}`}
                  >
                    {selectedReceipt.status.charAt(0).toUpperCase() +
                      selectedReceipt.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.doctor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.paymentMethod}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Generated Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.generatedDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Generated Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.generatedTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Print Count
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.printCount}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Services
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedReceipt.services.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewReceiptModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Print Receipt
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Print the receipt for{" "}
                <strong>{selectedReceipt.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Receipt ID:</strong> {selectedReceipt.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Amount:</strong> ${selectedReceipt.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Services:</strong>{" "}
                  {selectedReceipt.services.join(", ")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Payment Method:</strong>{" "}
                  {selectedReceipt.paymentMethod}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Download Receipt
              </h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Download the receipt for{" "}
                <strong>{selectedReceipt.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Receipt ID:</strong> {selectedReceipt.id}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Amount:</strong> ${selectedReceipt.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Services:</strong>{" "}
                  {selectedReceipt.services.join(", ")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Generated:</strong> {selectedReceipt.generatedDate} at{" "}
                  {selectedReceipt.generatedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsPrinting;
