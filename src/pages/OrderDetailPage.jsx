// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/order/${id}` } });
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${id}`);
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
  }, [id, isAuthenticated, navigate]);

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
          Couldn’t load this order.
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
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <p className="mt-1 opacity-70">
            Order ID: <span className="font-mono">{order._id}</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Back
        </button>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Shipping */}
        <div className="rounded-xl border border-white/10 p-4">
          <h2 className="font-semibold">Shipping</h2>
          <div className="mt-2 text-sm opacity-80 space-y-1">
            <div>{order.shippingAddress?.address || "-"}</div>
            <div>
              {order.shippingAddress?.city || "-"},{" "}
              {order.shippingAddress?.state || "-"}{" "}
              {order.shippingAddress?.postalCode || ""}
            </div>
            <div>{order.shippingAddress?.country || "-"}</div>
            {order.shippingAddress?.phone ? (
              <div>Phone: {order.shippingAddress.phone}</div>
            ) : null}
          </div>

          <div className="mt-3 text-sm">
            <span className="opacity-70">Status: </span>
            <span className="font-semibold">
              {order.status || "processing"}
            </span>
          </div>

          <div className="mt-1 text-sm">
            <span className="opacity-70">Payment: </span>
            <span className="font-semibold">
              {(order.paymentMethod || "cod").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-xl border border-white/10 p-4">
          <h2 className="font-semibold">Summary</h2>
          <div className="mt-3 text-sm opacity-80 space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{money(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{money(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{money(order.taxPrice)}</span>
            </div>

            <div className="flex justify-between font-semibold pt-2 border-t border-white/10">
              <span>Total</span>
              <span>{money(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold">Items</h2>
        </div>

        <div className="divide-y divide-white/10">
          {(order.orderItems || []).map((it, idx) => (
            <div key={it._id || idx} className="p-4 flex gap-4">
              <div className="w-20 h-20 rounded overflow-hidden border border-white/10 flex-shrink-0">
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm opacity-70 mt-1">
                  Qty: {it.qty} • Price: {money(it.price)}
                </div>
              </div>

              <div className="font-semibold">{money(it.price * it.qty)}</div>
            </div>
          ))}

          {(!order.orderItems || order.orderItems.length === 0) && (
            <div className="p-4 opacity-70">No items found in this order.</div>
          )}
        </div>
      </div>
    </div>
  );
}
