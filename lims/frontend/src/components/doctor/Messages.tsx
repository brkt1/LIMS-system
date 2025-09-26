import {
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { messageAPI } from "../../services/api";

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");

  // State for modals and CRUD operations
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Conversations data with state management
  const [conversations, setConversations] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState<string | null>(
    null
  );

  // Messages data with state management
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const response = await messageAPI.getAll();
      console.log("🔍 Messages fetched:", response.data);
      setMessages(response.data);

      // Transform messages into conversations format
      const conversationMap = new Map();
      response.data.forEach((message: any) => {
        const key =
          message.sender_id === "DOC001"
            ? message.recipient_id
            : message.sender_id;
        const patientName =
          message.sender_id === "DOC001"
            ? message.recipient_name
            : message.sender_name;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            id: key,
            patient: patientName,
            patientId: key,
            lastMessage: message.message_body,
            lastMessageTime: new Date(message.created_at).toLocaleString(),
            unreadCount: message.status === "Unread" ? 1 : 0,
            status: "active",
          });
        } else {
          const existing = conversationMap.get(key);
          if (
            new Date(message.created_at) > new Date(existing.lastMessageTime)
          ) {
            existing.lastMessage = message.message_body;
            existing.lastMessageTime = new Date(
              message.created_at
            ).toLocaleString();
            if (message.status === "Unread") {
              existing.unreadCount += 1;
            }
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setMessagesError(err.message || "Failed to fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // CRUD operation functions
  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  const handleEditMessage = (message: any) => {
    setSelectedMessage(message);
    setShowEditMessageModal(true);
  };

  const handleDeleteMessage = (message: any) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const handleCreateConversation = async (newConversation: any) => {
    try {
      const messageData = {
        sender_id: "DOC001",
        sender_name: "Dr. Johnson",
        recipient_id: newConversation.patientId,
        recipient_name: newConversation.patient,
        subject: newConversation.subject,
        message_body: newConversation.message,
        message_type: newConversation.type || "General",
        status: "Unread",
        is_urgent: newConversation.isUrgent || false,
      };

      await messageAPI.create(messageData);
      setShowNewMessageModal(false);
      fetchMessages(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating message:", err);
      setMessagesError(err.message || "Failed to create message");
    }
  };

  const handleUpdateMessage = (messageId: string, updatedData: any) => {
    setMessages(
      messages.map((m) => (m.id === messageId ? { ...m, ...updatedData } : m))
    );
    setShowEditMessageModal(false);
  };

  const handleDeleteMessageConfirm = (messageId: string) => {
    setMessages(messages.filter((m) => m.id !== messageId));
    setShowDeleteModal(false);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        const conversation = conversations.find(
          (c) => c.id === selectedConversation
        );
        if (conversation) {
          const messageData = {
            sender_id: "DOC001",
            sender_name: "Dr. Johnson",
            recipient_id: conversation.patientId,
            recipient_name: conversation.patient,
            subject: "New Message",
            message_body: newMessage.trim(),
            message_type: "General",
            status: "Unread",
            is_urgent: false,
          };

          await messageAPI.create(messageData);
          setNewMessage("");
          fetchMessages(); // Refresh the list
        }
      } catch (err: any) {
        console.error("Error sending message:", err);
        setMessagesError(err.message || "Failed to send message");
      }
    }
  };

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

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Messages
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Communicate with your patients
            </p>
          </div>
          <button
            onClick={handleNewMessage}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Message</span>
          </button>
        </div>
      </div>

      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-80 sm:h-96">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 h-full">
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Conversations
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto h-64 sm:h-80">
                {conversationsLoading ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Loading conversations...
                  </div>
                ) : conversationsError ? (
                  <div className="p-4 text-center text-red-500 dark:text-red-400">
                    Error: {conversationsError}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No conversations found.
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-3 sm:p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedConversation === conversation.id
                          ? "bg-primary-50 dark:bg-primary-900 border-r-2 border-primary-600 dark:border-primary-400"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {conversation.patient}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {conversation.lastMessageTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {selectedConversationData?.patient}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Patient ID: {selectedConversationData?.patientId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "doctor"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="relative group">
                          <div
                            className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                              message.sender === "doctor"
                                ? "bg-primary-600 dark:bg-primary-700 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                          >
                            <div className="text-xs sm:text-sm">
                              {message.message}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === "doctor"
                                  ? "text-primary-100 dark:text-primary-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {message.timestamp}
                            </div>
                          </div>
                          {message.sender === "doctor" && (
                            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEditMessage(message)}
                                  className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  title="Edit message"
                                >
                                  <Edit className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message)}
                                  className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                                  title="Delete message"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2 sm:mb-4" />
                    <p className="text-sm sm:text-base">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Start New Conversation
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleCreateConversation({
                  patient: formData.get("patient"),
                  patientId: formData.get("patientId"),
                  lastMessage: formData.get("initialMessage"),
                  lastMessageTime: new Date().toLocaleString(),
                });
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
                    placeholder="Enter patient name"
                  />
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
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Initial Message
                  </label>
                  <textarea
                    name="initialMessage"
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your initial message..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewMessageModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Message Modal */}
      {showEditMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Message
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateMessage(selectedMessage.id, {
                  message: formData.get("message"),
                  timestamp: new Date().toLocaleString(),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    defaultValue={selectedMessage.message}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Type your message..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditMessageModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Update Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Message Modal */}
      {showDeleteModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Message
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-white">
                  "{selectedMessage.message}"
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessageConfirm(selectedMessage.id)}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
