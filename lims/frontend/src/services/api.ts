import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
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

export const inventoryAPI = {
  getItems: () => api.get('/inventory/items/'),
  getCategories: () => api.get('/inventory/categories/'),
  getSuppliers: () => api.get('/inventory/suppliers/'),
  getTransactions: () => api.get('/inventory/transactions/'),
};

export const analyticsAPI = {
  getLabAnalytics: () => api.get('/analytics/lab-analytics/'),
  getTestCategoryAnalytics: () => api.get('/analytics/test-category-analytics/'),
  getSystemLogs: () => api.get('/analytics/system-logs/'),
  getAnalyticsSummary: (params?: any) => api.get('/analytics/lab-analytics/summary/', { params }),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications/notifications/'),
  getPreferences: () => api.get('/notifications/preferences/'),
  markAsRead: (id: number) => api.patch(`/notifications/notifications/${id}/`, { read: true }),
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
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post('/profile/upload-picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProfilePicture: () => api.delete('/profile/picture/'),
  changePassword: (data: { old_password: string; new_password: string }) => 
    api.post('/profile/change-password/', data),
};

// Superadmin API endpoints
export const superadminAPI = {
  // Tenant Management
  tenants: {
    getAll: () => api.get('/superadmin/tenants/'),
    getById: (id: number) => api.get(`/superadmin/tenants/${id}/`),
    create: (data: any) => api.post('/superadmin/tenants/', data),
    update: (id: number, data: any) => api.put(`/superadmin/tenants/${id}/`, data),
    delete: (id: number) => api.delete(`/superadmin/tenants/${id}/`),
    getCount: () => api.get('/superadmin/tenants/').then(res => ({ count: res.data.length })),
  },
  
  // User Management (across all tenants)
  users: {
    getAll: () => api.get('/tenant/users/'),
    getCount: () => api.get('/tenant/users/').then(res => ({ count: res.data.length })),
    getById: (id: number) => api.get(`/tenant/users/${id}/`),
    update: (id: number, data: any) => api.put(`/tenant/users/${id}/`, data),
    delete: (id: number) => api.delete(`/tenant/users/${id}/`),
  },
  
  // System Health & Monitoring
  systemHealth: {
    getStatus: () => api.get('/analytics/lab-analytics/summary/'),
    getActiveSessions: () => api.get('/analytics/system-logs/?level=info&action__icontains=login'),
    getSystemMetrics: () => api.get('/analytics/lab-analytics/'),
  },
};

export default api;
