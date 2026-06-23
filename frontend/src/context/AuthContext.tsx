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

  useEffect(() => {
    const token = getToken();

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (payload: LoginPayload, expectedRole?: UserRole) => {
      const { user: loggedInUser } = await loginRequest(payload);

      if (expectedRole && loggedInUser.role !== expectedRole) {
        await logoutRequest();
        setUser(null);
        throw new Error("Selected role does not match your account.");
      }

      setUser(loggedInUser);
      return loggedInUser;
    },
    [],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: registeredUser } = await registerRequest(payload);
    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
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
