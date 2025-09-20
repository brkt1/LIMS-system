import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  Download,
  Eye,
  FileText,
  Printer,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import BaseDashboard from '../dashboards/BaseDashboard';

interface Receipt {
  id: string;
  receipt_number: string;
  patient_name: string;
  patient_id: string;
  amount: number;
  payment_method: 'cash' | 'card' | 'insurance' | 'check';
  status: 'paid' | 'pending' | 'cancelled';
  created_date: string;
  printed_date: string;
  printed_by: string;
  services: string[];
}

const ReceiptsPrinting: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: '1',
      receipt_number: 'RCP-2025-001',
      patient_name: 'John Smith',
      patient_id: 'P001',
      amount: 125.50,
      payment_method: 'card',
      status: 'paid',
      created_date: '2025-01-20',
      printed_date: '2025-01-20',
      printed_by: 'Admin User',
      services: ['Complete Blood Count', 'Lipid Panel']
    },
    {
      id: '2',
      receipt_number: 'RCP-2025-002',
      patient_name: 'Sarah Johnson',
      patient_id: 'P002',
      amount: 89.75,
      payment_method: 'insurance',
      status: 'paid',
      created_date: '2025-01-19',
      printed_date: '2025-01-19',
      printed_by: 'Admin User',
      services: ['Thyroid Function Test']
    },
    {
      id: '3',
      receipt_number: 'RCP-2025-003',
      patient_name: 'Robert Brown',
      patient_id: 'P003',
      amount: 200.00,
      payment_method: 'cash',
      status: 'pending',
      created_date: '2025-01-18',
      printed_date: '',
      printed_by: '',
      services: ['MRI Scan', 'Blood Culture']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);

  const statuses = ['all', 'paid', 'pending', 'cancelled'];
  const paymentMethods = ['all', 'cash', 'card', 'insurance', 'check'];

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || receipt.payment_method === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const paidReceipts = receipts.filter(receipt => receipt.status === 'paid').length;
  const pendingReceipts = receipts.filter(receipt => receipt.status === 'pending').length;
  const printedReceipts = receipts.filter(receipt => receipt.printed_date).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'insurance':
        return 'bg-purple-100 text-purple-800';
      case 'check':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectReceipt = (receiptId: string) => {
    setSelectedReceipts(prev => 
      prev.includes(receiptId) 
        ? prev.filter(id => id !== receiptId)
        : [...prev, receiptId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReceipts.length === filteredReceipts.length) {
      setSelectedReceipts([]);
    } else {
      setSelectedReceipts(filteredReceipts.map(receipt => receipt.id));
    }
  };

  const handlePrintSelected = () => {
    console.log('Printing receipts:', selectedReceipts);
    // Implement print functionality
  };

  const handlePrintSingle = (receiptId: string) => {
    console.log('Printing receipt:', receiptId);
    // Implement single print functionality
  };

  return (
    <BaseDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Printer className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Receipts Printing</h1>
              <p className="text-gray-600">Manage and print patient receipts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedReceipts.length > 0 && (
              <button
                onClick={handlePrintSelected}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Selected ({selectedReceipts.length})</span>
              </button>
            )}
            <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-gray-900">{receipts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900">{paidReceipts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Printer className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Printed</p>
                <p className="text-2xl font-bold text-gray-900">{printedReceipts}</p>
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
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <select
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>
                {method === 'all' ? 'All Payment Methods' : method}
              </option>
            ))}
          </select>
        </div>

        {/* Receipts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedReceipts.length === filteredReceipts.length && filteredReceipts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReceipts.includes(receipt.id)}
                        onChange={() => handleSelectReceipt(receipt.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{receipt.receipt_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{receipt.patient_name}</div>
                        <div className="text-sm text-gray-500">ID: {receipt.patient_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${receipt.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(receipt.payment_method)}`}>
                        {receipt.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receipt.created_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handlePrintSingle(receipt.id)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Preview Modal */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Print Preview</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white border-2 border-gray-300 p-8">
              {/* Receipt Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">LABORATORY RECEIPT</h1>
                <p className="text-gray-600">Hospital Name</p>
                <p className="text-gray-600">123 Medical Street, City, State 12345</p>
                <p className="text-gray-600">Phone: (555) 123-4567</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Receipt Number:</span>
                  <span>RCP-2025-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>January 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Patient Name:</span>
                  <span>John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Patient ID:</span>
                  <span>P001</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Services:</h3>
                  <div className="flex justify-between">
                    <span>Complete Blood Count</span>
                    <span>$75.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lipid Panel</span>
                    <span>$50.50</span>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>$125.50</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Payment Method:</span>
                  <span>Credit Card</span>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-600">Thank you for your visit!</p>
                  <p className="text-sm text-gray-600">Keep this receipt for your records</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default ReceiptsPrinting;
