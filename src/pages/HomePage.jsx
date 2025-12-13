// src/pages/HomePage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useCart } from "../context/AppProviders";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const SkeletonCard = () => (
  <div className="rounded-xl border border-white/10 overflow-hidden animate-pulse">
    <div className="h-44 bg-white/5" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-1/2" />
      <div className="h-9 bg-white/5 rounded w-full mt-3" />
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const featured = useMemo(() => {
    // pick top 6 newest-ish
    return (products || []).slice(0, 6);
  }, [products]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/products");
        const data = res.data;

        // support both shapes
        const list = Array.isArray(data) ? data : data.products || [];
        if (alive) setProducts(list);
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || "Failed to load products");
        if (alive) setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
        <div className="p-6 sm:p-10 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-semibold opacity-90">
              ⚡ Ready for ranked season
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight">
              Esports-grade gear.
              <span className="block opacity-90">Built for speed, aim & wins.</span>
            </h1>

            <p className="mt-3 opacity-75 max-w-xl">
              Shop controllers, headsets, mousepads and performance accessories that actually
              feel competitive. Clean checkout. COD supported.
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => navigate("/products")}
                className="px-5 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition"
              >
                Shop Products
              </button>

              <button
                onClick={() => navigate("/about")}
                className="px-5 py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/5 transition"
              >
                Why EsportsCart
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">COD</div>
                <div className="opacity-70">Available</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Fast UI</div>
                <div className="opacity-70">Mobile-first</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="font-semibold">Secure</div>
                <div className="opacity-70">Cookie auth</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold opacity-90">Featured drops</div>
              <div className="mt-3 text-2xl font-extrabold">Level up your setup</div>
              <p className="mt-2 text-sm opacity-70">
                Hand-picked products for competitive play—comfort + latency + control.
              </p>

              <div className="mt-5 flex gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                  Headsets
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                  Controllers
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                  Mousepads
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/5">
                  Keyboards
                </span>
              </div>

              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/5 transition"
                >
                  Explore all products →
                </Link>
              </div>
            </div>

            {/* glow */}
            <div className="absolute -inset-8 -z-10 bg-white/5 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold">Featured Products</h2>
            <p className="mt-1 opacity-70 text-sm">Fresh picks from the store</p>
          </div>

          <Link
            to="/products"
            className="px-4 py-2 rounded border border-white/10 hover:bg-white/5 transition text-sm font-semibold"
          >
            View all
          </Link>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : featured.length === 0 ? (
            <div className="rounded-xl border border-white/10 p-6 opacity-70">
              No products available.
            </div>
          ) : (
            featured.map((p) => (
              <div key={p._id} className="rounded-xl border border-white/10 overflow-hidden">
                <Link to={`/product/${p._id}`} className="block">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <Link to={`/product/${p._id}`} className="font-semibold hover:underline line-clamp-1">
                    {p.name}
                  </Link>

                  <div className="mt-1 text-sm opacity-80">{money(p.price)}</div>
                  <div className="mt-2 text-xs opacity-70">
                    Stock: {p.countInStock ?? "-"}
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        toast.success("Added to cart");
                        navigate("/cart");
                      }}
                      className="px-3 py-2 rounded border border-white/10 hover:bg-white/5 transition text-sm font-semibold"
                    >
                      Add to cart
                    </button>

                    <button
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="px-3 py-2 rounded border border-white/10 bg-white/10 hover:bg-white/15 transition text-sm font-semibold"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-lg font-semibold">Want tournament-style vibes?</div>
          <div className="text-sm opacity-70 mt-1">
            Next: we can add leaderboard/tournaments module to match esports sites.
          </div>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="px-5 py-3 rounded-lg font-semibold border border-white/10 bg-white/10 hover:bg-white/15 transition"
        >
          Shop now
        </button>
      </section>
    </div>
  );
}
