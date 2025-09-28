import { BookOpen, Download, FileText, Plus, Search } from "lucide-react";
import React, { useState } from "react";

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const knowledgeItems = [
    {
      id: "KB001",
      title: "System Administration Guide",
      description:
        "Complete guide for system administrators covering user management, permissions, and system configuration",
      category: "Administration",
      type: "Guide",
      author: "Technical Team",
      lastUpdated: "2025-01-20",
      views: 156,
      downloads: 23,
      tags: ["admin", "guide", "configuration"],
    },
    {
      id: "KB002",
      title: "Equipment Maintenance Procedures",
      description:
        "Step-by-step procedures for maintaining laboratory equipment and troubleshooting common issues",
      category: "Maintenance",
      type: "Procedure",
      author: "Maintenance Team",
      lastUpdated: "2025-01-18",
      views: 89,
      downloads: 15,
      tags: ["equipment", "maintenance", "procedures"],
    },
    {
      id: "KB003",
      title: "API Documentation",
      description:
        "Complete API reference for developers integrating with the LIMS system",
      category: "Development",
      type: "Documentation",
      author: "Development Team",
      lastUpdated: "2025-01-22",
      views: 234,
      downloads: 45,
      tags: ["api", "development", "integration"],
    },
    {
      id: "KB004",
      title: "User Training Manual",
      description:
        "Comprehensive training manual for end users covering all system features and workflows",
      category: "Training",
      type: "Manual",
      author: "Training Team",
      lastUpdated: "2025-01-15",
      views: 312,
      downloads: 67,
      tags: ["training", "manual", "users"],
    },
    {
      id: "KB005",
      title: "Troubleshooting Common Issues",
      description:
        "Quick reference guide for resolving common system issues and error messages",
      category: "Troubleshooting",
      type: "Reference",
      author: "Support Team",
      lastUpdated: "2025-01-21",
      views: 178,
      downloads: 34,
      tags: ["troubleshooting", "errors", "issues"],
    },
    {
      id: "KB006",
      title: "Security Best Practices",
      description:
        "Security guidelines and best practices for protecting sensitive laboratory data",
      category: "Security",
      type: "Guidelines",
      author: "Security Team",
      lastUpdated: "2025-01-19",
      views: 145,
      downloads: 28,
      tags: ["security", "best-practices", "data-protection"],
    },
  ];

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some((tag) =>
        (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase() || '') {
      case "guide":
        return "bg-blue-100 text-blue-800";
      case "procedure":
        return "bg-green-100 text-green-800";
      case "documentation":
        return "bg-purple-100 text-purple-800";
      case "manual":
        return "bg-orange-100 text-orange-800";
      case "reference":
        return "bg-yellow-100 text-yellow-800";
      case "guidelines":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(knowledgeItems.map((item) => item.category))),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">
            Access documentation, guides, and resources
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Article</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles, descriptions, or tags..."
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

      {/* Knowledge Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-gray-400 flex-shrink-0 ml-2" />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                    item.type
                  )}`}
                >
                  {item.type}
                </span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {item.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By {item.author}</span>
                <span>Updated {item.lastUpdated}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{item.views} views</span>
                <span>{item.downloads} downloads</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No knowledge base articles found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
