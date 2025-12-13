// frontend/src/pages/PlaceOrderPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

// ✅ Adjust this import to match your project if needed
import { useCart } from "../context/CartContext";

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();

  const [submitting, setSubmitting] = useState(false);

  const { itemsCount } = useMemo(() => {
    const count = (cartItems || []).reduce(
      (acc, item) => acc + Number(item.qty || item.quantity || 0),
      0
    );
    return { itemsCount: count };
  }, [cartItems]);

  const validateCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }
    if (
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country
    ) {
      toast.error("Shipping address is missing.");
      navigate("/shipping");
      return false;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      navigate("/payment");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateCheckout()) return;

    // ✅ Only send product + qty (NO price, NO totals)
    const orderItems = cartItems.map((item) => ({
      product: item.product || item._id || item.productId, // support multiple shapes
      qty: Number(item.qty || item.quantity || 1),
    }));

    const payload = {
      orderItems,
      shippingAddress,
      paymentMethod,
    };

    try {
      setSubmitting(true);
      const res = await api.post("/api/orders", payload);

      toast.success("Order created!");
      // clear cart locally (your context should implement this)
      try {
        clearCart?.();
      } catch (_) {}

      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Place Order</h1>
          <p className="text-sm opacity-70 mt-1">
            Review your items and confirm checkout.
          </p>
        </div>

        <button
          onClick={placeOrder}
          disabled={submitting || itemsCount === 0}
          className="rounded-xl bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Placing…" : "Place Order"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: summary blocks */}
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold">Shipping</h2>
            <div className="text-sm opacity-80 mt-2">
              {shippingAddress?.address}, {shippingAddress?.city},{" "}
              {shippingAddress?.postalCode}, {shippingAddress?.country}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold">Payment</h2>
            <div className="text-sm opacity-80 mt-2">
              Method: <span className="font-medium">{paymentMethod}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold">Items</h2>

            {!cartItems?.length ? (
              <div className="text-sm opacity-70 mt-2">Your cart is empty.</div>
            ) : (
              <div className="mt-3 divide-y divide-gray-200 dark:divide-gray-800">
                {cartItems.map((item) => (
                  <div
                    key={item.product || item._id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover border border-gray-200 dark:border-gray-800"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-800" />
                      )}

                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs opacity-70">
                          Qty: {item.qty || item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* Price display is OK for UI, but NOT sent to backend */}
                    <div className="text-sm font-semibold">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: simple order confirm panel */}
        <aside className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 h-fit">
          <h2 className="font-semibold">Confirm</h2>
          <p className="text-sm opacity-70 mt-2">
            Totals will be recalculated securely on the server.
          </p>

          <button
            onClick={placeOrder}
            disabled={submitting || itemsCount === 0}
            className="mt-5 w-full rounded-xl bg-black text-white dark:bg-white dark:text-black py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing…" : "Place Order"}
          </button>

          <div className="text-xs opacity-60 mt-3">
            Items in cart: {itemsCount}
          </div>
        </aside>
      </div>
    </div>
  );
}
