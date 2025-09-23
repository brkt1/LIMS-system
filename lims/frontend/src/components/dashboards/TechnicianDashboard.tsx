import { CheckCircle, ClipboardCheck, FileText, TestTube, Wrench } from 'lucide-react';
import React from 'react';
import BaseDashboard from './BaseDashboard';

const TechnicianDashboard: React.FC = () => {
  const technicianCards = [
    {
      title: "Samples Processed",
      value: "156",
      change: "+23 Today",
      color: "bg-blue-500",
      chartData: [120, 130, 140, 145, 150, 152, 156]
    },
    {
      title: "Equipment Active",
      value: "8/10",
      change: "2 Maintenance Due",
      color: "bg-green-500",
      chartData: [6, 7, 8, 8, 8, 8, 8]
    },
    {
      title: "Test Reports Created",
      value: "89",
      change: "+12 This Week",
      color: "bg-purple-500",
      chartData: [70, 75, 80, 82, 85, 87, 89]
    },
    {
      title: "Quality Score",
      value: "98.5%",
      change: "+0.3% This Month",
      color: "bg-emerald-500",
      chartData: [97, 97.5, 98, 98.2, 98.3, 98.4, 98.5]
    }
  ];

  return (
    <BaseDashboard>
      {/* Technician specific cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {technicianCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{card.title}</h3>
              <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                {index === 0 && <TestTube className="w-4 h-4 text-white" />}
                {index === 1 && <Wrench className="w-4 h-4 text-white" />}
                {index === 2 && <FileText className="w-4 h-4 text-white" />}
                {index === 3 && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</span>
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

      {/* Sample Processing Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sample Processing Queue</h3>
            <ClipboardCheck className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { id: 'SP-001', type: 'Blood Panel', priority: 'High', status: 'Processing', time: '2h 15m' },
              { id: 'SP-002', type: 'Urine Analysis', priority: 'Medium', status: 'Pending', time: '1h 30m' },
              { id: 'SP-003', type: 'Tissue Biopsy', priority: 'High', status: 'Processing', time: '3h 45m' },
              { id: 'SP-004', type: 'Swab Culture', priority: 'Low', status: 'Completed', time: '0h 20m' },
              { id: 'SP-005', type: 'Blood Typing', priority: 'Medium', status: 'Pending', time: '45m' }
            ].map((sample, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    sample.priority === 'High' ? 'bg-red-100' : 
                    sample.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <TestTube className={`w-4 h-4 ${
                      sample.priority === 'High' ? 'text-red-600' : 
                      sample.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{sample.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{sample.type}</p>
                    <p className="text-xs text-gray-500">Est. time: {sample.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    sample.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    sample.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {sample.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Equipment Status</h3>
            <Wrench className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Microscope Alpha-1', status: 'Operational', lastCalibration: '2025-01-15', nextMaintenance: '2025-02-15' },
              { name: 'Centrifuge Beta-2', status: 'Maintenance Due', lastCalibration: '2025-01-10', nextMaintenance: '2025-01-25' },
              { name: 'PCR Machine Gamma-3', status: 'Operational', lastCalibration: '2025-01-18', nextMaintenance: '2025-02-18' },
              { name: 'Incubator Delta-4', status: 'Calibrating', lastCalibration: '2025-01-20', nextMaintenance: '2025-02-20' }
            ].map((equipment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    equipment.status === 'Operational' ? 'bg-green-100' : 
                    equipment.status === 'Maintenance Due' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <Wrench className={`w-4 h-4 ${
                      equipment.status === 'Operational' ? 'text-green-600' : 
                      equipment.status === 'Maintenance Due' ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{equipment.name}</p>
                    <p className="text-xs text-gray-500">Last cal: {equipment.lastCalibration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    equipment.status === 'Operational' ? 'bg-green-100 text-green-800' :
                    equipment.status === 'Maintenance Due' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {equipment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Test Reports */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Test Reports</h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              New Report
            </button>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Report ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Test Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">TR-2025-001</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">John Smith</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">Blood Panel Complete</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">2025-01-20 14:30</td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">TR-2025-002</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">Sarah Johnson</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">X-Ray Chest</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    In Review
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">2025-01-20 13:15</td>
                <td className="py-4 px-4">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">TR-2025-003</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">Mike Davis</td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">MRI Brain</td>
                <td className="py-4 px-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">2025-01-20 12:45</td>
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

export default TechnicianDashboard;
