import { Building2, Check, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import BaseDashboard from '../dashboards/BaseDashboard';

const CreateTenants: React.FC = () => {
  const [formData, setFormData] = useState({
    tenantName: '',
    domain: '',
    adminEmail: '',
    adminName: '',
    plan: 'Basic',
    maxUsers: 10,
    features: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const availableFeatures = [
    'Analytics Dashboard',
    'Advanced Reporting',
    'API Access',
    'Custom Branding',
    'Priority Support',
    'Data Export',
    'Multi-location Support',
    'Integration Tools'
  ];

  const plans = [
    { id: 'Basic', name: 'Basic', price: '$29/month', maxUsers: 10, features: ['Basic Dashboard', 'Standard Support'] },
    { id: 'Professional', name: 'Professional', price: '$79/month', maxUsers: 50, features: ['Advanced Analytics', 'Priority Support', 'API Access'] },
    { id: 'Enterprise', name: 'Enterprise', price: '$199/month', maxUsers: 200, features: ['All Features', 'Custom Branding', 'Dedicated Support'] }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        tenantName: '',
        domain: '',
        adminEmail: '',
        adminName: '',
        plan: 'Basic',
        maxUsers: 10,
        features: []
      });
      setShowSuccess(false);
    }, 3000);
  };

  const selectedPlan = plans.find(plan => plan.id === formData.plan);

  return (
    <BaseDashboard>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Tenant</h2>
            <p className="text-gray-600">Set up a new tenant organization with admin access</p>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Tenant Created Successfully!</p>
              <p className="text-green-600 text-sm">The new tenant has been set up and admin credentials have been sent.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenant Name *
                    </label>
                    <input
                      type="text"
                      name="tenantName"
                      value={formData.tenantName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., MedLab Solutions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="medlab"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-500">
                        .lims.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Information */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Name *
                    </label>
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email *
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin@medlab.com"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Selection */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.plan === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{plan.name}</h4>
                        {formData.plan === plan.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{plan.price}</p>
                      <p className="text-sm text-gray-600 mb-3">Up to {plan.maxUsers} users</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Features */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Tenant</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Tenant Name</p>
                  <p className="font-medium text-gray-900">{formData.tenantName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Domain</p>
                  <p className="font-medium text-gray-900">
                    {formData.domain ? `${formData.domain}.lims.com` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin</p>
                  <p className="font-medium text-gray-900">{formData.adminName || 'Not specified'}</p>
                  <p className="text-sm text-gray-500">{formData.adminEmail || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan</p>
                  <p className="font-medium text-gray-900">{selectedPlan?.name}</p>
                  <p className="text-sm text-gray-500">{selectedPlan?.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Additional Features</p>
                  <p className="text-sm text-gray-900">{formData.features.length} selected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default CreateTenants;
