import axios from "axios";

// All requests go through Vite proxy → backend
const api = axios.create({
  baseURL: "/api/v1",
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  whoami: () => api.get<{ success: boolean; user: User }>("/auth/whoami"),

  updateProfile: (formData: FormData) =>
    api.put<AuthResponse>("/auth/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;