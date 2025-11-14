// src/context/AppProviders.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

// ---------------- CART CONTEXT ----------------
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  // Initialize from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('esports-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('esports-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        toast.success(`Updated ${product.name} quantity in cart`, {
          duration: 2000,
          icon: '🛒',
        });
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      toast.success(`${product.name} added to cart!`, {
        duration: 2000,
        icon: '✅',
      });
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (id) => {
    const item = cart.find(item => item._id === id);
    setCart((prev) => prev.filter((item) => item._id !== id));
    if (item) {
      toast.success(`${item.name} removed from cart`, {
        duration: 2000,
        icon: '🗑️',
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared', {
      duration: 2000,
      icon: '🧹',
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        updateQty, 
        removeFromCart, 
        clearCart, 
        cartTotal,
        cartItemsCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ---------------- WISHLIST CONTEXT ----------------
const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

const WishlistProvider = ({ children }) => {
  // Initialize from localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('esports-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('esports-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        toast('Already in wishlist', {
          duration: 2000,
          icon: 'ℹ️',
        });
        return prev;
      }
      toast.success(`${product.name} added to wishlist!`, {
        duration: 2000,
        icon: '❤️',
      });
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    const item = wishlist.find(item => item._id === id);
    setWishlist((prev) => prev.filter((item) => item._id !== id));
    if (item) {
      toast.success(`${item.name} removed from wishlist`, {
        duration: 2000,
        icon: '💔',
      });
    }
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// -------------- MASTER PROVIDER (WRAPS ALL) --------------
const AppProviders = ({ children }) => {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
};

export default AppProviders;
