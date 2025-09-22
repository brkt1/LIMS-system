import { Calendar, Clock, Plus, Search, User, Users } from "lucide-react";
import React, { useState } from "react";

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const appointments = [
    {
      id: "APT001",
      patient: "John Smith",
      patientId: "P001",
      time: "09:00 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "Confirmed",
      date: "2025-01-22",
      notes: "Review blood test results",
    },
    {
      id: "APT002",
      patient: "Sarah Johnson",
      patientId: "P002",
      time: "10:30 AM",
      duration: "45 min",
      type: "New Patient",
      status: "Confirmed",
      date: "2025-01-22",
      notes: "Initial consultation",
    },
    {
      id: "APT003",
      patient: "Mike Davis",
      patientId: "P003",
      time: "02:00 PM",
      duration: "30 min",
      type: "Consultation",
      status: "Pending",
      date: "2025-01-22",
      notes: "Chest pain evaluation",
    },
    {
      id: "APT004",
      patient: "Lisa Wilson",
      patientId: "P004",
      time: "03:30 PM",
      duration: "30 min",
      type: "Test Review",
      status: "Confirmed",
      date: "2025-01-22",
      notes: "MRI results discussion",
    },
    {
      id: "APT005",
      patient: "Robert Brown",
      patientId: "P005",
      time: "04:45 PM",
      duration: "30 min",
      type: "Follow-up",
      status: "Cancelled",
      date: "2025-01-22",
      notes: "Patient cancelled",
    },
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      appointment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesDate = appointment.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new patient":
        return "bg-blue-100 text-blue-800";
      case "follow-up":
        return "bg-green-100 text-green-800";
      case "consultation":
        return "bg-purple-100 text-purple-800";
      case "test review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Appointments
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your patient appointments and schedule
            </p>
          </div>
          <button className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, appointment type, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Today's Appointments
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Confirmed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {appointments.filter((a) => a.status === "Confirmed").length}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {appointments.filter((a) => a.status === "Pending").length}
                </p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Cancelled</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  {appointments.filter((a) => a.status === "Cancelled").length}
                </p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Appointments for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-sm sm:text-base">
                No appointments found for the selected date and filters.
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 sm:p-6 hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <h4 className="text-base sm:text-lg font-medium text-gray-900">
                            {appointment.patient}
                          </h4>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ID: {appointment.patientId}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {appointment.time} ({appointment.duration})
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                              appointment.type
                            )}`}
                          >
                            {appointment.type}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-xs sm:text-sm text-gray-600">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span
                        className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-xs sm:text-sm font-medium text-left">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-xs sm:text-sm font-medium text-left">
                          Confirm
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-xs sm:text-sm font-medium text-left">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
