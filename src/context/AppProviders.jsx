// src/context/AppProviders.jsx
import React from 'react';
import axios from 'axios';

/*
  Prefer VITE_API_URL when provided during the Vite build.
  Otherwise fall back to the Render backend URL so the
  deployed frontend can reach the API even if the env var
  wasn't set at build time.
*/
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://esports-cart.onrender.com/api';

// Configure axios default base URL for all requests
axios.defaults.baseURL = API_BASE_URL;

// Example context and provider (minimal) — keep as-is if your app uses it
export const AppContext = React.createContext({
  apiBaseUrl: API_BASE_URL,
});

export default function AppProviders({ children }) {
  // you can add shared state/providers here if needed
  return (
    <AppContext.Provider value={{ apiBaseUrl: API_BASE_URL }}>
      {children}
    </AppContext.Provider>
  );
}  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const { data } = await axios.get('/cart');
          const mappedCart = data.map((item) => ({
            ...item,
            _id: item.product?._id || item.product,
          }));
          setCart(mappedCart);
        } catch (error) {
          console.error('Failed to fetch cart', error);
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    const product_id = product._id || product.id;
    const newItem = { ...product, quantity, _id: product_id };

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product_id);
      if (exists) {
        return prev.map((item) =>
          item._id === product_id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, newItem];
    });

    if (user) {
      try {
        await axios.post('/cart', { productId: product_id, quantity });
      } catch (error) {
        console.error('Failed to sync add to cart', error);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    if (user) {
      try {
        await axios.delete(`/cart/${productId}`);
      } catch (error) {
        console.error('Failed to sync remove from cart', error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: newQuantity } : item))
    );

    if (user) {
      try {
        await axios.put(`/cart/${productId}`, { quantity: newQuantity });
      } catch (error) {
        console.error('Failed to sync update cart', error);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await axios.delete('/cart');
      } catch (error) {
        console.error('Failed to clear cart', error);
      }
    }
  };

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const cartItemCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        loading,
      }}
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
  const getProductId = (product) => product._id || product.id;
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const pid = getProductId(product);
      if (prev.some((item) => getProductId(item) === pid)) return prev;
      return [...prev, product];
    });
  };
  const removeFromWishlist = (pid) =>
    setWishlist((prev) => prev.filter((item) => getProductId(item) !== pid));
  const isInWishlist = (pid) => wishlist.some((item) => getProductId(item) === pid);
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
    if (user) getMyOrders();
    else setOrders([]);
  }, [user]);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/orders', orderData);
      setOrders((prev) => [data, ...prev]);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const getMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/orders/myorders');
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

// --- REVIEW CONTEXT ---
const ReviewContext = createContext();
export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = usePersistentState('esportsReviews', {});
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

// --- MAIN APP PROVIDER ---
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <ReviewProvider>
                <ToastProvider>{children}</ToastProvider>
              </ReviewProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};
