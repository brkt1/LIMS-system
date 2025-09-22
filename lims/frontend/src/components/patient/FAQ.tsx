import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState("all");

  const faqItems = [
    {
      id: "FAQ001",
      question: "How do I book an appointment?",
      answer:
        "To book an appointment, go to the 'My Appointments' section and click 'Book Appointment'. Select your preferred doctor, date, and time. You can choose between in-person or video consultations.",
      category: "Appointments",
      tags: ["booking", "appointment", "schedule"],
    },
    {
      id: "FAQ002",
      question: "How can I view my test results?",
      answer:
        "Your test results are available in the 'Test Results' section. Once your doctor has reviewed and released the results, you'll receive a notification and can view them online. You can also download PDF copies of your reports.",
      category: "Test Results",
      tags: ["results", "tests", "reports"],
    },
    {
      id: "FAQ003",
      question: "What should I do if I need to cancel an appointment?",
      answer:
        "You can cancel an appointment up to 24 hours before the scheduled time. Go to 'My Appointments', find the appointment you want to cancel, and click the 'Cancel' button. For urgent cancellations, please call our office directly.",
      category: "Appointments",
      tags: ["cancel", "appointment", "reschedule"],
    },
    {
      id: "FAQ004",
      question: "How do I update my personal information?",
      answer:
        "You can update your personal information in the 'Profile' section. Click 'Edit Profile' to modify your contact details, medical information, and preferences. Remember to save your changes when you're done.",
      category: "Profile",
      tags: ["profile", "update", "information"],
    },
    {
      id: "FAQ005",
      question: "What types of appointments are available?",
      answer:
        "We offer both in-person and video consultations. In-person appointments are held at our clinic locations, while video consultations are conducted via secure video calls. You can choose the option that works best for you.",
      category: "Appointments",
      tags: ["types", "video", "in-person"],
    },
    {
      id: "FAQ006",
      question: "How do I prepare for a video consultation?",
      answer:
        "For video consultations, ensure you have a stable internet connection, good lighting, and a quiet environment. Test your camera and microphone beforehand. The consultation link will be sent to you 15 minutes before your appointment.",
      category: "Video Consultations",
      tags: ["video", "preparation", "technical"],
    },
    {
      id: "FAQ007",
      question: "Can I get a second opinion on my test results?",
      answer:
        "Yes, you can request a second opinion by contacting your primary physician or our support team. We can arrange for another specialist to review your results and provide additional insights.",
      category: "Test Results",
      tags: ["second opinion", "results", "review"],
    },
    {
      id: "FAQ008",
      question: "How do I contact my doctor directly?",
      answer:
        "You can send messages to your doctor through the 'Messages' section in your patient portal. For urgent matters, please call our office directly or use the emergency contact number provided.",
      category: "Communication",
      tags: ["doctor", "contact", "messages"],
    },
    {
      id: "FAQ009",
      question: "What if I forget my login password?",
      answer:
        "Click on 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password. If you continue to have issues, contact our support team.",
      category: "Account",
      tags: ["password", "login", "reset"],
    },
    {
      id: "FAQ010",
      question: "How do I update my insurance information?",
      answer:
        "Go to your 'Profile' section and click 'Edit Profile'. In the Medical Information section, you can update your insurance provider and policy number. Make sure to have your insurance card handy for accurate information.",
      category: "Profile",
      tags: ["insurance", "profile", "medical"],
    },
  ];

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const categories = [
    "all",
    ...Array.from(new Set(faqItems.map((item) => item.category))),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600">
            Find answers to common questions about our services
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleExpanded(item.id)}
              className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <div className="flex space-x-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>
            {expandedItems.has(item.id) && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No FAQ items found matching your search criteria.
          </p>
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Still need help?
        </h3>
        <p className="text-gray-600 mb-4">
          If you can't find the answer you're looking for, our support team is
          here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Phone className="w-4 h-4" />
            <span>Call Support</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4" />
            <span>Email Support</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
