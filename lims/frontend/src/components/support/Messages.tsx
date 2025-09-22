import { MessageSquare, Plus, Search, Send, User } from "lucide-react";
import React, { useState } from "react";

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
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
  ];

  const messages = [
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
  ];

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
      // Here you would typically send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "normal":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">
            Communicate with users and provide support
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-200 overflow-y-auto h-80">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id
                      ? "bg-primary-50 border-r-2 border-primary-600"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {conversation.user}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-400">
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
          <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
            {selectedConversationData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedConversationData.user}
                      </div>
                      <div className="text-sm text-gray-500">
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
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "support"
                              ? "text-primary-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
