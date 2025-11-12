import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { ToastContainer } from '../components/ToastContainer';
import axios from 'axios'; // Import axios

// --- AUTH CONTEXT ---
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

export const ToastProvider = ({ children }) => {
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

export const CartProvider = ({ children }) => {
  const [cart, setCart] = usePersistentState('esportsCart', []);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Use product._id if it exists (from MongoDB), otherwise fallback to id
      const productId = product._id || product.id;
      const existingItem = prevCart.find(item => (item._id || item.id) === productId);
      
      if (existingItem) {
        return prevCart.map(item =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
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

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = usePersistentState('esportsWishlist', []);
  
  const addToWishlist = (product) => {
     setWishlist(prev => {
      const productId = product._id || product.id;
      if (prev.some(item => (item._id || item.id) === productId)) {
        return prev; // Already in wishlist
      }
      return [...prev, product];
    });
  };
  
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
  };
  
  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
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

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = usePersistentState('esportsOrders', []); // <-- FIX was here
  
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

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = usePersistentState('esportsReviews', {});

  const addReview = (productId, review) => {
    const newReview = { ...review, id: Date.now(), date: new Date().toISOString() };
    const id = productId._id || productId;
    setReviews(prev => {
      const productReviews = prev[id] || [];
      return { ...prev, [id]: [newReview, ...productReviews] };
    });
  };
  
  const getReviewsForProduct = (productId) => {
    // Ensure product._id is used if available
    const id = productId._id || productId;
    return reviews[id] || [];
  };
  
  return (
    <ReviewContext.Provider value={{ addReview, getReviewsForProduct }}>
      {children}
    </ReviewContext.Provider>
  );
};
export const useReviews = () => useContext(ReviewContext);

// --- NEW: PRODUCT CONTEXT ---
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // THIS IS THE CONNECTION:
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please ensure the backend server is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Runs once on app load

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
export const useProducts = () => useContext(ProductContext);

// --- MAIN APP PROVIDER ---
// This component bundles all providers for clean wrapping in App.jsx
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
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
      </ProductProvider>
    </AuthProvider>
  );
};