// src/components/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

/**
 * Enterprise clean behavior:
 * - While auth is loading: render nothing (or a tiny loader)
 * - If unauthenticated: redirect to /login and preserve "from"
 * - Avoid toast spam using location.state flag
 */

export default function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Optional: show one-time message if redirected due to session expiry
    if (location.state?.reason === "session_expired") {
      toast.error("Session expired. Please login again.");
      // Prevent repeated toast on re-render
      // (react-router state can't be mutated here; it will naturally clear on next nav)
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-sm opacity-70">Checking session…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search, reason: "session_expired" }}
      />
    );
  }

  return <Outlet />;
}
