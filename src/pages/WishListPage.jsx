// src/pages/WishListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useCart } from "../context/AppProviders";

const WISHLIST_KEY = "esports_wishlist_v1";
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const safeParse = (raw) => {
  try {
    const x = JSON.parse(raw);
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
};

export default function WishListPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [ids, setIds] = useState(() => safeParse(localStorage.getItem(WISHLIST_KEY) || "[]"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // persist ids
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  // fetch latest product data for ids (price/stock changes etc.)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (!ids.length) {
          if (alive) setItems([]);
          return;
        }

        // Fetch in parallel (simple + reliable)
        const results = await Promise.allSettled(ids.map((id) => api.get(`/api/products/${id}`)));
        const ok = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data)
          .filter(Boolean);

        if (alive) setItems(ok);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load wishlist items");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [ids]);

  const remove = (id) => {
    setIds((prev) => prev.filter((x) => x !== id));
    toast.success("Removed from wishlist");
  };

  const clear = () => {
    setIds([]);
    toast.success("Wishlist cleared");
  };

  const count = useMemo(() => ids.length, [ids.length]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-sm opacity-70">Loading wishlist…</div>
      </div>
    );
  }

  if (!count) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <div className="mt-6 rounded-xl border border-white/10 p-6">
          <p className="opacity-70">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 rounded border border-white/10 hover:opacity-90"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Wishlist</h1>
          <p className="mt-1 opacity-70">{count} item(s)</p>
        </div>

        <button
          onClick={clear}
          className="px-4 py-2 rounded border border-white/10 hover:opacity-90"
        >
          Clear wishlist
        </button>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => (
          <div key={p._id} className="rounded-xl border border-white/10 overflow-hidden">
            <Link to={`/product/${p._id}`} className="block">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </Link>

            <div className="p-4">
              <Link to={`/product/${p._id}`} className="font-semibold hover:underline">
                {p.name}
              </Link>
              <div className="mt-1 text-sm opacity-80">{money(p.price)}</div>

              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    addToCart(p, 1);
                    toast.success("Added to cart");
                    navigate("/cart");
                  }}
                  className="px-3 py-2 rounded border border-white/10 hover:opacity-90"
                >
                  Add to cart
                </button>

                <button
                  onClick={() => remove(p._id)}
                  className="px-3 py-2 rounded bg-red-500/20 border border-red-400/30 hover:opacity-90"
                >
                  Remove
                </button>
              </div>

              {(p.countInStock ?? 1) <= 0 ? (
                <div className="mt-3 text-sm text-red-300">Out of stock</div>
              ) : (
                <div className="mt-3 text-sm opacity-70">
                  Stock: {p.countInStock ?? "-"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
