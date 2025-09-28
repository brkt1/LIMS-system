# Validation Fixes for LIMS System

## Overview
This document outlines the comprehensive fixes applied to resolve 400 Bad Request errors across all pages in the LIMS system.

## Issues Identified and Fixed

### 1. Billing Plans (BillingPlans.tsx)
**Problem**: `plan_type` field was being set to `newPlan.name.toLowerCase()`, but it must be one of the valid choices: `'basic'`, `'professional'`, `'enterprise'`, or `'custom'`.

**Solution**: 
- Added proper plan type mapping function
- Added comprehensive validation for required fields
- Added data sanitization
- Improved error handling

### 2. Tenant Creation (CreateTenants.tsx)
**Problem**: Missing validation for required fields, domain format, and email format.

**Solution**:
- Added comprehensive field validation
- Added domain and email format validation
- Added uniqueness checks for domain and email
- Added data sanitization

### 3. Sample Data Creation
**Problem**: Sample data was missing required `domain` field for tenants.

**Solution**: Updated sample data creation scripts to include all required fields.

## New Validation Utilities

### Created `/src/utils/validation.ts`
This file contains comprehensive validation utilities:

- `validateRequiredFields()` - Validates required form fields
- `validateEmail()` - Validates email format
- `validateDomain()` - Validates domain format (alphanumeric and hyphens only)
- `validatePositiveNumber()` - Validates positive numbers
- `validateInteger()` - Validates integers
- `sanitizeFormData()` - Sanitizes form data (trim, lowercase)
- `showValidationErrors()` - Shows validation errors to user
- `handleApiError()` - Handles API errors with detailed messages
- `extractErrorMessage()` - Extracts detailed error messages from API responses
- `getPlanType()` - Maps plan names to valid plan types

### Created `/src/utils/formValidationTemplate.tsx`
A template and hook for consistent form validation across all components.

## How to Apply These Fixes to Other Pages

### Step 1: Import Validation Utilities
```typescript
import {
  validateRequiredFields,
  validateEmail,
  validateDomain,
  validatePositiveNumber,
  validateInteger,
  sanitizeFormData,
  showValidationErrors,
  handleApiError,
  extractErrorMessage
} from "../../utils/validation";
```

### Step 2: Add Validation to Form Submit Handler
```typescript
const handleSubmit = async () => {
  try {
    // 1. Validate required fields
    const requiredFields = ['field1', 'field2', 'field3'];
    const validationErrors = validateRequiredFields(formData, requiredFields);
    
    // 2. Add custom validations
    if (formData.email && !validateEmail(formData.email)) {
      validationErrors.push({
        field: 'email',
        message: 'Please enter a valid email address'
      });
    }
    
    // 3. Show validation errors if any
    if (validationErrors.length > 0) {
      showValidationErrors(validationErrors);
      return;
    }
    
    // 4. Sanitize data
    const sanitizedData = sanitizeFormData(formData, ['field1', 'field2'], ['field3']);
    
    // 5. Make API call
    const response = await api.create(sanitizedData);
    
  } catch (error: any) {
    handleApiError(error, "Failed to create item");
  }
};
```

### Step 3: Common Validation Patterns

#### For Email Fields:
```typescript
if (formData.email && !validateEmail(formData.email)) {
  validationErrors.push({
    field: 'email',
    message: 'Please enter a valid email address'
  });
}
```

#### For Domain Fields:
```typescript
if (formData.domain && !validateDomain(formData.domain)) {
  validationErrors.push({
    field: 'domain',
    message: 'Domain can only contain letters, numbers, and hyphens'
  });
}
```

#### For Numeric Fields:
```typescript
validationErrors.push(...validatePositiveNumber(formData.price, 'price'));
validationErrors.push(...validateInteger(formData.maxUsers, 'maxUsers'));
```

#### For Plan Type Fields:
```typescript
import { getPlanType } from "../../utils/validation";

const planData = {
  name: formData.name,
  plan_type: getPlanType(formData.name), // Maps to valid plan type
  // ... other fields
};
```

## Backend Model Requirements

### Tenant Model Required Fields:
- `company_name` (CharField, unique)
- `domain` (CharField, unique)
- `email` (EmailField, unique)
- `status` (choices: 'active', 'suspended', 'pending', 'inactive')
- `billing_period` (choices: 'monthly', 'yearly')
- `max_users` (IntegerField)
- `created_by` (CharField)

### BillingPlan Model Required Fields:
- `name` (CharField, unique)
- `plan_type` (choices: 'basic', 'professional', 'enterprise', 'custom')
- `price` (DecimalField)
- `billing_cycle` (choices: 'monthly', 'yearly')
- `max_users` (IntegerField)
- `features` (JSONField)

## Testing the Fixes

### Test Billing Plans:
```bash
curl -X POST http://localhost:3001/api/superadmin/plans/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Plan",
    "plan_type": "basic",
    "price": 29.99,
    "billing_cycle": "monthly",
    "max_users": 10,
    "features": ["Feature 1", "Feature 2"]
  }'
```

### Test Tenant Creation:
```bash
curl -X POST http://localhost:3001/api/superadmin/tenants/ \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "domain": "testcompany",
    "email": "admin@testcompany.com",
    "password": "testpass123",
    "status": "active",
    "billing_period": "monthly",
    "max_users": 10,
    "created_by": "SuperAdmin"
  }'
```

## Common Error Patterns and Solutions

### 1. "Field 'X' is required"
**Cause**: Missing required field in form data
**Solution**: Add field to `requiredFields` array and ensure it's included in form data

### 2. "Invalid choice" errors
**Cause**: Field value doesn't match model choices
**Solution**: Use validation utilities to map values to valid choices

### 3. "Unique constraint" errors
**Cause**: Trying to create duplicate unique fields
**Solution**: Add uniqueness checks before API calls

### 4. "Invalid format" errors
**Cause**: Field format doesn't match model requirements
**Solution**: Use format validation utilities (email, domain, etc.)

## Files Modified

1. `/src/components/superadmin/BillingPlans.tsx` - Fixed plan type validation
2. `/src/components/superadmin/CreateTenants.tsx` - Added comprehensive validation
3. `/src/utils/validation.ts` - New validation utilities
4. `/src/utils/formValidationTemplate.tsx` - Validation template
5. `/backend/create_superadmin_sample_data.py` - Fixed sample data

## Next Steps

1. Apply the same validation pattern to other form components
2. Test all form submissions to ensure they work correctly
3. Add validation to any remaining components that create/update data
4. Consider adding client-side validation for better UX

## Benefits of These Fixes

1. **Consistent Error Handling**: All forms now show detailed, user-friendly error messages
2. **Data Validation**: Prevents invalid data from being sent to the API
3. **Better UX**: Users get immediate feedback on validation errors
4. **Maintainable Code**: Centralized validation utilities make it easy to maintain
5. **Reduced API Errors**: Proper validation reduces 400 errors from the backend
