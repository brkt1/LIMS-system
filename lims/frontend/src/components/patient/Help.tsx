import {
  BookOpen,
  Download,
  HelpCircle,
  Play,
  Search,
  Video,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import React, { useState } from "react";

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const helpResources = [
    {
      id: "HELP001",
      title: "Getting Started with Patient Portal",
      description:
        "Learn how to navigate your patient portal and access your medical information",
      category: "Getting Started",
      type: "Video",
      duration: "5:30",
      difficulty: "Beginner",
      views: 1250,
      lastUpdated: "2025-01-15",
      url: "#",
    },
    {
      id: "HELP002",
      title: "How to Book an Appointment",
      description:
        "Step-by-step guide to booking both in-person and video consultations",
      category: "Appointments",
      type: "Video",
      duration: "3:45",
      difficulty: "Beginner",
      views: 890,
      lastUpdated: "2025-01-12",
      url: "#",
    },
    {
      id: "HELP003",
      title: "Understanding Your Test Results",
      description: "Learn how to read and interpret your medical test results",
      category: "Test Results",
      type: "Article",
      duration: "8 min read",
      difficulty: "Intermediate",
      views: 2100,
      lastUpdated: "2025-01-10",
      url: "#",
    },
    {
      id: "HELP004",
      title: "Video Consultation Setup Guide",
      description:
        "Complete setup guide for video consultations including technical requirements",
      category: "Video Consultations",
      type: "Video",
      duration: "7:20",
      difficulty: "Intermediate",
      views: 1560,
      lastUpdated: "2025-01-08",
      url: "#",
    },
    {
      id: "HELP005",
      title: "Managing Your Profile and Preferences",
      description:
        "How to update your personal information, medical details, and notification preferences",
      category: "Profile",
      type: "Article",
      duration: "6 min read",
      difficulty: "Beginner",
      views: 980,
      lastUpdated: "2025-01-05",
      url: "#",
    },
    {
      id: "HELP006",
      title: "Troubleshooting Common Issues",
      description: "Solutions for common technical problems and login issues",
      category: "Troubleshooting",
      type: "Article",
      duration: "10 min read",
      difficulty: "Intermediate",
      views: 3200,
      lastUpdated: "2025-01-03",
      url: "#",
    },
    {
      id: "HELP007",
      title: "Security and Privacy Best Practices",
      description:
        "Learn how to keep your medical information secure and private",
      category: "Security",
      type: "Video",
      duration: "4:15",
      difficulty: "Beginner",
      views: 750,
      lastUpdated: "2025-01-01",
      url: "#",
    },
    {
      id: "HELP008",
      title: "Mobile App User Guide",
      description:
        "Complete guide to using our mobile application for iOS and Android",
      category: "Mobile",
      type: "Video",
      duration: "12:30",
      difficulty: "Beginner",
      views: 1800,
      lastUpdated: "2024-12-28",
      url: "#",
    },
  ];

  const filteredResources = helpResources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || resource.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    return type === "Video" ? Video : FileText;
  };

  const getTypeColor = (type: string) => {
    return type === "Video"
      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  // Handler functions
  const handleWatch = (resource: any) => {
    if (resource.type === "Video") {
      alert(
        `Playing video: "${resource.title}"\n\nDuration: ${resource.duration}\nCategory: ${resource.category}\n\nThis would open the video player in a new window.`
      );
    } else {
      alert(
        `Opening article: "${resource.title}"\n\nDuration: ${resource.duration}\nCategory: ${resource.category}\n\nThis would open the article in a new window.`
      );
    }
  };

  const handleDownload = (resource: any) => {
    // Create a simple text file with the resource content
    const content = `
${resource.title}
${"=".repeat(resource.title.length)}

Category: ${resource.category}
Type: ${resource.type}
Duration: ${resource.duration}
Difficulty: ${resource.difficulty}
Views: ${resource.views.toLocaleString()}
Last Updated: ${resource.lastUpdated}

Description:
${resource.description}

${
  resource.type === "Video"
    ? "This is a video tutorial. In a real application, this would download the video file or transcript."
    : "This is an article. In a real application, this would download the full article content."
}

Downloaded on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download file
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, "_")}_${
      resource.id
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleContactSupport = () => {
    alert(
      "Contact Support\n\nPhone: (555) 123-4567\nEmail: support@medicare.com\nLive Chat: Available 24/7\n\nHours: Monday-Friday, 8:00 AM - 6:00 PM\nEmergency: (555) 911-HELP (24/7)"
    );
  };

  const categories = [
    "all",
    ...Array.from(new Set(helpResources.map((resource) => resource.category))),
  ];

  const totalResources = helpResources.length;
  const videoCount = helpResources.filter((r) => r.type === "Video").length;
  const articleCount = helpResources.filter((r) => r.type === "Article").length;
  const totalViews = helpResources.reduce((sum, r) => sum + r.views, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Find tutorials, guides, and resources to help you use our services
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
              placeholder="Search help resources..."
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Help Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {resource.description}
                    </p>
                  </div>
                  <TypeIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                      resource.type
                    )}`}
                  >
                    {resource.type}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                      resource.difficulty
                    )}`}
                  >
                    {resource.difficulty}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {resource.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>{resource.duration}</span>
                  <span>{resource.views.toLocaleString()} views</span>
                </div>

                <div className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Updated: {resource.lastUpdated}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWatch(resource)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {resource.type === "Video" ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    <span>{resource.type === "Video" ? "Watch" : "Read"}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No help resources found matching your search criteria.
          </p>
        </div>
      )}

      {/* Quick Help Section */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Help
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Popular Topics
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li>• How to book an appointment</li>
              <li>• Understanding test results</li>
              <li>• Video consultation setup</li>
              <li>• Profile management</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Need More Help?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Can't find what you're looking for? Our support team is here to
              help.
            </p>
            <button
              onClick={handleContactSupport}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
