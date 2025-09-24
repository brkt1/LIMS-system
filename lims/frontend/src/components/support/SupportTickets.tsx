import {
  AlertCircle,
  Clock,
  Plus,
  Search,
  Ticket,
  TrendingUp,
  X,
  Eye,
  UserPlus,
  Edit,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const SupportTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // State management for modals
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showViewTicketModal, setShowViewTicketModal] = useState(false);
  const [showAssignTicketModal, setShowAssignTicketModal] = useState(false);
  const [showUpdateTicketModal, setShowUpdateTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form states
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    reporter: "",
    reporterEmail: "",
    tags: "",
  });

  const [assignData, setAssignData] = useState({
    assignedTo: "",
    notes: "",
  });

  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    notes: "",
  });

  // Tickets data state
  const [tickets, setTickets] = useState([
    {
      id: "TKT001",
      title: "Login Issues - User Cannot Access Dashboard",
      description:
        "User reports being unable to log into their dashboard after password reset",
      status: "open",
      priority: "high",
      category: "Authentication",
      reporter: "Dr. Sarah Johnson",
      reporterEmail: "sarah.johnson@clinic.com",
      assignedTo: "Support Team",
      createdDate: "2025-01-22",
      createdTime: "09:30 AM",
      lastUpdated: "2025-01-22 10:15 AM",
      tags: ["login", "dashboard", "authentication"],
    },
    {
      id: "TKT002",
      title: "Test Report Generation Error",
      description: "System fails to generate PDF reports for completed tests",
      status: "in_progress",
      priority: "urgent",
      category: "Reports",
      reporter: "Mike Davis",
      reporterEmail: "mike.davis@clinic.com",
      assignedTo: "Technical Support",
      createdDate: "2025-01-21",
      createdTime: "2:45 PM",
      lastUpdated: "2025-01-22 08:30 AM",
      tags: ["reports", "pdf", "generation"],
    },
    {
      id: "TKT003",
      title: "Equipment Status Not Updating",
      description: "Equipment maintenance status not reflecting in the system",
      status: "resolved",
      priority: "medium",
      category: "Equipment",
      reporter: "Lisa Wilson",
      reporterEmail: "lisa.wilson@clinic.com",
      assignedTo: "Support Team",
      createdDate: "2025-01-20",
      createdTime: "11:20 AM",
      lastUpdated: "2025-01-21 3:15 PM",
      tags: ["equipment", "maintenance", "status"],
    },
    {
      id: "TKT004",
      title: "Patient Data Export Issue",
      description: "Cannot export patient data in CSV format",
      status: "open",
      priority: "low",
      category: "Data Export",
      reporter: "Robert Brown",
      reporterEmail: "robert.brown@clinic.com",
      assignedTo: "Unassigned",
      createdDate: "2025-01-22",
      createdTime: "1:15 PM",
      lastUpdated: "2025-01-22 1:15 PM",
      tags: ["export", "csv", "patient-data"],
    },
    {
      id: "TKT005",
      title: "Notification System Down",
      description: "Email notifications not being sent to users",
      status: "in_progress",
      priority: "high",
      category: "Notifications",
      reporter: "Jennifer Smith",
      reporterEmail: "jennifer.smith@clinic.com",
      assignedTo: "Technical Support",
      createdDate: "2025-01-21",
      createdTime: "4:30 PM",
      lastUpdated: "2025-01-22 09:45 AM",
      tags: ["notifications", "email", "system"],
    },
  ]);

  // Load tickets from localStorage on component mount
  useEffect(() => {
    const savedTickets = localStorage.getItem("supportTickets");
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem("supportTickets", JSON.stringify(tickets));
  }, [tickets]);

  // Handler functions
  const handleNewTicket = () => {
    setNewTicket({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      reporter: "",
      reporterEmail: "",
      tags: "",
    });
    setShowNewTicketModal(true);
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowViewTicketModal(true);
  };

  const handleAssignTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setAssignData({
      assignedTo: ticket.assignedTo || "",
      notes: "",
    });
    setShowAssignTicketModal(true);
  };

  const handleUpdateTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setUpdateData({
      status: ticket.status,
      priority: ticket.priority,
      notes: "",
    });
    setShowUpdateTicketModal(true);
  };

  const handleCreateTicket = () => {
    const newTicketData = {
      id: `TKT${String(tickets.length + 1).padStart(3, "0")}`,
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      category: newTicket.category,
      reporter: newTicket.reporter,
      reporterEmail: newTicket.reporterEmail,
      assignedTo: "Unassigned",
      createdDate: new Date().toLocaleDateString(),
      createdTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      lastUpdated: new Date().toLocaleString(),
      tags: newTicket.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };
    setTickets([newTicketData, ...tickets]);
    setShowNewTicketModal(false);
  };

  const handleAssignSubmit = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              assignedTo: assignData.assignedTo,
              lastUpdated: new Date().toLocaleString(),
            }
          : ticket
      );
      setTickets(updatedTickets);
      setShowAssignTicketModal(false);
      setSelectedTicket(null);
    }
  };

  const handleUpdateSubmit = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              status: updateData.status,
              priority: updateData.priority,
              lastUpdated: new Date().toLocaleString(),
            }
          : ticket
      );
      setTickets(updatedTickets);
      setShowUpdateTicketModal(false);
      setSelectedTicket(null);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "high":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
        );
      case "in_progress":
        return (
          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "resolved":
        return (
          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      default:
        return <Ticket className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage and track customer support tickets
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleNewTicket}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
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
              placeholder="Search by title, description, reporter, or ticket ID..."
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
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {getStatusIcon(ticket.status)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {ticket.id}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                          {ticket.title}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {ticket.tags.map((tag) => `#${tag}`).join(" ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.reporter}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {ticket.reporterEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ticket.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority.charAt(0).toUpperCase() +
                        ticket.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ").charAt(0).toUpperCase() +
                        ticket.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ticket.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>{ticket.createdDate}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.createdTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleAssignTicket(ticket)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Assign</span>
                      </button>
                      <button
                        onClick={() => handleUpdateTicket(ticket)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Update</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Create New Ticket
              </h2>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter ticket title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Reports">Reports</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Data Export">Data Export</option>
                    <option value="Notifications">Notifications</option>
                    <option value="System">System</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the issue in detail"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reporter Name *
                  </label>
                  <input
                    type="text"
                    value={newTicket.reporter}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, reporter: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter reporter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reporter Email *
                  </label>
                  <input
                    type="email"
                    value={newTicket.reporterEmail}
                    onChange={(e) =>
                      setNewTicket({
                        ...newTicket,
                        reporterEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter reporter email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newTicket.tags}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ticket Modal */}
      {showViewTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Ticket Details - {selectedTicket.id}
              </h2>
              <button
                onClick={() => setShowViewTicketModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTicket.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedTicket.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status
                      .replace("_", " ")
                      .charAt(0)
                      .toUpperCase() +
                      selectedTicket.status.replace("_", " ").slice(1)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                      selectedTicket.priority
                    )}`}
                  >
                    {selectedTicket.priority.charAt(0).toUpperCase() +
                      selectedTicket.priority.slice(1)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTicket.category}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assigned To
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTicket.assignedTo}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reporter
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTicket.reporter}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedTicket.reporterEmail}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedTicket.createdDate}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedTicket.createdTime}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedTicket.lastUpdated}
                </p>
              </div>
              {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowViewTicketModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Ticket Modal */}
      {showAssignTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Assign Ticket
              </h2>
              <button
                onClick={() => setShowAssignTicketModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTicket.id} - {selectedTicket.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Assignment: {selectedTicket.assignedTo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign To
                </label>
                <select
                  value={assignData.assignedTo}
                  onChange={(e) =>
                    setAssignData({ ...assignData, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select assignee</option>
                  <option value="Support Team">Support Team</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Development Team">Development Team</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  value={assignData.notes}
                  onChange={(e) =>
                    setAssignData({ ...assignData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any notes about this assignment"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowAssignTicketModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Assign Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Ticket Modal */}
      {showUpdateTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Update Ticket
              </h2>
              <button
                onClick={() => setShowUpdateTicketModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {selectedTicket.id} - {selectedTicket.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Status: {selectedTicket.status} | Priority:{" "}
                  {selectedTicket.priority}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Update Notes (Optional)
                </label>
                <textarea
                  value={updateData.notes}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter any notes about this update"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setShowUpdateTicketModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
