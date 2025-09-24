import {
  BarChart3,
  Check,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Plus,
  TrendingUp,
  Eye,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const BillingPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlan, setSelectedPlan] = useState("basic");

  // Modal states
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showViewPlanModal, setShowViewPlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [selectedPlanData, setSelectedPlanData] = useState<any>(null);

  // Form states
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    billing: "monthly",
    users: 0,
    features: [] as string[],
  });

  const [editPlan, setEditPlan] = useState({
    name: "",
    price: 0,
    billing: "monthly",
    users: 0,
    features: [] as string[],
  });

  const billingData = {
    totalRevenue: 156800,
    monthlyRecurring: 12800,
    annualRecurring: 144000,
    churnRate: 2.1,
    averageRevenuePerUser: 125.6,
    totalCustomers: 1247,
  };

  const [plans, setPlans] = useState([
    {
      id: "basic",
      name: "Basic",
      price: 29,
      billing: "monthly",
      users: 10,
      features: [
        "Basic Dashboard",
        "Standard Support",
        "Up to 10 users",
        "Basic Analytics",
        "Email Support",
      ],
      tenants: 8,
      revenue: 2320,
    },
    {
      id: "professional",
      name: "Professional",
      price: 79,
      billing: "monthly",
      users: 50,
      features: [
        "Advanced Dashboard",
        "Priority Support",
        "Up to 50 users",
        "Advanced Analytics",
        "API Access",
        "Phone Support",
      ],
      tenants: 12,
      revenue: 9480,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      billing: "monthly",
      users: 200,
      features: [
        "Full Dashboard Suite",
        "Dedicated Support",
        "Unlimited users",
        "Custom Analytics",
        "Full API Access",
        "Custom Branding",
        "24/7 Support",
      ],
      tenants: 4,
      revenue: 7960,
    },
  ]);

  // Load plans from localStorage on component mount
  useEffect(() => {
    const savedPlans = localStorage.getItem("superadmin-billing-plans");
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error("Error loading saved plans:", error);
      }
    }
  }, []);

  // Save plans to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("superadmin-billing-plans", JSON.stringify(plans));
  }, [plans]);

  // Export functionality
  const handleExportReport = () => {
    const csvContent = generateBillingReportCSV();
    downloadCSV(csvContent, "billing-plans-report.csv");
  };

  const generateBillingReportCSV = () => {
    const headers = [
      "Plan Name",
      "Price",
      "Billing Cycle",
      "Max Users",
      "Active Tenants",
      "Monthly Revenue",
      "Features",
    ];

    const currentDate = new Date().toISOString().split("T")[0];

    const rows = plans.map((plan) => [
      plan.name,
      plan.price.toString(),
      plan.billing,
      plan.users.toString(),
      plan.tenants.toString(),
      plan.revenue.toString(),
      plan.features.join("; "),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CRUD handler functions
  const handleCreatePlan = () => {
    setShowCreatePlanModal(true);
  };

  const handleViewPlan = (plan: any) => {
    setSelectedPlanData(plan);
    setShowViewPlanModal(true);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlanData(plan);
    setEditPlan({
      name: plan.name,
      price: plan.price,
      billing: plan.billing,
      users: plan.users,
      features: plan.features,
    });
    setShowEditPlanModal(true);
  };

  const handleCreatePlanSubmit = () => {
    const newPlanData = {
      id: newPlan.name.toLowerCase().replace(/\s+/g, "-"),
      ...newPlan,
      tenants: 0,
      revenue: 0,
    };
    setPlans((prev: any) => [...prev, newPlanData]);
    setShowCreatePlanModal(false);
    setNewPlan({
      name: "",
      price: 0,
      billing: "monthly",
      users: 0,
      features: [],
    });
  };

  const handleUpdatePlan = () => {
    if (selectedPlanData) {
      setPlans((prev: any) =>
        prev.map((plan: any) =>
          plan.id === selectedPlanData.id ? { ...plan, ...editPlan } : plan
        )
      );
      setShowEditPlanModal(false);
      setSelectedPlanData(null);
    }
  };

  // Export transactions functionality
  const handleExportTransactions = () => {
    const csvContent = generateTransactionsCSV();
    downloadCSV(csvContent, "transactions-report.csv");
  };

  const generateTransactionsCSV = () => {
    const headers = [
      "Transaction ID",
      "Tenant",
      "Plan",
      "Amount",
      "Status",
      "Date",
      "Method",
    ];

    const currentDate = new Date().toISOString().split("T")[0];

    const rows = recentTransactions.map((transaction) => [
      transaction.id,
      transaction.tenant,
      transaction.plan,
      transaction.amount.toString(),
      transaction.status,
      transaction.date,
      transaction.method,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const recentTransactions = [
    {
      id: "1",
      tenant: "Research Institute",
      plan: "Enterprise",
      amount: 199,
      status: "Paid",
      date: "2025-01-20",
      method: "Credit Card",
    },
    {
      id: "2",
      tenant: "City Hospital Lab",
      plan: "Enterprise",
      amount: 199,
      status: "Paid",
      date: "2025-01-20",
      method: "Bank Transfer",
    },
    {
      id: "3",
      tenant: "MedLab Solutions",
      plan: "Professional",
      amount: 79,
      status: "Pending",
      date: "2025-01-19",
      method: "Credit Card",
    },
    {
      id: "4",
      tenant: "Private Clinic Network",
      plan: "Basic",
      amount: 29,
      status: "Failed",
      date: "2025-01-18",
      method: "Credit Card",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 -mx-4 sm:-mx-6 lg:-mx-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Billing & Plans
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage subscription plans, billing, and revenue analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleExportReport}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={handleCreatePlan}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8 px-4 sm:px-6">
              {[
                { id: "overview", name: "Overview" },
                { id: "plans", name: "Plans" },
                { id: "transactions", name: "Transactions" },
                { id: "analytics", name: "Analytics" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Revenue Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Total Revenue
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ${billingData.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% from last month
                    </p>
                  </div>
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Monthly Recurring
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ${billingData.monthlyRecurring.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      MRR
                    </p>
                  </div>
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      Churn Rate
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {billingData.churnRate}%
                    </p>
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                      -0.3% from last month
                    </p>
                  </div>
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      ARPU
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ${billingData.averageRevenuePerUser}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Average per user
                    </p>
                  </div>
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Trends
                </h3>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent w-full sm:w-auto">
                    <option value="6m">Last 6 months</option>
                    <option value="1y">Last year</option>
                    <option value="2y">Last 2 years</option>
                  </select>
                </div>
              </div>
              <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                  <p className="text-sm sm:text-base">
                    Revenue trends chart would go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? "ring-2 ring-blue-500"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    {selectedPlan === plan.id && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      /{plan.billing}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 sm:mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>Tenants</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {plan.tenants}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <span>Revenue</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${plan.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPlan(plan);
                      }}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPlan(plan);
                      }}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Details */}
            {plans.find((plan) => plan.id === selectedPlan) && (
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {plans.find((plan) => plan.id === selectedPlan)?.name} Plan
                  Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                      Pricing Information
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Monthly Price:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          $
                          {
                            plans.find((plan) => plan.id === selectedPlan)
                              ?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Billing Cycle:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {
                            plans.find((plan) => plan.id === selectedPlan)
                              ?.billing
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Max Users:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {
                            plans.find((plan) => plan.id === selectedPlan)
                              ?.users
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                      Usage Statistics
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Active Tenants:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {
                            plans.find((plan) => plan.id === selectedPlan)
                              ?.tenants
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Monthly Revenue:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          $
                          {plans
                            .find((plan) => plan.id === selectedPlan)
                            ?.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Growth Rate:
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          +8.5%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Transactions
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <select className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent w-full sm:w-auto">
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button
                    onClick={handleExportTransactions}
                    className="flex items-center justify-center space-x-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Transaction ID
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Tenant
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Plan
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                        Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900"
                      >
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          #{transaction.id}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {transaction.tenant}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {transaction.plan}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          ${transaction.amount}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {transaction.date}
                        </td>
                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                          {transaction.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Revenue by Plan
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {plan.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {plan.tenants} tenants
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-16 sm:w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (plan.revenue /
                                  Math.max(...plans.map((p) => p.revenue))) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          ${plan.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Payment Methods
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Credit Card
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      68%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Bank Transfer
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      22%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      PayPal
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Other
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                      2%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Plan Modal */}
        {showCreatePlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Plan
                </h3>
                <button
                  onClick={() => setShowCreatePlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter plan name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPlan.price}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={newPlan.billing}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, billing: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Users
                    </label>
                    <input
                      type="number"
                      value={newPlan.users}
                      onChange={(e) =>
                        setNewPlan({
                          ...newPlan,
                          users: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter max users"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {[
                      "Basic Dashboard",
                      "Advanced Dashboard",
                      "Standard Support",
                      "Priority Support",
                      "24/7 Support",
                      "Basic Analytics",
                      "Advanced Analytics",
                      "Email Support",
                      "Phone Support",
                      "Custom Branding",
                      "API Access",
                      "Data Export",
                    ].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newPlan.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPlan({
                                ...newPlan,
                                features: [...newPlan.features, feature],
                              });
                            } else {
                              setNewPlan({
                                ...newPlan,
                                features: newPlan.features.filter(
                                  (f) => f !== feature
                                ),
                              });
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCreatePlanModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlanSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Plan Modal */}
        {showViewPlanModal && selectedPlanData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Plan Details
                </h3>
                <button
                  onClick={() => setShowViewPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Plan Name
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedPlanData.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      ${selectedPlanData.price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Billing Cycle
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">
                      {selectedPlanData.billing}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Users
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedPlanData.users}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Active Tenants
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedPlanData.tenants}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Monthly Revenue
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      ${selectedPlanData.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlanData.features.map(
                      (feature: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowViewPlanModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Plan Modal */}
        {showEditPlanModal && selectedPlanData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Plan
                </h3>
                <button
                  onClick={() => setShowEditPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={editPlan.name}
                      onChange={(e) =>
                        setEditPlan({ ...editPlan, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={editPlan.price}
                      onChange={(e) =>
                        setEditPlan({
                          ...editPlan,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={editPlan.billing}
                      onChange={(e) =>
                        setEditPlan({ ...editPlan, billing: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Users
                    </label>
                    <input
                      type="number"
                      value={editPlan.users}
                      onChange={(e) =>
                        setEditPlan({
                          ...editPlan,
                          users: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {[
                      "Basic Dashboard",
                      "Advanced Dashboard",
                      "Standard Support",
                      "Priority Support",
                      "24/7 Support",
                      "Basic Analytics",
                      "Advanced Analytics",
                      "Email Support",
                      "Phone Support",
                      "Custom Branding",
                      "API Access",
                      "Data Export",
                    ].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editPlan.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditPlan({
                                ...editPlan,
                                features: [...editPlan.features, feature],
                              });
                            } else {
                              setEditPlan({
                                ...editPlan,
                                features: editPlan.features.filter(
                                  (f) => f !== feature
                                ),
                              });
                            }
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowEditPlanModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePlan}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPlans;
