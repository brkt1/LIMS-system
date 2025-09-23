import {
  FileText,
  Plus,
  Search,
  Calendar,
  DollarSign,
  User,
  AlertCircle,
} from "lucide-react";
import React, { useState } from "react";

const ContractManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const contracts = [
    {
      id: "CT001",
      title: "Medical Equipment Supply Agreement",
      type: "Supply",
      vendor: "MedTech Solutions Inc.",
      vendorContact: "John Smith",
      vendorEmail: "john@medtech.com",
      vendorPhone: "+1 (555) 123-4567",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      value: 50000,
      currency: "USD",
      renewalDate: "2024-11-01",
      terms: "Annual contract with quarterly payments",
      description: "Supply of laboratory equipment and maintenance services",
      lastModified: "2024-01-15",
      modifiedBy: "Dr. Sarah Johnson",
    },
    {
      id: "CT002",
      title: "IT Services Contract",
      type: "Service",
      vendor: "TechSupport Pro",
      vendorContact: "Mike Davis",
      vendorEmail: "mike@techsupport.com",
      vendorPhone: "+1 (555) 234-5678",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      status: "active",
      value: 25000,
      currency: "USD",
      renewalDate: "2025-01-01",
      terms: "Monthly service agreement",
      description: "IT support and system maintenance services",
      lastModified: "2024-03-10",
      modifiedBy: "Dr. Mike Davis",
    },
    {
      id: "CT003",
      title: "Cleaning Services Agreement",
      type: "Service",
      vendor: "CleanCare Services",
      vendorContact: "Lisa Wilson",
      vendorEmail: "lisa@cleancare.com",
      vendorPhone: "+1 (555) 345-6789",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      status: "expired",
      value: 12000,
      currency: "USD",
      renewalDate: "2024-04-01",
      terms: "Monthly cleaning services",
      description: "Daily cleaning and maintenance of clinic facilities",
      lastModified: "2023-06-05",
      modifiedBy: "Dr. Lisa Wilson",
    },
    {
      id: "CT004",
      title: "Insurance Provider Contract",
      type: "Insurance",
      vendor: "HealthGuard Insurance",
      vendorContact: "Robert Brown",
      vendorEmail: "robert@healthguard.com",
      vendorPhone: "+1 (555) 456-7890",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      value: 0,
      currency: "USD",
      renewalDate: "2024-10-01",
      terms: "Annual insurance coverage",
      description: "Professional liability and malpractice insurance",
      lastModified: "2024-01-20",
      modifiedBy: "Dr. Robert Brown",
    },
    {
      id: "CT005",
      title: "Pharmaceutical Supply Agreement",
      type: "Supply",
      vendor: "PharmaCorp Ltd.",
      vendorContact: "Jennifer Smith",
      vendorEmail: "jennifer@pharmacorp.com",
      vendorPhone: "+1 (555) 567-8901",
      startDate: "2025-02-01",
      endDate: "2026-01-31",
      status: "pending",
      value: 75000,
      currency: "USD",
      renewalDate: "2025-12-01",
      terms: "Quarterly supply agreement",
      description: "Supply of pharmaceuticals and medical supplies",
      lastModified: "2025-01-20",
      modifiedBy: "Dr. Jennifer Smith",
    },
  ];

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

  const totalContracts = contracts.length;
  const activeContracts = contracts.filter((c) => c.status === "active").length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const expiringSoon = contracts.filter((c) => {
    const renewalDate = new Date(c.renewalDate);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Contract Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Manage contracts and agreements</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
                {totalContracts}
              </p>
            </div>
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {activeContracts}
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Value</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">
                {expiringSoon}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
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
                <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
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
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left">
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left">
                        Renew
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

export default ContractManagement;
