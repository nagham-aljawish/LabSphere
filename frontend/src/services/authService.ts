import api, { ApiError, clearAuthStorage, setToken } from "./api";
import {
  AlreadyAuthenticatedError,
  ensureNoActiveSessionBeforeAuth,
} from "./authSession";
import { startAuthSession } from "./session";
import type { AuthResponse, User, UserRole } from "./types";

export interface LoginPayload {
  email: string;
  password: string;
  expected_role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  address?: string;
}

export interface RegisterStaffPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  role: "doctor" | "technician" | "reception";
}

function applyAuthResponse(data: AuthResponse): AuthResponse {
  if (!data?.token?.trim() || !data?.user) {
    setToken(null);
    throw new ApiError(
      "Authentication failed: server did not return a valid token.",
      500,
    );
  }

  setToken(data.token);
  startAuthSession(data.session);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await ensureNoActiveSessionBeforeAuth();

  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return applyAuthResponse(data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "ALREADY_AUTHENTICATED") {
      throw new AlreadyAuthenticatedError(error.message);
    }

    throw error;
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  await ensureNoActiveSessionBeforeAuth();

  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return applyAuthResponse(data);
  } catch (error) {
    if (error instanceof ApiError && error.code === "ALREADY_AUTHENTICATED") {
      throw new AlreadyAuthenticatedError(error.message);
    }

    throw error;
  }
}

export async function registerStaff(
  payload: RegisterStaffPayload,
): Promise<{ message: string }> {
  await ensureNoActiveSessionBeforeAuth();

  try {
    await api.post<{ user: User }>("/auth/register-staff", payload);

    return { message: "Registration request submitted for admin approval" };
  } catch (error) {
    if (error instanceof ApiError && error.code === "ALREADY_AUTHENTICATED") {
      throw new AlreadyAuthenticatedError(error.message);
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout", null, { skipAuthRedirect: true });
  } finally {
    clearAuthStorage();
  }
}

export async function getMe(options?: {
  skipAuthRedirect?: boolean;
}): Promise<User> {
  const { data } = await api.get<User>("/auth/me", {
    skipAuthRedirect: options?.skipAuthRedirect,
  });

  return data;
}

export {
  AlreadyAuthenticatedError,
  ensureNoActiveSessionBeforeAuth,
  getAuthErrorMessage,
  isAlreadyAuthenticatedError,
  ALREADY_AUTHENTICATED_MESSAGE,
} from "./authSession";
