// src/pages/OrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext.jsx";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/orders/myorders");
        if (alive) setOrders(res.data || []);
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || "Failed to load orders");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading your orders…</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      <div className="mt-6 overflow-x-auto rounded border border-white/10">
        <table className="min-w-[900px] w-full text-left">
          <thead className="bg-black/20">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-white/10">
                <td className="p-3">{o._id?.slice(-8)}</td>
                <td className="p-3">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-3">₹{o.totalPrice ?? o.total ?? "-"}</td>
                <td className="p-3">{o.status || "processing"}</td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/order/${o._id}`)}
                    className="px-3 py-1.5 rounded border border-white/10 hover:opacity-90"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 opacity-70">
                  You have no orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
