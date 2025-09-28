import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { faqAPI } from "../../services/api";

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState("all");
  const [faqItems, setFaqItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load FAQ data from backend API
  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch FAQ items for patients
        const faqResponse = await faqAPI.getAll({ user_type: 'patient' });
        if (faqResponse.data.success) {
          setFaqItems(faqResponse.data.data || []);
        } else {
          throw new Error('Failed to load FAQ items');
        }

        // Fetch categories for patients
        const categoriesResponse = await faqAPI.getCategories('patient');
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data || []);
        } else {
          throw new Error('Failed to load FAQ categories');
        }
      } catch (error: any) {
        console.error("Error fetching FAQ data:", error);
        setError(error.message || "Failed to load FAQ data");
        // Fallback to empty arrays if API fails
        setFaqItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);


  // Use API data only
  const currentFaqItems = faqItems;
  
  const filteredItems = currentFaqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
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

  // Support handler functions
  const handleCallSupport = () => {
    // Simulate calling support
    alert(
      "Calling support...\n\nPhone: (555) 123-4567\nHours: Monday-Friday, 8:00 AM - 6:00 PM\n\nEmergency Line: (555) 911-HELP (24/7)"
    );
  };

  const handleEmailSupport = () => {
    // Simulate email support
    const subject = encodeURIComponent("Patient Support Request");
    const body = encodeURIComponent(
      `Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you.`
    );
    window.open(`mailto:support@medicare.com?subject=${subject}&body=${body}`);
  };

  const handleLiveChat = () => {
    // Simulate live chat
    alert(
      "Live Chat Support\n\nConnecting you to our support team...\n\nAvailable: Monday-Friday, 9:00 AM - 5:00 PM\n\nA support agent will be with you shortly."
    );
  };

  // Use dynamic categories from API if available
  const availableCategories = categories.length > 0 ? categories : [
    { value: "all", label: "All Categories" },
    { value: "Appointments", label: "Appointments" },
    { value: "Test Results", label: "Test Results" },
    { value: "Billing", label: "Billing" },
    { value: "Profile", label: "Profile" }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find answers to common questions about our services
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {availableCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading FAQ...
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* FAQ Items */}
      {!loading && (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {item.question}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {item.category}
                      </span>
                      <div className="flex space-x-1">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>
              </button>
              {expandedItems.has(item.id) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No FAQ items found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Still need help?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          If you can't find the answer you're looking for, our support team is
          here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCallSupport}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Support</span>
          </button>
          <button
            onClick={handleEmailSupport}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Email Support</span>
          </button>
          <button
            onClick={handleLiveChat}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
