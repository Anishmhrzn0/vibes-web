import axiosInstance from './axios-instance';
import { API_ENDPOINTS } from './endpoints';
import type { RegisterSchema, LoginSchema } from '@/app/lib/schemas/auth.schema';

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

export async function registerApi(payload: RegisterSchema): Promise<AuthResponse> {
  const res = await axiosInstance.post(API_ENDPOINTS.auth.register, payload);
  return res.data.data; // ← unwrap .data.data
}

export async function loginApi(payload: LoginSchema): Promise<AuthResponse> {
  const res = await axiosInstance.post(API_ENDPOINTS.auth.login, payload);
  return res.data.data; // ← unwrap .data.data
}