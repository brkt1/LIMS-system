/**
 * Validation utilities for form handling and error management
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  field?: string;
  code?: string;
}

/**
 * Extract detailed error message from API response
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    
    // Handle field-specific errors
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
      return data.non_field_errors.join(", ");
    }
    
    // Handle individual field errors
    const fieldErrors: string[] = [];
    Object.keys(data).forEach(field => {
      if (Array.isArray(data[field])) {
        fieldErrors.push(`${field}: ${data[field].join(", ")}`);
      } else if (typeof data[field] === 'string') {
        fieldErrors.push(`${field}: ${data[field]}`);
      }
    });
    
    if (fieldErrors.length > 0) {
      return fieldErrors.join("; ");
    }
    
    // Handle generic error messages
    if (data.error) {
      return data.error;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.detail) {
      return data.detail;
    }
  }
  
  return error.message || "An unexpected error occurred";
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  requiredFields.forEach(field => {
    const value = data[field];
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push({
        field,
        message: `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`
      });
    }
  });
  
  return errors;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate domain format (alphanumeric and hyphens only)
 */
export const validateDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9-]+$/;
  return domainRegex.test(domain);
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value: any, fieldName: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const num = parseFloat(value);
  
  if (isNaN(num) || num <= 0) {
    errors.push({
      field: fieldName,
      message: `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be a positive number`
    });
  }
  
  return errors;
};

/**
 * Validate integer
 */
export const validateInteger = (value: any, fieldName: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const num = parseInt(value);
  
  if (isNaN(num) || !Number.isInteger(parseFloat(value))) {
    errors.push({
      field: fieldName,
      message: `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} must be a valid integer`
    });
  }
  
  return errors;
};

/**
 * Sanitize string input (trim and convert to lowercase if needed)
 */
export const sanitizeString = (value: string, toLowerCase: boolean = false): string => {
  const trimmed = value.trim();
  return toLowerCase ? trimmed.toLowerCase() : trimmed;
};

/**
 * Sanitize form data
 */
export const sanitizeFormData = (data: Record<string, any>, stringFields: string[] = [], lowercaseFields: string[] = []): Record<string, any> => {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      if (stringFields.includes(key) || lowercaseFields.includes(key)) {
        sanitized[key] = sanitizeString(sanitized[key], lowercaseFields.includes(key));
      }
    }
  });
  
  return sanitized;
};

/**
 * Show validation errors to user
 */
export const showValidationErrors = (errors: ValidationError[]): void => {
  if (errors.length > 0) {
    const errorMessages = errors.map(error => error.message).join('\n');
    alert(`Validation Errors:\n${errorMessages}`);
  }
};

/**
 * Handle API errors with detailed error messages
 */
export const handleApiError = (error: any, defaultMessage: string = "An error occurred"): void => {
  const errorMessage = extractErrorMessage(error);
  console.error("API Error:", error);
  alert(`Error: ${errorMessage}`);
};

/**
 * Plan type mapping utility
 */
export const getPlanType = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('basic')) return 'basic';
  if (lowerName.includes('professional') || lowerName.includes('pro')) return 'professional';
  if (lowerName.includes('enterprise')) return 'enterprise';
  return 'custom';
};

/**
 * Status validation for tenant status
 */
export const validateTenantStatus = (status: string): boolean => {
  const validStatuses = ['active', 'suspended', 'pending', 'inactive'];
  return validStatuses.includes(status.toLowerCase());
};

/**
 * Billing cycle validation
 */
export const validateBillingCycle = (cycle: string): boolean => {
  const validCycles = ['monthly', 'yearly'];
  return validCycles.includes(cycle.toLowerCase());
};
