import {
  ChevronDown,
  Edit,
  Filter,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { testRequestAPI } from "../services/api";

interface TableData {
  id: number;
  name: string;
  testType: string;
  email: string;
  quantity: number;
  totalPrice: string;
  date: string;
  avatar: string;
}

const RecentDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load recent test data from backend API
  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testRequestAPI.getAll();
        
        // Map backend data to frontend expected format
        const mappedData = response.data.map((test: any) => ({
          id: test.id,
          name: test.patient_name || "Unknown Patient",
          testType: test.test_type || "Unknown Test",
          email: test.patient_email || "No email",
          quantity: 1, // Default quantity
          totalPrice: "$0.00", // Default price since backend doesn't have pricing
          date: test.date_requested ? new Date(test.date_requested).toLocaleString() : "Unknown date",
          avatar: test.patient_name ? test.patient_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "UN",
        }));
        
        setTableData(mappedData);
      } catch (error: any) {
        console.error("Error fetching recent test data:", error);
        setError(error.message || "Failed to load recent data");
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentData();
  }, []);

  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Test Requests
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            Loading recent data...
          </span>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="appearance-none bg-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="All">Filter</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Urine Test">Urine Test</option>
              <option value="X-Ray">X-Ray</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Date">Sort By</option>
              <option value="Name">Name</option>
              <option value="Price">Price</option>
              <option value="Type">Test Type</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Test Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                User Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
              >
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.avatar}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {item.testType}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {item.email}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded">
                      <Minus className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded">
                      <Plus className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {item.totalPrice}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded text-gray-400 dark:text-gray-500 hover:text-red-600 dark:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default RecentDataTable;
