// src/pages/SignupPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const from = useMemo(() => {
    const st = location.state;
    return st?.from || "/";
  }, [location.state]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      // ✅ Create user (backend usually sets cookie after register or returns user)
      // If your backend uses different route, keep it consistent with userRoutes.
      await api.post("/api/users", {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      // Optional: some backends do not auto-login after signup.
      // If yours does not, you can redirect to /login with a toast.
      await refreshUser?.();

      toast.success("Account created");
      navigate(from, { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm opacity-70">Join and gear up. COD supported.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm opacity-80">Full name</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="Your name"
              autoComplete="name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
            />
            {errors.name ? (
              <p className="text-sm mt-1 text-red-300">{errors.name.message}</p>
            ) : null}
          </div>

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
              placeholder="Min 6 characters"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password ? (
              <p className="text-sm mt-1 text-red-300">{errors.password.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-sm opacity-80">Confirm password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="Repeat password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword ? (
              <p className="text-sm mt-1 text-red-300">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <button
            disabled={loading}
            className="w-full mt-2 px-4 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm opacity-80">
          Already have an account?{" "}
          <Link className="underline" to="/login" state={{ from }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
