// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

// ✅ use the same provider your app actually wraps with
import { useCart } from "../context/AppProviders";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/products/${id}`);
        if (alive) setProduct(res.data);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || "Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, Number(qty || 1));
    toast.success("Added to cart");
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading product…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="p-3 rounded border border-red-400/40 bg-red-500/10">
          {error}
        </div>
        <div className="mt-4">
          <Link className="underline" to="/products">Back to products</Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-white/10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[360px] object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="opacity-80 mt-2">{product.description || ""}</p>

          <div className="mt-4 text-xl font-bold">₹{product.price}</div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm opacity-80">Qty</label>
            <select
              className="border rounded px-3 py-2 bg-transparent"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {Array.from({ length: Math.max(1, product.countInStock || 1) }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAdd}
            className="mt-6 px-5 py-3 rounded-lg font-semibold border border-white/10 hover:opacity-90"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
