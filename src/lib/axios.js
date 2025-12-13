// src/pages/OrderConfirmationPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

const OrderConfirmationPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Support both param names (repo had inconsistent naming)
  const orderId = params.id || params.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view order details");
      navigate("/login", { state: { from: `/order-confirmation/${orderId}` } });
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${orderId}`);
        if (alive) setOrder(res.data || null);
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || "Failed to load order");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isAuthenticated, orderId, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading order…</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="p-3 rounded border border-red-400/40 bg-red-500/10">
          Couldn't load this order.
        </div>
        <div className="mt-4">
          <Link className="underline" to="/orders">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Order Confirmed ✅</h1>
      <p className="mt-1 opacity-70">
        Order ID: <span className="font-mono">{order._id}</span>
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 p-4">
          <h2 className="font-semibold">Shipping</h2>
          <div className="mt-2 text-sm opacity-80 space-y-1">
            <div>{order.shippingAddress?.address}</div>
            <div>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
              {order.shippingAddress?.postalCode}
            </div>
            <div>{order.shippingAddress?.country}</div>
            {order.shippingAddress?.phone ? (
              <div>Phone: {order.shippingAddress.phone}</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 p-4">
          <h2 className="font-semibold">Summary</h2>
          <div className="mt-2 text-sm opacity-80 space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>₹{order.itemsPrice ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingPrice ?? "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.taxPrice ?? "-"}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₹{order.totalPrice ?? "-"}</span>
            </div>
            <div className="pt-2 opacity-70">
              Payment: {order.paymentMethod?.toUpperCase() || "COD"}
            </div>
            <div className="opacity-70">Status: {order.status || "processing"}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <button
          onClick={() => navigate(`/order/${order._id}`)}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          View full order
        </button>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
