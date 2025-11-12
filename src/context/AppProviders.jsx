import React, { useState, useContext, createContext, useMemo, useEffect } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { ToastContainer } from '../components/ToastContainer';
import axios from 'axios';

// --- AUTH CONTEXT ---
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = usePersistentState('esportsUser', null);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };
  
  const signup = async (name, email, password) => {
     try {
      const { data } = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);

// --- PRODUCT CONTEXT ---
const ProductContext = createContext();
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Could not load products. Is backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
export const useProducts = () => useContext(ProductContext);

// --- TOAST CONTEXT ---
const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);

// --- CART CONTEXT (UPDATED FOR BACKEND) ---
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  // We use local state now, initialized with empty array. Data comes from API.
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data } = await axios.get('http://localhost:5000/api/cart');
          // Backend returns items with 'product' field as ID. We map to _id for frontend consistency
          const mappedCart = data.map(item => ({
            ...item,
            _id: item.product._id || item.product, // Handle populated or unpopulated
          }));
          setCart(mappedCart);
        } catch (error) {
          console.error("Failed to fetch cart", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]); // Clear cart on logout
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    // Optimistic UI update
    const product_id = product._id || product.id;
    const newItem = { ...product, quantity, _id: product_id };
    
    setCart(prev => {
      const exists = prev.find(item => item._id === product_id);
      if (exists) {
        return prev.map(item => item._id === product_id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, newItem];
    });

    if (user) {
      try {
        await axios.post('http://localhost:5000/api/cart', { productId: product_id, quantity });
      } catch (error) {
        console.error("Failed to sync add to cart", error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
    if (user) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      } catch (error) {
        console.error("Failed to sync remove from cart", error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQuantity } : item));
    
    if (user) {
      try {
        await axios.put(`http://localhost:5000/api/cart/${productId}`, { quantity: newQuantity });
      } catch (error) {
        console.error("Failed to sync update cart", error);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await axios.delete('http://localhost:5000/api/cart');
      } catch (error) {
        console.error("Failed to clear cart", error);
      }
    }
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartItemCount, loading }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);

// --- WISHLIST CONTEXT ---
const WishlistContext = createContext();
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = usePersistentState('esportsWishlist', []);
  const getProductId = (product) => product._id || product.id;
  const addToWishlist = (product) => {
    setWishlist(prev => {
      const pid = getProductId(product);
      if (prev.some(item => getProductId(item) === pid)) return prev;
      return [...prev, product];
    });
  };
  const removeFromWishlist = (pid) => setWishlist(prev => prev.filter(item => getProductId(item) !== pid));
  const isInWishlist = (pid) => wishlist.some(item => getProductId(item) === pid);
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getMyOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/orders', orderData);
      setOrders((prev) => [data, ...prev]);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message);
    }
  };
  
  return (
    <OrderContext.Provider value={{ orders, createOrder, getMyOrders, loading, error }}>
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
    setReviews(prev => {
      const list = prev[productId] || [];
      return { ...prev, [productId]: [newReview, ...list] };
    });
  };
  const getReviewsForProduct = (productId) => reviews[productId] || [];
  return (
    <ReviewContext.Provider value={{ addReview, getReviewsForProduct }}>
      {children}
    </ReviewContext.Provider>
  );
};
export const useReviews = () => useContext(ReviewContext);

// --- MAIN APP PROVIDER ---
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