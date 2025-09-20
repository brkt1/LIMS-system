import { Activity, BarChart3, Building2, Settings, Users } from 'lucide-react';
import React from 'react';
import BaseDashboard from './BaseDashboard';

const SuperAdminDashboard: React.FC = () => {
  const superAdminCards = [
    {
      title: "Total Tenants",
      value: "24",
      change: "+3 This Month",
      color: "bg-blue-500",
      chartData: [10, 15, 12, 18, 20, 22, 24]
    },
    {
      title: "System Users",
      value: "1,247",
      change: "+12% This Month",
      color: "bg-green-500",
      chartData: [800, 900, 950, 1000, 1100, 1200, 1247]
    },
    {
      title: "Active Sessions",
      value: "89",
      change: "+5% Today",
      color: "bg-purple-500",
      chartData: [60, 70, 65, 75, 80, 85, 89]
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Stable",
      color: "bg-emerald-500",
      chartData: [98, 99, 99.5, 99.8, 99.9, 99.9, 99.9]
    }
  ];

  return (
    <BaseDashboard>
      {/* Super Admin specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {superAdminCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                {index === 0 && <Building2 className="w-4 h-4 text-white" />}
                {index === 1 && <Users className="w-4 h-4 text-white" />}
                {index === 2 && <Activity className="w-4 h-4 text-white" />}
                {index === 3 && <Settings className="w-4 h-4 text-white" />}
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

      {/* System Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tenant Growth</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Tenant growth chart would go here</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-2" />
              <p>System performance metrics would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Logs Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-20 14:30:25</td>
                <td className="py-4 px-4 text-sm text-gray-900">admin@lims.com</td>
                <td className="py-4 px-4 text-sm text-gray-900">Created new tenant</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm text-gray-900">2025-01-20 14:25:10</td>
                <td className="py-4 px-4 text-sm text-gray-900">system@lims.com</td>
                <td className="py-4 px-4 text-sm text-gray-900">System backup completed</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Info
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default SuperAdminDashboard;
