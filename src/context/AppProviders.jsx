import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { usePersistentState } from "../hooks/usePersistentState";
import { ToastContainer } from "../components/ToastContainer";
import { AuthProvider } from "./AuthContext"; // Import the new separate provider

// API BASE URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://esports-cart.onrender.com/api";
axios.defaults.baseURL = API_BASE_URL;

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
        const { data } = await axios.get("/products");
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
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

// --- CART CONTEXT ---
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    // Use _id specifically
    const id = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === id);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, _id: id }];
    });
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => (item._id || item.id) !== id));

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);

// --- WISHLIST CONTEXT ---
const WishlistContext = createContext();
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = usePersistentState("esportsWishlist", []);

  const addToWishlist = (product) => {
    const id = product._id || product.id;
    setWishlist((prev) =>
      prev.some((item) => (item._id || item.id) === id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id) =>
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== id));

  const isInWishlist = (id) =>
    wishlist.some((item) => (item._id || item.id) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
export const useWishlist = () => useContext(WishlistContext);

// --- TOAST CONTEXT ---
const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);

// --- REVIEW CONTEXT ---
const ReviewContext = createContext();
export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = usePersistentState("esportsReviews", {});
  const addReview = (productId, review) => {
    const newReview = { ...review, id: Date.now(), date: new Date().toISOString() };
    setReviews((prev) => {
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

// --- ORDER CONTEXT ---
const OrderContext = createContext();
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/orders", orderData);
      setOrders((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/orders/myorders");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getMyOrders, loading, error }}>
      {children}
    </OrderContext.Provider>
  );
};
export const useOrders = () => useContext(OrderContext);

// Export Auth from here so other files don't break if they import from AppProviders
export { useAuth } from "./AuthContext";

export default AppProviders;