// Utility functions for the LIMS system
import { config } from '../config/environment';

// Helper function to get current tenant ID
export const getCurrentTenantId = (): string => {
  // Try to get from localStorage first
  const storedTenantId = localStorage.getItem('current_tenant_id');
  if (storedTenantId) {
    return storedTenantId;
  }
  
  // Try to get from user context
  const userContext = localStorage.getItem('user_context');
  if (userContext) {
    try {
      const context = JSON.parse(userContext);
      return context.tenant_id || config.defaultTenantId;
    } catch (error) {
      console.warn('Failed to parse user context:', error);
    }
  }
  
  // Fallback to environment configuration
  return config.defaultTenantId;
};

// Helper function to get current user ID
export const getCurrentUserId = (): string => {
  // Try to get from localStorage first
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
