// Utility functions for the LIMS system
import { config } from '../config/environment';

// Helper function to get current tenant ID
export const getCurrentTenantId = (): string => {
  console.log('🔍 Getting current tenant ID...');
  
  // Try to get from stored tenant data first (from authentication)
  const tenantData = localStorage.getItem('tenant_data');
  console.log('📦 Raw tenant_data from localStorage:', tenantData);
  
  if (tenantData) {
    try {
      const tenant = JSON.parse(tenantData);
      console.log('🏢 Parsed tenant data:', tenant);
      if (tenant && tenant.id) {
        console.log('✅ Using tenant ID from tenant_data:', tenant.id);
        return tenant.id.toString();
      }
    } catch (error) {
      console.warn('❌ Failed to parse tenant data:', error);
    }
  }
  
  // Try to get from stored tenant ID
  const storedTenantId = localStorage.getItem('current_tenant_id');
  console.log('📦 current_tenant_id from localStorage:', storedTenantId);
  if (storedTenantId) {
    console.log('✅ Using stored tenant ID:', storedTenantId);
    return storedTenantId;
  }
  
  // Try to get from user context
  const userContext = localStorage.getItem('user_context');
  console.log('📦 user_context from localStorage:', userContext);
  if (userContext) {
    try {
      const context = JSON.parse(userContext);
      console.log('👤 Parsed user context:', context);
      const tenantId = context.tenant_id || config.defaultTenantId;
      console.log('✅ Using tenant ID from user context:', tenantId);
      return tenantId;
    } catch (error) {
      console.warn('❌ Failed to parse user context:', error);
    }
  }
  
  // Fallback to environment configuration
  console.log('⚠️ Using default tenant ID from config:', config.defaultTenantId);
  return config.defaultTenantId;
};

// Helper function to get or create a default tenant
export const getOrCreateDefaultTenant = async (): Promise<string> => {
  try {
    // First try to get existing tenants
    const response = await fetch('/api/superadmin/tenants/');
    if (response.ok) {
      const tenants = await response.json();
      if (tenants && tenants.length > 0) {
        console.log('🏢 Found existing tenants:', tenants);
        // Use the first active tenant, or just the first one if none are active
        const activeTenant = tenants.find((t: any) => t.status === 'active') || tenants[0];
        console.log('✅ Using tenant:', activeTenant);
        return activeTenant.id.toString();
      }
    }
    
    // If no tenants exist, create a default one
    console.log('🏢 No tenants found, creating default tenant...');
    const defaultTenant = {
      company_name: 'Default Lab',
      domain: 'defaultlab',
      email: 'default@lims.com',
      password: 'default123',
      created_by: 'system',
      billing_period: 'monthly'
    };
    
    const createResponse = await fetch('/api/superadmin/tenants/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultTenant)
    });
    
    if (createResponse.ok) {
      const newTenant = await createResponse.json();
      console.log('✅ Created default tenant:', newTenant);
      return newTenant.id.toString();
    }
  } catch (error) {
    console.error('❌ Error getting or creating tenant:', error);
  }
  
  // Final fallback - use a known existing tenant ID
  console.log('⚠️ Using fallback tenant ID: 2 (City Hospital Lab)');
  return '2';
};

// Helper function to get current user ID
export const getCurrentUserId = (): string => {
  // Try to get from stored user data first (from authentication)
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user && user.id) {
        return user.id.toString();
      }
    } catch (error) {
      console.warn('Failed to parse user data:', error);
    }
  }
  
  // Try to get from localStorage
  const storedUserId = localStorage.getItem('current_user_id');
  if (storedUserId) {
    return storedUserId;
  }
  
  // Try to get from user context
  const userContext = localStorage.getItem('user_context');
  if (userContext) {
    try {
      const context = JSON.parse(userContext);
      return context.user_id || config.defaultUserId;
    } catch (error) {
      console.warn('Failed to parse user context:', error);
    }
  }
  
  // Fallback to environment configuration
  return config.defaultUserId;
};

// Helper function to get current user email
export const getCurrentUserEmail = (): string => {
  // Try to get from stored user data first (from authentication)
  const userData = localStorage.getItem('user_data');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user && user.email) {
        return user.email;
      }
    } catch (error) {
      console.warn('Failed to parse user data:', error);
    }
  }
  
  // Try to get from user context
  const userContext = localStorage.getItem('user_context');
  if (userContext) {
    try {
      const context = JSON.parse(userContext);
      return context.email || config.defaultUserEmail;
    } catch (error) {
      console.warn('Failed to parse user context:', error);
    }
  }
  
  return config.defaultUserEmail;
};

// Helper function to generate secure password
export const generateSecurePassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Helper function to get client IP (for logging)
export const getClientIP = (): string => {
  // In a real application, this would be provided by the backend
  // For now, we'll use a placeholder that can be overridden
  return config.clientIP;
};

// Helper function to get base URL
export const getBaseURL = (): string => {
  return config.apiBaseUrl;
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to format datetime
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
