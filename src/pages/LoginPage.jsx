// src/pages/LoginPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const from = useMemo(() => {
    // ProtectedRoute passes { from: "/somewhere" }
    const st = location.state;
    return st?.from || "/";
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  useEffect(() => {
    // small UX: if user already exists, prefilling email helps
    if (user?.email) setValue("email", user.email);
  }, [user, setValue]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      // ✅ Cookie-auth login (backend should set HttpOnly cookie)
      await api.post("/api/users/auth", {
        email: values.email.trim(),
        password: values.password,
      });

      // ✅ Refresh auth context state (recommended)
      await refreshUser?.();

      toast.success("Logged in");
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm opacity-70">Welcome back. Continue your grind.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm opacity-80">Email</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email ? (
              <p className="text-sm mt-1 text-red-300">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm opacity-80">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password ? (
              <p className="text-sm mt-1 text-red-300">{errors.password.message}</p>
            ) : null}
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 px-4 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm opacity-80">
          Don’t have an account?{" "}
          <Link className="underline" to="/register" state={{ from }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
