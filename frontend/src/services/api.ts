import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { clearAuthSessionMeta, touchAuthSession } from "./session";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface ApiErrorBody {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
    code?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

const TOKEN_KEY = "token";

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  clearAuthSessionMeta();
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    touchAuthSession();
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === "blob") {
      return response;
    }

    const body = response.data as ApiResponse<unknown>;

    if (body && typeof body === "object" && "success" in body && !body.success) {
      throw new ApiError(
        body.message || "Request failed",
        response.status,
        body.errors ?? undefined,
      );
    }

    if (body && typeof body === "object" && "success" in body && body.success) {
      response.data = body.data;
    }

    return response;
  },
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status ?? 500;
    const body = error.response?.data;
    const skipAuthRedirect = (
      error.config as InternalAxiosRequestConfig & {
        skipAuthRedirect?: boolean;
      }
    )?.skipAuthRedirect;

    if (status === 401) {
      const hadToken = Boolean(getToken());
      clearAuthStorage();

      if (hadToken && !skipAuthRedirect) {
        unauthorizedHandler?.();
      }
    }

    throw new ApiError(
      body?.message || error.message || "Request failed",
      status,
      body?.errors,
      body?.code,
    );
  },
);

export default api;

export type ApiRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}
