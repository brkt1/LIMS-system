// Environment configuration for LIMS system

export interface EnvironmentConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  
  // Default Values
  defaultTenantId: string;
  defaultUserId: string;
  defaultUserEmail: string;
  defaultDomain: string;
  
  // Security
  clientIP: string;
  passwordMinLength: number;
  passwordMaxLength: number;
  
  // Application Settings
  appName: string;
  appVersion: string;
  appDescription: string;
  
  // Feature Flags
  enableDarkMode: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  
  // Development Settings
  debug: boolean;
  logLevel: string;
}

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || window.location.origin,
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    
    // Default Values
    defaultTenantId: import.meta.env.VITE_DEFAULT_TENANT_ID || '2',
    defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || '1',
    defaultUserEmail: import.meta.env.VITE_DEFAULT_USER_EMAIL || 'admin@lims.com',
    defaultDomain: import.meta.env.VITE_DEFAULT_DOMAIN || 'lims.com',
    
    // Security
    clientIP: import.meta.env.VITE_CLIENT_IP || 'unknown',
    passwordMinLength: parseInt(import.meta.env.VITE_PASSWORD_MIN_LENGTH || '8'),
    passwordMaxLength: parseInt(import.meta.env.VITE_PASSWORD_MAX_LENGTH || '128'),
    
    // Application Settings
    appName: import.meta.env.VITE_APP_NAME || 'LIMS System',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Laboratory Information Management System',
    
    // Feature Flags
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    
    // Development Settings
    debug: import.meta.env.VITE_DEBUG === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  };
};

// Export the configuration
export const config = getEnvironmentConfig();

// Environment-specific configurations
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const isTest = import.meta.env.MODE === 'test';
