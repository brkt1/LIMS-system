import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Users,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";

const BranchManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");

  const branches = [
    {
      id: "BR001",
      name: "Main Clinic",
      address: "123 Medical Center Dr, Health City, HC 12345",
      phone: "+1 (555) 123-4567",
      email: "main@medicareclinic.com",
      status: "active",
      city: "Health City",
      state: "HC",
      zipCode: "12345",
      manager: "Dr. Sarah Johnson",
      establishedDate: "2020-01-15",
      totalStaff: 25,
      totalPatients: 1247,
      services: ["General Medicine", "Laboratory", "Radiology"],
      operatingHours: "Mon-Fri 8AM-6PM, Sat 9AM-2PM",
    },
    {
      id: "BR002",
      name: "Downtown Branch",
      address: "456 Business Ave, Downtown, DT 54321",
      phone: "+1 (555) 234-5678",
      email: "downtown@medicareclinic.com",
      status: "active",
      city: "Downtown",
      state: "DT",
      zipCode: "54321",
      manager: "Dr. Mike Davis",
      establishedDate: "2021-06-10",
      totalStaff: 15,
      totalPatients: 856,
      services: ["Cardiology", "Neurology", "Laboratory"],
      operatingHours: "Mon-Fri 7AM-5PM",
    },
    {
      id: "BR003",
      name: "Suburban Clinic",
      address: "789 Suburb St, Suburbia, SB 98765",
      phone: "+1 (555) 345-6789",
      email: "suburban@medicareclinic.com",
      status: "inactive",
      city: "Suburbia",
      state: "SB",
      zipCode: "98765",
      manager: "Dr. Lisa Wilson",
      establishedDate: "2022-03-20",
      totalStaff: 8,
      totalPatients: 423,
      services: ["Pediatrics", "Family Medicine"],
      operatingHours: "Mon-Fri 9AM-4PM",
    },
    {
      id: "BR004",
      name: "Emergency Center",
      address: "321 Emergency Blvd, Urgent City, UC 11111",
      phone: "+1 (555) 456-7890",
      email: "emergency@medicareclinic.com",
      status: "active",
      city: "Urgent City",
      state: "UC",
      zipCode: "11111",
      manager: "Dr. Robert Brown",
      establishedDate: "2023-01-05",
      totalStaff: 30,
      totalPatients: 2103,
      services: ["Emergency Medicine", "Trauma", "ICU"],
      operatingHours: "24/7",
    },
    {
      id: "BR005",
      name: "Specialty Center",
      address: "654 Specialty Dr, Expert City, EC 22222",
      phone: "+1 (555) 567-8901",
      email: "specialty@medicareclinic.com",
      status: "pending",
      city: "Expert City",
      state: "EC",
      zipCode: "22222",
      manager: "Dr. Jennifer Smith",
      establishedDate: "2025-01-20",
      totalStaff: 0,
      totalPatients: 0,
      services: ["Oncology", "Surgery", "Rehabilitation"],
      operatingHours: "Mon-Fri 8AM-6PM",
    },
  ];

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || branch.status === filterStatus;
    const matchesCity = filterCity === "all" || branch.city === filterCity;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalBranches = branches.length;
  const activeBranches = branches.filter((b) => b.status === "active").length;
  const totalStaff = branches.reduce((sum, b) => sum + b.totalStaff, 0);
  const totalPatients = branches.reduce((sum, b) => sum + b.totalPatients, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Branch Management
          </h1>
          <p className="text-gray-600">Manage multiple clinic branches</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by branch name, address, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Cities</option>
            <option value="Health City">Health City</option>
            <option value="Downtown">Downtown</option>
            <option value="Suburbia">Suburbia</option>
            <option value="Urgent City">Urgent City</option>
            <option value="Expert City">Expert City</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalBranches}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Branches</p>
              <p className="text-2xl font-bold text-green-600">
                {activeBranches}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-blue-600">{totalStaff}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPatients.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Staff/Patients
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Established
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {branch.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {branch.id}
                        </div>
                        <div className="text-xs text-gray-400 sm:hidden">
                          {branch.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {branch.city}, {branch.state}
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.zipCode}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {branch.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {branch.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {branch.manager}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-900">
                      {branch.totalStaff} staff
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.totalPatients.toLocaleString()} patients
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        branch.status
                      )}`}
                    >
                      {branch.status.charAt(0).toUpperCase() +
                        branch.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900">
                    {branch.establishedDate}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-left">
                        Edit
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 text-left">
                        Manage
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

export default BranchManagement;
