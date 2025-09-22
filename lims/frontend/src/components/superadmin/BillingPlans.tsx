import { BarChart3, Check, CreditCard, DollarSign, Download, Edit, Plus, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

const BillingPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const billingData = {
    totalRevenue: 156800,
    monthlyRecurring: 12800,
    annualRecurring: 144000,
    churnRate: 2.1,
    averageRevenuePerUser: 125.6,
    totalCustomers: 1247
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      billing: 'monthly',
      users: 10,
      features: [
        'Basic Dashboard',
        'Standard Support',
        'Up to 10 users',
        'Basic Analytics',
        'Email Support'
      ],
      tenants: 8,
      revenue: 2320
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      billing: 'monthly',
      users: 50,
      features: [
        'Advanced Dashboard',
        'Priority Support',
        'Up to 50 users',
        'Advanced Analytics',
        'API Access',
        'Phone Support'
      ],
      tenants: 12,
      revenue: 9480
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      billing: 'monthly',
      users: 200,
      features: [
        'Full Dashboard Suite',
        'Dedicated Support',
        'Unlimited users',
        'Custom Analytics',
        'Full API Access',
        'Custom Branding',
        '24/7 Support'
      ],
      tenants: 4,
      revenue: 7960
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      tenant: 'Research Institute',
      plan: 'Enterprise',
      amount: 199,
      status: 'Paid',
      date: '2025-01-20',
      method: 'Credit Card'
    },
    {
      id: '2',
      tenant: 'City Hospital Lab',
      plan: 'Enterprise',
      amount: 199,
      status: 'Paid',
      date: '2025-01-20',
      method: 'Bank Transfer'
    },
    {
      id: '3',
      tenant: 'MedLab Solutions',
      plan: 'Professional',
      amount: 79,
      status: 'Pending',
      date: '2025-01-19',
      method: 'Credit Card'
    },
    {
      id: '4',
      tenant: 'Private Clinic Network',
      plan: 'Basic',
      amount: 29,
      status: 'Failed',
      date: '2025-01-18',
      method: 'Credit Card'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Billing & Plans</h2>
            <p className="text-gray-600">Manage subscription plans, billing, and revenue analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'plans', name: 'Plans' },
              { id: 'transactions', name: 'Transactions' },
              { id: 'analytics', name: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${billingData.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Recurring</p>
                    <p className="text-2xl font-bold text-gray-900">${billingData.monthlyRecurring.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">MRR</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{billingData.churnRate}%</p>
                    <p className="text-sm text-green-600">-0.3% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ARPU</p>
                    <p className="text-2xl font-bold text-gray-900">${billingData.averageRevenuePerUser}</p>
                    <p className="text-sm text-gray-500">Average per user</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="6m">Last 6 months</option>
                    <option value="1y">Last year</option>
                    <option value="2y">Last 2 years</option>
                  </select>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Revenue trends chart would go here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`card cursor-pointer transition-all ${
                    selectedPlan === plan.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    {selectedPlan === plan.id && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/{plan.billing}</span>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span>Tenants</span>
                      <span className="font-medium text-gray-900">{plan.tenants}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Revenue</span>
                      <span className="font-medium text-gray-900">${plan.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Details */}
            {selectedPlanData && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedPlanData.name} Plan Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Price:</span>
                        <span className="font-medium">${selectedPlanData.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billing Cycle:</span>
                        <span className="font-medium capitalize">{selectedPlanData.billing}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Users:</span>
                        <span className="font-medium">{selectedPlanData.users}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Usage Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Tenants:</span>
                        <span className="font-medium">{selectedPlanData.tenants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="font-medium">${selectedPlanData.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth Rate:</span>
                        <span className="font-medium text-green-600">+8.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button className="flex items-center space-x-2 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Transaction ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tenant</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">#{transaction.id}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{transaction.tenant}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{transaction.plan}</td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">${transaction.amount}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">{transaction.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{transaction.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Plan</h3>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.tenants} tenants</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(plan.revenue / Math.max(...plans.map(p => p.revenue))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">${plan.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Credit Card</span>
                    <span className="text-sm font-medium text-gray-900">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bank Transfer</span>
                    <span className="text-sm font-medium text-gray-900">22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">PayPal</span>
                    <span className="text-sm font-medium text-gray-900">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Other</span>
                    <span className="text-sm font-medium text-gray-900">2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default BillingPlans;
