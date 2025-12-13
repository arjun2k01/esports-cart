// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";

/**
 * Cookie-session auth (HttpOnly cookie).
 * Assumes backend routes (typical):
 * - POST   /api/users/auth      (login)
 * - POST   /api/users/logout    (logout)
 * - GET    /api/users/profile   (current user)
 *
 * If your backend uses slightly different paths, keep them consistent across the app.
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;

  const refreshUser = async ({ silent = true } = {}) => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data || null);
      return res.data || null;
    } catch (e) {
      // If cookie invalid/expired, backend typically returns 401
      if (e?.response?.status === 401) {
        setUser(null);
        if (!silent) toast.error("Session expired. Please login again.");
      } else if (!silent) {
        toast.error(e?.response?.data?.message || "Failed to refresh session");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/users/logout");
    } catch {
      // even if logout API fails, clear local state
    } finally {
      setUser(null);
    }
  };

  // Initial session check on app boot
  useEffect(() => {
    refreshUser({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isAdmin,
      setUser,
      refreshUser,
      logout,
    }),
    [user, loading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
