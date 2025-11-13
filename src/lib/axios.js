// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // IMPORTANT: sends cookies to backend
});

// Optional: Auto-handle 401 errors
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      console.warn("Unauthorized: redirecting to login...");
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
