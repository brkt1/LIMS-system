import {
  AlertCircle,
  Edit2,
  Microscope,
  Plus,
  Save,
  Search,
  TestTube,
  Trash2,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import BaseDashboard from '../dashboards/BaseDashboard';

interface Culture {
  id: string;
  name: string;
  type: string;
  description: string;
  incubation_time: string;
  temperature: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface Antibiotic {
  id: string;
  name: string;
  category: string;
  description: string;
  concentration: string;
  status: 'active' | 'inactive';
  created_at: string;
}

const CulturesAntibiotics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cultures' | 'antibiotics'>('cultures');
  
  const [cultures, setCultures] = useState<Culture[]>([
    {
      id: '1',
      name: 'Blood Agar',
      type: 'Aerobic',
      description: 'General purpose medium for bacterial culture',
      incubation_time: '18-24 hours',
      temperature: '37°C',
      status: 'active',
      created_at: '2025-01-15'
    },
    {
      id: '2',
      name: 'MacConkey Agar',
      type: 'Selective',
      description: 'Selective medium for Gram-negative bacteria',
      incubation_time: '18-24 hours',
      temperature: '37°C',
      status: 'active',
      created_at: '2025-01-14'
    },
    {
      id: '3',
      name: 'Sabouraud Dextrose Agar',
      type: 'Fungal',
      description: 'Medium for fungal culture',
      incubation_time: '48-72 hours',
      temperature: '25°C',
      status: 'active',
      created_at: '2025-01-13'
    }
  ]);

  const [antibiotics, setAntibiotics] = useState<Antibiotic[]>([
    {
      id: '1',
      name: 'Penicillin',
      category: 'Beta-lactam',
      description: 'Broad-spectrum antibiotic',
      concentration: '10 μg',
      status: 'active',
      created_at: '2025-01-15'
    },
    {
      id: '2',
      name: 'Ciprofloxacin',
      category: 'Fluoroquinolone',
      description: 'Broad-spectrum antibiotic',
      concentration: '5 μg',
      status: 'active',
      created_at: '2025-01-14'
    },
    {
      id: '3',
      name: 'Vancomycin',
      category: 'Glycopeptide',
      description: 'Antibiotic for Gram-positive bacteria',
      concentration: '30 μg',
      status: 'active',
      created_at: '2025-01-13'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Culture | Antibiotic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCultures = cultures.filter(culture =>
    culture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    culture.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAntibiotics = antibiotics.filter(antibiotic =>
    antibiotic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    antibiotic.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleEdit = (item: Culture | Antibiotic) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'cultures') {
      setCultures(cultures.filter(culture => culture.id !== id));
    } else {
      setAntibiotics(antibiotics.filter(antibiotic => antibiotic.id !== id));
    }
  };

  const handleSave = (itemData: any) => {
    if (activeTab === 'cultures') {
      if (editingItem) {
        setCultures(cultures.map(culture => 
          culture.id === editingItem.id ? { ...culture, ...itemData } : culture
        ));
      } else {
        const newCulture: Culture = {
          id: Date.now().toString(),
          ...itemData,
          status: 'active',
          created_at: new Date().toISOString().split('T')[0]
        };
        setCultures([...cultures, newCulture]);
      }
    } else {
      if (editingItem) {
        setAntibiotics(antibiotics.map(antibiotic => 
          antibiotic.id === editingItem.id ? { ...antibiotic, ...itemData } : antibiotic
        ));
      } else {
        const newAntibiotic: Antibiotic = {
          id: Date.now().toString(),
          ...itemData,
          status: 'active',
          created_at: new Date().toISOString().split('T')[0]
        };
        setAntibiotics([...antibiotics, newAntibiotic]);
      }
    }
    setIsAdding(false);
    setEditingItem(null);
  };

  return (
    <BaseDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Microscope className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cultures & Antibiotics</h1>
              <p className="text-gray-600">Manage culture media and antibiotic sensitivity testing</p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'cultures' ? 'Culture' : 'Antibiotic'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('cultures')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cultures'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span>Culture Media ({cultures.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('antibiotics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'antibiotics'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>Antibiotics ({antibiotics.length})</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Cultures Table */}
        {activeTab === 'cultures' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Culture Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incubation Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperature
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
                  {filteredCultures.map((culture) => (
                    <tr key={culture.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{culture.name}</div>
                          <div className="text-sm text-gray-500">{culture.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {culture.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {culture.incubation_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {culture.temperature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          culture.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {culture.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(culture)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(culture.id)}
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
        )}

        {/* Antibiotics Table */}
        {activeTab === 'antibiotics' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Antibiotic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concentration
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
                  {filteredAntibiotics.map((antibiotic) => (
                    <tr key={antibiotic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{antibiotic.name}</div>
                          <div className="text-sm text-gray-500">{antibiotic.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {antibiotic.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {antibiotic.concentration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          antibiotic.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {antibiotic.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(antibiotic)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(antibiotic.id)}
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
        )}

        {/* Add/Edit Modal */}
        {(isAdding || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingItem ? `Edit ${activeTab === 'cultures' ? 'Culture' : 'Antibiotic'}` : `Add New ${activeTab === 'cultures' ? 'Culture' : 'Antibiotic'}`}
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
                const itemData = Object.fromEntries(formData.entries());
                handleSave(itemData);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {activeTab === 'cultures' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        defaultValue={(editingItem as Culture)?.type || ''}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Aerobic">Aerobic</option>
                        <option value="Anaerobic">Anaerobic</option>
                        <option value="Selective">Selective</option>
                        <option value="Differential">Differential</option>
                        <option value="Fungal">Fungal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Incubation Time
                      </label>
                      <input
                        type="text"
                        name="incubation_time"
                        defaultValue={(editingItem as Culture)?.incubation_time || ''}
                        placeholder="e.g., 18-24 hours"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature
                      </label>
                      <input
                        type="text"
                        name="temperature"
                        defaultValue={(editingItem as Culture)?.temperature || ''}
                        placeholder="e.g., 37°C"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={(editingItem as Antibiotic)?.category || ''}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        <option value="Beta-lactam">Beta-lactam</option>
                        <option value="Fluoroquinolone">Fluoroquinolone</option>
                        <option value="Glycopeptide">Glycopeptide</option>
                        <option value="Aminoglycoside">Aminoglycoside</option>
                        <option value="Macrolide">Macrolide</option>
                        <option value="Tetracycline">Tetracycline</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Concentration
                      </label>
                      <input
                        type="text"
                        name="concentration"
                        defaultValue={(editingItem as Antibiotic)?.concentration || ''}
                        placeholder="e.g., 10 μg"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItem ? 'Update' : 'Add'}</span>
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

export default CulturesAntibiotics;
