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
      patient: "John Smith",
      patientId: "P001",
      lastMessage:
        "Thank you for the test results. When should I schedule my next appointment?",
      lastMessageTime: "2025-01-22 10:30 AM",
      unreadCount: 2,
      status: "active",
    },
    {
      id: "CONV002",
      patient: "Sarah Johnson",
      patientId: "P002",
      lastMessage: "I have some questions about my X-ray results.",
      lastMessageTime: "2025-01-21 3:45 PM",
      unreadCount: 1,
      status: "active",
    },
    {
      id: "CONV003",
      patient: "Mike Davis",
      patientId: "P003",
      lastMessage: "The MRI appointment is confirmed for tomorrow.",
      lastMessageTime: "2025-01-20 2:15 PM",
      unreadCount: 0,
      status: "active",
    },
    {
      id: "CONV004",
      patient: "Lisa Wilson",
      patientId: "P004",
      lastMessage: "Thank you for the consultation.",
      lastMessageTime: "2025-01-19 11:20 AM",
      unreadCount: 0,
      status: "archived",
    },
  ];

  const messages = [
    {
      id: "MSG001",
      conversationId: "CONV001",
      sender: "patient",
      senderName: "John Smith",
      message:
        "Hello Dr. Johnson, I received my blood test results. Could you please explain what they mean?",
      timestamp: "2025-01-22 09:15 AM",
      isRead: true,
    },
    {
      id: "MSG002",
      conversationId: "CONV001",
      sender: "doctor",
      senderName: "Dr. Sarah Johnson",
      message:
        "Hello John! Your blood test results look good overall. All values are within normal range. I'll send you a detailed breakdown shortly.",
      timestamp: "2025-01-22 09:30 AM",
      isRead: true,
    },
    {
      id: "MSG003",
      conversationId: "CONV001",
      sender: "patient",
      senderName: "John Smith",
      message:
        "Thank you for the test results. When should I schedule my next appointment?",
      timestamp: "2025-01-22 10:30 AM",
      isRead: false,
    },
  ];

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with your patients</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex-1">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border h-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Conversations
              </h3>
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
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {conversation.patient}
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
                      <div className="text-xs text-gray-400">
                        {conversation.lastMessageTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedConversationData?.patient}
                      </div>
                      <div className="text-sm text-gray-500">
                        Patient ID: {selectedConversationData?.patientId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "doctor"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "doctor"
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "doctor"
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
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Conversations</p>
              <p className="text-2xl font-bold text-gray-900">
                {conversations.length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-red-600">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
              </p>
            </div>
            <User className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Conversations</p>
              <p className="text-2xl font-bold text-green-600">
                {conversations.filter((c) => c.status === "active").length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Messages Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  messages.filter((m) => m.timestamp.includes("2025-01-22"))
                    .length
                }
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
