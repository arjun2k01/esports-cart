// src/context/CartContext.jsx
// Compatibility wrapper: keep old imports working
// while using the real cart implementation from AppProviders.

import AppProviders, { useCart as useCartFromProviders } from "./AppProviders";

export const useCart = () => useCartFromProviders();

// If any legacy code still uses <CartProvider>, map it to AppProviders.
export const CartProvider = ({ children }) => <AppProviders>{children}</AppProviders>;

export default CartProvider;
