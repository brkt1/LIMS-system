import {
  Calculator,
  DollarSign,
  Edit2,
  Plus,
  Save,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import BaseDashboard from '../dashboards/BaseDashboard';

interface PricingItem {
  id: string;
  name: string;
  category: string;
  base_price: number;
  current_price: number;
  markup_percentage: number;
  cost: number;
  status: 'active' | 'inactive';
  last_updated: string;
}

const TestPricing: React.FC = () => {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      base_price: 20.00,
      current_price: 25.00,
      markup_percentage: 25,
      cost: 15.00,
      status: 'active',
      last_updated: '2025-01-15'
    },
    {
      id: '2',
      name: 'Lipid Panel',
      category: 'Biochemistry',
      base_price: 28.00,
      current_price: 35.00,
      markup_percentage: 25,
      cost: 20.00,
      status: 'active',
      last_updated: '2025-01-14'
    },
    {
      id: '3',
      name: 'Thyroid Function Test',
      category: 'Endocrinology',
      base_price: 36.00,
      current_price: 45.00,
      markup_percentage: 25,
      cost: 25.00,
      status: 'active',
      last_updated: '2025-01-13'
    },
    {
      id: '4',
      name: 'Blood Culture',
      category: 'Microbiology',
      base_price: 40.00,
      current_price: 50.00,
      markup_percentage: 25,
      cost: 30.00,
      status: 'active',
      last_updated: '2025-01-12'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Hematology', 'Biochemistry', 'Endocrinology', 'Microbiology', 'Immunology'];

  const filteredItems = pricingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = pricingItems.reduce((sum, item) => sum + item.current_price, 0);
  const totalCost = pricingItems.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const averageMarkup = pricingItems.length > 0 
    ? pricingItems.reduce((sum, item) => sum + item.markup_percentage, 0) / pricingItems.length 
    : 0;

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleEdit = (item: PricingItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    setPricingItems(pricingItems.filter(item => item.id !== id));
  };

  const handleSave = (itemData: Partial<PricingItem>) => {
    if (editingItem) {
      setPricingItems(pricingItems.map(item => 
        item.id === editingItem.id ? { ...item, ...itemData } : item
      ));
      setEditingItem(null);
    } else {
      const newItem: PricingItem = {
        id: Date.now().toString(),
        name: itemData.name || '',
        category: itemData.category || '',
        base_price: itemData.base_price || 0,
        current_price: itemData.current_price || 0,
        markup_percentage: itemData.markup_percentage || 0,
        cost: itemData.cost || 0,
        status: 'active',
        last_updated: new Date().toISOString().split('T')[0]
      };
      setPricingItems([...pricingItems, newItem]);
      setIsAdding(false);
    }
  };

  const calculateMarkup = (basePrice: number, cost: number) => {
    return ((basePrice - cost) / cost) * 100;
  };

  const calculatePrice = (cost: number, markup: number) => {
    return cost * (1 + markup / 100);
  };

  return (
    <BaseDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Test & Cultures Pricing</h1>
              <p className="text-gray-600">Manage pricing for tests and culture services</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pricing</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">${totalProfit.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Markup</p>
                <p className="text-2xl font-bold text-gray-900">{averageMarkup.toFixed(1)}%</p>
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
              placeholder="Search pricing items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markup %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.base_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.current_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.markup_percentage.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(isAdding || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingItem ? 'Edit Pricing' : 'Add New Pricing'}
                </h3>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const cost = parseFloat(formData.get('cost') as string);
                const markup = parseFloat(formData.get('markup_percentage') as string);
                const currentPrice = calculatePrice(cost, markup);
                
                handleSave({
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  cost: cost,
                  base_price: parseFloat(formData.get('base_price') as string),
                  current_price: currentPrice,
                  markup_percentage: markup,
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingItem?.category || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      name="cost"
                      step="0.01"
                      defaultValue={editingItem?.cost || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price ($)
                    </label>
                    <input
                      type="number"
                      name="base_price"
                      step="0.01"
                      defaultValue={editingItem?.base_price || ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Markup Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="markup_percentage"
                    step="0.1"
                    defaultValue={editingItem?.markup_percentage || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Calculated Price:</strong> 
                    <span id="calculated-price" className="ml-2 font-medium">
                      ${editingItem?.current_price.toFixed(2) || '0.00'}
                    </span>
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingItem(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'Update' : 'Add'} Pricing</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BaseDashboard>
  );
};

export default TestPricing;
