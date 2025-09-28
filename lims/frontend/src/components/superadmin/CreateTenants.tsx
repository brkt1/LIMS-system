import { Check, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { superadminAPI } from "../../services/api";
import { generateSecurePassword } from "../../utils/helpers";
import {
  handleApiError,
  sanitizeFormData,
  showValidationErrors,
  validateDomain,
  validateEmail,
  validateInteger,
  validateRequiredFields
} from "../../utils/validation";

const CreateTenants: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    tenantName: "",
    domain: "",
    adminEmail: "",
    adminName: "",
    plan: "Basic",
    maxUsers: 10,
    features: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [availableFeatures] = useState([
    "createTenants.analyticsDashboard",
    "createTenants.advancedReporting",
    "createTenants.apiAccess",
    "createTenants.customBranding",
    "createTenants.prioritySupport",
    "createTenants.dataExport",
    "createTenants.multiLocationSupport",
    "createTenants.integrationTools",
  ]);

  const [plans, setPlans] = useState<any[]>([]);

  // Load plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await superadminAPI.plans.getAll();
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to load plans:", error);
        // Fallback to default plans
        setPlans([
          {
            id: "Basic",
            name: "Basic",
            price: process.env.REACT_APP_BASIC_PLAN_PRICE || "$29/month",
            maxUsers: parseInt(process.env.REACT_APP_BASIC_PLAN_MAX_USERS || "10"),
            features: (process.env.REACT_APP_BASIC_PLAN_FEATURES || "Basic Dashboard,Standard Support").split(","),
          },
          {
            id: "Professional",
            name: "Professional",
            price: process.env.REACT_APP_PRO_PLAN_PRICE || "$79/month",
            maxUsers: parseInt(process.env.REACT_APP_PRO_PLAN_MAX_USERS || "50"),
            features: (process.env.REACT_APP_PRO_PLAN_FEATURES || "Advanced Analytics,Priority Support,API Access").split(","),
          },
          {
            id: "Enterprise",
            name: "Enterprise",
            price: process.env.REACT_APP_ENTERPRISE_PLAN_PRICE || "$199/month",
            maxUsers: parseInt(process.env.REACT_APP_ENTERPRISE_PLAN_MAX_USERS || "200"),
            features: (process.env.REACT_APP_ENTERPRISE_PLAN_FEATURES || "All Features,Custom Branding,Dedicated Support").split(","),
          },
        ]);
      }
    };

    fetchPlans();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const checkExistingTenant = async (domain: string, email: string) => {
    try {
      const response = await superadminAPI.tenants.getAll({ 
        search: domain,
        limit: 1 
      });
      
      // Check if domain or email already exists
      const existingTenants = response.data.results || response.data;
      const domainExists = existingTenants.some((tenant: any) => 
        tenant.domain === domain.toLowerCase()
      );
      const emailExists = existingTenants.some((tenant: any) => 
        tenant.email === email.toLowerCase()
      );
      
      return { domainExists, emailExists };
    } catch (error) {
      console.error('Error checking existing tenants:', error);
      return { domainExists: false, emailExists: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = ['tenantName', 'domain', 'adminEmail'];
      const validationErrors = validateRequiredFields(formData, requiredFields);
      
      // Validate domain format
      if (formData.domain.trim() && !validateDomain(formData.domain.trim())) {
        validationErrors.push({
          field: 'domain',
          message: t('createTenants.domainValidationError')
        });
      }
      
      // Validate email format
      if (formData.adminEmail.trim() && !validateEmail(formData.adminEmail.trim())) {
        validationErrors.push({
          field: 'adminEmail',
          message: t('createTenants.emailValidationError')
        });
      }
      
      // Validate max users
      validationErrors.push(...validateInteger(formData.maxUsers, 'maxUsers'));
      
      if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Check if domain or email already exists
      const { domainExists, emailExists } = await checkExistingTenant(
        formData.domain.trim().toLowerCase(),
        formData.adminEmail.trim().toLowerCase()
      );

      if (domainExists) {
        alert(t('createTenants.domainExistsError'));
        setIsSubmitting(false);
        return;
      }

      if (emailExists) {
        alert(t('createTenants.emailExistsError'));
        setIsSubmitting(false);
        return;
      }

      // Sanitize and prepare data
      const sanitizedData = sanitizeFormData(formData, ['tenantName', 'domain', 'adminEmail'], ['domain', 'adminEmail']);

      // Create tenant using the backend API
      const tenantData = {
        company_name: sanitizedData.tenantName,
        domain: sanitizedData.domain,
        email: sanitizedData.adminEmail,
        password: generateSecurePassword(), // Generate secure password
        status: 'active',
        billing_period: 'monthly',
        max_users: parseInt(sanitizedData.maxUsers.toString()),
        created_by: 'SuperAdmin', // This should come from the logged-in user
      };

      console.log('Creating tenant with data:', tenantData);
      await superadminAPI.tenants.create(tenantData);
      
      setIsSubmitting(false);
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          tenantName: "",
          domain: "",
          adminEmail: "",
          adminName: "",
          plan: "Basic",
          maxUsers: 10,
          features: [],
        });
        setShowSuccess(false);
      }, 3000);
    } catch (error: any) {
      handleApiError(error, "Failed to create tenant");
      setIsSubmitting(false);
    }
  };

  const selectedPlan = plans.find((plan) => plan.id === formData.plan);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {t('createTenants.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {t('createTenants.description')}
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start space-x-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-green-800 dark:text-green-200 font-medium text-sm sm:text-base">
              {t('createTenants.tenantCreatedSuccessfully')}
            </p>
            <p className="text-green-600 dark:text-green-300 text-xs sm:text-sm">
              {t('createTenants.tenantCreatedMessage')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Form */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('createTenants.basicInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('createTenants.tenantName')} *
                  </label>
                  <input
                    type="text"
                    name="tenantName"
                    value={formData.tenantName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('createTenants.tenantNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('createTenants.domain')} *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      required
                      className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder={t('createTenants.domainPlaceholder')}
                    />
                    <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                      .lims.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Information */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('createTenants.adminInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('createTenants.adminName')} *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('createTenants.adminNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('createTenants.adminEmail')} *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t('createTenants.adminEmailPlaceholder')}
                  />
                </div>
              </div>
            </div>

            {/* Plan Selection */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('createTenants.planSelection')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.plan === plan.id
                        ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, plan: plan.id }))
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {plan.name}
                      </h4>
                      {formData.plan === plan.id && (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.price}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {t('createTenants.upToUsers').replace('{count}', plan.maxUsers.toString())}
                    </p>
                    <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('createTenants.additionalFeatures')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {availableFeatures.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400 flex-shrink-0 bg-white dark:bg-gray-700"
                    />
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                      {t(feature)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                {t('createTenants.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('createTenants.creating')}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{t('createTenants.createTenant')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('createTenants.summary')}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('createTenants.tenantName')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {formData.tenantName || t('createTenants.notSpecified')}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('createTenants.domain')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {formData.domain
                    ? `${formData.domain}.lims.com`
                    : t('createTenants.notSpecified')}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('createTenants.admin')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {formData.adminName || t('createTenants.notSpecified')}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {formData.adminEmail || t('createTenants.notSpecified')}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('createTenants.plan')}
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                  {selectedPlan?.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {selectedPlan?.price}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('createTenants.additionalFeatures')}
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {t('createTenants.additionalFeaturesSelected').replace('{count}', formData.features.length.toString())}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTenants;
