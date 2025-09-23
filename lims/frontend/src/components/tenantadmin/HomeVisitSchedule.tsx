import {
  Calendar,
  Plus,
  Search,
  Clock,
  MapPin,
  User,
  Phone,
} from "lucide-react";
import React, { useState } from "react";

const HomeVisitSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const scheduledVisits = [
    {
      id: "HV001",
      patientName: "John Smith",
      patientId: "P001",
      address: "123 Main St, City, State 12345",
      phone: "+1 (555) 123-4567",
      scheduledDate: "2025-01-25",
      scheduledTime: "10:00 AM",
      status: "scheduled",
      serviceType: "Blood Collection",
      doctor: "Dr. Sarah Johnson",
      estimatedDuration: "30 minutes",
      notes: "Patient has mobility issues",
      priority: "normal",
    },
    {
      id: "HV002",
      patientName: "Sarah Johnson",
      patientId: "P002",
      address: "456 Oak Ave, City, State 12345",
      phone: "+1 (555) 234-5678",
      scheduledDate: "2025-01-24",
      scheduledTime: "2:00 PM",
      status: "in-progress",
      serviceType: "Vaccination",
      doctor: "Dr. Mike Davis",
      estimatedDuration: "45 minutes",
      notes: "Elderly patient, needs assistance",
      priority: "high",
    },
    {
      id: "HV003",
      patientName: "Mike Davis",
      patientId: "P003",
      address: "789 Pine Rd, City, State 12345",
      phone: "+1 (555) 345-6789",
      scheduledDate: "2025-01-23",
      scheduledTime: "9:00 AM",
      status: "completed",
      serviceType: "COVID-19 Test",
      doctor: "Dr. Lisa Wilson",
      estimatedDuration: "20 minutes",
      notes: "Patient is symptomatic",
      priority: "urgent",
    },
    {
      id: "HV004",
      patientName: "Lisa Wilson",
      patientId: "P004",
      address: "321 Elm St, City, State 12345",
      phone: "+1 (555) 456-7890",
      scheduledDate: "2025-01-26",
      scheduledTime: "11:00 AM",
      status: "cancelled",
      serviceType: "Consultation",
      doctor: "Dr. Robert Brown",
      estimatedDuration: "60 minutes",
      notes: "Patient cancelled due to scheduling conflict",
      priority: "normal",
    },
    {
      id: "HV005",
      patientName: "Robert Brown",
      patientId: "P005",
      address: "654 Maple Dr, City, State 12345",
      phone: "+1 (555) 567-8901",
      scheduledDate: "2025-01-27",
      scheduledTime: "3:00 PM",
      status: "scheduled",
      serviceType: "Physical Examination",
      doctor: "Dr. Sarah Johnson",
      estimatedDuration: "40 minutes",
      notes: "Routine check-up",
      priority: "normal",
    },
  ];

  const filteredVisits = scheduledVisits.filter((visit) => {
    const matchesSearch =
      visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate =
      filterDate === "all" || visit.scheduledDate === filterDate;
    const matchesStatus =
      filterStatus === "all" || visit.status === filterStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalVisits = scheduledVisits.length;
  const scheduledVisitsCount = scheduledVisits.filter(
    (v) => v.status === "scheduled"
  ).length;
  const completedVisits = scheduledVisits.filter(
    (v) => v.status === "completed"
  ).length;
  const inProgressVisits = scheduledVisits.filter(
    (v) => v.status === "in-progress"
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Home Visit Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Schedule and manage home visits</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="2025-01-23">Today</option>
            <option value="2025-01-24">Tomorrow</option>
            <option value="2025-01-25">Jan 25</option>
            <option value="2025-01-26">Jan 26</option>
            <option value="2025-01-27">Jan 27</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">{totalVisits}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">
                {scheduledVisitsCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {inProgressVisits}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedVisits}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Visit
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Address
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Doctor
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Scheduled
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVisits.map((visit) => (
                <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {visit.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {visit.estimatedDuration}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {visit.patientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        ID: {visit.patientId}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {visit.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {visit.address}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {visit.serviceType}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-900 dark:text-white">
                    {visit.doctor}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        visit.priority
                      )}`}
                    >
                      {visit.priority.charAt(0).toUpperCase() +
                        visit.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        visit.status
                      )}`}
                    >
                      {visit.status.charAt(0).toUpperCase() +
                        visit.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>{visit.scheduledDate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {visit.scheduledTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left">
                        Start
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left">
                        Reschedule
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

export default HomeVisitSchedule;
