// src/pages/ProductListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ProductListPage() {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";
  const sort = params.get("sort") || "new";
  const page = Number(params.get("page") || 1);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });

  const setQueryParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "") next.delete(key);
    else next.set(key, String(value));
    // reset to page 1 when filters change (except page itself)
    if (key !== "page") next.set("page", "1");
    setParams(next, { replace: true });
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Pagination-ready query params.
      // If backend doesn't support, it will ignore safely.
      const res = await api.get("/api/products", {
        params: {
          keyword: q,
          sort,
          pageNumber: page,
          pageSize: 12,
        },
      });

      const data = res.data;

      // Support both shapes:
      // 1) Array: [ {..}, {..} ]
      // 2) Paginated object: { products: [], page: 1, pages: 5 }
      if (Array.isArray(data)) {
        setProducts(data);
        setMeta({ page: 1, pages: 1 });
      } else {
        setProducts(data.products || []);
        setMeta({
          page: Number(data.page || 1),
          pages: Number(data.pages || 1),
        });
      }
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to load products");
      setProducts([]);
      setMeta({ page: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort, page]);

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.pages;

  const pageNumbers = useMemo(() => {
    // simple windowed pagination
    const total = meta.pages || 1;
    const current = meta.page || 1;
    const window = 5;

    const start = Math.max(1, current - Math.floor(window / 2));
    const end = Math.min(total, start + window - 1);

    const list = [];
    for (let i = start; i <= end; i++) list.push(i);
    return { total, current, list };
  }, [meta.page, meta.pages]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 opacity-70">Find your esports gear</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQueryParam("q", e.target.value)}
              placeholder="Search…"
              className="px-3 py-2 rounded border border-white/10 bg-transparent"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setQueryParam("sort", e.target.value)}
            className="px-3 py-2 rounded border border-white/10 bg-transparent"
          >
            <option value="new">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-sm opacity-70">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-xl border border-white/10 p-6">
          <p className="opacity-70">No products found.</p>
          <button
            onClick={() => {
              setParams(new URLSearchParams(), { replace: true });
            }}
            className="mt-4 px-4 py-2 rounded border border-white/10 hover:opacity-90"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="rounded-xl border border-white/10 overflow-hidden hover:opacity-95 transition"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="font-semibold line-clamp-1">{p.name}</div>
                  <div className="mt-1 text-sm opacity-80">{money(p.price)}</div>
                  <div className="mt-2 text-sm opacity-70">
                    Stock: {p.countInStock ?? "-"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination UI (works now; becomes real when backend supports pages>1) */}
          <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
            <button
              disabled={!canPrev}
              onClick={() => setQueryParam("page", meta.page - 1)}
              className="px-3 py-2 rounded border border-white/10 disabled:opacity-40"
            >
              Prev
            </button>

            {pageNumbers.list.map((n) => (
              <button
                key={n}
                onClick={() => setQueryParam("page", n)}
                className={`px-3 py-2 rounded border border-white/10 ${
                  n === pageNumbers.current ? "opacity-100 font-semibold" : "opacity-70"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              disabled={!canNext}
              onClick={() => setQueryParam("page", meta.page + 1)}
              className="px-3 py-2 rounded border border-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
