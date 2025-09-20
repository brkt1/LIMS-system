import { Calendar, CheckCircle, Clock, FileText, HelpCircle, MessageSquare, User } from 'lucide-react';
import React from 'react';
import BaseDashboard from './BaseDashboard';

const PatientDashboard: React.FC = () => {
  const patientCards = [
    {
      title: "Upcoming Appointments",
      value: "2",
      change: "Next: Tomorrow 10:00 AM",
      color: "bg-blue-500",
      chartData: [1, 2, 1, 3, 2, 2, 2]
    },
    {
      title: "Test Results Available",
      value: "5",
      change: "3 New This Week",
      color: "bg-green-500",
      chartData: [2, 3, 4, 4, 5, 5, 5]
    },
    {
      title: "Messages from Doctor",
      value: "3",
      change: "1 Unread",
      color: "bg-purple-500",
      chartData: [1, 2, 2, 3, 3, 3, 3]
    },
    {
      title: "Health Score",
      value: "85%",
      change: "+5% This Month",
      color: "bg-emerald-500",
      chartData: [75, 78, 80, 82, 83, 84, 85]
    }
  ];

  return (
    <BaseDashboard>
      {/* Patient specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {patientCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                {index === 0 && <Calendar className="w-4 h-4 text-white" />}
                {index === 1 && <FileText className="w-4 h-4 text-white" />}
                {index === 2 && <MessageSquare className="w-4 h-4 text-white" />}
                {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
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

      {/* Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { date: 'Tomorrow, Jan 21', time: '10:00 AM', doctor: 'Dr. Sarah Johnson', type: 'Follow-up', status: 'Confirmed' },
              { date: 'Friday, Jan 24', time: '2:30 PM', doctor: 'Dr. Mike Chen', type: 'Consultation', status: 'Confirmed' },
              { date: 'Next Monday, Jan 27', time: '9:15 AM', doctor: 'Dr. Lisa Rodriguez', type: 'Test Review', status: 'Pending' }
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time} - {appointment.doctor}</p>
                    <p className="text-xs text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  appointment.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { test: 'Blood Panel Complete', date: 'Jan 18, 2025', result: 'Normal', status: 'Available' },
              { test: 'X-Ray Chest', date: 'Jan 15, 2025', result: 'Clear', status: 'Available' },
              { test: 'Urine Analysis', date: 'Jan 12, 2025', result: 'Normal', status: 'Available' },
              { test: 'MRI Brain', date: 'Jan 10, 2025', result: 'Pending', status: 'Processing' }
            ].map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    test.status === 'Available' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      test.status === 'Available' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{test.test}</p>
                    <p className="text-xs text-gray-500">{test.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    test.result === 'Normal' || test.result === 'Clear' ? 'bg-green-100 text-green-800' :
                    test.result === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {test.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages from Healthcare Team */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Messages from Healthcare Team</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              New Message
            </button>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          {[
            { 
              from: 'Dr. Sarah Johnson', 
              subject: 'Test Results Discussion', 
              message: 'Your recent blood panel results look excellent. All values are within normal range...',
              time: '2 hours ago',
              unread: true
            },
            { 
              from: 'Lab Technician Mike', 
              subject: 'Sample Collection Reminder', 
              message: 'Please remember to fast for 12 hours before your blood test tomorrow...',
              time: '1 day ago',
              unread: false
            },
            { 
              from: 'Nurse Lisa', 
              subject: 'Appointment Confirmation', 
              message: 'Your appointment for tomorrow at 10:00 AM has been confirmed. Please arrive 15 minutes early...',
              time: '2 days ago',
              unread: false
            }
          ].map((message, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{message.from}</p>
                      {message.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{message.subject}</p>
                    <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{message.time}</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  {message.unread ? 'Mark as Read' : 'Reply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Appointment</h3>
          <p className="text-sm text-gray-600 mb-4">Schedule your next visit with our healthcare team</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Book Now
          </button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Test Results</h3>
          <p className="text-sm text-gray-600 mb-4">Access your latest test results and reports</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            View Results
          </button>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h3>
          <p className="text-sm text-gray-600 mb-4">Find answers to common questions and get support</p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
            Get Help
          </button>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default PatientDashboard;
