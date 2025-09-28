/**
 * Template for form validation across all pages
 * Use this as a reference for implementing consistent validation
 */

import {
    handleApiError,
    sanitizeFormData,
    showValidationErrors,
    validateRequiredFields
} from './validation';

// Example implementation for any form component
export const useFormValidation = () => {
  const validateAndSubmit = async (
    formData: any,
    requiredFields: string[],
    apiCall: (data: any) => Promise<any>,
    options: {
      stringFields?: string[];
      lowercaseFields?: string[];
      customValidations?: Array<() => ValidationError[]>;
    } = {}
  ) => {
    try {
      // 1. Validate required fields
      const validationErrors = validateRequiredFields(formData, requiredFields);
      
      // 2. Add custom validations
      if (options.customValidations) {
        options.customValidations.forEach(validation => {
          validationErrors.push(...validation());
        });
      }
      
      // 3. Show validation errors if any
      if (validationErrors.length > 0) {
        showValidationErrors(validationErrors);
        return false;
      }
      
      // 4. Sanitize data
      const sanitizedData = sanitizeFormData(
        formData, 
        options.stringFields || [], 
        options.lowercaseFields || []
      );
      
      // 5. Make API call
      const response = await apiCall(sanitizedData);
      return response;
      
    } catch (error: any) {
      handleApiError(error, "Operation failed");
      return false;
    }
  };
  
  return { validateAndSubmit };
};

// Example usage in a component:
/*
const MyComponent = () => {
  const { validateAndSubmit } = useFormValidation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    domain: '',
    price: 0
  });
  
  const handleSubmit = async () => {
    const result = await validateAndSubmit(
      formData,
      ['name', 'email', 'domain'], // required fields
      (data) => api.create(data), // API call
      {
        stringFields: ['name', 'email', 'domain'],
        lowercaseFields: ['email', 'domain'],
        customValidations: [
          () => validateEmail(formData.email) ? [] : [{ field: 'email', message: 'Invalid email' }],
          () => validateDomain(formData.domain) ? [] : [{ field: 'domain', message: 'Invalid domain' }],
          () => validatePositiveNumber(formData.price, 'price')
        ]
      }
    );
    
    if (result) {
      // Success handling
      console.log('Success:', result);
    }
  };
  
  return (
    // Your form JSX here
  );
};
*/
