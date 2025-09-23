import {
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  Ticket,
  Clock,
  CheckCircle,
} from "lucide-react";
import React, { useState } from "react";

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

  const supportTickets = [
    {
      id: "TKT001",
      subject: "Unable to access test results",
      description:
        "I'm having trouble viewing my recent blood test results. The page keeps loading but doesn't show the results.",
      status: "open",
      priority: "high",
      category: "Technical",
      createdDate: "2025-01-22",
      createdTime: "10:30 AM",
      lastUpdated: "2025-01-22 2:15 PM",
      assignedTo: "Support Team",
    },
    {
      id: "TKT002",
      subject: "Appointment booking issue",
      description:
        "When I try to book an appointment, the calendar doesn't show available time slots for next week.",
      status: "in_progress",
      priority: "medium",
      category: "Appointments",
      createdDate: "2025-01-21",
      createdTime: "3:45 PM",
      lastUpdated: "2025-01-21 4:20 PM",
      assignedTo: "Sarah Johnson",
    },
    {
      id: "TKT003",
      subject: "Password reset not working",
      description:
        "I requested a password reset but didn't receive the email. I've checked my spam folder as well.",
      status: "resolved",
      priority: "low",
      category: "Account",
      createdDate: "2025-01-20",
      createdTime: "11:20 AM",
      lastUpdated: "2025-01-20 1:30 PM",
      assignedTo: "Mike Davis",
    },
    {
      id: "TKT004",
      subject: "Video consultation technical issues",
      description:
        "During my video consultation yesterday, the audio was cutting in and out. This made it difficult to communicate with my doctor.",
      status: "open",
      priority: "medium",
      category: "Technical",
      createdDate: "2025-01-19",
      createdTime: "2:15 PM",
      lastUpdated: "2025-01-19 3:00 PM",
      assignedTo: "Support Team",
    },
  ];

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
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">
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
        <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <Phone className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Call Us</h3>
            <p className="text-sm text-gray-600">(555) 123-4567</p>
          </div>
        </button>
        <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <Mail className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Email Us</h3>
            <p className="text-sm text-gray-600">support@clinic.com</p>
          </div>
        </button>
        <button className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Live Chat</h3>
            <p className="text-sm text-gray-600">Available 24/7</p>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
            </div>
            <Ticket className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-red-600">{openTickets}</p>
            </div>
            <Clock className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {inProgressTickets}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {resolvedTickets}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* New Ticket Form Modal */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Support Ticket
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="appointments">Appointments</option>
                  <option value="account">Account</option>
                  <option value="billing">Billing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your issue"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
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
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
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
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {ticket.category}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Created: {ticket.createdDate}</p>
                  <p>ID: {ticket.id}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
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
          <Headphones className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No support tickets found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Support;
