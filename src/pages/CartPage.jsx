// src/pages/CartPage.jsx
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/AppProviders";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQty, removeFromCart, clearCart } = useCart();

  const summary = useMemo(() => {
    const itemsPrice = cartTotal || 0;
    const shippingPrice = itemsPrice >= 500 ? 0 : cart.length ? 50 : 0;
    const taxPrice = Math.round(itemsPrice * 0.18);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [cartTotal, cart.length]);

  const onCheckout = () => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (!cart.length) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <div className="mt-6 rounded-xl border border-white/10 p-6">
          <p className="opacity-70">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 rounded border border-white/10 hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <button
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* Items */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold">Items</h2>
          </div>

          <div className="divide-y divide-white/10">
            {cart.map((it) => {
              const maxStock = Number.isFinite(Number(it.countInStock))
                ? Math.max(1, Number(it.countInStock))
                : 99;

              return (
                <div key={it._id} className="p-4 flex gap-4">
                  <Link
                    to={`/product/${it._id}`}
                    className="w-20 h-20 rounded overflow-hidden border border-white/10 flex-shrink-0"
                  >
                    <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1">
                    <Link to={`/product/${it._id}`} className="font-semibold hover:underline">
                      {it.name}
                    </Link>

                    <div className="text-sm opacity-70 mt-1">{money(it.price)}</div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm opacity-70">Qty</span>
                        <select
                          className="px-3 py-2 rounded border border-white/10 bg-transparent"
                          value={it.qty}
                          onChange={(e) => updateQty(it._id, Number(e.target.value))}
                        >
                          {Array.from({ length: maxStock }).map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => {
                          removeFromCart(it._id);
                          toast.success("Removed from cart");
                        }}
                        className="px-3 py-2 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="font-semibold">{money(it.price * it.qty)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-white/10 p-4 h-fit">
          <h2 className="font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-2 text-sm opacity-90">
            <div className="flex justify-between">
              <span className="opacity-70">Items</span>
              <span>{money(summary.itemsPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-70">Shipping</span>
              <span>{money(summary.shippingPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-70">Tax (18%)</span>
              <span>{money(summary.taxPrice)}</span>
            </div>

            <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>{money(summary.totalPrice)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full mt-5 px-4 py-3 rounded font-semibold border border-white/10 hover:opacity-90"
          >
            Proceed to Checkout (COD)
          </button>

          <Link
            to="/products"
            className="block text-center mt-3 text-sm opacity-80 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
