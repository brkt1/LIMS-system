import { Activity, BarChart3, Package, Settings, TrendingUp, UserPlus, Users } from 'lucide-react';
import React from 'react';
import BaseDashboard from './BaseDashboard';

const TenantAdminDashboard: React.FC = () => {
  const tenantAdminCards = [
    {
      title: "Total Users",
      value: "47",
      change: "+5 This Month",
      color: "bg-blue-500",
      chartData: [30, 35, 38, 42, 45, 46, 47]
    },
    {
      title: "Active Equipment",
      value: "23",
      change: "+2 This Month",
      color: "bg-green-500",
      chartData: [18, 19, 20, 21, 22, 22, 23]
    },
    {
      title: "Pending Tests",
      value: "12",
      change: "-3 Today",
      color: "bg-orange-500",
      chartData: [15, 18, 16, 14, 12, 13, 12]
    },
    {
      title: "Monthly Revenue",
      value: "$24.5K",
      change: "+8.2% This Month",
      color: "bg-purple-500",
      chartData: [18, 20, 22, 21, 23, 24, 24.5]
    }
  ];

  return (
    <BaseDashboard>
      {/* Tenant Admin specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tenantAdminCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                {index === 0 && <Users className="w-4 h-4 text-white" />}
                {index === 1 && <Package className="w-4 h-4 text-white" />}
                {index === 2 && <Activity className="w-4 h-4 text-white" />}
                {index === 3 && <TrendingUp className="w-4 h-4 text-white" />}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              <div className="flex items-center space-x-1 text-green-600">
                <span className="text-sm font-medium">{card.change}</span>
              </div>
            </div>
            
            <div className="flex items-end space-x-1 h-8">
              {card.chartData.map((height, i) => (
                <div
                  key={i}
                  className={`${card.color} rounded-sm opacity-80`}
                  style={{ 
                    height: `${(height / Math.max(...card.chartData)) * 100}%`,
                    width: '8px'
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Add User</span>
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Johnson', role: 'Doctor', status: 'Active', avatar: 'SJ' },
              { name: 'Mike Chen', role: 'Technician', status: 'Active', avatar: 'MC' },
              { name: 'Lisa Rodriguez', role: 'Support', status: 'Pending', avatar: 'LR' },
              { name: 'David Kim', role: 'Doctor', status: 'Active', avatar: 'DK' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{user.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tenant Analytics</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Tenant performance metrics</p>
              <p className="text-sm">User activity, test volume, revenue trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Equipment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Calibration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Next Maintenance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">Microscope Alpha-1</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Operational
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-15</td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-02-15</td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Manage
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">Centrifuge Beta-2</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Maintenance Due
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-10</td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-25</td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Schedule
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">PCR Machine Gamma-3</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Operational
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-18</td>
                <td className="py-4 px-4 text-sm text-gray-900">2025-02-18</td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Manage
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default TenantAdminDashboard;
