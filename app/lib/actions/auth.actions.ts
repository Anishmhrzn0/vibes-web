'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { registerApi, loginApi } from '@/app/lib/api/auth';
import type { RegisterSchema, LoginSchema } from '@/app/lib/schemas/auth.schema';

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
  redirect('/dashboard');
}

export async function loginAction(payload: LoginSchema) {
  const { accessToken, user } = await loginApi(payload);
  const cookieStore = await cookies();
  cookieStore.set('ap_token', accessToken, COOKIE_OPTS);
  cookieStore.set('ap_user', JSON.stringify(user), { ...COOKIE_OPTS, httpOnly: false });
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('ap_token');
  cookieStore.delete('ap_user');
  redirect('/auth/login');
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