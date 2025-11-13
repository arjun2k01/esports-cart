// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://esports-cart.onrender.com/api", // 🔥 correct backend URL
  withCredentials: true, // required for cookies
});

// Auto-handle 401
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
