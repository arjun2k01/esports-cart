// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-60 bg-gray-200 animate-pulse rounded shadow"
          ></div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10 text-lg">{error}</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">E-Sports Products</h1>

      {products.length === 0 ? (
        <div className="text-gray-600 text-center text-xl mt-10">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
