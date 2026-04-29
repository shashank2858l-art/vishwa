import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/* ── Token injection ────────────────────────────── */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vishwas_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ── Response unwrap + error handling ───────────── */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Only auto-logout on genuine 401 from the server (not login/signup endpoints)
      if (status === 401 && typeof window !== "undefined") {
        const url = error.config?.url || "";
        const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/signup") || url.includes("/auth/admin-login");
        // Don't clear auth on login/signup attempts — let the form show the error
        if (!isAuthEndpoint) {
          localStorage.removeItem("vishwas_token");
          localStorage.removeItem("vishwas_user");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
        }
      }

      const message = data?.message || `Request failed (${status})`;
      return Promise.reject(new Error(message));
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    // Network error (backend not running) — do NOT clear auth
    return Promise.reject(new Error("Network error. Please check your connection."));
  }
);

/* ── Type helpers ───────────────────────────────── */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default api;
