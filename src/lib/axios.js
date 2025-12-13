// frontend/src/lib/axios.js
import axios from "axios";
import { triggerUnauthorized } from "./apiGuards";

/**
 * Cookie-only auth + CSRF
 * No Authorization headers, no localStorage tokens.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- CSRF ----------------
let csrfToken = null;
let csrfPromise = null;

async function fetchCsrfToken() {
  if (csrfPromise) return csrfPromise;

  csrfPromise = api
    .get("/api/auth/csrf-token")
    .then((res) => {
      csrfToken = res?.data?.csrfToken || null;
      return csrfToken;
    })
    .catch(() => {
      csrfToken = null;
      return null;
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

function isWriteMethod(method) {
  return ["post", "put", "patch", "delete"].includes(
    String(method || "").toLowerCase()
  );
}

// ---------------- REQUEST ----------------
api.interceptors.request.use(
  async (config) => {
    // Ensure no bearer tokens sneak in
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    if (isWriteMethod(config.method)) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE ----------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    // 401 = session expired / invalid cookie
    if (status === 401) {
      triggerUnauthorized({
        message: error?.response?.data?.message || "Session expired",
      });
      return Promise.reject(error);
    }

    // CSRF invalid → refresh token once and retry
    const isCsrf403 =
      status === 403 &&
      typeof error?.response?.data?.message === "string" &&
      error.response.data.message.toLowerCase().includes("csrf");

    if (isCsrf403 && original && !original.__csrfRetry) {
      original.__csrfRetry = true;
      csrfToken = null;
      await fetchCsrfToken();
      if (csrfToken) {
        original.headers = original.headers || {};
        original.headers["X-CSRF-Token"] = csrfToken;
      }
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;

// Optional warm-up
export async function warmupCsrf() {
  return fetchCsrfToken();
}
