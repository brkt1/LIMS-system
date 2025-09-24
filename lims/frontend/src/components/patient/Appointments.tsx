import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  User,
  Video,
  X,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State management for modals
  const [showBookAppointmentModal, setShowBookAppointmentModal] =
    useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Form states
  const [appointmentData, setAppointmentData] = useState({
    doctor: "",
    date: "",
    time: "",
    type: "",
    reason: "",
    notes: "",
  });

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  });

  // Appointments data state
  const [appointments, setAppointments] = useState([
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
  ]);

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem("patientAppointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save appointments to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem("patientAppointments", JSON.stringify(appointments));
  }, [appointments]);

  // Handler functions
  const handleBookAppointment = () => {
    setAppointmentData({
      doctor: "",
      date: "",
      time: "",
      type: "",
      reason: "",
      notes: "",
    });
    setShowBookAppointmentModal(true);
  };

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRescheduleAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      date: appointment.date,
      time: appointment.time,
    });
    setShowRescheduleModal(true);
  };

  const handleConfirmAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowConfirmModal(true);
  };

  const handleCreateAppointment = () => {
    const newAppointment = {
      id: `APT${String(appointments.length + 1).padStart(3, "0")}`,
      doctor: appointmentData.doctor,
      doctorSpecialty: getDoctorSpecialty(appointmentData.doctor),
      date: appointmentData.date,
      time: appointmentData.time,
      duration: 30,
      type: appointmentData.type,
      status: "pending",
      location:
        appointmentData.type === "Video Call"
          ? "Online - Zoom"
          : "Main Clinic - Room 201",
      reason: appointmentData.reason,
      notes: appointmentData.notes,
    };
    setAppointments([newAppointment, ...appointments]);
    setShowBookAppointmentModal(false);
  };

  const handleCancelConfirm = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, status: "cancelled" }
          : apt
      );
      setAppointments(updatedAppointments);
      setShowCancelModal(false);
    }
  };

  const handleRescheduleConfirm = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, date: rescheduleData.date, time: rescheduleData.time }
          : apt
      );
      setAppointments(updatedAppointments);
      setShowRescheduleModal(false);
    }
  };

  const handleConfirmConfirm = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, status: "confirmed" }
          : apt
      );
      setAppointments(updatedAppointments);
      setShowConfirmModal(false);
    }
  };

  const getDoctorSpecialty = (doctorName: string) => {
    const specialties: { [key: string]: string } = {
      "Dr. Sarah Johnson": "Cardiologist",
      "Dr. Michael Chen": "General Practitioner",
      "Dr. Emily Rodriguez": "Dermatologist",
      "Dr. David Wilson": "Orthopedist",
      "Dr. Lisa Anderson": "Pediatrician",
    };
    return specialties[doctorName] || "General Practitioner";
  };

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
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            View and manage your medical appointments
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleBookAppointment}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by doctor, reason, or appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredAppointments.map((appointment) => {
          const TypeIcon = getTypeIcon(appointment.type);
          return (
            <div
              key={appointment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {appointment.doctor}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
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
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {appointment.type}
                      </span>
                    </div>
                  </div>
                  <TypeIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.date} at {appointment.time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Duration: {appointment.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.location}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Reason:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.reason}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Notes:
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                  {appointment.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  {appointment.status === "pending" && (
                    <button
                      onClick={() => handleConfirmAppointment(appointment)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Confirm
                    </button>
                  )}
                  {(appointment.status === "confirmed" ||
                    appointment.status === "pending") && (
                    <button
                      onClick={() => handleRescheduleAppointment(appointment)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No appointments found matching your search criteria.
          </p>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Book New Appointment
              </h2>
              <button
                onClick={() => setShowBookAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctor *
                </label>
                <select
                  value={appointmentData.doctor}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      doctor: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select doctor</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                  <option value="Dr. Emily Rodriguez">
                    Dr. Emily Rodriguez
                  </option>
                  <option value="Dr. David Wilson">Dr. David Wilson</option>
                  <option value="Dr. Lisa Anderson">Dr. Lisa Anderson</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Time *
                  </label>
                  <select
                    value={appointmentData.time}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Appointment Type *
                </label>
                <select
                  value={appointmentData.type}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select type</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Video Call">Video Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  value={appointmentData.reason}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      reason: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the reason for your appointment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={appointmentData.notes}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Any additional information or special requests"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowBookAppointmentModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAppointment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Cancel Appointment
              </h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.doctor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Reschedule Appointment
              </h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <RotateCcw className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.doctor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Current: {selectedAppointment.date} at{" "}
                    {selectedAppointment.time}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Date *
                </label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Time *
                </label>
                <select
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      time: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRescheduleConfirm}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Appointment Modal */}
      {showConfirmModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Appointment
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.doctor}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to confirm this appointment? You will
                receive a confirmation email.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
