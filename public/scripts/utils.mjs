export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function generateId(prefix) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readStorageJSON(key, fallback = null) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key} from storage.`, error);
    return fallback;
  }
}

export function writeStorageJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to persist ${key} to storage.`, error);
  }
}

export function throttle(callback, waitMs) {
  let lastInvocation = 0;
  let trailingTimeout = null;
  let trailingArgs = null;

  return (...args) => {
    const now = Date.now();
    const remaining = waitMs - (now - lastInvocation);

    trailingArgs = args;

    if (remaining <= 0) {
      lastInvocation = now;
      callback(...args);
      return;
    }

    if (!trailingTimeout) {
      trailingTimeout = window.setTimeout(() => {
        lastInvocation = Date.now();
        trailingTimeout = null;
        callback(...trailingArgs);
      }, remaining);
    }
  };
}

export function isFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = typeof value === "number" ? new Date(value) : value.toDate ? value.toDate() : new Date(value);

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatRelativeTime(value) {
  if (!value) {
    return "just now";
  }

  const timestamp =
    typeof value === "number" ? value : value.toDate ? value.toDate().getTime() : new Date(value).getTime();
  const diffMs = timestamp - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
