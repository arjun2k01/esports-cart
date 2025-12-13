// src/pages/admin/AdminProductEditPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    countInStock: "",
    description: "",
  });

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get(`/api/products/${id}`);
      const p = res.data;

      setForm({
        name: p?.name || "",
        price: p?.price ?? "",
        image: p?.image || "",
        brand: p?.brand || "",
        category: p?.category || "",
        countInStock: p?.countInStock ?? "",
        description: p?.description || "",
      });
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (form.price === "" || Number(form.price) < 0) return toast.error("Valid price is required");

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        image: form.image.trim() || "https://via.placeholder.com/800x600?text=Product",
        brand: form.brand.trim(),
        category: form.category.trim(),
        countInStock: Number(form.countInStock || 0),
        description: form.description.trim(),
      };

      await api.put(`/api/products/${id}`, payload);
      toast.success("Product updated");
      await load(); // keep UI consistent after save
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const ok = window.confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      setSaving(true);
      await api.delete(`/api/products/${id}`);
      toast.success("Product deleted");
      navigate("/admin/products", { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading product…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="p-3 rounded border border-red-400/40 bg-red-500/10">{err}</div>
        <button
          onClick={() => navigate("/admin/products")}
          className="mt-4 px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Admin • Edit Product</h1>
          <p className="mt-1 text-sm opacity-70 font-mono">ID: {id}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
          >
            Back
          </button>

          <button
            onClick={remove}
            disabled={saving}
            className="px-4 py-2 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <form
        onSubmit={save}
        className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
      >
        <div>
          <label className="text-sm opacity-80">Name *</label>
          <input
            value={form.name}
            onChange={onChange("name")}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-80">Price *</label>
            <input
              value={form.price}
              onChange={onChange("price")}
              type="number"
              min="0"
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Stock</label>
            <input
              value={form.countInStock}
              onChange={onChange("countInStock")}
              type="number"
              min="0"
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-sm opacity-80">Image URL</label>
          <input
            value={form.image}
            onChange={onChange("image")}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            placeholder="https://..."
          />
        </div>

        {form.image ? (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <img src={form.image} alt="preview" className="w-full h-56 object-cover" />
          </div>
        ) : null}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-80">Brand</label>
            <input
              value={form.brand}
              onChange={onChange("brand")}
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Category</label>
            <input
              value={form.category}
              onChange={onChange("category")}
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-sm opacity-80">Description</label>
          <textarea
            value={form.description}
            onChange={onChange("description")}
            rows={5}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
          />
        </div>

        <button
          disabled={saving}
          className="w-full px-4 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
