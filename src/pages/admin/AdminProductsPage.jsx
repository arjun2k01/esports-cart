// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/products");
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Admin • Products</h1>
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
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3">{p.countInStock ?? "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => remove(p._id)}
                      className="px-3 py-1.5 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 opacity-70" colSpan={5}>
                    No products found.
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
// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/products");
      setItems(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      setItems((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Admin • Products</h1>
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
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3">{p.countInStock ?? "-"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => remove(p._id)}
                      className="px-3 py-1.5 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 opacity-70" colSpan={5}>
                    No products found.
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
