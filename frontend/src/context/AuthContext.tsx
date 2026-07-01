/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  getToken,
  clearAuthStorage,
  type LoginPayload,
  type RegisterPayload,
} from "../services";
import type { User, UserRole } from "../services/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload, expectedRole?: UserRole) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  clearSession: () => void;
  refreshSession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const roleToApi: Record<string, UserRole> = {
  Admin: "admin",
  Doctor: "doctor",
  Technician: "technician",
  Reception: "reception",
  Patient: "patient",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearAuthStorage();
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const me = await getMe({ skipAuthRedirect: true });
      setUser(me);
      return me;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    void refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const login = useCallback(async (payload: LoginPayload, expectedRole?: UserRole) => {
    const { user: loggedInUser, token } = await loginRequest({
      ...payload,
      expected_role: expectedRole,
    });

    if (!token || !getToken()) {
      clearSession();
      throw new Error("Login failed: token was not saved.");
    }

    setUser(loggedInUser);
    return loggedInUser;
  }, [clearSession]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: registeredUser, token } = await registerRequest(payload);

    if (!token || !getToken()) {
      clearSession();
      throw new Error("Registration failed: token was not saved.");
    }

    setUser(registeredUser);
    return registeredUser;
  }, [clearSession]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user && !!getToken(),
      login,
      register,
      logout,
      clearSession,
      refreshSession,
    }),
    [user, loading, login, register, logout, clearSession, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
