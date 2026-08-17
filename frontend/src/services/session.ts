import type { AuthSessionInfo } from "./types";

export const SESSION_EXPIRED_MESSAGE =
  "Your session expired. Please sign in again.";

const SESSION_STARTED_KEY = "session_started_at";
const LAST_ACTIVITY_KEY = "session_last_activity";
const IDLE_MS_KEY = "session_idle_ms";
const LIFETIME_MS_KEY = "session_lifetime_ms";

const DEFAULT_IDLE_MINUTES = 15;
const DEFAULT_LIFETIME_MINUTES = 480;
const ACTIVITY_THROTTLE_MS = 1000;

function minutesToMs(minutes: number | undefined, fallbackMinutes: number): number {
  if (typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0) {
    return minutes * 60 * 1000;
  }

  return fallbackMinutes * 60 * 1000;
}

function envMinutes(name: string, fallback: number): number {
  const value = Number(import.meta.env[name]);

  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function defaultSessionLimits(): { idleTimeoutMs: number; lifetimeMs: number } {
  return {
    idleTimeoutMs: minutesToMs(
      envMinutes("VITE_SESSION_IDLE_MINUTES", DEFAULT_IDLE_MINUTES),
      DEFAULT_IDLE_MINUTES,
    ),
    lifetimeMs: minutesToMs(
      envMinutes("VITE_SESSION_LIFETIME_MINUTES", DEFAULT_LIFETIME_MINUTES),
      DEFAULT_LIFETIME_MINUTES,
    ),
  };
}

function readTimestamp(key: string): number | null {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  const value = Number(raw);

  return Number.isFinite(value) && value > 0 ? value : null;
}

export function hasAuthSessionMeta(): boolean {
  return readTimestamp(SESSION_STARTED_KEY) !== null;
}

export function startAuthSession(session?: Partial<AuthSessionInfo>): void {
  const defaults = defaultSessionLimits();
  const now = Date.now();

  localStorage.setItem(SESSION_STARTED_KEY, String(now));
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  localStorage.setItem(
    IDLE_MS_KEY,
    String(minutesToMs(session?.idle_timeout_minutes, defaults.idleTimeoutMs / 60_000)),
  );
  localStorage.setItem(
    LIFETIME_MS_KEY,
    String(minutesToMs(session?.lifetime_minutes, defaults.lifetimeMs / 60_000)),
  );
}

export function touchAuthSession(): void {
  if (!hasAuthSessionMeta() || isAuthSessionExpired()) {
    return;
  }

  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function clearAuthSessionMeta(): void {
  localStorage.removeItem(SESSION_STARTED_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  localStorage.removeItem(IDLE_MS_KEY);
  localStorage.removeItem(LIFETIME_MS_KEY);
}

function sessionLimitsFromStorage(): { idleTimeoutMs: number; lifetimeMs: number } {
  const defaults = defaultSessionLimits();
  const idleTimeoutMs = readTimestamp(IDLE_MS_KEY) ?? defaults.idleTimeoutMs;
  const lifetimeMs = readTimestamp(LIFETIME_MS_KEY) ?? defaults.lifetimeMs;

  return { idleTimeoutMs, lifetimeMs };
}

export function isAuthSessionExpired(): boolean {
  const startedAt = readTimestamp(SESSION_STARTED_KEY);
  const lastActivityAt = readTimestamp(LAST_ACTIVITY_KEY);

  if (!startedAt || !lastActivityAt) {
    return false;
  }

  const { idleTimeoutMs, lifetimeMs } = sessionLimitsFromStorage();
  const now = Date.now();

  return now - startedAt >= lifetimeMs || now - lastActivityAt >= idleTimeoutMs;
}

export function msUntilAuthSessionExpiry(): number {
  const startedAt = readTimestamp(SESSION_STARTED_KEY);
  const lastActivityAt = readTimestamp(LAST_ACTIVITY_KEY);

  if (!startedAt || !lastActivityAt) {
    return Number.POSITIVE_INFINITY;
  }

  const { idleTimeoutMs, lifetimeMs } = sessionLimitsFromStorage();
  const now = Date.now();
  const remaining = Math.min(
    lifetimeMs - (now - startedAt),
    idleTimeoutMs - (now - lastActivityAt),
  );

  return Math.max(0, remaining);
}

export function subscribeToAuthSession(onExpired: () => void): () => void {
  if (isAuthSessionExpired()) {
    onExpired();
    return () => {};
  }

  let timerId: number | undefined;
  let lastTouchAt = 0;
  let stopped = false;

  const expireOnce = () => {
    if (stopped) {
      return;
    }

    stopped = true;
    onExpired();
  };

  const schedule = () => {
    if (stopped) {
      return;
    }

    if (timerId !== undefined) {
      window.clearTimeout(timerId);
    }

    const remaining = msUntilAuthSessionExpiry();

    if (!Number.isFinite(remaining) || remaining <= 0) {
      expireOnce();
      return;
    }

    timerId = window.setTimeout(expireOnce, remaining);
  };

  const onActivity = () => {
    if (stopped) {
      return;
    }

    if (isAuthSessionExpired()) {
      expireOnce();
      return;
    }

    const now = Date.now();

    if (now - lastTouchAt < ACTIVITY_THROTTLE_MS) {
      return;
    }

    lastTouchAt = now;
    touchAuthSession();
    schedule();
  };

  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      onActivity();
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (
      event.key !== LAST_ACTIVITY_KEY &&
      event.key !== SESSION_STARTED_KEY &&
      event.key !== IDLE_MS_KEY &&
      event.key !== LIFETIME_MS_KEY
    ) {
      return;
    }

    if (isAuthSessionExpired()) {
      expireOnce();
      return;
    }

    schedule();
  };

  const activityEvents: Array<keyof WindowEventMap> = [
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "click",
  ];

  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, onActivity, { passive: true });
  });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("storage", onStorage);

  schedule();

  return () => {
    stopped = true;

    if (timerId !== undefined) {
      window.clearTimeout(timerId);
    }

    activityEvents.forEach((eventName) => {
      window.removeEventListener(eventName, onActivity);
    });
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("storage", onStorage);
  };
}
