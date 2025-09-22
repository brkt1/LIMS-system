import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  User,
  Video,
} from "lucide-react";
import React, { useState } from "react";

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const appointments = [
    {
      id: "APT001",
      doctor: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiologist",
      date: "2025-01-25",
      time: "10:00 AM",
      duration: 30,
      type: "In-Person",
      status: "confirmed",
      location: "Main Clinic - Room 201",
      reason: "Follow-up consultation",
      notes: "Please bring your recent test results",
    },
    {
      id: "APT002",
      doctor: "Dr. Michael Chen",
      doctorSpecialty: "General Practitioner",
      date: "2025-01-28",
      time: "2:30 PM",
      duration: 45,
      type: "Video Call",
      status: "pending",
      location: "Online - Zoom",
      reason: "Annual checkup",
      notes: "Virtual consultation link will be sent 15 minutes before",
    },
    {
      id: "APT003",
      doctor: "Dr. Emily Rodriguez",
      doctorSpecialty: "Dermatologist",
      date: "2025-01-20",
      time: "11:15 AM",
      duration: 30,
      type: "In-Person",
      status: "completed",
      location: "Skin Clinic - Room 105",
      reason: "Skin examination",
      notes: "Appointment completed successfully",
    },
    {
      id: "APT004",
      doctor: "Dr. David Wilson",
      doctorSpecialty: "Orthopedist",
      date: "2025-02-02",
      time: "9:00 AM",
      duration: 60,
      type: "In-Person",
      status: "confirmed",
      location: "Orthopedic Center - Room 301",
      reason: "Knee pain consultation",
      notes: "Please bring X-ray images if available",
    },
    {
      id: "APT005",
      doctor: "Dr. Lisa Anderson",
      doctorSpecialty: "Pediatrician",
      date: "2025-01-18",
      time: "3:45 PM",
      duration: 30,
      type: "Video Call",
      status: "cancelled",
      location: "Online - Teams",
      reason: "Child's vaccination",
      notes: "Cancelled due to scheduling conflict",
    },
  ];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "Video Call" ? Video : User;
  };

  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  ).length;
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">
            View and manage your medical appointments
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by doctor, reason, or appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAppointments}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {confirmedAppointments}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingAppointments}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {completedAppointments}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAppointments.map((appointment) => {
          const TypeIcon = getTypeIcon(appointment.type);
          return (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {appointment.doctor}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {appointment.doctorSpecialty}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  <TypeIcon className="w-8 h-8 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {appointment.date} at {appointment.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Duration: {appointment.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {appointment.location}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900">Reason:</p>
                    <p className="text-sm text-gray-600">
                      {appointment.reason}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Notes:
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  {appointment.status === "confirmed" && (
                    <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                      Cancel
                    </button>
                  )}
                  {appointment.status === "pending" && (
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Confirm
                    </button>
                  )}
                  <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No appointments found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Appointments;
