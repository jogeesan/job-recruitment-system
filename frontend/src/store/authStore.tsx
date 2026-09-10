"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse, AuthUser } from "@/types/auth";
import { getMeApi, logoutApi } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMeApi()
      .then((authData) => setUser(toAuthUser(authData)))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    (authData: AuthResponse) => {
      const nextUser = toAuthUser(authData);
      setUser(nextUser);
      router.push(getRolePath(nextUser.role));
    },
    [router],
  );

  const logout = useCallback(() => {
    logoutApi()
      .catch(() => undefined)
      .finally(() => {
        setUser(null);
        router.push("/login");
      });
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function toAuthUser(authData: AuthResponse): AuthUser {
  return {
    userId: authData.userId,
    email: authData.email,
    firstName: authData.firstName,
    lastName: authData.lastName,
    role: authData.role as AuthUser["role"],
    status: authData.status,
  };
}

function getRolePath(role: AuthUser["role"]): string {
  if (role === "ADMIN") return "/admin";
  if (role === "HR") return "/company";
  return "/job-seeker";
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
