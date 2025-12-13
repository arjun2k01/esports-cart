// src/pages/admin/AdminProductCreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";

export default function AdminProductCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.price) return toast.error("Price is required");

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        image: form.image.trim() || "https://via.placeholder.com/800x600?text=Product",
        brand: form.brand.trim(),
        category: form.category.trim(),
        countInStock: Number(form.countInStock || 0),
        description: form.description.trim(),
      };

      const { data } = await api.post("/api/products", payload);
      toast.success("Product created");
      navigate(`/admin/products/${data._id}/edit`, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Create product failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Admin • Create Product</h1>
          <p className="mt-1 text-sm opacity-70">Add a new product to the catalog.</p>
        </div>

        <button
          onClick={() => navigate("/admin/products")}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Back
        </button>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
      >
        <div>
          <label className="text-sm opacity-80">Name *</label>
          <input
            value={form.name}
            onChange={onChange("name")}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            placeholder="Product name"
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
              placeholder="e.g. 1999"
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
              placeholder="e.g. 10"
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

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm opacity-80">Brand</label>
            <input
              value={form.brand}
              onChange={onChange("brand")}
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="e.g. Logitech"
            />
          </div>

          <div>
            <label className="text-sm opacity-80">Category</label>
            <input
              value={form.category}
              onChange={onChange("category")}
              className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
              placeholder="e.g. Headset"
            />
          </div>
        </div>

        <div>
          <label className="text-sm opacity-80">Description</label>
          <textarea
            value={form.description}
            onChange={onChange("description")}
            rows={4}
            className="w-full mt-1 px-3 py-2 rounded border border-white/10 bg-transparent"
            placeholder="Short product description…"
          />
        </div>

        <button
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create Product"}
        </button>
      </form>
    </div>
  );
}
