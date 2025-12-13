// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { warmupCsrf } from "../lib/axios";
import { setUnauthorizedHandler } from "../lib/apiGuards";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const isAdmin = !!user?.isAdmin;

  const clearAuth = (opts = {}) => {
    setUser(null);
    setAuthError("");
    if (opts.redirect) {
      toast.error(opts.message || "Session expired. Please sign in again.");
      navigate("/login", { replace: true });
    }
  };

  const refreshMe = async () => {
    try {
      setAuthError("");
      const res = await api.get("/api/users/profile");
      setUser(res?.data?.user || null);
      return res?.data?.user || null;
    } catch (err) {
      if (err?.response?.status === 401) {
        clearAuth();
        return null;
      }
      setAuthError(err?.response?.data?.message || "Failed to load session");
      return null;
    }
  };

  const login = async ({ email, password }) => {
    setAuthError("");
    const res = await api.post("/api/users/login", { email, password });
    setUser(res?.data?.user || null);
    return res?.data;
  };

  const register = async ({ name, email, password }) => {
    setAuthError("");
    const res = await api.post("/api/users", { name, email, password });
    setUser(res?.data?.user || null);
    return res?.data;
  };

  const logout = async () => {
    setAuthError("");
    try {
      await api.post("/api/users/logout");
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    // Bind global 401 handler ONCE
    setUnauthorizedHandler(({ message }) => {
      clearAuth({ redirect: true, message });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await warmupCsrf();
        await refreshMe();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      authError,
      setAuthError,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, isAdmin, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
