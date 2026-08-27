import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { APP_CONFIG } from '../config/constants';

export interface CustomAxiosError extends AxiosError {
  userMessage?: string;
  errorCode?: string;
}

/**
 * Resilient Centralized Axios Client Instance
 * Configured with credentials for HTTP-Only cookie forwarding and response envelope unwrappers.
 */
const axiosInstance: AxiosInstance = axios.create({
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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor: Seamless data unwrapping & error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns a standardized ApiResponse envelope ({ success, data, message }),
    // we unwrap the data field while maintaining backward compatibility.
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      const unwrapped = response.data.data;
      if (typeof unwrapped === 'object' && unwrapped !== null && !Array.isArray(unwrapped)) {
        unwrapped.__message = response.data.message;
        unwrapped.__meta = response.data.meta;
      }
      return { ...response, data: unwrapped };
    }
    return response;
  },
  (error: CustomAxiosError) => {
    // Standardize error message extraction
    const responseData = error.response?.data as any;
    const serverMessage = responseData?.message || error.message || 'An unexpected sovereign network error occurred';
    const errorCode = responseData?.error?.code || 'NETWORK_ERROR';
    
    // Enrich error object
    error.userMessage = serverMessage;
    error.errorCode = errorCode;

    // Handle 401 Unauthorized session expiration without hard loops
    if (error.response?.status === 401) {
      console.warn('👑 [SESSION] 401 Unauthorized detected - clearing stale local credentials.');
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
