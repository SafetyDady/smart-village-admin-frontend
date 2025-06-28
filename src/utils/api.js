import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Property API
export const propertyAPI = {
  getProperties: (params = {}) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getStatistics: () => api.get('/properties/statistics'),
  getRecent: (limit = 10) => api.get('/properties/recent', { params: { limit } }),
  getPropertyTypes: () => api.get('/property-types'),
  getPropertyStatuses: () => api.get('/property-statuses'),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStatistics: () => api.get('/admin/dashboard/statistics'),
  
  // Property Types
  getPropertyTypes: (includeInactive = false) => 
    api.get('/admin/property-types', { params: { include_inactive: includeInactive } }),
  getPropertyType: (id) => api.get(`/admin/property-types/${id}`),
  createPropertyType: (data) => api.post('/admin/property-types', data),
  updatePropertyType: (id, data) => api.put(`/admin/property-types/${id}`, data),
  deletePropertyType: (id) => api.delete(`/admin/property-types/${id}`),
  togglePropertyTypeStatus: (id) => api.patch(`/admin/property-types/${id}/toggle-status`),
  
  // Property Statuses
  getPropertyStatuses: (includeInactive = false) => 
    api.get('/admin/property-statuses', { params: { include_inactive: includeInactive } }),
  getPropertyStatus: (id) => api.get(`/admin/property-statuses/${id}`),
  createPropertyStatus: (data) => api.post('/admin/property-statuses', data),
  updatePropertyStatus: (id, data) => api.put(`/admin/property-statuses/${id}`, data),
  deletePropertyStatus: (id) => api.delete(`/admin/property-statuses/${id}`),
  togglePropertyStatusStatus: (id) => api.patch(`/admin/property-statuses/${id}/toggle-status`),
};

// Generic API helper functions
export const apiHelpers = {
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return { success: false, message, status: error.response.status };
    } else if (error.request) {
      // Request was made but no response received
      return { success: false, message: 'Network error - please check your connection' };
    } else {
      // Something else happened
      return { success: false, message: 'An unexpected error occurred' };
    }
  },
  
  extractData: (response) => {
    return response.data?.data || response.data;
  },
  
  isSuccess: (response) => {
    return response.data?.success !== false;
  }
};

export default api;

