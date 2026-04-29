"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authService, type AuthUser } from "@/services/authService";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLoginStep2: (tempToken: string, faceImage: string) => Promise<void>;
  signup: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  googleLogin: (supabaseToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    const storedToken = authService.getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setToken(result.token);
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const result = await authService.adminLogin(email, password);
    setUser(result.user);
    setToken(result.token);
  }, []);

  const adminLoginStep2 = useCallback(async (tempToken: string, faceImage: string) => {
    const result = await authService.adminLoginStep2(tempToken, faceImage);
    setUser(result.user);
    setToken(result.token);
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; phone?: string; password: string }) => {
    const result = await authService.signup(data);
    setUser(result.user);
    setToken(result.token);
  }, []);

  const googleLogin = useCallback(async (supabaseToken: string) => {
    // We need to implement this in authService first, but for now we'll do it manually or call a new authService method
    const result = await authService.googleLogin(supabaseToken);
    setUser(result.user);
    setToken(result.token);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
        isLoading,
        login,
        adminLogin,
        adminLoginStep2,
        signup,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
