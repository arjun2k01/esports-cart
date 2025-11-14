// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart, useWishlist } from '../context/AppProviders';
import { ShoppingCart, Heart, User, Menu, X, LogOut, Package, Search, Gamepad2 } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, cartItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'HOME' },
    { to: '/products', label: 'PRODUCTS' },
    { to: '/about', label: 'ABOUT' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">E-SPORTS</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"> CART</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Button */}
            <Link
              to="/products"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-all">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors rounded-t-xl"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-neutral-800 transition-colors rounded-b-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2 text-sm font-semibold text-white hover:text-orange-500 transition-colors"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800">
          <div className="px-4 py-6 space-y-4">
            
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Search */}
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
              SEARCH
            </Link>

            {/* Mobile Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5" />
                WISHLIST
              </div>
              {wishlist.length > 0 && (
                <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                CART
              </div>
              {cartItemsCount > 0 && (
                <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <div className="border-t border-neutral-800 pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <User className="w-5 h-5" />
                    PROFILE
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    ORDERS
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-semibold text-red-500 hover:bg-neutral-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-xl text-sm font-semibold text-center text-white hover:bg-neutral-800 transition-colors mb-2"
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all text-center shadow-lg shadow-orange-500/20"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
