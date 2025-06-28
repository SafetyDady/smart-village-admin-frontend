/**
 * API Client for Smart Village Management System
 * Handles HTTP requests with authentication and error handling
 */

import axios from 'axios';

// API Configuration
const API_CONFIG = {
  // Direct connection to Mock Auth Service (as approved)
  AUTH_BASE_URL: 'http://localhost:3002',
  MAIN_API_BASE_URL: 'http://localhost:3001', // For future use
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Create axios instance for Auth Service
const authApiClient = axios.create({
  baseURL: API_CONFIG.AUTH_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Client-Platform': 'web'
  }
});

// Create axios instance for Main API (future use)
const mainApiClient = axios.create({
  baseURL: API_CONFIG.MAIN_API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Client-Platform': 'web'
  }
});

// Token management
let authToken = null;
let refreshToken = null;
let isRefreshing = false;
let failedQueue = [];

// Helper function to process failed queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Set authentication tokens
export const setAuthTokens = (token, refresh = null) => {
  authToken = token;
  refreshToken = refresh;
  
  if (token) {
    authApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    mainApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete authApiClient.defaults.headers.common['Authorization'];
    delete mainApiClient.defaults.headers.common['Authorization'];
  }
};

// Clear authentication tokens
export const clearAuthTokens = () => {
  authToken = null;
  refreshToken = null;
  delete authApiClient.defaults.headers.common['Authorization'];
  delete mainApiClient.defaults.headers.common['Authorization'];
};

// Request interceptor for Auth API
authApiClient.interceptors.request.use(
  (config) => {
    // Add request timestamp
    config.metadata = { startTime: new Date() };
    
    // Add correlation ID for tracking
    config.headers['X-Correlation-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔐 Auth API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('🔐 Auth API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for Auth API
authApiClient.interceptors.response.use(
  (response) => {
    // Calculate response time
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    console.log(`✅ Auth API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      duration: `${duration}ms`,
      data: response.data
    });
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ Auth API Error: ${error.response?.status || 'Network'} ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
      error: error.message,
      response: error.response?.data
    });

    // Handle 401 Unauthorized - Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return authApiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (refreshToken) {
          const response = await authApiClient.post('/auth/refresh', {
            refreshToken: refreshToken
          });

          const newToken = response.data.token;
          setAuthTokens(newToken, refreshToken);
          
          processQueue(null, newToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return authApiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        
        // Redirect to login or emit logout event
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'token_refresh_failed' } 
        }));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Request interceptor for Main API
mainApiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    config.headers['X-Correlation-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔗 Main API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('🔗 Main API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for Main API
mainApiClient.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    
    console.log(`✅ Main API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      duration: `${duration}ms`,
      data: response.data
    });
    
    return response;
  },
  (error) => {
    console.error(`❌ Main API Error: ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      error: error.message,
      response: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

// Retry logic for failed requests
const retryRequest = async (apiClient, config, attempt = 1) => {
  try {
    return await apiClient(config);
  } catch (error) {
    if (attempt < API_CONFIG.RETRY_ATTEMPTS && error.code === 'ECONNABORTED') {
      console.log(`🔄 Retrying request (${attempt}/${API_CONFIG.RETRY_ATTEMPTS}): ${config.method?.toUpperCase()} ${config.url}`);
      
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      return retryRequest(apiClient, config, attempt + 1);
    }
    
    throw error;
  }
};

// Authentication API methods
export const authApi = {
  // Login
  login: async (credentials) => {
    try {
      const response = await authApiClient.post('/auth/login', credentials);
      
      // Set tokens after successful login
      if (response.data.token) {
        setAuthTokens(response.data.token, response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      await authApiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      clearAuthTokens();
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await authApiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  // Refresh token
  refreshToken: async (token) => {
    try {
      const response = await authApiClient.post('/auth/refresh', {
        refreshToken: token
      });
      
      if (response.data.token) {
        setAuthTokens(response.data.token, token);
      }
      
      return response.data;
    } catch (error) {
      clearAuthTokens();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await authApiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Auth service is not available');
    }
  }
};

// Main API methods (placeholder for future)
export const mainApi = {
  // Users
  getUsers: async (params = {}) => {
    try {
      const response = await mainApiClient.get('/api/v1/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  },

  // Properties (placeholder)
  getProperties: async (params = {}) => {
    try {
      const response = await mainApiClient.get('/api/v1/properties', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get properties');
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await mainApiClient.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Main API service is not available');
    }
  }
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return { type: 'validation', message: data.message || 'Invalid request data' };
      case 401:
        return { type: 'authentication', message: 'Authentication required' };
      case 403:
        return { type: 'authorization', message: 'Access denied' };
      case 404:
        return { type: 'not_found', message: 'Resource not found' };
      case 429:
        return { type: 'rate_limit', message: 'Too many requests. Please try again later.' };
      case 500:
        return { type: 'server', message: 'Internal server error' };
      default:
        return { type: 'unknown', message: data.message || 'An error occurred' };
    }
  } else if (error.request) {
    // Network error
    return { type: 'network', message: 'Network error. Please check your connection.' };
  } else {
    // Other error
    return { type: 'unknown', message: error.message || 'An unexpected error occurred' };
  }
};

// Initialize tokens from localStorage
const initializeTokens = () => {
  const token = localStorage.getItem('auth_token');
  const refresh = localStorage.getItem('refresh_token');
  
  if (token) {
    setAuthTokens(token, refresh);
  }
};

// Initialize on module load
initializeTokens();

export default {
  authApi,
  mainApi,
  setAuthTokens,
  clearAuthTokens,
  handleApiError
};

