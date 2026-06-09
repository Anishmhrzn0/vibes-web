'use client';

import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

function readUserCookie(): AuthUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find(r => r.startsWith('ap_user='));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split('=')[1]));
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readUserCookie());
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}