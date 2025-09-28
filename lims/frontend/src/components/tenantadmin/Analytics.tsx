import { BarChart3, DollarSign, TrendingUp, Users, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { analyticsAPI } from "../../services/api";

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    totalPatients: 0,
    totalTests: 0,
    topTests: [],
    monthlyRevenue: [],
    testCategories: [],
    patientDemographics: {
      ageGroups: [],
      genderDistribution: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data from backend API
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [labAnalyticsResponse, testCategoryResponse] = await Promise.all([
          analyticsAPI.getAnalyticsSummary(),
          analyticsAPI.getTestCategoryAnalytics(),
        ]);

        // Map backend data to frontend expected format
        const labData = labAnalyticsResponse.data;
        const testCategoryData = testCategoryResponse.data;

        setAnalyticsData({
          totalRevenue: 0, // Not available in current backend
          monthlyGrowth: 0, // Not available in current backend
          totalPatients: 0, // Not available in current backend
          totalTests: labData.total_tests || 0,
          topTests: [], // Not available in current backend
          monthlyRevenue: [], // Not available in current backend
          testCategories: labData.test_categories || [],
          patientDemographics: {
            ageGroups: [],
            genderDistribution: [],
          }, // Not available in current backend
        });
      } catch (error: any) {
        console.error("Error fetching analytics:", error);
        setError(error.message || "Failed to load analytics data");
        // Set empty data structure when API fails
        setAnalyticsData({
          totalRevenue: 0,
          monthlyGrowth: 0,
          totalPatients: 0,
          totalTests: 0,
          topTests: [],
          monthlyRevenue: [],
          testCategories: [],
          patientDemographics: {
            ageGroups: [],
            genderDistribution: [],
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive insights into your laboratory performance
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
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
            Loading analytics...
          </span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Tests
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
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

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Avg. Test Price
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                $36.20
              </p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.3% this month
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Performing Tests */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">
              Top Performing Tests
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.topTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {test.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                        {test.count} tests
                      </p>
                    </div>
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
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
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">
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
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {month.month} 2025
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {group.range} years
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {group.count} patients
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
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
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:text-white">
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {gender.gender}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {gender.count} patients
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
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
