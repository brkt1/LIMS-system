import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  appointmentAPI,
  messageAPI,
  patientMessageAPI,
  patientTestResultAPI,
} from "../../services/api";
import BaseDashboard from "./BaseDashboard";

const PatientDashboard: React.FC = () => {
  const { t } = useLanguage();

  // State management for modals
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showBookAppointmentModal, setShowBookAppointmentModal] =
    useState(false);
  const [showViewResultModal, setShowViewResultModal] = useState(false);
  const [showGetHelpModal, setShowGetHelpModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  // Form states
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    message: "",
    priority: "normal",
  });

  const [replyMessage, setReplyMessage] = useState({
    message: "",
  });

  const [appointmentData, setAppointmentData] = useState({
    doctor: "",
    date: "",
    time: "",
    type: "",
    reason: "",
  });

  // Messages data state
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Test results data state
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testResultsLoading, setTestResultsLoading] = useState(true);
  const [testResultsError, setTestResultsError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    fetchMessages();
    fetchTestResults();
  }, []);

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError(null);
      // For now, get all messages - in a real app, this would be filtered by patient ID
      const response = await patientMessageAPI.getAll();
      console.log("💬 Messages fetched:", response.data);
      setMessages(response.data);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setMessagesError(err.message || "Failed to fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchTestResults = async () => {
    try {
      setTestResultsLoading(true);
      setTestResultsError(null);
      // For now, get all test reports - in a real app, this would be filtered by patient ID
      const response = await patientTestResultAPI.getAll();
      console.log("📊 Test Results fetched:", response.data);
      setTestResults(response.data);
    } catch (err: any) {
      console.error("Error fetching test results:", err);
      setTestResultsError(err.message || "Failed to fetch test results");
    } finally {
      setTestResultsLoading(false);
    }
  };

  // Handler functions
  const handleNewMessage = () => {
    setNewMessage({
      to: "",
      subject: "",
      message: "",
      priority: "normal",
    });
    setShowNewMessageModal(true);
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await messageAPI.markAsRead(messageId);
      // Refresh messages to get updated status
      fetchMessages();
    } catch (err: any) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setReplyMessage({ message: "" });
    setShowReplyModal(true);
  };

  const handleSendNewMessage = async () => {
    try {
      const messageData = {
        sender_id: "P001", // In real app, this would come from user context
        sender_name: "Current Patient",
        recipient_id: newMessage.to,
        recipient_name: newMessage.to,
        subject: newMessage.subject,
        message_body: newMessage.message,
        message_type: "General",
        status: "Unread",
        is_urgent: newMessage.priority === "urgent",
      };

      await messageAPI.create(messageData);
      setShowNewMessageModal(false);
      fetchMessages(); // Refresh the list
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleSendReply = async () => {
    try {
      const replyData = {
        sender_id: "P001", // In real app, this would come from user context
        sender_name: "Current Patient",
        recipient_id: selectedMessage.sender_id,
        recipient_name: selectedMessage.sender_name,
        subject: `Re: ${selectedMessage.subject}`,
        message_body: replyMessage.message,
        message_type: "General",
        status: "Unread",
        is_urgent: false,
      };

      await messageAPI.create(replyData);
      setShowReplyModal(false);
      fetchMessages(); // Refresh the list
    } catch (err: any) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply. Please try again.");
    }
  };

  const handleBookNow = () => {
    setAppointmentData({
      doctor: "",
      date: "",
      time: "",
      type: "",
      reason: "",
    });
    setShowBookAppointmentModal(true);
  };

  const handleBookAppointment = async () => {
    try {
      console.log("Booking appointment:", appointmentData);

      const appointmentPayload = {
        patient_name: "Current Patient", // In real app, this would come from user context
        patient_id: "P001", // In real app, this would come from user context
        doctor_name: appointmentData.doctor,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        appointment_type: appointmentData.type,
        reason: appointmentData.reason,
        status: "Pending",
      };

      await appointmentAPI.create(appointmentPayload);
      setShowBookAppointmentModal(false);
      alert(
        "Appointment request submitted successfully! You will receive a confirmation soon."
      );
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleViewResult = (test: any) => {
    setSelectedTest(test);
    setShowViewResultModal(true);
  };

  const handleDownloadResult = (test: any) => {
    if (test.fileUrl) {
      // Simulate file download
      const content = `Test Result: ${test.test}\n\nDate: ${test.date}\nResult: ${test.result}\n\nDetails:\n${test.details}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${test.test.replace(/\s+/g, "_")}_${test.date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleGetHelp = () => {
    setShowGetHelpModal(true);
  };

  const patientCards = [
    {
      title: t("patient.upcomingAppointments"),
      value: "2",
      change: `${t("patient.next")}: ${t("patient.tomorrow")} 10:00 AM`,
      color: "bg-blue-500",
      chartData: [1, 2, 1, 3, 2, 2, 2],
    },
    {
      title: t("patient.testResultsAvailable"),
      value: "5",
      change: `3 ${t("patient.newThisWeek")}`,
      color: "bg-green-500",
      chartData: [2, 3, 4, 4, 5, 5, 5],
    },
    {
      title: t("patient.messagesFromDoctor"),
      value: "3",
      change: `1 ${t("patient.unread")}`,
      color: "bg-purple-500",
      chartData: [1, 2, 2, 3, 3, 3, 3],
    },
    {
      title: t("patient.healthScore"),
      value: "85%",
      change: `+5% ${t("patient.thisMonth")}`,
      color: "bg-emerald-500",
      chartData: [75, 78, 80, 82, 83, 84, 85],
    },
  ];

  return (
    <BaseDashboard>
      {/* Patient specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {patientCards.map((card, index) => (
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
                {index === 2 && (
                  <MessageSquare className="w-4 h-4 text-white" />
                )}
                {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
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

      {/* Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("patient.upcomingAppointments")}
            </h3>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                date: `${t("patient.tomorrow")}, Jan 21`,
                time: "10:00 AM",
                doctor: "Dr. Sarah Johnson",
                type: t("patient.followUp"),
                status: t("patient.confirmed"),
              },
              {
                date: "Friday, Jan 24",
                time: "2:30 PM",
                doctor: "Dr. Mike Chen",
                type: t("patient.consultation"),
                status: t("patient.confirmed"),
              },
              {
                date: "Next Monday, Jan 27",
                time: "9:15 AM",
                doctor: "Dr. Lisa Rodriguez",
                type: t("patient.testReview"),
                status: t("patient.pending"),
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.time} - {appointment.doctor}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.type}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("patient.recentTestResults")}
            </h3>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {testResultsLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("patient.loadingTestResults")}
                  </p>
                </div>
              </div>
            ) : testResultsError ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {testResultsError}
                  </p>
                </div>
              </div>
            ) : testResults.length === 0 ? (
              <div className="flex items-center justify-center p-6">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("patient.noTestResultsAvailable")}
                  </p>
                </div>
              </div>
            ) : (
              testResults.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        test.status === "Completed" ||
                        test.status === "Available"
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-yellow-100 dark:bg-yellow-900"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 ${
                          test.status === "Completed" ||
                          test.status === "Available"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {test.test_name || test.test_type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(test.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        test.status === "Completed" ||
                        test.status === "Available"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : test.status === "Pending" ||
                            test.status === "Processing"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {test.status}
                    </span>
                    {(test.status === "Completed" ||
                      test.status === "Available") && (
                      <button
                        onClick={() => handleViewResult(test)}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Messages from Healthcare Team */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Messages from Healthcare Team
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewMessage}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              New Message
            </button>
            <MessageSquare className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="space-y-4">
          {messagesLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : messagesError ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-500 dark:text-red-400">
                  {messagesError}
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No messages available
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  message.status === "Unread"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {message.sender_name}
                        </p>
                        {message.status === "Unread" && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {message.message_body}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      message.status === "Unread"
                        ? handleMarkAsRead(message.id)
                        : handleReply(message)
                    }
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {message.status === "Unread" ? "Mark as Read" : "Reply"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Book Appointment
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Schedule your next visit with our healthcare team
          </p>
          <button
            onClick={handleBookNow}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            View Test Results
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Access your latest test results and reports
          </p>
          <button
            onClick={() => handleViewResult(testResults[0])}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            View Results
          </button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Get Help
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Find answers to common questions and get support
          </p>
          <button
            onClick={handleGetHelp}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Get Help
          </button>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                New Message
              </h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To *
                </label>
                <select
                  value={newMessage.to}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select recipient</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Dr. Mike Chen">Dr. Mike Chen</option>
                  <option value="Dr. Lisa Rodriguez">Dr. Lisa Rodriguez</option>
                  <option value="Nurse Lisa">Nurse Lisa</option>
                  <option value="Lab Technician Mike">
                    Lab Technician Mike
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newMessage.priority}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your message"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNewMessage}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Reply to {selectedMessage.from}
              </h2>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Original Message: {selectedMessage.subject}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedMessage.message}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Reply *
                </label>
                <textarea
                  value={replyMessage.message}
                  onChange={(e) =>
                    setReplyMessage({
                      ...replyMessage,
                      message: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your reply"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
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
                  <option value="Dr. Mike Chen">Dr. Mike Chen</option>
                  <option value="Dr. Lisa Rodriguez">Dr. Lisa Rodriguez</option>
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
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
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
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Test Review">Test Review</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for Visit *
                </label>
                <textarea
                  value={appointmentData.reason}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      reason: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the reason for your appointment"
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
                onClick={handleBookAppointment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Result Modal */}
      {showViewResultModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Test Result Details
              </h2>
              <button
                onClick={() => setShowViewResultModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTest.test}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedTest.details}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Test Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTest.date}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Result
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedTest.result === "Normal" ||
                      selectedTest.result === "Clear"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : selectedTest.result === "Pending"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {selectedTest.result}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedTest.status === "Available"
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                      : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  }`}
                >
                  {selectedTest.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowViewResultModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              {selectedTest.status === "Available" && (
                <button
                  onClick={() => handleDownloadResult(selectedTest)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Download Result
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Get Help Modal */}
      {showGetHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Help & Support
              </h2>
              <button
                onClick={() => setShowGetHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      <strong>Q:</strong> How do I view my test results?
                    </p>
                    <p>
                      <strong>A:</strong> Click on "View Results" in the test
                      results section or use the "View Test Results" quick
                      action button.
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      <strong>Phone:</strong> (555) 123-4567
                    </p>
                    <p>
                      <strong>Email:</strong> support@medicare.com
                    </p>
                    <p>
                      <strong>Hours:</strong> Monday-Friday, 8:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Emergency Contact
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>
                      <strong>Emergency Line:</strong> (555) 911-HELP
                    </p>
                    <p>
                      <strong>Available:</strong> 24/7 for urgent medical
                      concerns
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowGetHelpModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowGetHelpModal(false);
                  handleNewMessage();
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseDashboard>
  );
};

export default PatientDashboard;
