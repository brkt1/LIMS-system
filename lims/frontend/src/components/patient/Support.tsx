import {
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { patientSupportTicketAPI } from "../../services/api";

const Support: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general",
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // Load support tickets from API
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        setTicketsLoading(true);
        setTicketsError(null);
        const response = await patientSupportTicketAPI.getAll();
        console.log("🎫 Support tickets fetched:", response.data);
        setSupportTickets(response.data || []);
      } catch (error: any) {
        console.error("Error fetching support tickets:", error);
        setTicketsError(error.message || "Failed to fetch support tickets");
        setSupportTickets([]);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchSupportTickets();
  }, []);

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "in_progress":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "resolved":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "closed":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const handleSubmitTicket = () => {
    if (newTicket.subject && newTicket.description) {
      // Here you would typically submit the ticket to the backend
      console.log("Submitting ticket:", newTicket);
      alert("Support ticket submitted successfully!");
      setNewTicket({
        subject: "",
        description: "",
        priority: "medium",
        category: "general",
      });
      setShowNewTicketForm(false);
    }
  };

  // Contact handler functions
  const handleCallSupport = () => {
    const supportPhone = process.env.REACT_APP_SUPPORT_PHONE || "(555) 123-4567";
    const emergencyPhone = process.env.REACT_APP_EMERGENCY_PHONE || "(555) 911-HELP";
    const supportHours = process.env.REACT_APP_SUPPORT_HOURS || "Monday-Friday, 8:00 AM - 6:00 PM";
    
    alert(
      `Calling support...\n\nPhone: ${supportPhone}\nHours: ${supportHours}\n\nEmergency Line: ${emergencyPhone} (24/7)`
    );
  };

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Patient Support Request");
    const body = encodeURIComponent(
      `Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you.`
    );
    const supportEmail = process.env.REACT_APP_SUPPORT_EMAIL || "support@clinic.com";
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`);
  };

  const handleLiveChat = () => {
    const chatHours = process.env.REACT_APP_CHAT_HOURS || "Monday-Friday, 9:00 AM - 5:00 PM";
    alert(
      `Live Chat Support\n\nConnecting you to our support team...\n\nAvailable: ${chatHours}\n\nA support agent will be with you shortly.`
    );
  };

  const totalTickets = supportTickets.length;
  const openTickets = supportTickets.filter((t) => t.status === "open").length;
  const inProgressTickets = supportTickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const resolvedTickets = supportTickets.filter(
    (t) => t.status === "resolved"
  ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Get help with your account and services
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={handleCallSupport}
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          <Phone className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Call Us
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              (555) 123-4567
            </p>
          </div>
        </button>
        <button
          onClick={handleEmailSupport}
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          <Mail className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Email Us
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              support@clinic.com
            </p>
          </div>
        </button>
        <button
          onClick={handleLiveChat}
          className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Live Chat
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Available 24/7
            </p>
          </div>
        </button>
      </div>

      {/* New Ticket Form Modal */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Support Ticket
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="appointments">Appointments</option>
                  <option value="account">Account</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your issue"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
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
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Support Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {ticket.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {ticket.category}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Created: {ticket.createdDate}</p>
                  <p>ID: {ticket.id}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>Assigned to: {ticket.assignedTo}</span>
                  <span>Last updated: {ticket.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <Headphones className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No support tickets found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Support;
