// src/components/Header.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, User, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/AppProviders";

const WISHLIST_KEY = "esports_wishlist_v1";

const getWishlistCount = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(getWishlistCount());

  // Keep wishlist badge live (also updates across tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === WISHLIST_KEY) setWishlistCount(getWishlistCount());
    };
    window.addEventListener("storage", onStorage);

    // also update on focus (same tab changes)
    const onFocus = () => setWishlistCount(getWishlistCount());
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const navItemClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-semibold transition 
     ${isActive ? "bg-white/10" : "hover:bg-white/5"}`;

  const closeMenu = () => setMenuOpen(false);

  const onLogout = async () => {
    try {
      await logout?.();
      toast.success("Logged out");
      navigate("/", { replace: true });
    } catch (e) {
      toast.error("Logout failed");
    }
  };

  const badge = (n) =>
    n > 0 ? (
      <span className="ml-1 inline-flex items-center justify-center text-[11px] min-w-[18px] h-[18px] px-1 rounded-full bg-white/15 border border-white/10">
        {n}
      </span>
    ) : null;

  const adminLinks = useMemo(
    () =>
      isAdmin
        ? [
            { to: "/admin/products", label: "Admin Products" },
            { to: "/admin/orders", label: "Admin Orders" },
            { to: "/admin/users", label: "Admin Users" },
          ]
        : [],
    [isAdmin]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070A1A]/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-wide">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            ⚡
          </span>
          <span className="text-base">EsportsCart</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink className={navItemClass} to="/products">
            Products
          </NavLink>
          <NavLink className={navItemClass} to="/about">
            About
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink className={navItemClass} to="/orders">
                Orders
              </NavLink>
              <NavLink className={navItemClass} to="/profile">
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className={navItemClass} to="/login">
                Login
              </NavLink>
              <NavLink className={navItemClass} to="/register">
                Register
              </NavLink>
            </>
          )}

          {isAdmin ? (
            <div className="ml-2 flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1">
              <Shield className="w-4 h-4 opacity-80" />
              <NavLink className={navItemClass} to="/admin/products">
                Admin
              </NavLink>
            </div>
          ) : null}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/wishlist")}
            className="relative inline-flex items-center gap-1 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-semibold">Wishlist</span>
            {badge(wishlistCount)}
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="relative inline-flex items-center gap-1 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-semibold">Cart</span>
            {badge(cartCount)}
          </button>

          {/* User quick */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="text-sm opacity-80 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="max-w-[140px] truncate">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen ? (
        <div className="md:hidden border-t border-white/10 bg-[#070A1A]/95">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            <NavLink onClick={closeMenu} className={navItemClass} to="/products">
              Products
            </NavLink>
            <NavLink onClick={closeMenu} className={navItemClass} to="/about">
              About
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink onClick={closeMenu} className={navItemClass} to="/orders">
                  Orders
                </NavLink>
                <NavLink onClick={closeMenu} className={navItemClass} to="/profile">
                  Profile
                </NavLink>

                {isAdmin ? (
                  <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2">
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                      <Shield className="w-4 h-4" /> Admin
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {adminLinks.map((l) => (
                        <NavLink key={l.to} onClick={closeMenu} className={navItemClass} to={l.to}>
                          {l.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink onClick={closeMenu} className={navItemClass} to="/login">
                  Login
                </NavLink>
                <NavLink onClick={closeMenu} className={navItemClass} to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
