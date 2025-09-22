import {
  HelpCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqItems = [
    {
      id: "FAQ001",
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email. If you don't receive the email, check your spam folder.",
      category: "Authentication",
      tags: ["password", "login", "reset"],
      lastUpdated: "2025-01-20",
      helpful: 15,
    },
    {
      id: "FAQ002",
      question: "How do I generate a test report?",
      answer:
        "To generate a test report, go to the Test Reports section, select the completed test, and click 'Generate Report'. The system will create a PDF report that you can download or print.",
      category: "Reports",
      tags: ["reports", "pdf", "generation"],
      lastUpdated: "2025-01-18",
      helpful: 23,
    },
    {
      id: "FAQ003",
      question: "Why is my equipment showing as offline?",
      answer:
        "Equipment may show as offline due to connectivity issues, maintenance mode, or system updates. Check the equipment's network connection and ensure it's properly configured. Contact technical support if the issue persists.",
      category: "Equipment",
      tags: ["equipment", "offline", "connectivity"],
      lastUpdated: "2025-01-15",
      helpful: 8,
    },
    {
      id: "FAQ004",
      question: "How do I add a new user to the system?",
      answer:
        "To add a new user, go to User Management, click 'Add User', fill in the required information including name, email, role, and department. The user will receive an email with login credentials.",
      category: "User Management",
      tags: ["users", "add", "management"],
      lastUpdated: "2025-01-22",
      helpful: 12,
    },
    {
      id: "FAQ005",
      question: "How do I schedule equipment maintenance?",
      answer:
        "To schedule maintenance, go to the Equipment section, select the equipment, and click 'Schedule Maintenance'. Choose the date, time, and type of maintenance required. The system will send notifications to relevant technicians.",
      category: "Maintenance",
      tags: ["maintenance", "schedule", "equipment"],
      lastUpdated: "2025-01-19",
      helpful: 18,
    },
    {
      id: "FAQ006",
      question: "Why are notifications not being sent?",
      answer:
        "Check your notification settings in the user profile. Ensure email notifications are enabled and your email address is correct. If issues persist, contact technical support as there may be a system-wide notification issue.",
      category: "Notifications",
      tags: ["notifications", "email", "settings"],
      lastUpdated: "2025-01-21",
      helpful: 6,
    },
    {
      id: "FAQ007",
      question: "How do I export patient data?",
      answer:
        "To export patient data, go to the Patient Management section, select the patients you want to export, and click 'Export'. Choose the format (CSV, Excel, or PDF) and the data will be downloaded to your device.",
      category: "Data Export",
      tags: ["export", "patients", "data"],
      lastUpdated: "2025-01-17",
      helpful: 14,
    },
    {
      id: "FAQ008",
      question: "How do I update my profile information?",
      answer:
        "To update your profile, click on your name in the top-right corner, select 'Profile Settings', make the necessary changes, and click 'Save'. Some changes may require administrator approval.",
      category: "Profile",
      tags: ["profile", "settings", "update"],
      lastUpdated: "2025-01-16",
      helpful: 9,
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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
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
            Find answers to common questions and issues
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions, answers, or tags..."
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
          <div key={item.id} className="bg-white rounded-lg shadow-sm border">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.question}
                    </h3>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last updated: {item.lastUpdated}</span>
                    <span>•</span>
                    <span>{item.helpful} people found this helpful</span>
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
            </div>
            {expandedItems.has(item.id) && (
              <div className="px-6 pb-6 border-t border-gray-200">
                <div className="pt-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  <div className="mt-4 flex items-center space-x-4">
                    <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                      👍 Helpful
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      👎 Not Helpful
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </button>
                  </div>
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
    </div>
  );
};

export default FAQ;
