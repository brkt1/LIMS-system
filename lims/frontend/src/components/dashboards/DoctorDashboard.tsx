import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { appointmentAPI, patientAPI, testRequestAPI } from "../../services/api";
import BaseDashboard from "./BaseDashboard";

const DoctorDashboard: React.FC = () => {
  const { t } = useLanguage();
  
  // State for modals and CRUD operations
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Test requests data with state management
  const [testRequests, setTestRequests] = useState<any[]>([]);
  const [testRequestsLoading, setTestRequestsLoading] = useState(true);
  const [testRequestsError, setTestRequestsError] = useState<string | null>(
    null
  );

  // Appointments data with state management
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );

  // Patients data with state management
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchTestRequests();
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchTestRequests = async () => {
    try {
      setTestRequestsLoading(true);
      setTestRequestsError(null);
      const response = await testRequestAPI.getAll();
      console.log("🔍 Test Requests fetched:", response.data);
      setTestRequests(response.data);
    } catch (err: any) {
      console.error("Error fetching test requests:", err);
      setTestRequestsError(err.message || "Failed to fetch test requests");
    } finally {
      setTestRequestsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      const response = await appointmentAPI.getAll();
      console.log("📅 Appointments fetched:", response.data);
      setAppointments(response.data);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
      setAppointmentsError(err.message || "Failed to fetch appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      setPatientsLoading(true);
      setPatientsError(null);
      const response = await patientAPI.getAll();
      console.log("👥 Patients fetched:", response.data);
      setPatients(response.data);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setPatientsError(err.message || "Failed to fetch patients");
    } finally {
      setPatientsLoading(false);
    }
  };

  // CRUD operation functions
  const handleNewRequest = () => {
    setShowNewRequestModal(true);
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleReviewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const handleTrackRequest = (request: any) => {
    setSelectedRequest(request);
    setShowTrackModal(true);
  };

  const handleCreateRequest = async (newRequest: any) => {
    try {
      console.log("🔍 Form data received:", newRequest);

      const requestData = {
        patient_id: newRequest.patientId,
        patient_name: newRequest.patient,
        test_type: newRequest.testType,
        priority: newRequest.priority,
        notes: newRequest.doctorNotes || "",
        date_requested: newRequest.requestedDate,
        status: "Pending",
      };

      console.log("📤 Sending request data:", requestData);
      const response = await testRequestAPI.create(requestData);
      console.log("✅ Request created successfully:", response.data);

      setShowNewRequestModal(false);
      fetchTestRequests(); // Refresh the list
    } catch (err: any) {
      console.error("❌ Error creating test request:", err);
      console.error("❌ Error details:", err.response?.data);
      setTestRequestsError(err.message || "Failed to create test request");
    }
  };

  const handleUpdateRequest = async (updatedRequest: any) => {
    try {
      const updateData = {
        patient_id: updatedRequest.patient_id,
        patient_name: updatedRequest.patient_name,
        test_type: updatedRequest.test_type,
        priority: updatedRequest.priority,
        notes: updatedRequest.notes,
        status: updatedRequest.status,
      };

      await testRequestAPI.update(updatedRequest.id, updateData);
      setShowReviewModal(false);
      setShowViewModal(false);
      fetchTestRequests(); // Refresh the list
    } catch (err: any) {
      console.error("Error updating test request:", err);
      setTestRequestsError(err.message || "Failed to update test request");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Approved":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "Completed":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "Urgent":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "Normal":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  // Calculate dynamic statistics from test requests data
  const getDashboardStats = () => {
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);

    // Calculate statistics from test requests
    const pendingRequests = testRequests.filter(
      (req) => req.status === "Pending"
    ).length;
    const completedRequests = testRequests.filter(
      (req) => req.status === "Completed"
    ).length;
    const approvedRequests = testRequests.filter(
      (req) => req.status === "Approved"
    ).length;
    const inProgressRequests = testRequests.filter(
      (req) => req.status === "In Progress"
    ).length;

    // Get unique patients from patients data
    const uniquePatients = patients.length;

    // Calculate changes based on real data
    const pendingChange = "0 Today";
    const completedChange = "0 This Week";
    const patientsChange = "0 This Month";

    return [
      {
        title: `${t('doctor.todaysAppointments')} - ${new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            weekday: "long",
          }
        )}`,
        value: (approvedRequests + inProgressRequests).toString(),
        change: `+2 ${t('doctor.thisWeek')}`,
        color: "bg-blue-500",
        chartData: [
          5,
          6,
          7,
          approvedRequests + inProgressRequests,
          6,
          7,
          approvedRequests + inProgressRequests,
        ],
      },
      {
        title: t('doctor.pendingTestRequests'),
        value: pendingRequests.toString(),
        change: `0 ${t('doctor.today')}`,
        color: "bg-orange-500",
        chartData: [18, 20, 17, pendingRequests, 16, 18, pendingRequests],
      },
      {
        title: t('doctor.completedTests'),
        value: completedRequests.toString(),
        change: `0 ${t('doctor.thisWeek')}`,
        color: "bg-green-500",
        chartData: [30, 32, 35, 38, 40, 41, completedRequests],
      },
      {
        title: t('doctor.activePatients'),
        value: uniquePatients.toString(),
        change: `0 ${t('doctor.thisMonth')}`,
        color: "bg-purple-500",
        chartData: [110, 115, 120, 122, 125, 126, uniquePatients],
      },
    ];
  };

  const doctorCards = getDashboardStats();

  return (
    <BaseDashboard>
      {/* Doctor specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {doctorCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Calendar className="w-4 h-4 text-white" />}
                {index === 1 && <FileText className="w-4 h-4 text-white" />}
                {index === 2 && <CheckCircle className="w-4 h-4 text-white" />}
                {index === 3 && <Users className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <div className="flex items-center space-x-1 text-green-600">
                <span className="text-sm font-medium">{card.change}</span>
              </div>
            </div>

            <div className="flex items-end space-x-1 h-8">
              {card.chartData.map((height, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-sm opacity-80`}
                  style={{
                    height: `${(height / Math.max(...card.chartData)) * 100}%`,
                    width: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('doctor.todaysSchedule')} -{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                weekday: "long",
              })}
            </h3>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {(() => {
              // Get today's appointments
              const today = new Date().toISOString().split("T")[0];
              const todaysAppointments = appointments.filter(
                (apt) => apt.appointment_date === today
              );

              // If no appointments for today, show message
              if (todaysAppointments.length === 0) {
                return (
                  <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('doctor.noAppointmentsScheduled')}
                      </p>
                    </div>
                  </div>
                );
              }

              // Display real appointments
              return todaysAppointments
                .slice(0, 5)
                .map((appointment, index) => {
                  const appointmentTime = new Date(
                    appointment.appointment_time
                  );
                  const timeString = appointmentTime.toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {timeString}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {appointment.patient_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {appointment.appointment_type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === "Confirmed" ||
                          appointment.status === "In Progress"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : appointment.status === "Completed"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  );
                });
            })()}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('doctor.recentTestResults')}
            </h3>
            <ClipboardList className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {(() => {
              // Get recent test results from test requests data
              const recentResults = testRequests
                .filter(
                  (req) =>
                    req.status === "Completed" || req.status === "In Progress"
                )
                .slice(0, 4);

              // If no recent results, show empty state
              if (recentResults.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('doctor.noRecentTestResults')}</p>
                  </div>
                );
              }

              // Transform test requests into test results format
              return recentResults.map((request, index) => {
                const getResultStatus = (status: string) => {
                  switch (status) {
                    case "Completed":
                      return t('doctor.normal');
                    case "In Progress":
                      return t('doctor.processing');
                    default:
                      return t('doctor.pending');
                  }
                };

                const getPriorityLevel = (priority: string) => {
                  switch (priority) {
                    case "Critical":
                      return t('doctor.high');
                    case "Urgent":
                      return t('doctor.medium');
                    case "Normal":
                      return t('doctor.low');
                    default:
                      return t('doctor.low');
                  }
                };

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getPriorityLevel(request.priority) === "High"
                            ? "bg-red-100 dark:bg-red-900"
                            : getPriorityLevel(request.priority) === "Medium"
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-green-100 dark:bg-green-900"
                        }`}
                      >
                        <Stethoscope
                          className={`w-4 h-4 ${
                            getPriorityLevel(request.priority) === "High"
                              ? "text-red-600 dark:text-red-400"
                              : getPriorityLevel(request.priority) === "Medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.patient_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {request.test_type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          getResultStatus(request.status) === "Normal"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : getResultStatus(request.status) === "Processing"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {getResultStatus(request.status)}
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Test Requests Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('doctor.testRequestsQueue')}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewRequest}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('doctor.newRequest')}</span>
            </button>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.patient')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.testType')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.priority')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.requestedDate')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.status')}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('doctor.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {testRequestsLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {t('doctor.loadingTestRequests')}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : testRequestsError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-red-600 dark:text-red-400"
                  >
                    Error: {testRequestsError}
                  </td>
                </tr>
              ) : testRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t('doctor.noTestRequestsFound')}
                  </td>
                </tr>
              ) : (
                testRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {request.patient_name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {request.test_type}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          request.priority
                        )}`}
                      >
                        {request.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                      {request.date_requested}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {request.status === "Pending" && (
                          <button
                            onClick={() => handleReviewRequest(request)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            <span>{t('doctor.review')}</span>
                          </button>
                        )}
                        {request.status === "Approved" && (
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t('doctor.view')}</span>
                          </button>
                        )}
                        {request.status === "In Progress" && (
                          <button
                            onClick={() => handleTrackRequest(request)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                          >
                            <Search className="w-3 h-3" />
                            <span>{t('doctor.track')}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Test Request
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const formObject = {
                  patient: formData.get("patient"),
                  testType: formData.get("testType"),
                  priority: formData.get("priority"),
                  requestedDate: formData.get("requestedDate"),
                  patientId: formData.get("patientId"),
                  doctorNotes: formData.get("doctorNotes"),
                };
                console.log("📝 Form submitted with data:", formObject);
                handleCreateRequest(formObject);
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
                    Test Type
                  </label>
                  <select
                    name="testType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Test Type</option>
                    <option value="Blood Panel Complete">
                      Blood Panel Complete
                    </option>
                    <option value="X-Ray Chest">X-Ray Chest</option>
                    <option value="MRI Brain">MRI Brain</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    name="requestedDate"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Doctor Notes
                  </label>
                  <textarea
                    name="doctorNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Request Details
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.patient}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.testType}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    selectedRequest.priority
                  )}`}
                >
                  {selectedRequest.priority}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requested Date:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.requestedDate}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doctor Notes:
                </span>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.doctorNotes}
                </p>
              </div>
              {selectedRequest.results && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Results:
                  </span>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.results}
                  </p>
                </div>
              )}
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

      {/* Review Request Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review Test Request
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateRequest({
                  ...selectedRequest,
                  priority: formData.get("priority"),
                  notes: formData.get("notes"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Patient:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.patient_name}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Test Type:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.test_type}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Status:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    defaultValue={selectedRequest.priority}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Review Notes
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={selectedRequest.notes || ""}
                    rows={3}
                    placeholder="Add review notes or comments..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Track Request Modal */}
      {showTrackModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Track Test Progress
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.patient}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Type:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {selectedRequest.testType}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Status:
                </span>
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progress Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Request Submitted
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.requestedDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedRequest.status !== "Pending"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Request Approved
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.status !== "Pending"
                        ? "2025-01-21"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedRequest.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Test In Progress
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedRequest.status === "In Progress"
                        ? "2025-01-22"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      Results Available
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTrackModal(false)}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseDashboard>
  );
};

export default DoctorDashboard;
