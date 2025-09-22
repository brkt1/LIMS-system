import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import React from "react";

const Analytics: React.FC = () => {
  const analyticsData = {
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
    totalPatients: 1247,
    totalTests: 3456,
    topTests: [
      { name: "Complete Blood Count", count: 456, revenue: 20520 },
      { name: "COVID-19 PCR Test", count: 234, revenue: 28080 },
      { name: "Lipid Panel", count: 189, revenue: 12285 },
      { name: "Thyroid Function Test", count: 156, revenue: 13260 },
      { name: "Urinalysis Complete", count: 298, revenue: 7450 },
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 8500 },
      { month: "Feb", revenue: 9200 },
      { month: "Mar", revenue: 8800 },
      { month: "Apr", revenue: 10500 },
      { month: "May", revenue: 11200 },
      { month: "Jun", revenue: 12000 },
    ],
    patientDemographics: {
      ageGroups: [
        { range: "0-18", count: 234, percentage: 18.8 },
        { range: "19-35", count: 456, percentage: 36.6 },
        { range: "36-50", count: 345, percentage: 27.7 },
        { range: "51-65", count: 178, percentage: 14.3 },
        { range: "65+", count: 34, percentage: 2.7 },
      ],
      genderDistribution: [
        { gender: "Male", count: 623, percentage: 50.0 },
        { gender: "Female", count: 624, percentage: 50.0 },
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your laboratory performance
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${analyticsData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />+
                {analyticsData.monthlyGrowth}% this month
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">
                {analyticsData.totalPatients.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Users className="w-4 h-4 mr-1" />
                +45 new this month
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">
                {analyticsData.totalTests.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <BarChart3 className="w-4 h-4 mr-1" />
                +12% this month
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Test Price</p>
              <p className="text-3xl font-bold text-gray-900">$36.20</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.3% this month
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Tests */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Tests
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.topTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {test.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {test.count} tests
                      </p>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Revenue: ${test.revenue.toLocaleString()}</span>
                        <span>
                          {(
                            (test.revenue / analyticsData.totalRevenue) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (test.revenue / analyticsData.totalRevenue) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Revenue Trend
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {month.month}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {month.month} 2025
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${month.revenue.toLocaleString()}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(month.revenue / 12000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Patient Age Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.patientDemographics.ageGroups.map(
                (group, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {group.range}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {group.range} years
                        </p>
                        <p className="text-xs text-gray-500">
                          {group.count} patients
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {group.percentage}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${group.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Gender Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {analyticsData.patientDemographics.genderDistribution.map(
                (gender, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          gender.gender === "Male"
                            ? "bg-blue-100"
                            : "bg-pink-100"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            gender.gender === "Male"
                              ? "text-blue-600"
                              : "text-pink-600"
                          }`}
                        >
                          {gender.gender === "Male" ? "♂" : "♀"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {gender.gender}
                        </p>
                        <p className="text-xs text-gray-500">
                          {gender.count} patients
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {gender.percentage}%
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            gender.gender === "Male"
                              ? "bg-blue-600"
                              : "bg-pink-600"
                          }`}
                          style={{ width: `${gender.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
