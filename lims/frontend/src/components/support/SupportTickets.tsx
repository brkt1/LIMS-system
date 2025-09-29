import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Plus,
  Search,
  Ticket,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { supportTicketAPI } from "../../services/api";
import { getCurrentTenantId, getCurrentUserId } from "../../utils/helpers";

const SupportTickets: React.FC = () => {
  const { t } = useLanguage();
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

  // State for available users for assignment
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    notes: "",
  });

  // Tickets data state
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await supportTicketAPI.getTickets();
        setTickets(response.data || []);
      } catch (error: any) {
        console.error("Error fetching support tickets:", error);
        setError(error.message || "Failed to load support tickets");
        // Fallback to empty array if API fails
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Function to fetch available users for assignment
  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);
      // Fetch users from the tenant admin API or user management API
      const response = await fetch("/api/tenantadmin/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      } else {
        // Fallback to a default list of users if API fails
        setAvailableUsers([
          {
            id: 1,
            username: "admin",
            first_name: "Admin",
            last_name: "User",
            role: "admin",
          },
          {
            id: 2,
            username: "tenantadmin",
            first_name: "Tenant",
            last_name: "Admin",
            role: "tenantadmin",
          },
          {
            id: 3,
            username: "doctor",
            first_name: "Dr.",
            last_name: "Smith",
            role: "doctor",
          },
          {
            id: 4,
            username: "technician",
            first_name: "Lab",
            last_name: "Technician",
            role: "technician",
          },
          {
            id: 9,
            username: "support",
            first_name: "Support",
            last_name: "Staff",
            role: "support",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback to default users
      setAvailableUsers([
        {
          id: 1,
          username: "admin",
          first_name: "Admin",
          last_name: "User",
          role: "admin",
        },
        {
          id: 2,
          username: "tenantadmin",
          first_name: "Tenant",
          last_name: "Admin",
          role: "tenantadmin",
        },
        {
          id: 3,
          username: "doctor",
          first_name: "Dr.",
          last_name: "Smith",
          role: "doctor",
        },
        {
          id: 4,
          username: "technician",
          first_name: "Lab",
          last_name: "Technician",
          role: "technician",
        },
        {
          id: 9,
          username: "support",
          first_name: "Support",
          last_name: "Staff",
          role: "support",
        },
      ]);
    } finally {
      setUsersLoading(false);
    }
  };

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
      assignedTo: ticket.assigned_to || "",
      notes: "",
    });
    setShowAssignTicketModal(true);
    // Fetch available users when opening the assign modal
    fetchAvailableUsers();
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

  const handleCreateTicket = async () => {
    try {
      // Clear any previous errors
      setError(null);

      // Validate required fields
      if (!newTicket.title.trim()) {
        setError("Title is required");
        return;
      }
      if (!newTicket.description.trim()) {
        setError("Description is required");
        return;
      }
      if (!newTicket.category) {
        setError("Category is required");
        return;
      }

      // Get current user info from localStorage or API
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const currentTenant = JSON.parse(
        localStorage.getItem("currentTenant") || "{}"
      );

      // Ensure we have valid user and tenant IDs
      const userId = getCurrentUserId() || "1"; // Fallback to admin user
      const tenantId = getCurrentTenantId() || "1"; // Fallback to default tenant

      const ticketData = {
        title: newTicket.title.trim(),
        description: newTicket.description.trim(),
        priority: newTicket.priority || "medium",
        category: newTicket.category,
        reporter_name: newTicket.reporter?.trim() || "Anonymous",
        reporter_email: newTicket.reporterEmail?.trim() || "",
        tags: newTicket.tags
          ? newTicket.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        created_by: parseInt(userId), // Ensure it's an integer
        tenant: parseInt(tenantId), // Ensure it's an integer
      };

      console.log("🎫 Creating support ticket with data:", ticketData);
      console.log("👤 User ID:", userId, "Tenant ID:", tenantId);

      const response = await supportTicketAPI.createTicket(ticketData);
      const createdTicket = response.data;

      console.log("✅ Support ticket created successfully:", createdTicket);

      // Refresh the tickets list
      const updatedResponse = await supportTicketAPI.getTickets();
      setTickets(updatedResponse.data || []);

      setShowNewTicketModal(false);
      setNewTicket({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        reporter: "",
        reporterEmail: "",
        tags: "",
      });

      // Show success message (you could add a toast notification here)
      console.log("🎉 Support ticket created successfully!");
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create ticket"
      );
    }
  };

  const handleAssignSubmit = async () => {
    if (selectedTicket) {
      try {
        // Clear any previous errors
        setError(null);

        // Validate that a user is selected
        if (!assignData.assignedTo) {
          setError("Please select a user to assign the ticket to");
          return;
        }

        const assignmentData = {
          assigned_to: parseInt(assignData.assignedTo), // Ensure it's an integer
        };

        console.log(
          "🎫 Assigning ticket:",
          selectedTicket.id,
          "to user:",
          assignmentData.assigned_to
        );

        await supportTicketAPI.assignTicket(selectedTicket.id, assignmentData);

        // Send notification to the assigned user
        const assignedUser = availableUsers.find(
          (user) => user.id === parseInt(assignData.assignedTo)
        );
        if (assignedUser) {
          try {
            await fetch("/api/notifications/notifications/", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                recipient: assignedUser.id,
                title: `Support Ticket Assigned`,
                message: `You have been assigned support ticket #${selectedTicket.id}: "${selectedTicket.title}"`,
                type: "ticket_assignment",
                priority: "medium",
                is_read: false,
              }),
            });
            console.log("📧 Notification sent to user:", assignedUser.username);
          } catch (notificationError) {
            console.warn("Failed to send notification:", notificationError);
            // Don't fail the assignment if notification fails
          }
        }

        // Refresh the tickets list
        const updatedResponse = await supportTicketAPI.getTickets();
        setTickets(updatedResponse.data || []);

        setShowAssignTicketModal(false);
        setSelectedTicket(null);
        setAssignData({ assignedTo: "", notes: "" });

        console.log("✅ Ticket assigned successfully!");
      } catch (error: any) {
        console.error("Error assigning ticket:", error);
        console.error("Error response:", error.response?.data);
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to assign ticket"
        );
      }
    }
  };

  const handleUpdateSubmit = async () => {
    if (selectedTicket) {
      try {
        // Clear any previous errors
        setError(null);

        // Validate required fields
        if (!updateData.status) {
          setError("Status is required");
          return;
        }

        const updateDataPayload = {
          title: selectedTicket.title,
          description: selectedTicket.description,
          status: updateData.status,
          priority: updateData.priority || selectedTicket.priority,
          category: selectedTicket.category,
          created_by: selectedTicket.created_by,
          internal_notes: updateData.notes,
        };

        console.log(
          "🔄 Updating ticket:",
          selectedTicket.id,
          "with data:",
          updateDataPayload
        );

        await supportTicketAPI.updateTicket(
          selectedTicket.id,
          updateDataPayload
        );

        // Refresh the tickets list
        const updatedResponse = await supportTicketAPI.getTickets();
        setTickets(updatedResponse.data || []);

        setShowUpdateTicketModal(false);
        setSelectedTicket(null);
        setUpdateData({ status: "", priority: "", notes: "" });

        console.log("✅ Ticket updated successfully!");
      } catch (error: any) {
        console.error("Error updating ticket:", error);
        console.error("Error response:", error.response?.data);
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to update ticket"
        );
      }
    }
  };

  const handleResolveTicket = async (ticket: any) => {
    try {
      // Clear any previous errors
      setError(null);

      console.log("✅ Resolving ticket:", ticket.id);

      await supportTicketAPI.resolveTicket(ticket.id);

      // Refresh the tickets list
      const updatedResponse = await supportTicketAPI.getTickets();
      setTickets(updatedResponse.data || []);

      console.log("✅ Ticket resolved successfully!");
    } catch (error: any) {
      console.error("Error resolving ticket:", error);
      console.error("Error response:", error.response?.data);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to resolve ticket"
      );
    }
  };

  const handleCloseTicket = async (ticket: any) => {
    try {
      // Clear any previous errors
      setError(null);

      console.log("🔒 Closing ticket:", ticket.id);

      await supportTicketAPI.closeTicket(ticket.id);

      // Refresh the tickets list
      const updatedResponse = await supportTicketAPI.getTickets();
      setTickets(updatedResponse.data || []);

      console.log("✅ Ticket closed successfully!");
    } catch (error: any) {
      console.error("Error closing ticket:", error);
      console.error("Error response:", error.response?.data);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to close ticket"
      );
    }
  };

  const handleDeleteTicket = async (ticket: any) => {
    if (
      window.confirm(
        `Are you sure you want to delete ticket "${ticket.title}"?`
      )
    ) {
      try {
        // Clear any previous errors
        setError(null);

        console.log("🗑️ Deleting ticket:", ticket.id);

        await supportTicketAPI.deleteTicket(ticket.id);

        // Refresh the tickets list
        const updatedResponse = await supportTicketAPI.getTickets();
        setTickets(updatedResponse.data || []);

        console.log("✅ Ticket deleted successfully!");
      } catch (error: any) {
        console.error("Error deleting ticket:", error);
        console.error("Error response:", error.response?.data);
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to delete ticket"
        );
      }
    }
  };

  const handleEscalateTicket = async (ticket: any) => {
    const escalationReason = prompt("Please provide the escalation reason:");
    if (escalationReason) {
      try {
        // Clear any previous errors
        setError(null);

        console.log(
          "📈 Escalating ticket:",
          ticket.id,
          "with reason:",
          escalationReason
        );

        await supportTicketAPI.escalateTicket(ticket.id, {
          escalation_reason: escalationReason,
          escalation_level: (ticket.escalation_level || 0) + 1,
        });

        // Refresh the tickets list
        const updatedResponse = await supportTicketAPI.getTickets();
        setTickets(updatedResponse.data || []);

        console.log("✅ Ticket escalated successfully!");
      } catch (error: any) {
        console.error("Error escalating ticket:", error);
        console.error("Error response:", error.response?.data);
        setError(
          error.response?.data?.detail ||
            error.message ||
            "Failed to escalate ticket"
        );
      }
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (ticket.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (ticket.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (ticket.id?.toString().toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (ticket.reporter?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase() || "") {
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
    switch (priority?.toLowerCase() || "") {
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
    switch (status?.toLowerCase() || "") {
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

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("support.loadingTickets")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t("support.failedToLoadTickets")}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("support.supportTickets")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t("support.manageAndTrackTickets")}
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleNewTicket}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>{t("support.newTicket")}</span>
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
              placeholder={t("support.searchTickets")}
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
            <option value="all">
              {t("support.all")} {t("support.status")}
            </option>
            <option value="open">{t("support.open")}</option>
            <option value="in_progress">{t("support.inProgress")}</option>
            <option value="resolved">{t("support.resolved")}</option>
            <option value="closed">{t("support.closed")}</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">
              {t("support.all")} {t("support.priority")}
            </option>
            <option value="urgent">{t("support.urgent")}</option>
            <option value="high">{t("support.high")}</option>
            <option value="medium">{t("support.medium")}</option>
            <option value="low">{t("support.low")}</option>
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
                  {t("support.ticket")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.reporter")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.category")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.priority")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.assignedTo")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.createdAt")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("support.actions")}
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
                          {ticket.tags && ticket.tags.length > 0
                            ? ticket.tags.map((tag) => `#${tag}`).join(" ")
                            : "No tags"}
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
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleAssignTicket(ticket)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Assign</span>
                      </button>
                      <button
                        onClick={() => handleUpdateTicket(ticket)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Update</span>
                      </button>
                      {ticket.status !== "resolved" && (
                        <button
                          onClick={() => handleResolveTicket(ticket)}
                          className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 text-xs"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      )}
                      {ticket.status !== "closed" && (
                        <button
                          onClick={() => handleCloseTicket(ticket)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-xs"
                        >
                          <X className="w-3 h-3" />
                          <span>Close</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleEscalateTicket(ticket)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>Escalate</span>
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                      >
                        <X className="w-3 h-3" />
                        <span>Delete</span>
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
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="appointments">Appointments</option>
                    <option value="reports">Reports</option>
                    <option value="equipment">Equipment</option>
                    <option value="data_export">Data Export</option>
                    <option value="notifications">Notifications</option>
                    <option value="general">General</option>
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
                    <option value="critical">Critical</option>
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
                  disabled={usersLoading}
                >
                  <option value="">Select assignee</option>
                  {usersLoading ? (
                    <option value="" disabled>
                      Loading users...
                    </option>
                  ) : (
                    availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.username}) -{" "}
                        {user.role}
                      </option>
                    ))
                  )}
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
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
                  <option value="critical">Critical</option>
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
