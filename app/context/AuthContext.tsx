"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { whoamiApi } from "@/app/lib/api/auth";

export interface User {
  role: "user" | "admin";
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User) => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    whoamiApi()
      .then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        // token invalid/expired/missing — not logged in
        setUser(null);
        document.cookie = "ap_user=; path=/; max-age=0";
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    document.cookie = "ap_token=; path=/; max-age=0";
    document.cookie = "ap_user=; path=/; max-age=0";
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};