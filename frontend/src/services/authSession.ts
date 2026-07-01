import api, { ApiError, clearAuthStorage, getToken } from "./api";
import type { User } from "./types";

export class AlreadyAuthenticatedError extends Error {
  constructor(
    message = "أنت مسجل دخول حاليًا بحساب آخر. يرجى تسجيل الخروج أولًا.",
  ) {
    super(message);
    this.name = "AlreadyAuthenticatedError";
  }
}

export const ALREADY_AUTHENTICATED_MESSAGE =
  "أنت مسجل دخول حاليًا بحساب آخر. يرجى تسجيل الخروج أولًا.";

export function isAlreadyAuthenticatedError(error: unknown): boolean {
  if (error instanceof AlreadyAuthenticatedError) {
    return true;
  }

  if (error instanceof ApiError) {
    return (
      error.status === 409 && error.code === "ALREADY_AUTHENTICATED"
    );
  }

  return false;
}

export function getAuthErrorMessage(error: unknown): string {
  if (isAlreadyAuthenticatedError(error)) {
    return ALREADY_AUTHENTICATED_MESSAGE;
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

async function probeCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me", {
    skipAuthRedirect: true,
  });

  return data;
}

/**
 * Block login/register when a valid token already exists.
 * Clears invalid/expired tokens so auth can proceed.
 */
export async function ensureNoActiveSessionBeforeAuth(): Promise<void> {
  const token = getToken();

  if (!token) {
    return;
  }

  try {
    await probeCurrentUser();
    throw new AlreadyAuthenticatedError();
  } catch (error) {
    if (error instanceof AlreadyAuthenticatedError) {
      throw error;
    }

    if (error instanceof ApiError && error.status === 401) {
      clearAuthStorage();
      return;
    }

    throw error;
  }
}
