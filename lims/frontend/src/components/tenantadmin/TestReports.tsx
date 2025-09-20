import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Search,
  XCircle
} from 'lucide-react';
import React, { useState } from 'react';
import BaseDashboard from '../dashboards/BaseDashboard';

interface TestReport {
  id: string;
  patient_name: string;
  patient_id: string;
  test_name: string;
  test_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  technician: string;
  doctor: string;
  created_date: string;
  completed_date: string;
  result: string;
  normal_range: string;
  units: string;
  notes: string;
}

const TestReports: React.FC = () => {
  const [reports, setReports] = useState<TestReport[]>([
    {
      id: '1',
      patient_name: 'John Smith',
      patient_id: 'P001',
      test_name: 'Complete Blood Count',
      test_type: 'Hematology',
      status: 'completed',
      priority: 'routine',
      technician: 'Mike Chen',
      doctor: 'Dr. Sarah Johnson',
      created_date: '2025-01-20',
      completed_date: '2025-01-20',
      result: 'Normal',
      normal_range: '4.5-11.0 x10³/μL',
      units: 'x10³/μL',
      notes: 'All parameters within normal limits'
    },
    {
      id: '2',
      patient_name: 'Sarah Johnson',
      patient_id: 'P002',
      test_name: 'Lipid Panel',
      test_type: 'Biochemistry',
      status: 'in_progress',
      priority: 'urgent',
      technician: 'Lisa Rodriguez',
      doctor: 'Dr. Michael Chen',
      created_date: '2025-01-20',
      completed_date: '',
      result: '',
      normal_range: '',
      units: '',
      notes: 'Sample processing in progress'
    },
    {
      id: '3',
      patient_name: 'Robert Brown',
      patient_id: 'P003',
      test_name: 'Thyroid Function Test',
      test_type: 'Endocrinology',
      status: 'pending',
      priority: 'routine',
      technician: '',
      doctor: 'Dr. Emily Rodriguez',
      created_date: '2025-01-19',
      completed_date: '',
      result: '',
      normal_range: '',
      units: '',
      notes: 'Awaiting sample collection'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTestType, setFilterTestType] = useState('all');

  const statuses = ['all', 'pending', 'in_progress', 'completed', 'cancelled'];
  const priorities = ['all', 'routine', 'urgent', 'stat'];
  const testTypes = ['all', 'Hematology', 'Biochemistry', 'Endocrinology', 'Microbiology', 'Immunology'];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    const matchesTestType = filterTestType === 'all' || report.test_type === filterTestType;
    return matchesSearch && matchesStatus && matchesPriority && matchesTestType;
  });

  const completedReports = reports.filter(report => report.status === 'completed').length;
  const pendingReports = reports.filter(report => report.status === 'pending').length;
  const inProgressReports = reports.filter(report => report.status === 'in_progress').length;
  const urgentReports = reports.filter(report => report.priority === 'urgent' || report.priority === 'stat').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <BaseDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test Reports</h1>
              <p className="text-gray-600">View and manage laboratory test reports</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Reports</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedReports}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressReports}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">{urgentReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priority' : priority.toUpperCase()}
              </option>
            ))}
          </select>
          <select
            value={filterTestType}
            onChange={(e) => setFilterTestType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {testTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.patient_name}</div>
                        <div className="text-sm text-gray-500">ID: {report.patient_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.test_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {report.test_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(report.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.technician || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.created_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Details Modal */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Report Details</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Patient Name</label>
                    <p className="text-sm font-medium">John Smith</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Patient ID</label>
                    <p className="text-sm font-medium">P001</p>
                  </div>
                </div>
              </div>

              {/* Test Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Test Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Test Name</label>
                    <p className="text-sm font-medium">Complete Blood Count</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Test Type</label>
                    <p className="text-sm font-medium">Hematology</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Technician</label>
                    <p className="text-sm font-medium">Mike Chen</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Doctor</label>
                    <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Test Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">White Blood Cell Count</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">7.2</span>
                      <span className="text-xs text-gray-500 ml-2">x10³/μL</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Normal Range: 4.5-11.0 x10³/μL</div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Red Blood Cell Count</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">4.8</span>
                      <span className="text-xs text-gray-500 ml-2">x10⁶/μL</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Normal Range: 4.0-5.5 x10⁶/μL</div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Notes</h4>
                <p className="text-sm text-gray-700">All parameters within normal limits. No abnormalities detected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default TestReports;
