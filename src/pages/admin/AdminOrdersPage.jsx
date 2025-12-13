// src/pages/admin/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminOrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/orders"); // admin-only
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action) => {
    try {
      if (action === "ship") await api.put(`/api/orders/${id}/ship`);
      if (action === "deliver") await api.put(`/api/orders/${id}/deliver`);
      if (action === "cancel") await api.put(`/api/orders/${id}/cancel`);
      toast.success("Updated");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Admin • Orders</h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {err ? (
        <div className="mt-4 p-3 rounded border border-red-400/40 bg-red-500/10">
          {err}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-sm opacity-70">Loading…</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border border-white/10">
          <table className="min-w-[1000px] w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">User</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o._id} className="border-t border-white/10">
                  <td className="p-3">{o._id?.slice(-8)}</td>
                  <td className="p-3">{o.user?.email || o.user?.name || "-"}</td>
                  <td className="p-3">₹{o.totalPrice ?? o.total ?? "-"}</td>
                  <td className="p-3">{o.status || "processing"}</td>
                  <td className="p-3">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => act(o._id, "ship")}
                      className="px-3 py-1.5 rounded border border-white/10 hover:opacity-90"
                    >
                      Ship
                    </button>
                    <button
                      onClick={() => act(o._id, "deliver")}
                      className="px-3 py-1.5 rounded border border-white/10 hover:opacity-90"
                    >
                      Deliver
                    </button>
                    <button
                      onClick={() => act(o._id, "cancel")}
                      className="px-3 py-1.5 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 opacity-70" colSpan={6}>
                    No orders found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
