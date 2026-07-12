import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('esg_session_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common error codes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes
    if (error.response) {
      if (error.response.status === 401) {
        // Handle token expiration or unauthorized access
        localStorage.removeItem('esg_session_user');
        localStorage.removeItem('esg_session_token');
        // Redirect to login if in browser environment and not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
