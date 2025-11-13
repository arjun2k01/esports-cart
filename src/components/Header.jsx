// src/components/Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart, Heart, User, Gamepad2 } from "lucide-react";
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
    <nav className="bg-gaming-dark border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-gaming-gold to-gaming-orange rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Gamepad2 size={28} className="text-black" />
          </div>
          <span className="font-display text-2xl font-black text-gaming-gold uppercase tracking-wider hidden sm:block">
            E-Sports Cart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-bold uppercase tracking-wide transition relative text-sm ${
                  isActive ? "text-gaming-gold" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gaming-gold"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative group">
              <Heart size={24} className="text-gray-400 group-hover:text-gaming-gold transition" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gaming-gold text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart size={24} className="text-gray-400 group-hover:text-gaming-gold transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gaming-orange text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="group relative cursor-pointer">
                <User size={24} className="text-gaming-gold" />
                <div className="absolute right-0 hidden group-hover:block bg-surface-dark border border-gray-700 rounded-lg p-3 mt-2 w-40 shadow-xl">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 hover:bg-gaming-darker rounded text-gray-300 hover:text-gaming-gold transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 hover:bg-gaming-darker rounded text-gray-300 hover:text-gaming-gold transition"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-gaming-darker rounded text-out-red font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-gaming-gold text-sm font-bold uppercase transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gaming-orange text-black px-5 py-2 rounded-lg hover:bg-gaming-gold font-bold uppercase text-sm transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gaming-gold" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gaming-darker px-6 py-4 space-y-4 border-t border-gray-800">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block text-lg text-gray-400 hover:text-gaming-gold font-bold uppercase"
            >
              {item.label}
            </NavLink>
          ))}

          {/* Mobile Icons */}
          <div className="flex items-center gap-6 py-4 border-t border-gray-800">
            <Link to="/wishlist" onClick={() => setOpen(false)} className="relative">
              <Heart size={22} className="text-gray-400" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gaming-gold text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="relative">
              <ShoppingCart size={22} className="text-gray-400" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gaming-orange text-black text-xs px-1.5 py-0.5 rounded-full font-bold">
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
                className="block text-gray-400 hover:text-gaming-gold text-lg font-bold"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="block text-gray-400 hover:text-gaming-gold text-lg font-bold"
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-out-red text-lg font-bold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-gray-400 hover:text-gaming-gold text-lg font-bold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block bg-gaming-orange text-black px-5 py-3 rounded-lg text-center font-bold uppercase"
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
