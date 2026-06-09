'use client';

import { ApiUser } from '@/app/lib/api/auth';
import { useEffect, useState } from 'react';


function readUserCookie(): ApiUser | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('ap_user='));

  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match.split('=')[1]));
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readUserCookie());
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
