/** Django API base URL (no trailing slash). */
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

export const BACKEND_UNREACHABLE_MESSAGE =
  "Cannot reach the server. Start Django: cd restDjango/myproject && python manage.py runserver 127.0.0.1:8000";
