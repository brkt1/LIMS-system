import { MessageSquare, Plus, Search, Send, User, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  // State management for modals
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Form states
  const [newConversationData, setNewConversationData] = useState({
    recipient: "",
    recipientRole: "",
    subject: "",
    message: "",
    priority: "normal",
  });

  const [conversations, setConversations] = useState([
    {
      id: "CONV001",
      user: "Dr. Sarah Johnson",
      userRole: "Doctor",
      lastMessage:
        "I'm having trouble accessing the test reports section. Can you help?",
      lastMessageTime: "2025-01-22 10:30 AM",
      unreadCount: 2,
      status: "active",
      priority: "high",
    },
    {
      id: "CONV002",
      user: "Mike Davis",
      userRole: "Technician",
      lastMessage:
        "The equipment calibration is complete. All systems are operational.",
      lastMessageTime: "2025-01-21 3:45 PM",
      unreadCount: 0,
      status: "active",
      priority: "normal",
    },
    {
      id: "CONV003",
      user: "Lisa Wilson",
      userRole: "Tenant Admin",
      lastMessage: "Thank you for resolving the user management issue.",
      lastMessageTime: "2025-01-20 2:15 PM",
      unreadCount: 0,
      status: "resolved",
      priority: "low",
    },
    {
      id: "CONV004",
      user: "Robert Brown",
      userRole: "Doctor",
      lastMessage: "I need help with the appointment scheduling system.",
      lastMessageTime: "2025-01-19 11:20 AM",
      unreadCount: 1,
      status: "active",
      priority: "medium",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: "MSG001",
      conversationId: "CONV001",
      sender: "user",
      senderName: "Dr. Sarah Johnson",
      message:
        "I'm having trouble accessing the test reports section. Can you help?",
      timestamp: "2025-01-22 10:15 AM",
      isRead: true,
    },
    {
      id: "MSG002",
      conversationId: "CONV001",
      sender: "support",
      senderName: "Support Team",
      message:
        "Hello Dr. Johnson! I can help you with that. Let me check your permissions and guide you through accessing the test reports.",
      timestamp: "2025-01-22 10:30 AM",
      isRead: true,
    },
    {
      id: "MSG003",
      conversationId: "CONV001",
      sender: "user",
      senderName: "Dr. Sarah Johnson",
      message:
        "Thank you! I can see the reports now. The issue was with my browser cache.",
      timestamp: "2025-01-22 10:45 AM",
      isRead: false,
    },
  ]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem("supportConversations");
    const savedMessages = localStorage.getItem("supportMessages");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("supportConversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("supportMessages", JSON.stringify(messages));
  }, [messages]);

  // Handler functions
  const handleNewMessage = () => {
    setNewConversationData({
      recipient: "",
      recipientRole: "",
      subject: "",
      message: "",
      priority: "normal",
    });
    setShowNewMessageModal(true);
  };

  const handleCreateConversation = () => {
    const newConversation = {
      id: `CONV${String(conversations.length + 1).padStart(3, "0")}`,
      user: newConversationData.recipient,
      userRole: newConversationData.recipientRole,
      lastMessage: newConversationData.message,
      lastMessageTime: new Date().toLocaleString(),
      unreadCount: 0,
      status: "active",
      priority: newConversationData.priority,
    };

    const newMessageData = {
      id: `MSG${String(messages.length + 1).padStart(3, "0")}`,
      conversationId: newConversation.id,
      sender: "support",
      senderName: "Support Team",
      message: newConversationData.message,
      timestamp: new Date().toLocaleString(),
      isRead: true,
    };

    setConversations([newConversation, ...conversations]);
    setMessages([newMessageData, ...messages]);
    setShowNewMessageModal(false);
    setSelectedConversation(newConversation.id);
  };

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationMessages = selectedConversation
    ? messages.filter((msg) => msg.conversationId === selectedConversation)
    : [];

  const selectedConversationData = selectedConversation
    ? conversations.find((conv) => conv.id === selectedConversation)
    : null;

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMessageData = {
        id: `MSG${String(messages.length + 1).padStart(3, "0")}`,
        conversationId: selectedConversation,
        sender: "support",
        senderName: "Support Team",
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        isRead: true,
      };

      // Update messages
      setMessages([...messages, newMessageData]);

      // Update conversation's last message
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: new Date().toLocaleString(),
            }
          : conv
      );
      setConversations(updatedConversations);

      setNewMessage("");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "normal":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "low":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "resolved":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Communicate with users and provide support
          </p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleNewMessage}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>New Message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-80">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedConversation === conversation.id
                      ? "bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {conversation.user}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
                        {conversation.lastMessage}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {conversation.lastMessageTime}
                        </div>
                        <div className="flex space-x-1">
                          <span
                            className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getPriorityColor(
                              conversation.priority
                            )}`}
                          >
                            {conversation.priority}
                          </span>
                          <span
                            className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded ${getStatusColor(
                              conversation.status
                            )}`}
                          >
                            {conversation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 h-full flex flex-col">
            {selectedConversationData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedConversationData.user}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {selectedConversationData.userRole}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "support"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "support"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "support"
                              ? "text-primary-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={newConversationData.recipient}
                    onChange={(e) =>
                      setNewConversationData({
                        ...newConversationData,
                        recipient: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter recipient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Role *
                  </label>
                  <select
                    value={newConversationData.recipientRole}
                    onChange={(e) =>
                      setNewConversationData({
                        ...newConversationData,
                        recipientRole: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select role</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Technician">Technician</option>
                    <option value="Tenant Admin">Tenant Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newConversationData.subject}
                  onChange={(e) =>
                    setNewConversationData({
                      ...newConversationData,
                      subject: e.target.value,
                    })
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
                  value={newConversationData.priority}
                  onChange={(e) =>
                    setNewConversationData({
                      ...newConversationData,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  value={newConversationData.message}
                  onChange={(e) =>
                    setNewConversationData({
                      ...newConversationData,
                      message: e.target.value,
                    })
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
                onClick={handleCreateConversation}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
