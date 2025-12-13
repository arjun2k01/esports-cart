// src/lib/axios.js
import axios from "axios";

/**
 * Single API client used everywhere.
 * Cookie auth enabled via withCredentials.
 *
 * In Vercel:
 * - set VITE_API_URL to your backend domain (Render)
 *   e.g. https://your-backend.onrender.com
 *
 * If VITE_API_URL is not set, baseURL = "" (same-origin).
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add any global response handling here (keep minimal)
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;
