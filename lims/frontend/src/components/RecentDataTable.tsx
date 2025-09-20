import { ChevronDown, Edit, Filter, Minus, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [sortBy, setSortBy] = useState('Date');

  const tableData: TableData[] = [
    {
      id: 1,
      name: 'Susan Williams',
      testType: 'Blood Test',
      email: 'susan@example.com',
      quantity: 1,
      totalPrice: '$152.00',
      date: 'Apr 22, 2025 12:00 AM',
      avatar: 'SW'
    },
    {
      id: 2,
      name: 'Bentley Howard',
      testType: 'Urine Test',
      email: 'bentley@example.com',
      quantity: 2,
      totalPrice: '$89.50',
      date: 'Apr 21, 2025 10:30 AM',
      avatar: 'BH'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      testType: 'X-Ray',
      email: 'alice@example.com',
      quantity: 1,
      totalPrice: '$245.00',
      date: 'Apr 20, 2025 3:15 PM',
      avatar: 'AJ'
    }
  ];

  const filteredData = tableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Test Requests</h3>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="All">Filter</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Urine Test">Urine Test</option>
              <option value="X-Ray">X-Ray</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Date">Sort By</option>
              <option value="Name">Name</option>
              <option value="Price">Price</option>
              <option value="Type">Test Type</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Test Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                User Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Total Price
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{item.avatar}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.testType}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.email}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Minus className="w-3 h-3 text-gray-400" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Plus className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.totalPrice}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{item.date}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentDataTable;
