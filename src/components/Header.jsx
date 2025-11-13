// src/components/Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart, useWishlist } from "../context/AppProviders";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/cart", label: "Cart" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          E-Sports Cart
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-lg ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                } hover:text-blue-600`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Heart size={22} className="text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} className="text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="group relative cursor-pointer">
                <User size={24} className="text-gray-700" />

                <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-lg p-3 mt-2 w-40">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 text-lg"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-6 py-4 space-y-4 shadow-inner">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block text-lg text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </NavLink>
          ))}

          {/* Mobile Icons */}
          <div className="flex items-center gap-6 py-2">
            <Link to="/wishlist" onClick={() => setOpen(false)} className="relative">
              <Heart size={22} className="text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" onClick={() => setOpen(false)} className="relative">
              <ShoppingCart size={22} className="text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile User Auth */}
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600 text-lg"
              >
                Profile
              </Link>

              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600 text-lg"
              >
                My Orders
              </Link>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-red-600 text-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600 text-lg"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
