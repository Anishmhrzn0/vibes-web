import axiosInstance from './axios-instance';
import { API_ENDPOINTS } from './endpoints';
import type { RegisterSchema, LoginSchema } from '@/app/lib/schemas/auth.schema';

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

export async function registerApi(payload: RegisterSchema): Promise<AuthResponse> {
  const res = await axiosInstance.post(API_ENDPOINTS.auth.register, payload);
  return res.data; // ← unwrap .data.data
}

export async function loginApi(payload: LoginSchema): Promise<AuthResponse> {
  const res = await axiosInstance.post(API_ENDPOINTS.auth.login, payload);
  return res.data; // ← unwrap .data.data
}
export const updateProfile = async (data: any) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.auth.update, data,  { 
            headers: {
                'Content-Type': 'multipart/form-data' // multipart/form-data for file upload
            }
        });
        return response.data; // reponse ko body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Failed to update profile');
    }
}

export const updatePassword = async (data: any) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.auth.updatePassword, data);
        return response.data; // reponse ko body
    }
    catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Failed to update password');
    }
}