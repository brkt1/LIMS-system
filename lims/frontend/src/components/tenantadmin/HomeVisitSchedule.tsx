import {
    Edit,
    Eye,
    MapPin,
    Play,
    Plus,
    Search,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { homeVisitScheduleAPI } from "../../services/api";

const HomeVisitSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);
  const [showViewVisitModal, setShowViewVisitModal] = useState(false);
  const [showStartVisitModal, setShowStartVisitModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  // Form states
  const [newVisit, setNewVisit] = useState({
    patientName: "",
    patientId: "",
    address: "",
    phone: "",
    scheduledDate: "",
    scheduledTime: "",
    serviceType: "",
    doctor: "",
    notes: "",
    priority: "normal",
    estimatedDuration: "",
  });

  const [rescheduleData, setRescheduleData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    notes: "",
  });

  const [scheduledVisits, setScheduledVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Load home visit schedules from backend API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await homeVisitScheduleAPI.getAll();

        // Map backend data to frontend expected format
        const mappedSchedules = response.data.map((schedule: any) => ({
          id: schedule.id,
          patientName: schedule.patient_name,
          patientId: schedule.patient_id,
          address: schedule.address,
          phone: schedule.phone,
          scheduledDate: schedule.scheduled_date,
          scheduledTime: schedule.scheduled_time,
          status: schedule.status,
          serviceType: schedule.service_type,
          doctor: schedule.doctor,
          estimatedDuration: schedule.estimated_duration,
          notes: schedule.notes || "",
          priority: "normal", // Default priority since backend doesn't have it
        }));

        setScheduledVisits(mappedSchedules);
      } catch (error: any) {
        console.error("Error fetching home visit schedules:", error);
        setError(error.message || "Failed to load home visit schedules");
        // Set empty array when API fails
        setScheduledVisits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

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

  // Handler functions
  const handleScheduleVisit = () => {
    setNewVisit({
      patientName: "",
      patientId: "",
      address: "",
      phone: "",
      scheduledDate: "",
      scheduledTime: "",
      serviceType: "",
      doctor: "",
      notes: "",
      priority: "normal",
      estimatedDuration: "",
    });
    setShowScheduleVisitModal(true);
  };

  const handleViewVisit = (visit: any) => {
    setSelectedVisit(visit);
    setShowViewVisitModal(true);
  };

  const handleStartVisit = (visit: any) => {
    setSelectedVisit(visit);
    setShowStartVisitModal(true);
  };

  const handleRescheduleVisit = (visit: any) => {
    setSelectedVisit(visit);
    setRescheduleData({
      scheduledDate: visit.scheduledDate,
      scheduledTime: visit.scheduledTime,
      notes: visit.notes,
    });
    setShowRescheduleModal(true);
  };

  const handleCreateVisit = () => {
    const newId = `HV${String(scheduledVisits.length + 1).padStart(3, "0")}`;
    const visit = {
      ...newVisit,
      id: newId,
      status: "scheduled",
    };
    setScheduledVisits([...scheduledVisits, visit]);
    setShowScheduleVisitModal(false);
  };

  const handleStartVisitConfirm = () => {
    if (selectedVisit) {
      setScheduledVisits(
        scheduledVisits.map((visit) =>
          visit.id === selectedVisit.id
            ? { ...visit, status: "in-progress" }
            : visit
        )
      );
      setShowStartVisitModal(false);
    }
  };

  const handleRescheduleConfirm = () => {
    if (selectedVisit) {
      setScheduledVisits(
        scheduledVisits.map((visit) =>
          visit.id === selectedVisit.id
            ? {
                ...visit,
                scheduledDate: rescheduleData.scheduledDate,
                scheduledTime: rescheduleData.scheduledTime,
                notes: rescheduleData.notes,
              }
            : visit
        )
      );
      setShowRescheduleModal(false);
    }
  };

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

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Home Visit Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Schedule and manage home visits
          </p>
        </div>
        <button
          onClick={handleScheduleVisit}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
        >
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
            Loading home visit schedules...
          </span>
        </div>
      )}

      {/* Schedule Table */}
      {!loading && (
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
                  <tr
                    key={visit.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700"
                  >
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
                        <button
                          onClick={() => handleViewVisit(visit)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-left flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {visit.status === "scheduled" && (
                          <button
                            onClick={() => handleStartVisit(visit)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-left flex items-center"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </button>
                        )}
                        <button
                          onClick={() => handleRescheduleVisit(visit)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-left flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
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
      )}

      {/* Schedule Visit Modal */}
      {showScheduleVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Home Visit
              </h3>
              <button
                onClick={() => setShowScheduleVisitModal(false)}
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
                    value={newVisit.patientName}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, patientName: e.target.value })
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
                    value={newVisit.patientId}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, patientId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newVisit.phone}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={newVisit.serviceType}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, serviceType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select service type</option>
                    <option value="Blood Collection">Blood Collection</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="COVID-19 Test">COVID-19 Test</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Physical Examination">
                      Physical Examination
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={newVisit.scheduledDate}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        scheduledDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Time *
                  </label>
                  <input
                    type="time"
                    value={newVisit.scheduledTime}
                    onChange={(e) =>
                      setNewVisit({
                        ...newVisit,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Doctor *
                  </label>
                  <input
                    type="text"
                    value={newVisit.doctor}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, doctor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter doctor name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newVisit.priority}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={newVisit.address}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newVisit.notes}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter any additional notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowScheduleVisitModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVisit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Visit Modal */}
      {showViewVisitModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Visit Details - {selectedVisit.id}
              </h3>
              <button
                onClick={() => setShowViewVisitModal(false)}
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
                    {selectedVisit.patientName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Patient ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.patientId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Service Type
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.serviceType}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.doctor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedVisit.priority
                    )}`}
                  >
                    {selectedVisit.priority.charAt(0).toUpperCase() +
                      selectedVisit.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedVisit.status
                    )}`}
                  >
                    {selectedVisit.status.charAt(0).toUpperCase() +
                      selectedVisit.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scheduled Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.scheduledDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scheduled Time
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.scheduledTime}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Duration
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.estimatedDuration}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.address}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedVisit.notes || "No notes provided"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowViewVisitModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Visit Modal */}
      {showStartVisitModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Start Visit
              </h3>
              <button
                onClick={() => setShowStartVisitModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you ready to start the home visit for{" "}
                <strong>{selectedVisit.patientName}</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Service:</strong> {selectedVisit.serviceType}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Scheduled:</strong> {selectedVisit.scheduledDate} at{" "}
                  {selectedVisit.scheduledTime}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Doctor:</strong> {selectedVisit.doctor}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Address:</strong> {selectedVisit.address}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowStartVisitModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartVisitConfirm}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Visit Modal */}
      {showRescheduleModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reschedule Visit
              </h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Date *
                </label>
                <input
                  type="date"
                  value={rescheduleData.scheduledDate}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      scheduledDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Time *
                </label>
                <input
                  type="time"
                  value={rescheduleData.scheduledTime}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      scheduledTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={rescheduleData.notes}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter reason for rescheduling"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reschedule Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeVisitSchedule;
