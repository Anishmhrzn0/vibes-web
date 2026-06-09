import type { ApiUser } from '@/app/lib/api/auth';

const TOKEN_KEY = 'ap_token';
const USER_KEY  = 'ap_user';
const MAX_AGE   = 60 * 60 * 24 * 7; // 7 days

// ─── Write ────────────────────────────────────────────────────────────────────

export function setAuthCookies(accessToken: string, user: ApiUser): void {
  const base = `path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  // httpOnly can't be set from JS — token stored here is for client reads only.
  // The httpOnly version is set server-side in auth.actions.ts.
  document.cookie = `${TOKEN_KEY}=${accessToken}; ${base}${secure}`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; ${base}${secure}`;
}

export function clearAuthCookies(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0`;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getTokenCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find(r => r.startsWith(`${TOKEN_KEY}=`));
  return match ? match.split('=')[1] : null;
}

export function getUserCookie(): ApiUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find(r => r.startsWith(`${USER_KEY}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split('=')[1]));
  } catch {
    return null;
  }
}