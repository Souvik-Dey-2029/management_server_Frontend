"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type Authority = "superadmin" | "admin" | "member" | "nonmember";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  authority: Authority;
  domain: string | null;
  avatarUrl?: string | null;
}

const RANK: Record<Authority, number> = { nonmember: 0, member: 1, admin: 2, superadmin: 3 };
export function atLeast(a: Authority | undefined, required: Authority): boolean {
  if (!a) return false;
  return RANK[a] >= RANK[required];
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, domain?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// TODO: Connect Backend API
// This is a frontend-only build: there is no auth backend to call. A fixed demo user
// (with the highest authority level) is used so every page/route in the app is reachable
// for the frontend team. The backend team should replace this provider with one backed
// by real session/auth endpoints, keeping the same context shape (useAuth / atLeast) so
// none of the pages below need to change.
const DEMO_USER: CurrentUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@gdghit.dev",
  authority: "superadmin",
  domain: null,
  avatarUrl: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(DEMO_USER);
  const loading = false;

  const refresh = useCallback(async () => {
    // TODO: Connect Backend API
    console.log("Backend integration pending: refresh current user");
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // TODO: Connect Backend API
    console.log("Backend integration pending: login", { email, password });
    setUser(DEMO_USER);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, domain?: string) => {
    // TODO: Connect Backend API
    console.log("Backend integration pending: register", { name, email, password, domain });
    setUser(DEMO_USER);
  }, []);

  const logout = useCallback(async () => {
    // TODO: Connect Backend API
    console.log("Backend integration pending: logout");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
