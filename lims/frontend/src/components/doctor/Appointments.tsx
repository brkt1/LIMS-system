import { Clock, Plus, Search, Eye, Check, X, RefreshCw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { appointmentAPI } from "../../services/api";

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // State for modals and CRUD operations
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Appointments data with state management
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );
  const [newlyCreatedAppointments, setNewlyCreatedAppointments] = useState<
    Set<string>
  >(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const response = await appointmentAPI.getAll();
      console.log("🔍 Appointments fetched:", response.data);

      // Ensure we have an array and sort by date/time
      const appointmentsData = Array.isArray(response.data)
        ? response.data
        : [];
      setAppointments(appointmentsData);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setAppointmentsError(err.message || "Failed to fetch appointments");
      // Don't clear existing appointments on error to maintain persistence
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Load appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // CRUD operation functions
  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleConfirmAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowConfirmModal(true);
  };

  const handleCancelAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCreateAppointment = async (newAppointment: any) => {
    try {
      const appointmentData = {
        patient_id: newAppointment.patientId,
        patient_name: newAppointment.patient,
        appointment_date: newAppointment.date,
        appointment_time: newAppointment.time,
        duration: parseInt(newAppointment.duration),
        appointment_type: newAppointment.type,
        status: "Scheduled",
        notes: newAppointment.notes,
      };

      const response = await appointmentAPI.create(appointmentData);
      console.log("✅ Appointment created successfully:", response.data);

      // Add the new appointment to the current list immediately
      const newAppointmentWithId = {
        ...appointmentData,
        id: response.data.id || Date.now(), // Use response ID or fallback
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setAppointments((prevAppointments) => [
        newAppointmentWithId,
        ...prevAppointments,
      ]);

      // Mark this appointment as newly created for visual highlighting
      const appointmentId = newAppointmentWithId.id.toString();
      setNewlyCreatedAppointments((prev) => new Set([...prev, appointmentId]));

      // Remove the highlight after 5 seconds
      setTimeout(() => {
        setNewlyCreatedAppointments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(appointmentId);
          return newSet;
        });
      }, 5000);

      setShowNewAppointmentModal(false);

      // Show success message
      setSuccessMessage(
        `Appointment created successfully for ${newAppointment.patient}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);

      // Also refresh from server to ensure consistency
      fetchAppointments();
    } catch (err: any) {
      console.error("Error creating appointment:", err);
      setAppointmentsError(err.message || "Failed to create appointment");
    }
  };

  const handleUpdateAppointmentStatus = async (
    appointmentId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      const appointment = appointments.find((apt) => apt.id === appointmentId);
      if (appointment) {
        const updateData = {
          ...appointment,
          status: newStatus,
          notes: notes || appointment.notes,
        };

        const response = await appointmentAPI.update(
          parseInt(appointmentId),
          updateData
        );
        console.log(
          "✅ Appointment status updated successfully:",
          response.data
        );

        // Update the appointment in the local state immediately
        setAppointments((prevAppointments) =>
          prevAppointments.map((apt) =>
            apt.id === appointmentId
              ? {
                  ...apt,
                  status: newStatus,
                  notes: notes || apt.notes,
                  updated_at: new Date().toISOString(),
                }
              : apt
          )
        );

        setShowConfirmModal(false);
        setShowCancelModal(false);

        // Also refresh from server to ensure consistency
        fetchAppointments();
      }
    } catch (err: any) {
      console.error("Error updating appointment:", err);
      setAppointmentsError(err.message || "Failed to update appointment");
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch =
        appointment.patient_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.appointment_type
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.id?.toString().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        appointment.status?.toLowerCase() === filterStatus.toLowerCase();
      const matchesDate = appointment.appointment_date === selectedDate;
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort by date first, then by time, with newest appointments first
      const dateA = new Date(a.appointment_date);
      const dateB = new Date(b.appointment_date);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime(); // Ascending date order
      }

      // If same date, sort by time
      const timeA = new Date(`2000-01-01T${a.appointment_time}`);
      const timeB = new Date(`2000-01-01T${b.appointment_time}`);
      return timeA.getTime() - timeB.getTime(); // Ascending time order
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "new patient":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "follow-up":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "consultation":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "test review":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Appointments
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage your patient appointments and schedule
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={fetchAppointments}
              disabled={appointmentsLoading}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  appointmentsLoading ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleNewAppointment}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, appointment type, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
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

        {/* Appointments List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Appointments for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Total: {appointments.length} appointment
                  {appointments.length !== 1 ? "s" : ""}
                </span>
                <span>
                  Showing: {filteredAppointments.length} appointment
                  {filteredAppointments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {appointmentsLoading ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Loading appointments...
              </div>
            ) : appointmentsError ? (
              <div className="p-4 sm:p-6 text-center text-red-500 dark:text-red-400 text-sm sm:text-base">
                Error: {appointmentsError}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No appointments found for the selected date and filters.
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const isNewlyCreated = newlyCreatedAppointments.has(
                  appointment.id.toString()
                );
                return (
                  <div
                    key={appointment.id}
                    className={`p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ${
                      isNewlyCreated
                        ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 shadow-md"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                              {appointment.patient_name}
                            </h4>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              ID: {appointment.patient_id}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {appointment.appointment_time} (
                              {appointment.duration} min)
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                appointment.appointment_type
                              )}`}
                            >
                              {appointment.appointment_type}
                            </span>
                          </div>
                          {appointment.notes && (
                            <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
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
                          <button
                            onClick={() => handleViewAppointment(appointment)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-xs sm:text-sm font-medium text-left transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          {appointment.status === "Pending" && (
                            <button
                              onClick={() =>
                                handleConfirmAppointment(appointment)
                              }
                              className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm font-medium text-left transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              <span>Confirm</span>
                            </button>
                          )}
                          {appointment.status !== "Cancelled" &&
                            appointment.status !== "Completed" && (
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appointment)
                                }
                                className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm font-medium text-left transition-colors"
                              >
                                <X className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Appointment
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleCreateAppointment({
                  patient: formData.get("patient"),
                  patientId: formData.get("patientId"),
                  time: formData.get("time"),
                  duration: formData.get("duration"),
                  type: formData.get("type"),
                  date: formData.get("date"),
                  notes: formData.get("notes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patient"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    name="patientId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      defaultValue={selectedDate}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="15 min">15 min</option>
                      <option value="30 min">30 min</option>
                      <option value="45 min">45 min</option>
                      <option value="60 min">60 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="New Patient">New Patient</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Test Review">Test Review</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes or instructions..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appointment Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appointment ID:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.id}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.patient_name}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient ID:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.patient_id}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date & Time:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.appointment_date} at{" "}
                  {selectedAppointment.appointment_time}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.duration} minutes
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                    selectedAppointment.appointment_type
                  )}`}
                >
                  {selectedAppointment.appointment_type}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedAppointment.notes || "No notes available"}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Appointment Modal */}
      {showConfirmModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Appointment
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to confirm this appointment for{" "}
                <strong>{selectedAppointment.patient_name}</strong>?
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateAppointmentStatus(
                  selectedAppointment.id,
                  "Confirmed",
                  formData.get("confirmationNotes") as string
                );
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmation Notes (Optional)
                </label>
                <textarea
                  name="confirmationNotes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Add any additional notes for the confirmation..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cancel Appointment
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to cancel this appointment for{" "}
                <strong>{selectedAppointment.patient_name}</strong>?
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateAppointmentStatus(
                  selectedAppointment.id,
                  "Cancelled",
                  formData.get("cancellationReason") as string
                );
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="cancellationReason"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  Cancel Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
