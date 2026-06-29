import axios from 'axios';

const BASE_URL = typeof window === 'undefined'
  ? 'http://localhost:3000/api'  
  : '/api';                       

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attach token from cookie if present (for authenticated requests)
axiosInstance.interceptors.request.use(
  config => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.split('; ').find(r => r.startsWith('ap_token='));
      if (match) {
        const token = match.split('=')[1];
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
// Unwrap error messages from API responses
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;