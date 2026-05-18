/** Production Django API on Render (used when not on localhost). */
export const PRODUCTION_API_URL =
  "https://restaurant-management-system-9p47.onrender.com";

const LOCAL_API_URL = "http://127.0.0.1:8000";

function resolveApiUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  // When deployed without VITE_API_URL, use Render instead of localhost
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return PRODUCTION_API_URL;
    }
  }

  return LOCAL_API_URL;
}

/** Django API base URL (no trailing slash). Resolved at runtime on each page load. */
export const API_URL = resolveApiUrl();

export const BACKEND_UNREACHABLE_MESSAGE =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "Cannot reach the API server. Check that the Render backend is running."
    : "Cannot reach the server. Start Django: cd restDjango/myproject && python manage.py runserver 127.0.0.1:8000";
