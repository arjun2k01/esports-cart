import React, { useState, useContext, createContext, useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { ToastContainer } from '../components/ToastContainer';

// --- AUTH CONTEXT ---
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 

  const login = (email, password) => {
    console.log('Logging in with', email, password);
    setIsAuthenticated(true);
    setUser({ name: email.split('@')[0] || 'ProGamer123', email });
    return true; // Mock success
  };
  
  const signup = (name, email, password) => {
    console.log('Signing up with', name, email, password);
    setIsAuthenticated(true);
    setUser({ name, email });
    return true; // Mock success
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

// --- TOAST CONTEXT ---
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);

// --- CART CONTEXT ---
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = usePersistentState('esportsCart', []);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);

// --- WISHLIST CONTEXT ---
const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = usePersistentState('esportsWishlist', []);
  
  const addToWishlist = (product) => {
    setWishlist(prev => [...prev, product]);
  };
  
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };
  
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };
  
  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
export const useWishlist = () => useContext(WishlistContext);

// --- ORDER CONTEXT ---
const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = usePersistentState('esportsOrders', []);
  
  const addOrder = (cart, total) => {
    const newOrder = {
      id: `ES-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total,
    };
    setOrders(prev => [newOrder, ...prev]);
  };
  
  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
export const useOrders = () => useContext(OrderContext);

// --- REVIEW CONTEXT ---
const ReviewContext = createContext();

const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = usePersistentState('esportsReviews', {});

  const addReview = (productId, review) => {
    const newReview = { ...review, id: Date.now(), date: new Date().toISOString() };
    setReviews(prev => {
      const productReviews = prev[productId] || [];
      return { ...prev, [productId]: [newReview, ...productReviews] };
    });
  };
  
  const getReviewsForProduct = (productId) => {
    return reviews[productId] || [];
  };
  
  return (
    <ReviewContext.Provider value={{ addReview, getReviewsForProduct }}>
      {children}
    </ReviewContext.Provider>
  );
};
export const useReviews = () => useContext(ReviewContext);

// --- MAIN APP PROVIDER ---
// This component bundles all providers for clean wrapping in App.jsx
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ReviewProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ReviewProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};