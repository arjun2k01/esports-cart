// src/pages/admin/AdminProductsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/products");
      const data = res.data;

      // supports either array or { products: [] }
      const list = Array.isArray(data) ? data : data?.products || [];
      setItems(list);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((p) => {
      if (p?.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((p) => (category === "all" ? true : p?.category === category))
      .filter((p) => {
        if (!needle) return true;
        return (
          String(p?.name || "").toLowerCase().includes(needle) ||
          String(p?.brand || "").toLowerCase().includes(needle) ||
          String(p?.category || "").toLowerCase().includes(needle)
        );
      });
  }, [items, q, category]);

  const remove = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Admin • Products</h1>
          <p className="mt-1 text-sm opacity-70">
            Manage your catalog (create/edit/delete). Showing {filtered.length} item(s)
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={load}
            className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
          >
            Refresh
          </button>

          {/* Optional: if you later add create product page */}
          <Link
            to="/admin/products/new"
            className="px-4 py-2 rounded border border-white/10 bg-white/10 hover:bg-white/15 font-semibold"
          >
            + New
          </Link>
        </div>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name / brand / category…"
          className="px-3 py-2 rounded border border-white/10 bg-transparent min-w-[240px]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded border border-white/10 bg-transparent"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="p-3">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs opacity-70 font-mono">{p._id}</div>
                  </td>
                  <td className="p-3">{money(p.price)}</td>
                  <td className="p-3">{p.brand || "-"}</td>
                  <td className="p-3">{p.category || "-"}</td>
                  <td className="p-3">{p.countInStock ?? "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="px-3 py-1.5 rounded border border-white/10 hover:opacity-90"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(p._id)}
                        className="px-3 py-1.5 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 ? (
                <tr>
                  <td className="p-3 opacity-70" colSpan={6}>
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
