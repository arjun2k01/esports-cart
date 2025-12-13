// src/context/AppProviders.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Enterprise-stable cart provider:
 * - Single source of truth for cart state
 * - Persists to localStorage
 * - Handles qty correctly
 * - Safe guards (stock limits, negative qty, bad values)
 */

const CART_KEY = "esports_cart_v1";

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within AppProviders");
  return ctx;
};

const normalizeItem = (product, qty) => {
  const safeQty = Math.max(1, Number(qty || 1));
  const stock = Number(product?.countInStock ?? product?.stock ?? 999999);

  return {
    _id: product._id,
    name: product.name,
    image: product.image,
    price: Number(product.price || 0),
    countInStock: Number.isFinite(stock) ? stock : 999999,
    qty: Math.min(safeQty, Number.isFinite(stock) ? stock : safeQty),
  };
};

export default function AppProviders({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage issues
    }
  }, [cart]);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== CART_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToCart = (product, qty = 1) => {
    if (!product?._id) return;

    setCart((prev) => {
      const idx = prev.findIndex((x) => x._id === product._id);
      const incoming = normalizeItem(product, qty);

      // Merge quantities if already exists
      if (idx >= 0) {
        const existing = prev[idx];
        const mergedQty = Math.min(
          (existing.qty || 0) + incoming.qty,
          incoming.countInStock || 999999
        );
        const updated = { ...existing, ...incoming, qty: mergedQty };
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }

      return [...prev, incoming];
    });
  };

  const updateQty = (productId, qty) => {
    const safeQty = Math.max(1, Number(qty || 1));
    setCart((prev) =>
      prev.map((x) => {
        if (x._id !== productId) return x;
        const limit = Number.isFinite(Number(x.countInStock)) ? Number(x.countInStock) : safeQty;
        return { ...x, qty: Math.min(safeQty, limit) };
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((x) => x._id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(() => cart.reduce((sum, x) => sum + (Number(x.qty) || 0), 0), [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, x) => sum + (Number(x.price) || 0) * (Number(x.qty) || 0), 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      setCart, // optional escape hatch (admin/dev)
    }),
    [cart, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
