// frontend/src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login", { replace: true });
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const activeClass =
    "text-black dark:text-white font-semibold underline underline-offset-8";
  const idleClass = "text-gray-700 dark:text-gray-200 hover:opacity-80";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
            E
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-gray-900 dark:text-gray-50">
              Esports Cart
            </div>
            <div className="text-xs opacity-70">Premium gaming store</div>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? activeClass : idleClass)}>
            Home
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? activeClass : idleClass)}>
            Cart
          </NavLink>

          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? activeClass : idleClass)}
            >
              Profile
            </NavLink>
          )}

          {/* Admin links */}
          {user && isAdmin && (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
              <NavLink
                to="/admin/products"
                className={({ isActive }) => (isActive ? activeClass : idleClass)}
              >
                Admin Products
              </NavLink>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => (isActive ? activeClass : idleClass)}
              >
                Admin Orders
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? activeClass : idleClass)}
              >
                Admin Users
              </NavLink>
            </div>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800">
                <span className="opacity-70">Hi,</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <Link className="hover:opacity-80" to="/">
            Home
          </Link>
          <Link className="hover:opacity-80" to="/cart">
            Cart
          </Link>
          {user ? (
            <>
              <Link className="hover:opacity-80" to="/profile">
                Profile
              </Link>
              {isAdmin && (
                <Link className="hover:opacity-80" to="/admin/products">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link className="hover:opacity-80" to="/login">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
