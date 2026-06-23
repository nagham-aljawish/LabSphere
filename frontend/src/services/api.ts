import axios, { AxiosError, type AxiosResponse } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "token";

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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


console.log("API URL:", import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

    if (!body.success) {
      throw new ApiError(
        body.message || "Request failed",
        response.status,
        body.errors,
      );
    }

    response.data = body.data;
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status ?? 500;
    const body = error.response?.data;

    throw new ApiError(
      body?.message || error.message || "Request failed",
      status,
      body?.errors,
    );
  },
);

export default api;
