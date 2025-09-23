import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Stethoscope,
  Users,
} from "lucide-react";
import React from "react";
import BaseDashboard from "./BaseDashboard";

const DoctorDashboard: React.FC = () => {
  const doctorCards = [
    {
      title: "Today's Appointments",
      value: "8",
      change: "+2 This Week",
      color: "bg-blue-500",
      chartData: [5, 6, 7, 8, 6, 7, 8],
    },
    {
      title: "Pending Test Requests",
      value: "15",
      change: "-3 Today",
      color: "bg-orange-500",
      chartData: [18, 20, 17, 15, 16, 18, 15],
    },
    {
      title: "Completed Tests",
      value: "42",
      change: "+12 This Week",
      color: "bg-green-500",
      chartData: [30, 32, 35, 38, 40, 41, 42],
    },
    {
      title: "Active Patients",
      value: "127",
      change: "+5 This Month",
      color: "bg-purple-500",
      chartData: [110, 115, 120, 122, 125, 126, 127],
    },
  ];

  return (
    <BaseDashboard>
      {/* Doctor specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {doctorCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <div
                className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}
              >
                {index === 0 && <Calendar className="w-4 h-4 text-white" />}
                {index === 1 && <FileText className="w-4 h-4 text-white" />}
                {index === 2 && <CheckCircle className="w-4 h-4 text-white" />}
                {index === 3 && <Users className="w-4 h-4 text-white" />}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </span>
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
                    width: "8px",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Today's Schedule
            </h3>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                time: "09:00 AM",
                patient: "John Smith",
                type: "Follow-up",
                status: "Confirmed",
              },
              {
                time: "10:30 AM",
                patient: "Sarah Johnson",
                type: "New Patient",
                status: "Confirmed",
              },
              {
                time: "02:00 PM",
                patient: "Mike Davis",
                type: "Consultation",
                status: "Pending",
              },
              {
                time: "03:30 PM",
                patient: "Lisa Wilson",
                type: "Test Review",
                status: "Confirmed",
              },
              {
                time: "04:45 PM",
                patient: "Robert Brown",
                type: "Follow-up",
                status: "Confirmed",
              },
            ].map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.patient}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {appointment.type}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Test Results
            </h3>
            <ClipboardList className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                patient: "John Smith",
                test: "Blood Panel",
                result: "Normal",
                priority: "Low",
              },
              {
                patient: "Sarah Johnson",
                test: "X-Ray Chest",
                result: "Abnormal",
                priority: "High",
              },
              {
                patient: "Mike Davis",
                test: "Urine Analysis",
                result: "Normal",
                priority: "Low",
              },
              {
                patient: "Lisa Wilson",
                test: "MRI Brain",
                result: "Pending",
                priority: "Medium",
              },
            ].map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      test.priority === "High"
                        ? "bg-red-100"
                        : test.priority === "Medium"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                    }`}
                  >
                    <Stethoscope
                      className={`w-4 h-4 ${
                        test.priority === "High"
                          ? "text-red-600"
                          : test.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.patient}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {test.test}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      test.result === "Normal"
                        ? "bg-green-100 text-green-800"
                        : test.result === "Abnormal"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {test.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Requests Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Requests Queue
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              New Request
            </button>
            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Patient
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Test Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Requested Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  John Smith
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  Blood Panel Complete
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    High
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-20
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Review
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Sarah Johnson
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  X-Ray Chest
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Medium
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-19
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Mike Davis
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  MRI Brain
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Low
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                  2025-01-18
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Track
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

export default DoctorDashboard;
