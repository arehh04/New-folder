import axios from 'axios';
import { APP_CONFIG } from '../config/constants';

/**
 * Resilient Centralized Axios Client Instance
 * Configured with credentials for HTTP-Only cookie forwarding and response envelope unwrappers.
 */
const axiosInstance = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach fallback authorization token if stored
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless data unwrapping & error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend returns a standardized ApiResponse envelope ({ success, data, message }),
    // we unwrap the data field while maintaining backward compatibility.
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      // Attach message and meta to the unwrapped data
      const unwrapped = response.data.data;
      if (typeof unwrapped === 'object' && unwrapped !== null && !Array.isArray(unwrapped)) {
        unwrapped.__message = response.data.message;
        unwrapped.__meta = response.data.meta;
      }
      return { ...response, data: unwrapped };
    }
    return response;
  },
  (error) => {
    // Standardize error message extraction
    const serverMessage = error.response?.data?.message || error.message || 'An unexpected sovereign network error occurred';
    const errorCode = error.response?.data?.error?.code || 'NETWORK_ERROR';
    
    // Enrich error object
    error.userMessage = serverMessage;
    error.errorCode = errorCode;

    // Handle 401 Unauthorized session expiration without hard loops
    if (error.response?.status === 401) {
      console.warn('👑 [SESSION] 401 Unauthorized detected - clearing stale local credentials.');
      // Clean up fallback local token if expired
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
