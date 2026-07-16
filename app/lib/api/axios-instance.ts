import axios from 'axios';

const BASE_URL = typeof window === 'undefined'
  ? 'http://localhost:3000/api'
  : '/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

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