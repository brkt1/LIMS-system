import { Edit, Eye, Plus, RotateCcw, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { contractAPI } from "../../services/api";

const ContractManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Modal states
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showViewContractModal, setShowViewContractModal] = useState(false);
  const [showEditContractModal, setShowEditContractModal] = useState(false);
  const [showRenewContractModal, setShowRenewContractModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // Form states
  const [newContract, setNewContract] = useState({
    title: "",
    type: "",
    vendor: "",
    vendorContact: "",
    vendorEmail: "",
    vendorPhone: "",
    startDate: "",
    endDate: "",
    value: "",
    currency: "USD",
    terms: "",
    description: "",
  });

  const [editContract, setEditContract] = useState({
    title: "",
    type: "",
    vendor: "",
    vendorContact: "",
    vendorEmail: "",
    vendorPhone: "",
    startDate: "",
    endDate: "",
    value: "",
    currency: "USD",
    terms: "",
    description: "",
  });

  const [renewContract, setRenewContract] = useState({
    newEndDate: "",
    newValue: "",
    newTerms: "",
    notes: "",
  });

  // Contract state
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load contracts from backend API
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contractAPI.getAll();

        // Map backend data to frontend expected format
        const mappedContracts = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          vendor: item.vendor,
          vendorContact: item.vendor_contact,
          vendorEmail: item.vendor_email,
          vendorPhone: item.vendor_phone,
          startDate: item.start_date,
          endDate: item.end_date,
          value: parseFloat(item.value),
          currency: item.currency,
          status: item.status,
          renewalDate: item.renewal_date,
          autoRenewal: item.auto_renewal,
          terms: item.terms || "",
          notes: item.notes || "",
        }));

        setContracts(mappedContracts);
      } catch (error: any) {
        console.error("Error fetching contracts:", error);
        setError(error.message || "Failed to load contracts");
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || contract.status === filterStatus;
    const matchesType = filterType === "all" || contract.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "supply":
        return "bg-blue-100 text-blue-800";
      case "service":
        return "bg-purple-100 text-purple-800";
      case "insurance":
        return "bg-orange-100 text-orange-800";
      case "lease":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handler functions
  const handleAddContract = () => {
    setNewContract({
      title: "",
      type: "",
      vendor: "",
      vendorContact: "",
      vendorEmail: "",
      vendorPhone: "",
      startDate: "",
      endDate: "",
      value: "",
      currency: "USD",
      terms: "",
      description: "",
    });
    setShowAddContractModal(true);
  };

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract);
    setShowViewContractModal(true);
  };

  const handleEditContract = (contract: any) => {
    setSelectedContract(contract);
    setEditContract({
      title: contract.title,
      type: contract.type,
      vendor: contract.vendor,
      vendorContact: contract.vendorContact,
      vendorEmail: contract.vendorEmail,
      vendorPhone: contract.vendorPhone,
      startDate: contract.startDate,
      endDate: contract.endDate,
      value: contract.value.toString(),
      currency: contract.currency,
      terms: contract.terms,
      description: contract.description,
    });
    setShowEditContractModal(true);
  };

  const handleRenewContract = (contract: any) => {
    setSelectedContract(contract);
    setRenewContract({
      newEndDate: "",
      newValue: contract.value.toString(),
      newTerms: contract.terms,
      notes: "",
    });
    setShowRenewContractModal(true);
  };

  const handleCreateContract = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic form validation
      if (
        !newContract.title ||
        !newContract.type ||
        !newContract.vendor ||
        !newContract.vendorContact ||
        !newContract.vendorEmail ||
        !newContract.vendorPhone ||
        !newContract.startDate ||
        !newContract.endDate ||
        !newContract.value
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare contract data for backend
      const contractData = {
        title: newContract.title,
        type: newContract.type, // Already in correct format
        vendor: newContract.vendor,
        vendor_contact: newContract.vendorContact,
        vendor_email: newContract.vendorEmail,
        vendor_phone: newContract.vendorPhone,
        start_date: newContract.startDate,
        end_date: newContract.endDate,
        value: parseFloat(newContract.value),
        currency: newContract.currency,
        terms: newContract.terms || "No terms specified", // Ensure terms is not empty
        description: newContract.description || "No description provided", // Ensure description is not empty
        status: "draft", // Start as draft
        auto_renewal: false,
        tenant: 1, // Default tenant - should be dynamic in production
        created_by: 1, // Default user - should be dynamic in production
      };

      // Debug: Log the data being sent
      console.log("Sending contract data:", contractData);

      // Make API call to create contract
      const response = await contractAPI.create(contractData);

      // Map backend response to frontend format
      const newContractData = {
        id: response.data.id,
        title: response.data.title,
        type: response.data.type,
        vendor: response.data.vendor,
        vendorContact: response.data.vendor_contact,
        vendorEmail: response.data.vendor_email,
        vendorPhone: response.data.vendor_phone,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        value: parseFloat(response.data.value),
        currency: response.data.currency,
        status: response.data.status,
        renewalDate: response.data.renewal_date,
        autoRenewal: response.data.auto_renewal,
        terms: response.data.terms || "",
        notes: response.data.notes || "",
      };

      // Add to local state
      setContracts((prev: any) => [...prev, newContractData]);

      // Reset form and close modal
      setNewContract({
        title: "",
        type: "",
        vendor: "",
        vendorContact: "",
        vendorEmail: "",
        vendorPhone: "",
        startDate: "",
        endDate: "",
        value: "",
        currency: "USD",
        terms: "",
        description: "",
      });
      setShowAddContractModal(false);
    } catch (error: any) {
      console.error("Error creating contract:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create contract"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContract = async () => {
    try {
      setLoading(true);
      setError(null);

      // Basic form validation
      if (
        !editContract.title ||
        !editContract.type ||
        !editContract.vendor ||
        !editContract.vendorContact ||
        !editContract.vendorEmail ||
        !editContract.vendorPhone ||
        !editContract.startDate ||
        !editContract.endDate ||
        !editContract.value
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare contract data for backend
      const contractData = {
        title: editContract.title,
        type: editContract.type,
        vendor: editContract.vendor,
        vendor_contact: editContract.vendorContact,
        vendor_email: editContract.vendorEmail,
        vendor_phone: editContract.vendorPhone,
        start_date: editContract.startDate,
        end_date: editContract.endDate,
        value: parseFloat(editContract.value),
        currency: editContract.currency,
        terms: editContract.terms || "No terms specified",
        description: editContract.description || "No description provided",
      };

      // Debug: Log the data being sent
      console.log("Updating contract with data:", contractData);

      // Make API call to update contract
      const response = await contractAPI.update(
        selectedContract.id,
        contractData
      );

      // Map backend response to frontend format
      const updatedContractData = {
        id: response.data.id,
        title: response.data.title,
        type: response.data.type,
        vendor: response.data.vendor,
        vendorContact: response.data.vendor_contact,
        vendorEmail: response.data.vendor_email,
        vendorPhone: response.data.vendor_phone,
        startDate: response.data.start_date,
        endDate: response.data.end_date,
        value: parseFloat(response.data.value),
        currency: response.data.currency,
        status: response.data.status,
        renewalDate: response.data.renewal_date,
        autoRenewal: response.data.auto_renewal,
        terms: response.data.terms || "",
        notes: response.data.notes || "",
      };

      // Update local state
      setContracts((prev: any) =>
        prev.map((contract: any) =>
          contract.id === selectedContract.id ? updatedContractData : contract
        )
      );

      setShowEditContractModal(false);
    } catch (error: any) {
      console.error("Error updating contract:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update contract"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRenewConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare renewal data for backend
      const renewalData = {
        new_end_date: renewContract.newEndDate,
        new_value: renewContract.newValue
          ? parseFloat(renewContract.newValue)
          : null,
        notes: renewContract.notes,
      };

      // Make API call to renew contract
      const response = await contractAPI.renew(
        selectedContract.id,
        renewalData
      );

      // Refresh contracts list to get updated data
      const contractsResponse = await contractAPI.getAll();
      const mappedContracts = contractsResponse.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        vendor: item.vendor,
        vendorContact: item.vendor_contact,
        vendorEmail: item.vendor_email,
        vendorPhone: item.vendor_phone,
        startDate: item.start_date,
        endDate: item.end_date,
        value: parseFloat(item.value),
        currency: item.currency,
        status: item.status,
        renewalDate: item.renewal_date,
        autoRenewal: item.auto_renewal,
        terms: item.terms || "",
        notes: item.notes || "",
      }));

      setContracts(mappedContracts);
      setShowRenewContractModal(false);

      // Reset renewal form
      setRenewContract({
        newEndDate: "",
        newValue: "",
        newTerms: "",
        notes: "",
      });
    } catch (error: any) {
      console.error("Error renewing contract:", error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to renew contract"
      );
    } finally {
      setLoading(false);
    }
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
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading contracts...
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Contract Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage contracts and agreements
          </p>
        </div>
        <button
          onClick={handleAddContract}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contract</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title, vendor, or contract ID..."
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
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Supply">Supply</option>
            <option value="Service">Service</option>
            <option value="Insurance">Insurance</option>
            <option value="Lease">Lease</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Period
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contract.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        ID: {contract.id}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                        {contract.vendorContact} • {contract.vendorPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contract.vendor}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {contract.vendorEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {contract.vendorContact}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {contract.vendorPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                        contract.type
                      )}`}
                    >
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${contract.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {contract.currency}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {contract.status.charAt(0).toUpperCase() +
                        contract.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>
                        {contract.startDate} to {contract.endDate}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        Renewal: {contract.renewalDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleViewContract(contract)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleEditContract(contract)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleRenewContract(contract)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Renew</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contract Modal */}
      {showAddContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Contract
              </h2>
              <button
                onClick={() => setShowAddContractModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Title
                  </label>
                  <input
                    type="text"
                    value={newContract.title}
                    onChange={(e) =>
                      setNewContract({ ...newContract, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter contract title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Type
                  </label>
                  <select
                    value={newContract.type}
                    onChange={(e) =>
                      setNewContract({ ...newContract, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="service">Service Contract</option>
                    <option value="supply">Supply Contract</option>
                    <option value="maintenance">Maintenance Contract</option>
                    <option value="consulting">Consulting Contract</option>
                    <option value="lease">Lease Contract</option>
                    <option value="employment">Employment Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={newContract.vendor}
                    onChange={(e) =>
                      setNewContract({ ...newContract, vendor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={newContract.vendorContact}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        vendorContact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter contact person"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newContract.vendorEmail}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        vendorEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newContract.vendorPhone}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        vendorPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Value
                  </label>
                  <input
                    type="number"
                    value={newContract.value}
                    onChange={(e) =>
                      setNewContract({ ...newContract, value: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter contract value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={newContract.currency}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={newContract.terms}
                  onChange={(e) =>
                    setNewContract({ ...newContract, terms: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter terms and conditions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newContract.description}
                  onChange={(e) =>
                    setNewContract({
                      ...newContract,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter contract description"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddContractModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContract}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {showViewContractModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contract Details
              </h2>
              <button
                onClick={() => setShowViewContractModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedContract.status
                    )}`}
                  >
                    {selectedContract.status.charAt(0).toUpperCase() +
                      selectedContract.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.vendor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.vendorContact}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.vendorEmail}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.vendorPhone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.startDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.endDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Value
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${selectedContract.value.toLocaleString()}{" "}
                    {selectedContract.currency}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Renewal Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.renewalDate}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Terms & Conditions
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedContract.terms}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedContract.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Modified
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.lastModified}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Modified By
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedContract.modifiedBy}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewContractModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contract Modal */}
      {showEditContractModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Contract
              </h2>
              <button
                onClick={() => setShowEditContractModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Title
                  </label>
                  <input
                    type="text"
                    value={editContract.title}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Type
                  </label>
                  <select
                    value={editContract.type}
                    onChange={(e) =>
                      setEditContract({ ...editContract, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select type</option>
                    <option value="service">Service Contract</option>
                    <option value="supply">Supply Contract</option>
                    <option value="maintenance">Maintenance Contract</option>
                    <option value="consulting">Consulting Contract</option>
                    <option value="lease">Lease Contract</option>
                    <option value="employment">Employment Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    value={editContract.vendor}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        vendor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={editContract.vendorContact}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        vendorContact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editContract.vendorEmail}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        vendorEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editContract.vendorPhone}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        vendorPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editContract.startDate}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editContract.endDate}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contract Value
                  </label>
                  <input
                    type="number"
                    value={editContract.value}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={editContract.currency}
                    onChange={(e) =>
                      setEditContract({
                        ...editContract,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Terms & Conditions
                </label>
                <textarea
                  value={editContract.terms}
                  onChange={(e) =>
                    setEditContract({ ...editContract, terms: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editContract.description}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowEditContractModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContract}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Update Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Contract Modal */}
      {showRenewContractModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Renew Contract
              </h2>
              <button
                onClick={() => setShowRenewContractModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Current Contract
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>{selectedContract.title}</strong> -{" "}
                  {selectedContract.vendor}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current End Date: {selectedContract.endDate}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Value: ${selectedContract.value.toLocaleString()}{" "}
                  {selectedContract.currency}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New End Date
                </label>
                <input
                  type="date"
                  value={renewContract.newEndDate}
                  onChange={(e) =>
                    setRenewContract({
                      ...renewContract,
                      newEndDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Contract Value
                </label>
                <input
                  type="number"
                  value={renewContract.newValue}
                  onChange={(e) =>
                    setRenewContract({
                      ...renewContract,
                      newValue: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter new contract value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Updated Terms
                </label>
                <textarea
                  value={renewContract.newTerms}
                  onChange={(e) =>
                    setRenewContract({
                      ...renewContract,
                      newTerms: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter updated terms and conditions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Renewal Notes
                </label>
                <textarea
                  value={renewContract.notes}
                  onChange={(e) =>
                    setRenewContract({
                      ...renewContract,
                      notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any additional notes for this renewal"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRenewContractModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRenewConfirm}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Renew Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;
