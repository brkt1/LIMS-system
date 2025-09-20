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
  getAll: () => api.get('/test-requests/'),
  getById: (id: number) => api.get(`/test-requests/${id}/`),
  create: (data: any) => api.post('/test-requests/', data),
  update: (id: number, data: any) => api.put(`/test-requests/${id}/`, data),
  delete: (id: number) => api.delete(`/test-requests/${id}/`),
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

export default api;
