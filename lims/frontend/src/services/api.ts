import axios from 'axios';
import { getCurrentTenantId } from '../utils/helpers';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Use proxy instead of direct URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // For development/testing, try to set a test token
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.warn('No auth token found, API calls may fail with 401 errors');
        // You can uncomment the line below to automatically set a test token
        // localStorage.setItem('access_token', 'test-token-123');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login or handle refresh error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION API
// ============================================================================
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};

// ============================================================================
// TENANT ADMIN APIs
// ============================================================================

// User Management API
export const userManagementAPI = {
  getAll: (tenantId?: string) => api.get(`/tenant/users/?tenant=${tenantId || getCurrentTenantId()}`),
  getById: (id: string) => api.get(`/tenant/users/${id}/`),
  create: (data: any) => api.post('/tenant/users/', data),
  update: (id: string, data: any) => api.put(`/tenant/users/${id}/`, data),
  delete: (id: string) => api.delete(`/tenant/users/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/tenant/users/?tenant=${tenantId}`),
};

// Doctor Management API
export const doctorAPI = {
  // Basic CRUD operations
  getAll: (tenantId?: string) => api.get(`/doctors/?tenant=${tenantId || getCurrentTenantId()}`),
  getById: (id: string) => api.get(`/doctors/${id}/`),
  create: (data: any) => api.post('/doctors/', data),
  update: (id: string, data: any) => api.put(`/doctors/${id}/`, data),
  delete: (id: string) => api.delete(`/doctors/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/doctors/?tenant=${tenantId}`),
  getBySpecialty: (specialty: string) => api.get(`/doctors/?specialty=${specialty}`),
  getByStatus: (status: string) => api.get(`/doctors/?status=${status}`),
  
  // Specialties
  getSpecialties: () => api.get('/doctors/specialties/'),
  getSpecialtyStats: () => api.get('/doctors/specialties/stats/'),
  
  // Clinical workflow - Test Requests
  testRequests: {
    getAll: (params?: any) => api.get('/test-requests/', { params }),
    getById: (id: string) => api.get(`/test-requests/${id}/`),
    create: (data: any) => api.post('/test-requests/', data),
    update: (id: string, data: any) => api.put(`/test-requests/${id}/`, data),
    delete: (id: string) => api.delete(`/test-requests/${id}/`),
    getByDoctor: (doctorId: string) => api.get(`/test-requests/?doctor=${doctorId}`),
    assignTechnician: (id: string, technicianId: string) => api.post(`/test-requests/${id}/assign_technician/`, { technician_id: technicianId }),
    complete: (id: string) => api.post(`/test-requests/${id}/complete/`),
  },
  
  // Clinical workflow - Patient Records
  patientRecords: {
    getAll: (params?: any) => api.get('/patient-records/', { params }),
    getById: (id: string) => api.get(`/patient-records/${id}/`),
    create: (data: any) => api.post('/patient-records/', data),
    update: (id: string, data: any) => api.put(`/patient-records/${id}/`, data),
    delete: (id: string) => api.delete(`/patient-records/${id}/`),
    getByDoctor: (doctorId: string) => api.get(`/patient-records/?doctor=${doctorId}`),
    getByPatient: (patientId: string) => api.get(`/patient-records/?patient_id=${patientId}`),
  },
  
  // Clinical workflow - Test Results
  testResults: {
    getAll: (params?: any) => api.get('/test-results/', { params }),
    getById: (id: string) => api.get(`/test-results/${id}/`),
    getByDoctor: (doctorId: string) => api.get(`/test-results/?doctor=${doctorId}`),
    review: (id: string, action: 'approve' | 'reject', notes?: string) => 
      api.post(`/test-results/${id}/review/`, { action, doctor_notes: notes }),
  },
  
  // Clinical workflow - Appointments
  appointments: {
    getAll: (params?: any) => api.get('/appointments/', { params }),
    getById: (id: string) => api.get(`/appointments/${id}/`),
    create: (data: any) => api.post('/appointments/', data),
    update: (id: string, data: any) => api.put(`/appointments/${id}/`, data),
    delete: (id: string) => api.delete(`/appointments/${id}/`),
    getByDoctor: (doctorId: string) => api.get(`/appointments/?doctor=${doctorId}`),
    getByPatient: (patientId: string) => api.get(`/appointments/?patient_id=${patientId}`),
    confirm: (id: string) => api.post(`/appointments/${id}/confirm/`),
    complete: (id: string) => api.post(`/appointments/${id}/complete/`),
  },
};

// Equipment Management API (Tenant Admin)
export const equipmentAPI = {
  getAll: (tenantId?: string) => api.get(`/equipment/?tenant=${tenantId || getCurrentTenantId()}`),
  getById: (id: string) => api.get(`/equipment/${id}/`),
  create: (data: any) => api.post('/equipment/', data),
  update: (id: string, data: any) => api.put(`/equipment/${id}/`, data),
  delete: (id: string) => api.delete(`/equipment/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/equipment/?tenant=${tenantId}`),
  getByType: (type: string) => api.get(`/equipment/?type=${type}`),
  getByStatus: (status: string) => api.get(`/equipment/?status=${status}`),
};

// Branch Management API (Tenant Admin)
export const branchAPI = {
  getAll: (tenantId?: string) => api.get(`/api/branches/?tenant=${tenantId || getCurrentTenantId()}`),
  getById: (id: string) => api.get(`/api/branches/${id}/`),
  create: (data: any) => api.post('/api/branches/', data),
  update: (id: string, data: any) => api.put(`/api/branches/${id}/`, data),
  delete: (id: string) => api.delete(`/api/branches/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/api/branches/?tenant=${tenantId}`),
  getByStatus: (status: string) => api.get(`/api/branches/?status=${status}`),
  getByCity: (city: string) => api.get(`/api/branches/?city=${city}`),
};

export const testPricingAPI = {
  getAll: (tenantId?: string) => api.get(`/test-pricing/?tenant=${tenantId || getCurrentTenantId()}`),
  getById: (id: string) => api.get(`/test-pricing/${id}/`),
  create: (data: any) => api.post('/test-pricing/', data),
  update: (id: string, data: any) => api.put(`/test-pricing/${id}/`, data),
  delete: (id: string) => api.delete(`/test-pricing/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/test-pricing/?tenant=${tenantId}`),
  getByCategory: (category: string) => api.get(`/test-pricing/?category=${category}`),
  getByPricingType: (pricingType: string) => api.get(`/test-pricing/?pricing_type=${pricingType}`),
  getActive: () => api.get('/test-pricing/?is_active=true'),
  
  // Test Categories
  getCategories: () => api.get('/test-categories/'),
  getCategoryStats: (tenantId?: string) => api.get(`/test-categories/stats/?tenant=${tenantId || getCurrentTenantId()}`),
};

export const culturesAntibioticsAPI = {
  // Cultures
  getAllCultures: (tenantId?: string) => api.get(`/cultures/?tenant=${tenantId || getCurrentTenantId()}`),
  getCultureById: (id: string) => api.get(`/cultures/${id}/`),
  createCulture: (data: any) => api.post('/cultures/', data),
  updateCulture: (id: string, data: any) => api.put(`/cultures/${id}/`, data),
  deleteCulture: (id: string) => api.delete(`/cultures/${id}/`),
  getCulturesByTenant: (tenantId: string) => api.get(`/cultures/?tenant=${tenantId}`),
  getCulturesByStatus: (status: string) => api.get(`/cultures/?status=${status}`),
  getCulturesBySpecimenType: (specimenType: string) => api.get(`/cultures/?specimen_type=${specimenType}`),
  
  // Antibiotic Sensitivities
  getAllAntibioticSensitivities: (tenantId?: string) => api.get(`/antibiotic-sensitivities/?tenant=${tenantId || getCurrentTenantId()}`),
  getAntibioticSensitivityById: (id: string) => api.get(`/antibiotic-sensitivities/${id}/`),
  createAntibioticSensitivity: (data: any) => api.post('/antibiotic-sensitivities/', data),
  updateAntibioticSensitivity: (id: string, data: any) => api.put(`/antibiotic-sensitivities/${id}/`, data),
  deleteAntibioticSensitivity: (id: string) => api.delete(`/antibiotic-sensitivities/${id}/`),
  getAntibioticSensitivitiesByCulture: (cultureId: string) => api.get(`/antibiotic-sensitivities/?culture=${cultureId}`),
  getAntibioticSensitivitiesByTenant: (tenantId: string) => api.get(`/antibiotic-sensitivities/?tenant=${tenantId}`),
};

// ============================================================================
// TECHNICIAN APIs
// ============================================================================

// Test Request API (Technician)
export const testRequestAPI = {
  getAll: () => api.get('/test-requests/test-requests/'),
  getById: (id: number) => api.get(`/test-requests/test-requests/${id}/`),
  create: (data: any) => api.post('/test-requests/test-requests/', data),
  update: (id: number, data: any) => api.put(`/test-requests/test-requests/${id}/`, data),
  delete: (id: number) => api.delete(`/test-requests/test-requests/${id}/`),
};

// Test Report API
export const testReportAPI = {
  getAll: () => api.get('/test-reports/'),
  getById: (id: number) => api.get(`/test-reports/${id}/`),
  create: (data: any) => api.post('/test-reports/', data),
  update: (id: number, data: any) => api.put(`/test-reports/${id}/`, data),
  delete: (id: number) => api.delete(`/test-reports/${id}/`),
  getByPatient: (patientId: string) => api.get(`/test-reports/?patient_id=${patientId}`),
};

// Sample API
export const sampleAPI = {
  getAll: () => api.get('/samples/'),
  getById: (id: number) => api.get(`/samples/${id}/`),
  create: (data: any) => api.post('/samples/', data),
  update: (id: number, data: any) => api.put(`/samples/${id}/`, data),
  delete: (id: number) => api.delete(`/samples/${id}/`),
};

// Technician Equipment API
export const technicianEquipmentAPI = {
  getAll: () => api.get('/equipment/equipment/'),
  getById: (id: number) => api.get(`/equipment/equipment/${id}/`),
  create: (data: any) => api.post('/equipment/equipment/', data),
  update: (id: number, data: any) => api.put(`/equipment/equipment/${id}/`, data),
  delete: (id: number) => api.delete(`/equipment/equipment/${id}/`),
  
  // Maintenance endpoints
  maintain: (id: number, data: any) => api.post(`/equipment/equipment/${id}/maintain/`, data),
  getMaintenance: (id: number) => api.get(`/equipment/maintenance/?equipment=${id}`),
  
  // Calibration endpoints
  calibrate: (id: number, data: any) => api.post(`/equipment/equipment/${id}/calibrate/`, data),
  getCalibrations: (id: number) => api.get(`/equipment/calibrations/?equipment=${id}`),
  
  // Status update
  updateStatus: (id: number, status: string) => api.post(`/equipment/equipment/${id}/update_status/`, { status }),
};

// ============================================================================
// ANALYTICS & NOTIFICATIONS
// ============================================================================

export const analyticsAPI = {
  getLabAnalytics: () => api.get('/analytics/lab-analytics/'),
  getTestCategoryAnalytics: () => api.get('/analytics/test-category-analytics/'),
  getSystemLogs: () => api.get('/analytics/system-logs/'),
  getAnalyticsSummary: (params?: any) => api.get('/analytics/lab-analytics/summary/', { params }),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications/notifications/'),
  getById: (id: number) => api.get(`/notifications/notifications/${id}/`),
  create: (data: any) => api.post('/notifications/notifications/', data),
  update: (id: number, data: any) => api.put(`/notifications/notifications/${id}/`, data),
  delete: (id: number) => api.delete(`/notifications/notifications/${id}/`),
  markAsRead: (id: number) => api.post(`/notifications/notifications/${id}/mark_read/`),
  markAllAsRead: (tenant?: string) => api.post('/notifications/notifications/mark_all_read/', { tenant }),
  getUnreadCount: (tenant?: string) => api.get('/notifications/notifications/unread_count/', { params: { tenant } }),
  
  // Global notification methods
  sendGlobal: (data: any) => api.post('/notifications/notifications/send_global/', data),
  sendToRoles: (data: any) => api.post('/notifications/notifications/send_to_roles/', data),
  sendToTenants: (data: any) => api.post('/notifications/notifications/send_to_tenants/', data),
  sendMaintenanceAlert: (data: any) => api.post('/notifications/notifications/send_maintenance_alert/', data),
  sendSecurityAlert: (data: any) => api.post('/notifications/notifications/send_security_alert/', data),
  
  // Preferences
  getPreferences: () => api.get('/notifications/preferences/'),
  createPreference: (data: any) => api.post('/notifications/preferences/', data),
  updatePreference: (id: number, data: any) => api.put(`/notifications/preferences/${id}/`, data),
  deletePreference: (id: number) => api.delete(`/notifications/preferences/${id}/`),
};

// ============================================================================
// SUPPORT & PROFILE
// ============================================================================

export const supportAPI = {
  getTickets: () => api.get('/support/tickets/'),
  getMessages: () => api.get('/support/messages/'),
  createTicket: (data: any) => api.post('/support/tickets/', data),
  createMessage: (data: any) => api.post('/support/messages/', data),
};

// FAQ API
export const faqAPI = {
  getAll: (params?: any) => api.get('/faq/faqs/', { params }),
  getById: (id: string) => api.get(`/faq/faqs/${id}/`),
  create: (data: any) => api.post('/faq/faqs/', data),
  update: (id: string, data: any) => api.put(`/faq/faqs/${id}/`, data),
  delete: (id: string) => api.delete(`/faq/faqs/${id}/`),
  getCategories: (userType?: string) => api.get(`/faq/faqs/categories/?user_type=${userType || 'all'}`),
  getPopular: (userType?: string, limit?: number) => api.get(`/faq/faqs/popular/?user_type=${userType || 'all'}&limit=${limit || 10}`),
  markHelpful: (id: string) => api.post(`/faq/faqs/${id}/mark_helpful/`),
  markNotHelpful: (id: string) => api.post(`/faq/faqs/${id}/mark_not_helpful/`),
  search: (query: string, userType?: string) => api.get(`/faq/faqs/?search=${query}&user_type=${userType || 'all'}`),
};

export const profileAPI = {
  // Basic CRUD operations
  getProfile: () => api.get('/profile/'),
  updateProfile: (data: any) => api.put('/profile/', data),
  deleteProfile: (data: { confirm_deletion: boolean; reason?: string }) => 
    api.delete('/profile/delete/', { data }),
  restoreProfile: () => api.post('/profile/restore/'),
  resetProfile: () => api.post('/profile/reset/'),
  exportProfile: () => api.get('/profile/export/'),
  
  // Profile picture operations
  uploadProfilePicture: (formData: FormData) => api.post('/profile/upload-picture/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteProfilePicture: () => api.delete('/profile/picture/'),
  
  // Password operations
  changePassword: (data: { old_password: string; new_password: string }) => 
    api.post('/profile/change-password/', data),
  
  // Profile options
  getTimezones: () => api.get('/profile/options/timezones/'),
  getLanguages: () => api.get('/profile/options/languages/'),
  getGenders: () => api.get('/profile/options/genders/'),
  getBloodTypes: () => api.get('/profile/options/blood-types/'),
};

// ============================================================================
// SUPERADMIN APIs
// ============================================================================

export const superadminAPI = {
  // Tenant Management
  tenants: {
    getAll: (params?: any) => api.get('/superadmin/tenants/', { params }),
    getById: (id: number) => api.get(`/superadmin/tenants/${id}/`),
    create: (data: any) => api.post('/superadmin/tenants/', data),
    update: (id: number, data: any) => api.put(`/superadmin/tenants/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/tenants/${id}/`),
    getCount: () => api.get('/superadmin/tenants/count/'),
    suspend: (id: number) => api.post(`/superadmin/tenants/${id}/suspend/`),
    activate: (id: number) => api.post(`/superadmin/tenants/${id}/activate/`),
    getDashboardStats: () => api.get('/superadmin/tenants/dashboard_stats/'),
  },
  
  // Billing Plans
  plans: {
    getAll: () => api.get('/superadmin/plans/'),
    getById: (id: number) => api.get(`/superadmin/plans/${id}/`),
    create: (data: any) => api.post('/superadmin/plans/', data),
    update: (id: number, data: any) => api.put(`/superadmin/plans/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/plans/${id}/`),
    getAnalytics: () => api.get('/superadmin/plans/analytics/'),
  },
  
  // Billing Transactions
  transactions: {
    getAll: (params?: any) => api.get('/superadmin/transactions/', { params }),
    getById: (id: number) => api.get(`/superadmin/transactions/${id}/`),
  },
  
  // Usage Analytics
  usage: {
    getAll: (params?: any) => api.get('/superadmin/usage/', { params }),
    getAnalysis: (params?: any) => api.get('/superadmin/usage/analysis/', { params }),
    getTenantUsage: () => api.get('/superadmin/usage/tenant_usage/'),
    getFeatureUsage: () => api.get('/superadmin/usage/feature_usage/'),
  },
  
  // System Logs
  logs: {
    getAll: (params?: any) => api.get('/superadmin/logs/', { params }),
    getRecentActivity: () => api.get('/superadmin/logs/recent_activity/'),
  },
  
  // System Health
  health: {
    getAll: () => api.get('/superadmin/health/'),
    getOverallStatus: () => api.get('/superadmin/health/overall_status/'),
  },
  
  // Superadmin User Management
  users: {
    getAll: (params?: any) => api.get('/superadmin/users/', { params }),
    getById: (id: number) => api.get(`/superadmin/users/${id}/`),
    create: (data: any) => api.post('/superadmin/users/', data),
    update: (id: number, data: any) => api.put(`/superadmin/users/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/users/${id}/`),
    suspend: (id: number) => api.post(`/superadmin/users/${id}/suspend/`),
    activate: (id: number) => api.post(`/superadmin/users/${id}/activate/`),
  },
  
  // User Session Monitoring
  sessions: {
    getAll: (params?: any) => api.get('/superadmin/sessions/', { params }),
    getStats: () => api.get('/superadmin/sessions/stats/'),
  },
  
  // Database Backup Management
  backups: {
    getAll: (params?: any) => api.get('/superadmin/backups/', { params }),
    getById: (id: number) => api.get(`/superadmin/backups/${id}/`),
    create: (data: any) => api.post('/superadmin/backups/', data),
    update: (id: number, data: any) => api.put(`/superadmin/backups/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/backups/${id}/`),
    startBackup: (id: number) => api.post(`/superadmin/backups/${id}/start_backup/`),
    download: (id: number) => api.post(`/superadmin/backups/${id}/download/`),
  },
  
  // Global Notifications
  globalNotifications: {
    getAll: (params?: any) => api.get('/superadmin/notifications/', { params }),
    getById: (id: number) => api.get(`/superadmin/notifications/${id}/`),
    create: (data: any) => api.post('/superadmin/notifications/', data),
    update: (id: number, data: any) => api.put(`/superadmin/notifications/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/notifications/${id}/`),
    send: (id: number) => api.post(`/superadmin/notifications/${id}/send/`),
    getTemplates: () => api.get('/superadmin/notifications/templates/'),
  },
  
  // Notification Templates
  notificationTemplates: {
    getAll: () => api.get('/superadmin/notification-templates/'),
    getById: (id: number) => api.get(`/superadmin/notification-templates/${id}/`),
    create: (data: any) => api.post('/superadmin/notification-templates/', data),
    update: (id: number, data: any) => api.put(`/superadmin/notification-templates/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/notification-templates/${id}/`),
    useTemplate: (id: number, data: any) => api.post(`/superadmin/notification-templates/${id}/use_template/`, data),
  },
  
  // Notification History
  notificationHistory: {
    getAll: (params?: any) => api.get('/superadmin/notification-history/', { params }),
    getById: (id: number) => api.get(`/superadmin/notification-history/${id}/`),
  },
};

// ============================================================================
// DOCTOR DASHBOARD APIs
// ============================================================================

export const appointmentAPI = {
  getAll: () => api.get('/appointments/appointments/'),
  getById: (id: number) => api.get(`/appointments/appointments/${id}/`),
  create: (data: any) => api.post('/appointments/appointments/', data),
  update: (id: number, data: any) => api.put(`/appointments/appointments/${id}/`, data),
  delete: (id: number) => api.delete(`/appointments/appointments/${id}/`),
  getByDate: (date: string) => api.get(`/appointments/appointments/?appointment_date=${date}`),
  getByPatient: (patientId: string) => api.get(`/appointments/appointments/?patient_id=${patientId}`),
};

export const patientAPI = {
  getAll: () => api.get('/patients/patients/'),
  getById: (id: number) => api.get(`/patients/patients/${id}/`),
  create: (data: any) => api.post('/patients/patients/', data),
  update: (id: number, data: any) => api.put(`/patients/patients/${id}/`, data),
  delete: (id: number) => api.delete(`/patients/patients/${id}/`),
  getByPatientId: (patientId: string) => api.get(`/patients/patients/?patient_id=${patientId}`),
  search: (query: string) => api.get(`/patients/patients/?search=${query}`),
};

export const messageAPI = {
  getAll: () => api.get('/messages/messages/'),
  getById: (id: number) => api.get(`/messages/messages/${id}/`),
  create: (data: any) => api.post('/messages/messages/', data),
  update: (id: number, data: any) => api.put(`/messages/messages/${id}/`, data),
  delete: (id: number) => api.delete(`/messages/messages/${id}/`),
  getByRecipient: (recipientId: string) => api.get(`/messages/messages/?recipient_id=${recipientId}`),
  getBySender: (senderId: string) => api.get(`/messages/messages/?sender_id=${senderId}`),
  markAsRead: (id: number) => api.post(`/messages/messages/${id}/mark_read/`),
};

// ============================================================================
// INVENTORY MANAGEMENT APIs
// ============================================================================

export const inventoryAPI = {
  // Items
  getItems: () => api.get('/inventory/items/'),
  getItemById: (id: number) => api.get(`/inventory/items/${id}/`),
  createItem: (data: any) => api.post('/inventory/items/', data),
  updateItem: (id: number, data: any) => api.put(`/inventory/items/${id}/`, data),
  deleteItem: (id: number) => api.delete(`/inventory/items/${id}/`),
  
  // Categories
  getCategories: () => api.get('/inventory/categories/'),
  getCategoryById: (id: number) => api.get(`/inventory/categories/${id}/`),
  createCategory: (data: any) => api.post('/inventory/categories/', data),
  updateCategory: (id: number, data: any) => api.put(`/inventory/categories/${id}/`, data),
  deleteCategory: (id: number) => api.delete(`/inventory/categories/${id}/`),
  
  // Suppliers
  getSuppliers: () => api.get('/inventory/suppliers/'),
  getSupplierById: (id: number) => api.get(`/inventory/suppliers/${id}/`),
  createSupplier: (data: any) => api.post('/inventory/suppliers/', data),
  updateSupplier: (id: number, data: any) => api.put(`/inventory/suppliers/${id}/`, data),
  deleteSupplier: (id: number) => api.delete(`/inventory/suppliers/${id}/`),
  
  // Transactions
  getTransactions: () => api.get('/inventory/transactions/'),
  getTransactionById: (id: number) => api.get(`/inventory/transactions/${id}/`),
  createTransaction: (data: any) => api.post('/inventory/transactions/', data),
  updateTransaction: (id: number, data: any) => api.put(`/inventory/transactions/${id}/`, data),
  deleteTransaction: (id: number) => api.delete(`/inventory/transactions/${id}/`),
  
  // Reorder Requests
  getReorderRequests: () => api.get('/inventory/reorders/'),
  getReorderRequestById: (id: number) => api.get(`/inventory/reorders/${id}/`),
  createReorderRequest: (data: any) => api.post('/inventory/reorders/', data),
  updateReorderRequest: (id: number, data: any) => api.put(`/inventory/reorders/${id}/`, data),
  deleteReorderRequest: (id: number) => api.delete(`/inventory/reorders/${id}/`),
};

// ============================================================================
// SUPPORT TICKETS APIs
// ============================================================================

export const supportTicketAPI = {
  // Tickets
  getTickets: () => api.get('/api/support/tickets/'),
  getTicketById: (id: number) => api.get(`/api/support/tickets/${id}/`),
  createTicket: (data: any) => api.post('/api/support/tickets/', data),
  updateTicket: (id: number, data: any) => api.put(`/api/support/tickets/${id}/`, data),
  deleteTicket: (id: number) => api.delete(`/api/support/tickets/${id}/`),
  assignTicket: (id: number, data: any) => api.post(`/api/support/tickets/${id}/assign/`, data),
  resolveTicket: (id: number) => api.post(`/api/support/tickets/${id}/resolve/`),
  closeTicket: (id: number) => api.post(`/api/support/tickets/${id}/close/`),
  escalateTicket: (id: number, data: any) => api.post(`/api/support/tickets/${id}/escalate/`, data),
  addSatisfactionRating: (id: number, data: any) => api.post(`/api/support/tickets/${id}/add_satisfaction_rating/`, data),
  addMessage: (id: number, data: any) => api.post(`/api/support/tickets/${id}/add_message/`, data),
  
  // Messages
  getMessages: () => api.get('/api/support/messages/'),
  getMessageById: (id: number) => api.get(`/api/support/messages/${id}/`),
  createMessage: (data: any) => api.post('/api/support/messages/', data),
  updateMessage: (id: number, data: any) => api.put(`/api/support/messages/${id}/`, data),
  deleteMessage: (id: number) => api.delete(`/api/support/messages/${id}/`),
  getMessagesByTicket: (ticketId: number) => api.get(`/api/support/messages/?ticket=${ticketId}`),
};

// Support Staff Management API
export const supportStaffAPI = {
  // Staff Management
  getAll: (params?: any) => api.get('/api/support/staff/', { params }),
  getById: (id: string) => api.get(`/api/support/staff/${id}/`),
  create: (data: any) => api.post('/api/support/staff/', data),
  update: (id: string, data: any) => api.put(`/api/support/staff/${id}/`, data),
  delete: (id: string) => api.delete(`/api/support/staff/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/api/support/staff/?tenant=${tenantId}`),
  getBySpecialization: (specialization: string) => api.get(`/api/support/staff/?specialization=${specialization}`),
  getByLevel: (level: string) => api.get(`/api/support/staff/?level=${level}`),
  getAvailable: () => api.get('/api/support/staff/?is_available=true'),
  updateAvailability: (id: string, data: any) => api.post(`/api/support/staff/${id}/update_availability/`, data),
  getWorkload: (id: string) => api.get(`/api/support/staff/${id}/workload/`),
};

// Support Teams API
export const supportTeamAPI = {
  getAll: (params?: any) => api.get('/api/support/teams/', { params }),
  getById: (id: string) => api.get(`/api/support/teams/${id}/`),
  create: (data: any) => api.post('/api/support/teams/', data),
  update: (id: string, data: any) => api.put(`/api/support/teams/${id}/`, data),
  delete: (id: string) => api.delete(`/api/support/teams/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/api/support/teams/?tenant=${tenantId}`),
};

// Support SLA API
export const supportSLAAPI = {
  getAll: (params?: any) => api.get('/api/support/slas/', { params }),
  getById: (id: string) => api.get(`/api/support/slas/${id}/`),
  create: (data: any) => api.post('/api/support/slas/', data),
  update: (id: string, data: any) => api.put(`/api/support/slas/${id}/`, data),
  delete: (id: string) => api.delete(`/api/support/slas/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/api/support/slas/?tenant=${tenantId}`),
  getByPriority: (priority: string) => api.get(`/api/support/slas/?priority=${priority}`),
  getByCategory: (category: string) => api.get(`/api/support/slas/?category=${category}`),
};

// Support Analytics API
export const supportAnalyticsAPI = {
  getAll: (params?: any) => api.get('/api/support/analytics/', { params }),
  getById: (id: string) => api.get(`/api/support/analytics/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/api/support/analytics/?tenant=${tenantId}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/api/support/analytics/?date__gte=${startDate}&date__lte=${endDate}`),
  getSummary: (params?: any) => api.get('/api/support/analytics/summary/', { params }),
};

// ============================================================================
// BILLING & RECEIPTS APIs
// ============================================================================

export const receiptsAPI = {
  getAll: () => api.get('/receipts/receipts/'),
  getById: (id: string) => api.get(`/receipts/receipts/${id}/`),
  create: (data: any) => api.post('/receipts/receipts/', data),
  update: (id: string, data: any) => api.put(`/receipts/receipts/${id}/`, data),
  delete: (id: string) => api.delete(`/receipts/receipts/${id}/`),
  printReceipt: (id: string) => api.post(`/receipts/receipts/${id}/print_receipt/`),
  generateReceipt: (id: string) => api.post(`/receipts/receipts/${id}/generate_receipt/`),
};

export const billingTransactionAPI = {
  getAll: () => api.get('/receipts/transactions/'),
  getById: (id: string) => api.get(`/receipts/transactions/${id}/`),
  create: (data: any) => api.post('/receipts/transactions/', data),
  update: (id: string, data: any) => api.put(`/receipts/transactions/${id}/`, data),
  delete: (id: string) => api.delete(`/receipts/transactions/${id}/`),
};

// ============================================================================
// HOME VISIT APIs
// ============================================================================

export const homeVisitRequestAPI = {
  getAll: () => api.get('/home-visits/requests/'),
  getById: (id: string) => api.get(`/home-visits/requests/${id}/`),
  create: (data: any) => api.post('/home-visits/requests/', data),
  update: (id: string, data: any) => api.put(`/home-visits/requests/${id}/`, data),
  delete: (id: string) => api.delete(`/home-visits/requests/${id}/`),
  approve: (id: string) => api.post(`/home-visits/requests/${id}/approve/`),
  reject: (id: string) => api.post(`/home-visits/requests/${id}/reject/`),
  schedule: (id: string, data: any) => api.post(`/home-visits/requests/${id}/schedule/`, data),
};

export const homeVisitScheduleAPI = {
  getAll: () => api.get('/home-visits/schedules/'),
  getById: (id: string) => api.get(`/home-visits/schedules/${id}/`),
  create: (data: any) => api.post('/home-visits/schedules/', data),
  update: (id: string, data: any) => api.put(`/home-visits/schedules/${id}/`, data),
  delete: (id: string) => api.delete(`/home-visits/schedules/${id}/`),
  startVisit: (id: string) => api.post(`/home-visits/schedules/${id}/start_visit/`),
  completeVisit: (id: string) => api.post(`/home-visits/schedules/${id}/complete_visit/`),
};

// ============================================================================
// BRANCH MANAGEMENT APIs
// ============================================================================

export const branchManagementAPI = {
  getAll: () => api.get('/branches/branches/'),
  getById: (id: string) => api.get(`/branches/branches/${id}/`),
  create: (data: any) => api.post('/branches/branches/', data),
  update: (id: string, data: any) => api.put(`/branches/branches/${id}/`, data),
  delete: (id: string) => api.delete(`/branches/branches/${id}/`),
  activate: (id: string) => api.post(`/branches/branches/${id}/activate/`),
  deactivate: (id: string) => api.post(`/branches/branches/${id}/deactivate/`),
};

export const branchStaffAPI = {
  getAll: () => api.get('/branches/staff/'),
  getById: (id: string) => api.get(`/branches/staff/${id}/`),
  create: (data: any) => api.post('/branches/staff/', data),
  update: (id: string, data: any) => api.put(`/branches/staff/${id}/`, data),
  delete: (id: string) => api.delete(`/branches/staff/${id}/`),
  activate: (id: string) => api.post(`/branches/staff/${id}/activate/`),
  deactivate: (id: string) => api.post(`/branches/staff/${id}/deactivate/`),
};

// ============================================================================
// CONTRACT MANAGEMENT APIs
// ============================================================================

export const contractAPI = {
  getAll: () => api.get('/contracts/contracts/'),
  getById: (id: string) => api.get(`/contracts/contracts/${id}/`),
  create: (data: any) => api.post('/contracts/contracts/', data),
  update: (id: string, data: any) => api.put(`/contracts/contracts/${id}/`, data),
  delete: (id: string) => api.delete(`/contracts/contracts/${id}/`),
  activate: (id: string) => api.post(`/contracts/contracts/${id}/activate/`),
  terminate: (id: string) => api.post(`/contracts/contracts/${id}/terminate/`),
  renew: (id: string, data: any) => api.post(`/contracts/contracts/${id}/renew/`, data),
};

export const contractRenewalAPI = {
  getAll: () => api.get('/contracts/renewals/'),
  getById: (id: string) => api.get(`/contracts/renewals/${id}/`),
  create: (data: any) => api.post('/contracts/renewals/', data),
  update: (id: string, data: any) => api.put(`/contracts/renewals/${id}/`, data),
  delete: (id: string) => api.delete(`/contracts/renewals/${id}/`),
};

// ============================================================================
// ACCOUNTING APIs
// ============================================================================

export const accountingAPI = {
  // Basic CRUD operations
  getAll: (params?: any) => api.get('/accounting/entries/', { params }),
  getById: (id: string) => api.get(`/accounting/entries/${id}/`),
  create: (data: any) => api.post('/accounting/entries/', data),
  update: (id: string, data: any) => api.put(`/accounting/entries/${id}/`, data),
  delete: (id: string) => api.delete(`/accounting/entries/${id}/`),
  
  // Filtering and search
  getByType: (type: string) => api.get(`/accounting/entries/?entry_type=${type}`),
  getByCategory: (category: string) => api.get(`/accounting/entries/?category=${category}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/accounting/entries/?date__gte=${startDate}&date__lte=${endDate}`),
  search: (query: string) => api.get(`/accounting/entries/?search=${query}`),
  
  // Financial summary and analytics
  getSummary: (params?: any) => api.get('/accounting/entries/summary/', { params }),
  getFinancialSummary: (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return api.get('/accounting/entries/summary/', { params });
  },
  
  // Reports
  getReports: () => api.get('/accounting/reports/'),
  getReportById: (id: string) => api.get(`/accounting/reports/${id}/`),
  createReport: (data: any) => api.post('/accounting/reports/', data),
  updateReport: (id: string, data: any) => api.put(`/accounting/reports/${id}/`, data),
  deleteReport: (id: string) => api.delete(`/accounting/reports/${id}/`),
};

export const financialReportAPI = {
  getAll: () => api.get('/accounting/reports/'),
  getById: (id: string) => api.get(`/accounting/reports/${id}/`),
  create: (data: any) => api.post('/accounting/reports/', data),
  update: (id: string, data: any) => api.put(`/accounting/reports/${id}/`, data),
  delete: (id: string) => api.delete(`/accounting/reports/${id}/`),
};

// ============================================================================
// PATIENT MANAGEMENT API
// ============================================================================

// Patient API
export const patientManagementAPI = {
  // Patients
  getAll: (params?: any) => api.get('/patient/patients/', { params }),
  getById: (id: string) => api.get(`/patient/patients/${id}/`),
  create: (data: any) => api.post('/patient/patients/', data),
  update: (id: string, data: any) => api.put(`/patient/patients/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/patients/${id}/`),
  updateProfile: (id: string, data: any) => api.post(`/patient/patients/${id}/update_profile/`, data),
  getAppointments: (id: string) => api.get(`/patient/patients/${id}/appointments/`),
  getTestResults: (id: string) => api.get(`/patient/patients/${id}/test_results/`),
  getMessages: (id: string) => api.get(`/patient/patients/${id}/messages/`),
  getSupportTickets: (id: string) => api.get(`/patient/patients/${id}/support_tickets/`),
  getNotifications: (id: string) => api.get(`/patient/patients/${id}/notifications/`),
};

// Patient Appointments API
export const patientAppointmentAPI = {
  getAll: (params?: any) => api.get('/patient/appointments/', { params }),
  getById: (id: string) => api.get(`/patient/appointments/${id}/`),
  create: (data: any) => api.post('/patient/appointments/', data),
  update: (id: string, data: any) => api.put(`/patient/appointments/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/appointments/${id}/`),
  confirm: (id: string) => api.post(`/patient/appointments/${id}/confirm/`),
  cancel: (id: string) => api.post(`/patient/appointments/${id}/cancel/`),
  reschedule: (id: string, data: any) => api.post(`/patient/appointments/${id}/reschedule/`, data),
  getUpcoming: () => api.get('/patient/appointments/upcoming/'),
  getToday: () => api.get('/patient/appointments/today/'),
};

// Patient Test Results API
export const patientTestResultAPI = {
  getAll: (params?: any) => api.get('/patient/test-results/', { params }),
  getById: (id: string) => api.get(`/patient/test-results/${id}/`),
  create: (data: any) => api.post('/patient/test-results/', data),
  update: (id: string, data: any) => api.put(`/patient/test-results/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/test-results/${id}/`),
  markAbnormal: (id: string) => api.post(`/patient/test-results/${id}/mark_abnormal/`),
  markCritical: (id: string) => api.post(`/patient/test-results/${id}/mark_critical/`),
  getAbnormal: () => api.get('/patient/test-results/abnormal/'),
  getCritical: () => api.get('/patient/test-results/critical/'),
  getRecent: (days?: number) => api.get(`/patient/test-results/recent/?days=${days || 30}`),
};

// Patient Messages API
export const patientMessageAPI = {
  getAll: (params?: any) => api.get('/patient/messages/', { params }),
  getById: (id: string) => api.get(`/patient/messages/${id}/`),
  create: (data: any) => api.post('/patient/messages/', data),
  update: (id: string, data: any) => api.put(`/patient/messages/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/messages/${id}/`),
  markRead: (id: string) => api.post(`/patient/messages/${id}/mark_read/`),
  archive: (id: string) => api.post(`/patient/messages/${id}/archive/`),
  getUnread: () => api.get('/patient/messages/unread/'),
  getSent: () => api.get('/patient/messages/sent/'),
  getReceived: () => api.get('/patient/messages/received/'),
};

// Patient Support Tickets API
export const patientSupportTicketAPI = {
  getAll: (params?: any) => api.get('/patient/support-tickets/', { params }),
  getById: (id: string) => api.get(`/patient/support-tickets/${id}/`),
  create: (data: any) => api.post('/patient/support-tickets/', data),
  update: (id: string, data: any) => api.put(`/patient/support-tickets/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/support-tickets/${id}/`),
  assign: (id: string, data: any) => api.post(`/patient/support-tickets/${id}/assign/`, data),
  resolve: (id: string, data: any) => api.post(`/patient/support-tickets/${id}/resolve/`, data),
  close: (id: string) => api.post(`/patient/support-tickets/${id}/close/`),
  getOpen: () => api.get('/patient/support-tickets/open/'),
  getAssigned: () => api.get('/patient/support-tickets/assigned/'),
};

// Patient Notifications API
export const patientNotificationAPI = {
  getAll: (params?: any) => api.get('/patient/notifications/', { params }),
  getById: (id: string) => api.get(`/patient/notifications/${id}/`),
  create: (data: any) => api.post('/patient/notifications/', data),
  update: (id: string, data: any) => api.put(`/patient/notifications/${id}/`, data),
  delete: (id: string) => api.delete(`/patient/notifications/${id}/`),
  markRead: (id: string) => api.post(`/patient/notifications/${id}/mark_read/`),
  getUnread: () => api.get('/patient/notifications/unread/'),
  markAllRead: () => api.post('/patient/notifications/mark_all_read/'),
};

// ============================================================================
// TECHNICIAN MANAGEMENT API
// ============================================================================

// Technician Management API
export const technicianAPI = {
  // Technicians
  getAll: (params?: any) => api.get('/technician/technicians/', { params }),
  getById: (id: string) => api.get(`/technician/technicians/${id}/`),
  create: (data: any) => api.post('/technician/technicians/', data),
  update: (id: string, data: any) => api.put(`/technician/technicians/${id}/`, data),
  delete: (id: string) => api.delete(`/technician/technicians/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/technician/technicians/?tenant=${tenantId}`),
  getBySpecialization: (specialization: string) => api.get(`/technician/technicians/?specialization=${specialization}`),
  getByStatus: (status: string) => api.get(`/technician/technicians/?status=${status}`),
  updateStatus: (id: string, data: any) => api.post(`/technician/technicians/${id}/update_status/`, data),
  getPerformanceMetrics: (id: string) => api.get(`/technician/technicians/${id}/performance_metrics/`),
  getStatistics: (params?: any) => api.get('/technician/technicians/statistics/', { params }),
};

// Sample Management API
export const technicianSampleAPI = {
  getAll: (params?: any) => api.get('/technician/samples/', { params }),
  getById: (id: string) => api.get(`/technician/samples/${id}/`),
  create: (data: any) => api.post('/technician/samples/', data),
  update: (id: string, data: any) => api.put(`/technician/samples/${id}/`, data),
  delete: (id: string) => api.delete(`/technician/samples/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/technician/samples/?tenant=${tenantId}`),
  getByStatus: (status: string) => api.get(`/technician/samples/?status=${status}`),
  getByTechnician: (technicianId: string) => api.get(`/technician/samples/?technician=${technicianId}`),
  getBySampleType: (sampleType: string) => api.get(`/technician/samples/?sample_type=${sampleType}`),
  getPending: () => api.get('/technician/samples/pending_samples/'),
  assignTechnician: (id: string, data: any) => api.post(`/technician/samples/${id}/assign_technician/`, data),
  updateStatus: (id: string, data: any) => api.post(`/technician/samples/${id}/update_status/`, data),
  rejectSample: (id: string, data: any) => api.post(`/technician/samples/${id}/reject_sample/`, data),
  getStatistics: (params?: any) => api.get('/technician/samples/statistics/', { params }),
};

// Test Result Management API
export const testResultAPI = {
  getAll: (params?: any) => api.get('/technician/test-results/', { params }),
  getById: (id: string) => api.get(`/technician/test-results/${id}/`),
  create: (data: any) => api.post('/technician/test-results/', data),
  update: (id: string, data: any) => api.put(`/technician/test-results/${id}/`, data),
  delete: (id: string) => api.delete(`/technician/test-results/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/technician/test-results/?tenant=${tenantId}`),
  getByStatus: (status: string) => api.get(`/technician/test-results/?status=${status}`),
  getByTechnician: (technicianId: string) => api.get(`/technician/test-results/?technician=${technicianId}`),
  getBySample: (sampleId: string) => api.get(`/technician/test-results/?sample=${sampleId}`),
  getAbnormal: () => api.get('/technician/test-results/abnormal_results/'),
  getCritical: () => api.get('/technician/test-results/critical_results/'),
  completeResult: (id: string, data: any) => api.post(`/technician/test-results/${id}/complete_result/`, data),
  markAbnormal: (id: string, data: any) => api.post(`/technician/test-results/${id}/mark_abnormal/`, data),
  reviewResult: (id: string, data: any) => api.post(`/technician/test-results/${id}/review_result/`, data),
  getStatistics: (params?: any) => api.get('/technician/test-results/statistics/', { params }),
};

// Quality Control API
export const qualityControlAPI = {
  getAll: (params?: any) => api.get('/technician/quality-controls/', { params }),
  getById: (id: string) => api.get(`/technician/quality-controls/${id}/`),
  create: (data: any) => api.post('/technician/quality-controls/', data),
  update: (id: string, data: any) => api.put(`/technician/quality-controls/${id}/`, data),
  delete: (id: string) => api.delete(`/technician/quality-controls/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/technician/quality-controls/?tenant=${tenantId}`),
  getByStatus: (status: string) => api.get(`/technician/quality-controls/?status=${status}`),
  getByTechnician: (technicianId: string) => api.get(`/technician/quality-controls/?technician=${technicianId}`),
  getByEquipment: (equipmentId: string) => api.get(`/technician/quality-controls/?equipment=${equipmentId}`),
  getFailed: () => api.get('/technician/quality-controls/failed_qc/'),
  updateStatus: (id: string, data: any) => api.post(`/technician/quality-controls/${id}/update_status/`, data),
  getStatistics: (params?: any) => api.get('/technician/quality-controls/statistics/', { params }),
};

// Lab Workflow API
export const labWorkflowAPI = {
  getAll: (params?: any) => api.get('/technician/workflows/', { params }),
  getById: (id: string) => api.get(`/technician/workflows/${id}/`),
  create: (data: any) => api.post('/technician/workflows/', data),
  update: (id: string, data: any) => api.put(`/technician/workflows/${id}/`, data),
  delete: (id: string) => api.delete(`/technician/workflows/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/technician/workflows/?tenant=${tenantId}`),
  getByStatus: (status: string) => api.get(`/technician/workflows/?status=${status}`),
  getByTechnician: (technicianId: string) => api.get(`/technician/workflows/?assigned_to=${technicianId}`),
  getByWorkflowType: (workflowType: string) => api.get(`/technician/workflows/?workflow_type=${workflowType}`),
  getPending: () => api.get('/technician/workflows/pending_workflows/'),
  assignWorkflow: (id: string, data: any) => api.post(`/technician/workflows/${id}/assign_workflow/`, data),
  completeWorkflow: (id: string, data: any) => api.post(`/technician/workflows/${id}/complete_workflow/`, data),
  getStatistics: (params?: any) => api.get('/technician/workflows/statistics/', { params }),
};

export default api;