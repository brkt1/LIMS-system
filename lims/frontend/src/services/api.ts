import axios from 'axios';

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
          const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
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

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};

export const testRequestAPI = {
  getAll: () => api.get('/test-requests/test-requests/'),
  getById: (id: number) => api.get(`/test-requests/test-requests/${id}/`),
  create: (data: any) => api.post('/test-requests/test-requests/', data),
  update: (id: number, data: any) => api.put(`/test-requests/test-requests/${id}/`, data),
  delete: (id: number) => api.delete(`/test-requests/test-requests/${id}/`),
};

export const testReportAPI = {
  getAll: () => api.get('/test-reports/'),
  getById: (id: number) => api.get(`/test-reports/${id}/`),
  create: (data: any) => api.post('/test-reports/', data),
  update: (id: number, data: any) => api.put(`/test-reports/${id}/`, data),
  delete: (id: number) => api.delete(`/test-reports/${id}/`),
  getByPatient: (patientId: string) => api.get(`/test-reports/?patient_id=${patientId}`),
};

export const userManagementAPI = {
  getAll: () => api.get('/tenant/users/?tenant=1'), // Default to tenant 1
  getById: (id: string) => api.get(`/tenant/users/${id}/`),
  create: (data: any) => api.post('/tenant/users/', data),
  update: (id: string, data: any) => api.put(`/tenant/users/${id}/`, data),
  delete: (id: string) => api.delete(`/tenant/users/${id}/`),
  getByTenant: (tenantId: string) => api.get(`/tenant/users/?tenant=${tenantId}`),
};

export const sampleAPI = {
  getAll: () => api.get('/samples/'),
  getById: (id: number) => api.get(`/samples/${id}/`),
  create: (data: any) => api.post('/samples/', data),
  update: (id: number, data: any) => api.put(`/samples/${id}/`, data),
  delete: (id: number) => api.delete(`/samples/${id}/`),
};

export const equipmentAPI = {
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
  sendGlobal: (data: any) => api.post('/notifications/notifications/send_global/', data),
  
  // Preferences
  getPreferences: () => api.get('/notifications/preferences/'),
  createPreference: (data: any) => api.post('/notifications/preferences/', data),
  updatePreference: (id: number, data: any) => api.put(`/notifications/preferences/${id}/`, data),
  deletePreference: (id: number) => api.delete(`/notifications/preferences/${id}/`),
};

export const supportAPI = {
  getTickets: () => api.get('/support/tickets/'),
  getMessages: () => api.get('/support/messages/'),
  createTicket: (data: any) => api.post('/support/tickets/', data),
  createMessage: (data: any) => api.post('/support/messages/', data),
};

export const profileAPI = {
  getProfile: () => api.get('/profile/'),
  updateProfile: (data: any) => api.put('/profile/', data),
  uploadProfilePicture: (formData: FormData) => api.post('/profile/upload-picture/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteProfilePicture: () => api.delete('/profile/picture/'),
  changePassword: (data: { old_password: string; new_password: string }) => 
    api.post('/profile/change-password/', data),
};

// Superadmin API endpoints
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
  
  // User Management (across all tenants)
  users: {
    getAll: () => api.get('/tenant/users/'),
    getCount: () => api.get('/tenant/users/').then(res => ({ count: res.data.length })),
    getById: (id: number) => api.get(`/tenant/users/${id}/`),
    update: (id: number, data: any) => api.put(`/tenant/users/${id}/`, data),
    delete: (id: number) => api.delete(`/tenant/users/${id}/`),
  },
};

// New API endpoints for Doctor Dashboard integration
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

// Inventory Management API
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

// Support Tickets API
export const supportTicketAPI = {
  // Tickets
  getTickets: () => api.get('/support/tickets/'),
  getTicketById: (id: number) => api.get(`/support/tickets/${id}/`),
  createTicket: (data: any) => api.post('/support/tickets/', data),
  updateTicket: (id: number, data: any) => api.put(`/support/tickets/${id}/`, data),
  deleteTicket: (id: number) => api.delete(`/support/tickets/${id}/`),
  assignTicket: (id: number, data: any) => api.post(`/support/tickets/${id}/assign/`, data),
  resolveTicket: (id: number) => api.post(`/support/tickets/${id}/resolve/`),
  closeTicket: (id: number) => api.post(`/support/tickets/${id}/close/`),
  
  // Messages
  getMessages: () => api.get('/support/messages/'),
  getMessageById: (id: number) => api.get(`/support/messages/${id}/`),
  createMessage: (data: any) => api.post('/support/messages/', data),
  updateMessage: (id: number, data: any) => api.put(`/support/messages/${id}/`, data),
  deleteMessage: (id: number) => api.delete(`/support/messages/${id}/`),
  getMessagesByTicket: (ticketId: number) => api.get(`/support/messages/?ticket=${ticketId}`),
};

// Receipts/Billing API
export const receiptsAPI = {
  getAll: () => api.get('/receipts/receipts/'),
  getById: (id: string) => api.get(`/receipts/receipts/${id}/`),
  create: (data: any) => api.post('/receipts/receipts/', data),
  update: (id: string, data: any) => api.put(`/receipts/receipts/${id}/`, data),
  delete: (id: string) => api.delete(`/receipts/receipts/${id}/`),
  printReceipt: (id: string) => api.post(`/receipts/receipts/${id}/print_receipt/`),
  generateReceipt: (id: string) => api.post(`/receipts/receipts/${id}/generate_receipt/`),
};

// Billing Transactions API
export const billingTransactionAPI = {
  getAll: () => api.get('/receipts/transactions/'),
  getById: (id: string) => api.get(`/receipts/transactions/${id}/`),
  create: (data: any) => api.post('/receipts/transactions/', data),
  update: (id: string, data: any) => api.put(`/receipts/transactions/${id}/`, data),
  delete: (id: string) => api.delete(`/receipts/transactions/${id}/`),
};

// Home Visit Requests API
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

// Home Visit Schedules API
export const homeVisitScheduleAPI = {
  getAll: () => api.get('/home-visits/schedules/'),
  getById: (id: string) => api.get(`/home-visits/schedules/${id}/`),
  create: (data: any) => api.post('/home-visits/schedules/', data),
  update: (id: string, data: any) => api.put(`/home-visits/schedules/${id}/`, data),
  delete: (id: string) => api.delete(`/home-visits/schedules/${id}/`),
  startVisit: (id: string) => api.post(`/home-visits/schedules/${id}/start_visit/`),
  completeVisit: (id: string) => api.post(`/home-visits/schedules/${id}/complete_visit/`),
};

// Branch Management API
export const branchAPI = {
  getAll: () => api.get('/branches/branches/'),
  getById: (id: string) => api.get(`/branches/branches/${id}/`),
  create: (data: any) => api.post('/branches/branches/', data),
  update: (id: string, data: any) => api.put(`/branches/branches/${id}/`, data),
  delete: (id: string) => api.delete(`/branches/branches/${id}/`),
  activate: (id: string) => api.post(`/branches/branches/${id}/activate/`),
  deactivate: (id: string) => api.post(`/branches/branches/${id}/deactivate/`),
};

// Branch Staff API
export const branchStaffAPI = {
  getAll: () => api.get('/branches/staff/'),
  getById: (id: string) => api.get(`/branches/staff/${id}/`),
  create: (data: any) => api.post('/branches/staff/', data),
  update: (id: string, data: any) => api.put(`/branches/staff/${id}/`, data),
  delete: (id: string) => api.delete(`/branches/staff/${id}/`),
  activate: (id: string) => api.post(`/branches/staff/${id}/activate/`),
  deactivate: (id: string) => api.post(`/branches/staff/${id}/deactivate/`),
};

// Contract Management API
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

// Contract Renewals API
export const contractRenewalAPI = {
  getAll: () => api.get('/contracts/renewals/'),
  getById: (id: string) => api.get(`/contracts/renewals/${id}/`),
  create: (data: any) => api.post('/contracts/renewals/', data),
  update: (id: string, data: any) => api.put(`/contracts/renewals/${id}/`, data),
  delete: (id: string) => api.delete(`/contracts/renewals/${id}/`),
};

// Accounting API
export const accountingAPI = {
  getAll: () => api.get('/accounting/entries/'),
  getById: (id: string) => api.get(`/accounting/entries/${id}/`),
  create: (data: any) => api.post('/accounting/entries/', data),
  update: (id: string, data: any) => api.put(`/accounting/entries/${id}/`, data),
  delete: (id: string) => api.delete(`/accounting/entries/${id}/`),
  getSummary: (params?: any) => api.get('/accounting/entries/summary/', { params }),
};

// Financial Reports API
export const financialReportAPI = {
  getAll: () => api.get('/accounting/reports/'),
  getById: (id: string) => api.get(`/accounting/reports/${id}/`),
  create: (data: any) => api.post('/accounting/reports/', data),
  update: (id: string, data: any) => api.put(`/accounting/reports/${id}/`, data),
  delete: (id: string) => api.delete(`/accounting/reports/${id}/`),
};

export default api;
