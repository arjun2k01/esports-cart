// src/lib/axios.js
import axios from "axios";

/**
 * IMPORTANT:
 * Vercel ENV must be:
 * VITE_API_URL=https://esports-cart.onrender.com
 * (NO /api at the end)
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
