import { BarChart3, Calendar, Download, Filter, TrendingUp, Users } from 'lucide-react';
import React, { useState } from 'react';

const UsageAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  const usageData = {
    totalUsers: 1247,
    activeUsers: 892,
    totalTenants: 24,
    activeTenants: 22,
    totalTests: 15678,
    totalReports: 12345,
    systemUptime: 99.9,
    avgResponseTime: 245
  };

  const monthlyData = [
    { month: 'Jan', users: 800, tests: 12000, reports: 9500, revenue: 45000 },
    { month: 'Feb', users: 850, tests: 13000, reports: 10200, revenue: 48000 },
    { month: 'Mar', users: 920, tests: 14500, reports: 11200, revenue: 52000 },
    { month: 'Apr', users: 980, tests: 15200, reports: 11800, revenue: 55000 },
    { month: 'May', users: 1050, tests: 16000, reports: 12500, revenue: 58000 },
    { month: 'Jun', users: 1120, tests: 16800, reports: 13200, revenue: 62000 },
    { month: 'Jul', users: 1200, tests: 17500, reports: 13800, revenue: 65000 },
    { month: 'Aug', users: 1247, tests: 18200, reports: 14500, revenue: 68000 }
  ];

  const tenantUsage = [
    { name: 'Research Institute', users: 156, tests: 3200, reports: 2800, growth: 15.7 },
    { name: 'City Hospital Lab', users: 78, tests: 2100, reports: 1950, growth: 8.3 },
    { name: 'MedLab Solutions', users: 45, tests: 1800, reports: 1650, growth: 12.5 },
    { name: 'Medical Group', users: 67, tests: 1500, reports: 1400, growth: 6.8 },
    { name: 'Private Clinic Network', users: 23, tests: 800, reports: 750, growth: -2.1 }
  ];

  const featureUsage = [
    { feature: 'Test Management', usage: 95, users: 1180 },
    { feature: 'Report Generation', usage: 88, users: 1097 },
    { feature: 'Analytics Dashboard', usage: 76, users: 947 },
    { feature: 'API Access', usage: 45, users: 561 },
    { feature: 'Custom Branding', usage: 32, users: 399 },
    { feature: 'Data Export', usage: 28, users: 349 }
  ];

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usage Analysis</h2>
            <p className="text-gray-600">Comprehensive analytics and usage metrics across all tenants</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{usageData.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{usageData.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {Math.round((usageData.activeUsers / usageData.totalUsers) * 100)}% of total
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{usageData.totalTests.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{usageData.systemUptime}%</p>
                <p className="text-sm text-green-600">Excellent</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Trends */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="users">Users</option>
                  <option value="tests">Tests</option>
                  <option value="reports">Reports</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Usage trends chart for {selectedMetric} would go here</p>
                <p className="text-sm">Data: {getTimeRangeLabel(timeRange)}</p>
              </div>
            </div>
          </div>

          {/* Tenant Usage Distribution */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tenant Usage Distribution</h3>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {tenantUsage.map((tenant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">{tenant.users} users</span>
                      <span className="text-xs text-gray-500">{tenant.tests} tests</span>
                      <span className={`text-xs ${tenant.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tenant.growth > 0 ? '+' : ''}{tenant.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(tenant.users / 156) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Feature Usage Statistics</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Feature</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Usage Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Active Users</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featureUsage.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{feature.feature}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${feature.usage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">{feature.usage}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{feature.users.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.2%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{usageData.avgResponseTime}ms</p>
              <p className="text-sm text-gray-500 mt-2">Average response time</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Excellent performance</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{usageData.systemUptime}%</p>
              <p className="text-sm text-gray-500 mt-2">Uptime this month</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '99.9%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Outstanding reliability</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Satisfaction</h3>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">4.8/5</p>
              <p className="text-sm text-gray-500 mt-2">Average rating</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on 1,247 responses</p>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default UsageAnalysis;
