import React, { useState } from 'react';
import { 
  Shield, ShoppingBag, X, Search, User, LogOut, Package, Heart, UserPlus 
} from 'lucide-react';
import { useCart } from '../context/AppProviders';
import { useAuth } from '../context/AppProviders';

export const Header = ({ setPage, setSearchTerm }) => {
  const { cartItemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Products', page: 'products' },
    { name: 'About', page: 'about' },
  ];
  
  const handleLogout = () => {
    logout();
    setPage('home');
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setPage('home')}>
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white hidden sm:block">EsportsCart</span>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for gear..."
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setPage('products')}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => setPage(link.page)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setPage('wishlist')}
                  title="My Wishlist"
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </button>
                 <button
                  onClick={() => setPage('orders')}
                  title="My Orders"
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Package className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-1">
                <button
                  onClick={() => setPage('login')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5 mr-1" />
                  Login
                </button>
                 <button
                  onClick={() => setPage('signup')}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={() => setPage('cart')}
              className="relative ml-2 p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            <div className="ml-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search for gear..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setPage('products')}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { setPage(link.page); setIsMobileMenuOpen(false); }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {link.name}
            </button>
          ))}
          
          <div className="border-t border-gray-700 pt-3 mt-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setPage('wishlist'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  My Wishlist
                </button>
                <button
                  onClick={() => { setPage('orders'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Package className="h-5 w-5 mr-2" />
                  My Orders
                </button>
                 <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setPage('login'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <User className="h-5 w-5 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => { setPage('signup'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};