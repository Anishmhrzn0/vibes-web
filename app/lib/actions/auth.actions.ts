'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerApi, loginApi, updateProfile, updatePassword } from '@/app/lib/api/auth';
import type { RegisterSchema, LoginSchema } from '@/app/lib/schemas/auth.schema';
import { revalidatePath } from 'next/cache';
import { UpdatePasswordFormData } from '@/app/components/auth/schema';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export async function registerAction(payload: RegisterSchema) {
  const { accessToken, user } = await registerApi(payload);
  const cookieStore = await cookies();
  cookieStore.set('ap_token', accessToken, COOKIE_OPTS);
  cookieStore.set('ap_user', JSON.stringify(user), { ...COOKIE_OPTS, httpOnly: false });
}

export async function loginAction(payload: LoginSchema) {
  const { accessToken, user } = await loginApi(payload);
  const cookieStore = await cookies();
  cookieStore.set('ap_token', accessToken, COOKIE_OPTS);
  cookieStore.set('ap_user', JSON.stringify(user), { ...COOKIE_OPTS, httpOnly: false });
}

export const handleUpdateProfile = async (formData: FormData) => {
    try {
        const result = await updateProfile(formData);
        if (result.success) {
            await revalidatePath("/dashboard/profile"); // Revalidate the profile page after successful update
            return { success: true, message: result.message, data: result.data };
        }
        else {
            return { success: false, message: result.message || 'Failed to update profile' };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || 'Failed to update profile' };
    }
}

export const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    try {
        const result = await updatePassword(data);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Failed to update password' };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || 'Failed to update password' };
    }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('ap_token');
  cookieStore.delete('ap_user');
  redirect('/login');
}

export async function getSession() {
  const cookieStore = await cookies();
  const token   = cookieStore.get('ap_token')?.value;
  const userRaw = cookieStore.get('ap_user')?.value;
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}